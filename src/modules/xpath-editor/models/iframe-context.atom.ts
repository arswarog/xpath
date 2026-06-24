import { action, atom } from '@reatom/framework';

export type IframeSearchMode = 'all' | 'main' | 'specific';

export interface IframeInfo {
    id: string;
    name: string;
    src?: string;
    element?: HTMLIFrameElement;
}

export interface IframeContext {
    mode: IframeSearchMode;
    specificFrameId?: string;
}

export const iframeContextAtom = atom<IframeContext>(
    {
        mode: 'all',
    },
    'iframeContextAtom',
);

export const setIframeContextAction = action((ctx, context: IframeContext) => {
    return iframeContextAtom(ctx, context);
}, 'setIframeContextAction');

/**
 * Atom storing список доступных iframe на странице.
 * Обновляется вручную через updateAvailableFramesAction.
 * Пустой массив означает, что список ещё не загружен или iframe отсутствуют.
 */
export const availableFramesAtom = atom<IframeInfo[]>([], 'availableFramesAtom');

export const updateAvailableFramesAction = action((ctx, frames: IframeInfo[]) => {
    return availableFramesAtom(ctx, frames);
}, 'updateAvailableFramesAction');

/**
 * Функция для получения списка iframe через Chrome Debugger API.
 * Должна вызываться из контекста DevTools.
 */
export async function fetchAvailableFrames(): Promise<IframeInfo[]> {
    const debuggee = { tabId: chrome.devtools.inspectedWindow.tabId };

    return new Promise((resolve) => {
        const getFramesExpr = `
            (function() {
                const frames = [];
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach((frame, index) => {
                    try {
                        // Проверяем, доступен ли контент фрейма (same-origin)
                        const hasAccess = frame.contentDocument != null;
                        frames.push({
                            id: frame.id || 'iframe-' + index,
                            name: frame.name || '',
                            src: frame.src || '',
                            hasAccess: hasAccess
                        });
                    } catch (e) {
                        // Cross-origin iframe - не можем получить доступ к содержимому
                        frames.push({
                            id: 'iframe-' + index,
                            name: '',
                            src: frame.src || '',
                            hasAccess: false,
                            crossOrigin: true
                        });
                    }
                });
                return frames;
            })();
        `;

        chrome.debugger.sendCommand(
            debuggee,
            'Runtime.evaluate',
            { expression: getFramesExpr, returnByValue: true },
            (res: any) => {
                if (chrome.runtime.lastError || !res?.result?.value) {
                    resolve([]);
                    return;
                }
                resolve(res.result.value || []);
            },
        );
    });
}
