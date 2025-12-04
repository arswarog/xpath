import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { reatomContext } from '@reatom/npm-react';
import { HashRouter } from 'react-router';

import { ctx, DevToolsApp } from '@src/app';

import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <reatomContext.Provider value={ctx}>
            <HashRouter>
                <DevToolsApp />
            </HashRouter>
        </reatomContext.Provider>
    </StrictMode>,
);
