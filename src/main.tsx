import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { reatomContext } from '@reatom/npm-react';
import { HashRouter } from 'react-router';

import { App, ctx } from '@src/app';

import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <reatomContext.Provider value={ctx}>
            <HashRouter>
                <App />
            </HashRouter>
        </reatomContext.Provider>
    </StrictMode>,
);
