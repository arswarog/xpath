import './App.css';
import { CalculatorUI } from './components/CalculatorUI';
import { SiteTitle } from './components/SiteTitle';
import { useCalc } from './hooks/useCalc';

export function App() {
    const { display, onChange } = useCalc();
    return (
        <>
            <SiteTitle />
            <CalculatorUI
                display={display}
                onChange={onChange}
            />
        </>
    );
}
