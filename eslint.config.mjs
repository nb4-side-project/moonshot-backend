import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
                NodeJS: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            prettier: prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            'no-console': 'off',
            'no-debugger': 'warn',
        },
    },
    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            'coverage/',
            '.husky/',
            '*.config.js',
            '*.config.ts',
            'prisma/migrations/'
        ],
    },
];
