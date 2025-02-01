import { useAction } from '@reatom/npm-react';

import { pressKeyAction } from '../state';

import { Keyboard } from './Keyboard';

export function KeyboardWidget() {
    const handleClick = useAction(pressKeyAction);

    return <Keyboard onClick={handleClick} />;
}
