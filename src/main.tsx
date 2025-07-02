import { reatomContext } from '@reatom/npm-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ctx } from '@src/state';

import { App } from './App';

import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <reatomContext.Provider value={ctx}>
            <App />
        </reatomContext.Provider>
    </StrictMode>,
);
