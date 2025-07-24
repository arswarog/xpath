import { Route, Routes } from 'react-router';

import { CalculatorPage } from '@src/pages/calculator';

import './App.css';

export function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<CalculatorPage />}
            />
        </Routes>
    );
}
