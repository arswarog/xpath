import './App.css';
import { SiteTitle } from './components/SiteTitle.tsx';
import { CalculatorUI } from './components/CalculatorUI.tsx';
import { useCalc } from './hooks/useCalc.ts';

function App() {
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

export default App;
