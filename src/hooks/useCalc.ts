import { IDisplayData } from '../types';
import { useMemo, useState } from 'react';
import { parse } from '../calc/parser';

export interface UseCalc {
    display: IDisplayData;
    onChange: (code: string) => void;
}

export function useCalc(): UseCalc {
    const [display, setDisplay] = useState<IDisplayData>({
        code: '',
        result: '',
        error: true,
    });

    const actions = useMemo(() => {
        let code = '0';

        setDisplay({
            code,
            result: '0',
            error: false,
        });

        const handleChange = (newCode: string) => {
            code = newCode;

            try {
                const root = parse(code);
                const result = root.evaluate();

                setDisplay({
                    code,
                    result: result.value.toString(),
                    error: false,
                });
            } catch (_) {
                setDisplay((state) => ({
                    ...state,
                    code,
                    error: true,
                }));
            }
        };

        return {
            onChange: handleChange,
        };
    }, []);

    return {
        display,
        ...actions,
    };
}
