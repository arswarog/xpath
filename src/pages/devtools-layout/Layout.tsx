import { useEffect } from 'react';

import { useAction, useAtom } from '@reatom/npm-react';
import block from 'bem-css-modules';
import { Outlet } from 'react-router';

import { XPathEditor } from '@src/modules/xpath-editor';
import {
    availableFramesAtom,
    fetchAvailableFrames,
    iframeContextAtom,
    setIframeContextAction,
    updateAvailableFramesAction,
} from '@src/modules/xpath-editor/models';

import styles from './Layout.module.scss';

const b = block(styles, 'DevToolsLayout');

export function DevToolsLayout({ stickyEditor }: { stickyEditor?: boolean }) {
    const [iframeContext] = useAtom(iframeContextAtom);
    const [availableFrames] = useAtom(availableFramesAtom);
    const updateFrames = useAction(updateAvailableFramesAction);
    const setContext = useAction(setIframeContextAction);

    useEffect(() => {
        // Загружаем список iframe при монтировании компонента
        fetchAvailableFrames().then((frames) => {
            updateFrames(frames);
        });
    }, [updateFrames]);

    const handleFrameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === 'all') {
            setContext({ mode: 'all' });
        } else if (value === 'main') {
            setContext({ mode: 'main' });
        } else {
            setContext({ mode: 'specific', specificFrameId: value });
        }
    };

    const getSelectValue = () => {
        if (iframeContext.mode === 'all') {
            return 'all';
        }
        if (iframeContext.mode === 'main') {
            return 'main';
        }
        return iframeContext.specificFrameId || 'all';
    };

    return (
        <div className={b({ stickyEditor })}>
            <div className={b('display')}>
                <XPathEditor />
            </div>
            <div className={b('controls')}>
                <label className={b('frame-selector')}>
                    Search in:
                    <select
                        value={getSelectValue()}
                        onChange={handleFrameChange}
                    >
                        <option value="all">All frames ({availableFrames.length + 1})</option>
                        <option value="main">Main document only</option>
                        {availableFrames.map((frame) => (
                            <option
                                key={frame.id}
                                value={frame.id}
                            >
                                {frame.name || frame.id || frame.src || 'iframe'}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className={b('page')}>
                <Outlet />
            </div>
        </div>
    );
}
