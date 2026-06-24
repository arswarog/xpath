import { action, atom } from '@reatom/framework';

export type IframeSearchMode = 'all' | 'main' | 'specific';

export interface IframeInfo {
    id: string;
    name?: string;
    isDefault?: boolean;
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
 * Использует Runtime.getExecutionContexts для получения всех контекстов.
 * Должна вызываться из контекста DevTools.
 */
export async function fetchAvailableFrames(): Promise<IframeInfo[]> {
    const debuggee = { tabId: chrome.devtools.inspectedWindow.tabId };

    return new Promise((resolve) => {
        chrome.debugger.sendCommand(
            debuggee,
            'Runtime.getExecutionContexts',
            {},
            (res: any) => {
                if (chrome.runtime.lastError || !res?.contexts) {
                    resolve([]);
                    return;
                }

                const contexts = res.contexts || [];
                const frames: IframeInfo[] = contexts
                    .filter((ctx: any) => ctx.auxData?.frameId)
                    .map((ctx: any) => ({
                        id: ctx.auxData.frameId,
                        name: ctx.name || '',
                        isDefault: ctx.auxData.isDefault || false,
                    }));

                resolve(frames);
            },
        );
    });
}
