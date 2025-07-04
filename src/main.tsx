import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { reatomContext } from '@reatom/npm-react';

import { ctx } from '@src/state';

import './index.css';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <reatomContext.Provider value={ctx}>
            <App />
        </reatomContext.Provider>
    </StrictMode>,
);
