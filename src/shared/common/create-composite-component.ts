import { ComponentType } from 'react';

export function createCompositeComponent<
    Component extends ComponentType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Children extends { [key: string]: ComponentType<any> },
>(component: Component, displayName: string, children?: Children): Component & Children {
    const result = Object.assign(component, children);

    result.displayName = displayName;

    return result;
}
