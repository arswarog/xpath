import { Navigate, Route, Routes } from 'react-router';

import { DevToolsLayout } from '@src/pages/devtools-layout';
import { NodeSearchPage } from '@src/pages/node-search';

import './App.css';

export function DevToolsApp() {
    return (
        <Routes>
            <Route element={<DevToolsLayout />}>
                <Route
                    path="search"
                    element={<NodeSearchPage />}
                />
            </Route>
            <Route
                path="*"
                element={
                    <Navigate
                        replace
                        to="/search"
                    />
                }
            />
        </Routes>
    );
}
