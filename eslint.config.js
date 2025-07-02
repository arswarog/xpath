import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';

import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

export default tsEslint.config(
    { ignores: ['dist'] },
    {
        extends: [
            js.configs.recommended,
            importPlugin.flatConfigs.recommended,
            importPlugin.flatConfigs.typescript,
            ...tsEslint.configs.recommended,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    caughtErrorsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],

            'import/order': [
                'error',
                {
                    pathGroups: [
                        {
                            pattern: 'react,bem-css-modules',
                            group: 'builtin',
                            position: 'before',
                        },
                        {
                            pattern: '@src/**',
                            group: 'internal',
                        },
                    ],

                    pathGroupsExcludedImportTypes: ['react'],
                    'newlines-between': 'always',
                    groups: ['builtin', 'external', 'internal', 'parent', ['sibling', 'index']],

                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'import/no-unresolved': 'off',
        },
    },
    {
        plugins: { prettier: prettierPlugin },
        rules: {
            // выводить ошибку, если форматирование не по Prettier
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
        },
    },
    prettierConfig,
);
