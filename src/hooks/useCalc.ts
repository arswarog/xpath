import { IDisplayData } from '../types';
import { useMemo, useState } from 'react';

export interface UseCalc {
    display: IDisplayData;
    onChange: (code: string) => void;
}

export function useCalc(): UseCalc {
    const [display, setDisplay] = useState<IDisplayData>({
        code: '',
        result: '',
    });

    const actions = useMemo(() => {
        let code = '6д + 2:00';

        setDisplay({
            code,
            result: '6д 2ч 12м',
        });

        const handleChange = (newCode: string) => {
            code = newCode;
            console.log(code);
            setDisplay({
                code,
                result: '6д 2ч 12м',
            });
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
