import { ButtonCode } from '../types';

export const keyboardLayout: ButtonCode[][] = [
    [ButtonCode.Plus, ButtonCode.Minus, ButtonCode.Multiply, ButtonCode.Divide],
    [ButtonCode.Symbol7, ButtonCode.Symbol8, ButtonCode.Symbol9, ButtonCode.Enter],
    [ButtonCode.Symbol4, ButtonCode.Symbol5, ButtonCode.Symbol6, ButtonCode.Enter],
    [ButtonCode.Symbol1, ButtonCode.Symbol2, ButtonCode.Symbol3, ButtonCode.Enter],
    [ButtonCode.Symbol0, ButtonCode.Symbol0, ButtonCode.SymbolDot, ButtonCode.Enter],
];

export interface IButtonMeta {
    text: string;
    operator?: boolean;
    enter?: boolean;
}

export const buttonsMeta: { [key in ButtonCode]: IButtonMeta } = {
    [ButtonCode.Plus]: { text: '+', operator: true },
    [ButtonCode.Minus]: { text: '-', operator: true },
    [ButtonCode.Multiply]: { text: '×', operator: true },
    [ButtonCode.Divide]: { text: '÷', operator: true },
    [ButtonCode.Symbol7]: { text: '7' },
    [ButtonCode.Symbol8]: { text: '8' },
    [ButtonCode.Symbol9]: { text: '9' },
    [ButtonCode.Symbol4]: { text: '4' },
    [ButtonCode.Symbol5]: { text: '5' },
    [ButtonCode.Symbol6]: { text: '6' },
    [ButtonCode.Symbol1]: { text: '1' },
    [ButtonCode.Symbol2]: { text: '2' },
    [ButtonCode.Symbol3]: { text: '3' },
    [ButtonCode.Symbol0]: { text: '0' },
    [ButtonCode.SymbolDot]: { text: '.' },
    [ButtonCode.Enter]: { text: '=', enter: true },
};
