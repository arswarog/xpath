import { Route, Routes } from 'react-router';

import { AstViewPage } from '@src/pages/ast-view';
import { CalculatorPage } from '@src/pages/calculator';
import { DevLayout } from '@src/pages/dev-layout';
import { HighlightPage } from '@src/pages/highlight';
import { TokensViewPage } from '@src/pages/tokens-view';

import './App.css';

export function App() {
    return (
        <Routes>
            <Route element={<DevLayout />}>
                <Route
                    path="highlight"
                    element={<HighlightPage />}
                />
                <Route
                    path="ast"
                    element={<AstViewPage />}
                />
                <Route
                    path="tokens"
                    element={<TokensViewPage />}
                />
            </Route>
            <Route
                path="*"
                element={<CalculatorPage />}
            />
        </Routes>
    );
}
