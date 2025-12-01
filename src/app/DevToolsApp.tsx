import { Navigate, Route, Routes } from 'react-router';

import { DevLayout } from '@src/pages/dev-layout';
import { NodeSearchPage } from '@src/pages/node-search';

import './App.css';

export function DevToolsApp() {
    return (
        <Routes>
            <Route element={<DevLayout />}>
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
