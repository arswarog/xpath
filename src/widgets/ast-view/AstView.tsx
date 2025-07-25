import { RootNode } from '@src/features/evaluate';

interface AstViewProps {
    ast: RootNode;
}

export function AstView({ ast }: AstViewProps) {
    return <pre>{JSON.stringify(ast, null, 2)}</pre>;
}
