import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    jsdocPlugin.configs['flat/recommended-typescript'],
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
            import: importPlugin,
            jsdoc: jsdocPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
                node: {
                    extensions: ['.ts', '.js'],
                },
            },
        },
        rules: {
            // =========================================
            // 🎨 Prettier
            // =========================================
            'prettier/prettier': 'error',

            // =========================================
            // 📦 Import 규칙
            // =========================================
            // Import 순서 강제: 외부 라이브러리 → @/ 별칭 → 상대 경로
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin', // Node.js 내장 모듈 (fs, path 등)
                        'external', // 외부 라이브러리 (express, zod 등)
                        'internal', // @/ 별칭
                        ['parent', 'sibling'], // ../, ./
                        'index', // ./index
                        'type', // import type
                    ],
                    pathGroups: [
                        {
                            pattern: '@/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],

            // .js 확장자 필수 (ESM)
            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    ts: 'never',
                    js: 'always',
                },
            ],

            // Default export 권장 (Users 모듈 패턴)
            'import/prefer-default-export': 'warn',

            // 중복 import 금지
            'import/no-duplicates': 'error',

            // 순환 참조 금지
            'import/no-cycle': 'warn',

            // 존재하지 않는 모듈 import 금지
            'import/no-unresolved': 'off', // TypeScript가 이미 검사하므로 off

            // =========================================
            // 📝 JSDoc 규칙
            // =========================================
            // JSDoc 주석 필수 (함수, 클래스)
            'jsdoc/require-jsdoc': [
                'warn',
                {
                    require: {
                        FunctionDeclaration: false,
                        MethodDefinition: false,
                        ClassDeclaration: false,
                        ArrowFunctionExpression: false,
                        FunctionExpression: false,
                    },
                    contexts: [
                        // 객체의 메서드에만 JSDoc 권장
                        'Property[value.type="ArrowFunctionExpression"]',
                        'Property[value.type="FunctionExpression"]',
                    ],
                },
            ],

            // JSDoc 설명 필수
            'jsdoc/require-description': 'off',

            // JSDoc 파라미터 설명 필수
            'jsdoc/require-param-description': 'off',

            // JSDoc 리턴 설명 필수
            'jsdoc/require-returns-description': 'off',

            // JSDoc 리턴 타입 (TypeScript가 처리)
            'jsdoc/require-returns': 'off',
            'jsdoc/require-param-type': 'off',
            'jsdoc/require-returns-type': 'off',

            // JSDoc 태그 순서
            'jsdoc/tag-lines': 'off',

            // =========================================
            // 🔧 TypeScript 규칙
            // =========================================
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            // any 타입 사용 경고
            '@typescript-eslint/no-explicit-any': 'warn',

            // 함수 리턴 타입 명시 (선택적)
            '@typescript-eslint/explicit-module-boundary-types': 'off',

            // Non-null assertion 경고
            '@typescript-eslint/no-non-null-assertion': 'warn',

            // 네이밍 컨벤션
            '@typescript-eslint/naming-convention': [
                'error',
                // 변수/함수: camelCase
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                },
                // 함수: camelCase
                {
                    selector: 'function',
                    format: ['camelCase'],
                },
                // 타입/인터페이스: PascalCase
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
                // Zod 스키마: camelCase + Schema 접미사
                {
                    selector: 'variable',
                    filter: {
                        regex: 'Schema$',
                        match: true,
                    },
                    format: ['camelCase'],
                },
                // DTO 타입: PascalCase + Dto 접미사
                {
                    selector: 'typeAlias',
                    filter: {
                        regex: 'Dto$',
                        match: true,
                    },
                    format: ['PascalCase'],
                },
            ],

            // =========================================
            // 🚫 일반 규칙
            // =========================================
            // console.log 허용 (개발 환경)
            'no-console': 'off',

            // debugger 경고
            'no-debugger': 'warn',

            // var 금지 (let, const 사용)
            'no-var': 'error',

            // const 우선 사용
            'prefer-const': 'error',
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
            '*.config.mjs',
            '*.config.ts',
            'prisma/migrations/',
            'plop-templates/',
        ],
    },
];
