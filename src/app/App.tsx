import { Navigate, Route, Routes } from 'react-router';

import { AstViewPage } from '@src/pages/ast-view';

import './App.css';

export function App() {
    return (
        <Routes>
            <Route
                path="ast"
                element={<AstViewPage />}
            />
            <Route
                path="*"
                element={
                    <Navigate
                        replace
                        to="/ast"
                    />
                }
            />
        </Routes>
    );
}
