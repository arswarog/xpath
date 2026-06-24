import { useEffect } from 'react';

import { useAtom } from '@reatom/npm-react';

import { expressionAtom, iframeContextAtom } from '@src/modules/xpath-editor/models';

export function NodeSearchPage() {
    const [expression] = useAtom(expressionAtom);
    const [iframeContext] = useAtom(iframeContextAtom);

    useEffect(() => {
        run(expression, iframeContext);
    }, [expression, iframeContext]);
    return null;
}

function run(
    xpath: string,
    iframeContext: { mode: 'all' | 'main' | 'specific'; specificFrameId?: string },
) {
    highlightByXPath(xpath, iframeContext);
}

// panel.js

const debuggee = { tabId: chrome.devtools.inspectedWindow.tabId };
let attached = false;

// Подключение отладчика к вкладке
function ensureAttached(callback) {
    if (attached) {
        return callback();
    }
    chrome.debugger.attach(debuggee, '1.3', () => {
        if (chrome.runtime.lastError) {
            console.error('Debugger attach failed:', chrome.runtime.lastError.message);
            return;
        }
        attached = true;
        callback();
    });
}

// Включаем DOM перед использованием Overlay
function enableDOM(callback) {
    chrome.debugger.sendCommand(debuggee, 'DOM.enable', {}, (response) => {
        console.log(response);

        if (chrome.runtime.lastError) {
            console.error('Error enabling DOM:', chrome.runtime.lastError.message);
            return;
        }
        callback();
    });
}

// Включаем Overlay после DOM.enable
function enableOverlay(callback) {
    enableDOM(() => {
        chrome.debugger.sendCommand(debuggee, 'Overlay.enable', {}, (response) => {
            console.log(response);

            if (chrome.runtime.lastError) {
                console.error('Error enabling Overlay:', chrome.runtime.lastError.message);
                return;
            }
            callback();
        });
    });
}

// Вычислить набора прямоугольников (margin/padding/border/content) для каждого узла по XPath.
// Возвращаем массив объектов {type: 'margin'|'border'|'padding'|'content', x,y,width,height, frameId?}
function fetchBoxesForXPath(
    xpath: string,
    cb: (boxes: any[] | null, err: any | null) => void,
    options: { searchInFrames?: boolean; specificFrameId?: string | null } = { searchInFrames: true },
) {
    const { searchInFrames = true, specificFrameId = null } = options;

    // Функция для получения boxes из одного документа
    const getBoxesForDocument = (frameId: string | null = null) => {
        const expr = `
        (function() {
          const xp = ${JSON.stringify(xpath)};
          function parsePx(v){ const f = parseFloat(v); return isNaN(f)?0:f; }

          const out = [];
          try {
            const it = document.evaluate(xp, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            let node;
            while (node = it.iterateNext()) {
              const r = node.getBoundingClientRect();
              const cs = getComputedStyle(node);

              const margin = {
                top: parsePx(cs.marginTop),
                right: parsePx(cs.marginRight),
                bottom: parsePx(cs.marginBottom),
                left: parsePx(cs.marginLeft)
              };
              const padding = {
                top: parsePx(cs.paddingTop),
                right: parsePx(cs.paddingRight),
                bottom: parsePx(cs.paddingBottom),
                left: parsePx(cs.paddingLeft)
              };
              const border = {
                top: parsePx(cs.borderTopWidth),
                right: parsePx(cs.borderRightWidth),
                bottom: parsePx(cs.borderBottomWidth),
                left: parsePx(cs.borderLeftWidth)
              };

              const sx = window.scrollX || window.pageXOffset || 0;
              const sy = window.scrollY || window.pageYOffset || 0;

              // margin box
              const marginBox = {
                x: r.left - margin.left + sx,
                y: r.top - margin.top + sy,
                width: r.width + margin.left + margin.right,
                height: r.height + margin.top + margin.bottom
              };
              // border box (includes padding + content + border)
              const borderBox = {
                x: r.left - border.left + sx,
                y: r.top - border.top + sy,
                width: r.width + border.left + border.right,
                height: r.height + border.top + border.bottom
              };
              // padding box
              const paddingBox = {
                x: r.left + border.left + sx,
                y: r.top + border.top + sy,
                width: r.width - border.left - border.right,
                height: r.height - border.top - border.bottom
              };
              // content box (padding removed)
              const contentBox = {
                x: r.left + border.left + padding.left + sx,
                y: r.top + border.top + padding.top + sy,
                width: r.width - border.left - border.right - padding.left - padding.right,
                height: r.height - border.top - border.bottom - padding.top - padding.bottom
              };

              // push boxes in order margin -> border -> padding -> content
              out.push({type:'margin', rect:marginBox, frameId: ${frameId === null ? 'null' : JSON.stringify(frameId)}});
              out.push({type:'border', rect:borderBox, frameId: ${frameId === null ? 'null' : JSON.stringify(frameId)}});
              out.push({type:'padding', rect:paddingBox, frameId: ${frameId === null ? 'null' : JSON.stringify(frameId)}});
              out.push({type:'content', rect:contentBox, frameId: ${frameId === null ? 'null' : JSON.stringify(frameId)}});
            }
          } catch (e) {
            console.error('Error evaluating XPath in frame:', e);
          }
          return out;
        })();
      `;
        return expr;
    };

    // Если ищем только в основном документе или конкретном фрейме
    if (!searchInFrames || specificFrameId !== null) {
        const expr = getBoxesForDocument(specificFrameId);
        chrome.debugger.sendCommand(
            debuggee,
            'Runtime.evaluate',
            { expression: expr, returnByValue: true },
            (res: any) => {
                if (chrome.runtime.lastError) {
                    cb(null, chrome.runtime.lastError);
                    return;
                }
                if (!res || res.exceptionDetails) {
                    cb(
                        null,
                        res && res.exceptionDetails ? res.exceptionDetails : new Error('No result'),
                    );
                    return;
                }
                cb(res.result ? res.result.value : [], null);
            },
        );
        return;
    }

    // Поиск во всех фреймах: основной документ + iframe
    // Получаем все execution contexts
    chrome.debugger.sendCommand(
        debuggee,
        'Runtime.getExecutionContexts',
        {},
        (contextsRes: any) => {
            if (chrome.runtime.lastError) {
                cb(null, chrome.runtime.lastError);
                return;
            }

            const contexts = contextsRes?.contexts || [];
            const allBoxes: any[] = [];
            let pending = contexts.length;

            if (pending === 0) {
                cb([], null);
                return;
            }

            contexts.forEach((context: any) => {
                // context.auxData?.frameId содержит ID фрейма
                const frameId = context.auxData?.frameId || null;

                // Выполняем XPath в каждом контексте
                const expr = getBoxesForDocument(frameId);
                chrome.debugger.sendCommand(
                    debuggee,
                    'Runtime.evaluate',
                    {
                        expression: expr,
                        returnByValue: true,
                        contextId: context.id,
                    },
                    (res: any) => {
                        if (res?.result?.value) {
                            allBoxes.push(...res.result.value);
                        }
                        pending--;
                        if (pending === 0) {
                            cb(allBoxes, null);
                        }
                    },
                );
            });
        },
    );
}

// Отрисовать набор прямоугольников через Overlay.highlightRect.
// Мы можем вызывать несколько highlightRect подряд — они все остаются видны пока не вызвать Overlay.hideHighlight.
function showOverlayForBoxes(boxes) {
    if (!boxes || boxes.length === 0) {
        return;
    }
    // цвета, приближённые к тем, что использует Elements
    const colors = {
        margin: { r: 255, g: 155, b: 0, a: 0.18, outline: { r: 226, g: 147, b: 0, a: 0.6 } },
        border: { r: 255, g: 200, b: 0, a: 0.25, outline: { r: 200, g: 160, b: 0, a: 0.6 } },
        padding: { r: 120, g: 170, b: 210, a: 0.25, outline: { r: 90, g: 150, b: 200, a: 0.6 } },
        content: { r: 120, g: 220, b: 120, a: 0.3, outline: { r: 90, g: 200, b: 90, a: 0.6 } },
    };

    const dpr = window.devicePixelRatio || 1;

    boxes.forEach((b) => {
        const rect = b.rect;
        const c = colors[b.type] || colors.content;
        const params = {
            x: Math.ceil(rect.x / dpr),
            y: Math.ceil(rect.y / dpr),
            width: Math.max(0, Math.ceil(rect.width / dpr)),
            height: Math.max(0, Math.ceil(rect.height / dpr)),
            color: { r: c.r, g: c.g, b: c.b, a: c.a },
            outlineColor: c.outline,
        };
        console.log('highlight box', b);
        chrome.debugger.sendCommand(debuggee, 'Overlay.highlightRect', params, (_data) => {
            // игнорируем ошибки для отдельных прямоугольников
        });
    });
}

// Скрыть все подсветки Overlay
function hideOverlay() {
    chrome.debugger.sendCommand(debuggee, 'Overlay.hideHighlight', {}, () => {});
}

// Основная функция для подсветки элементов по XPath
function highlightByXPath(
    xpath: string,
    iframeContext: { mode: 'all' | 'main' | 'specific'; specificFrameId?: string },
) {
    console.log('highlightByXPath', xpath, iframeContext);
    ensureAttached(() => {
        enableOverlay(() => {
            // Перед отрисовкой скрываем старые подсветки
            hideOverlay();

            const options = {
                searchInFrames: iframeContext.mode === 'all',
                specificFrameId:
                    iframeContext.mode === 'specific' ? iframeContext.specificFrameId : null,
            };

            fetchBoxesForXPath(
                xpath,
                (boxes, err) => {
                    if (err) {
                        console.error('Error fetching boxes:', err);
                        return;
                    }
                    if (!boxes || boxes.length === 0) {
                        console.log('No nodes matched xpath:', xpath);
                        return;
                    }
                    console.log('boxes', boxes);
                    showOverlayForBoxes(boxes);
                },
                options,
            );
        });
    });
}

// Очистка подсветки
function clearHighlights() {
    hideOverlay();
}

// Пример использования
clearHighlights();

// Пример использования с интервалом для отрисовки прямоугольников каждую секунду
// setInterval(() => {
//     ensureAttached(() => {
//         enableOverlay(() => {
//             showOverlayForBoxes([
//                 {
//                     rect: {
//                         x: 10,
//                         y: 10,
//                         width: 100,
//                         height: 100,
//                     },
//                 },
//             ]);
//         });
//     });
// }, 1000);
