import { RootNode } from '@src/parser';

interface AstViewProps {
    ast: RootNode;
}

export function AstView({ ast }: AstViewProps) {
    return <pre>{JSON.stringify(ast, null, 4)}</pre>;
}
