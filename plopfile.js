/**
 * Plop 설정 - 모듈 자동 생성
 * @param plop - Plop API 인스턴스
 */
export default function (plop) {
    // =========================================
    // 헬퍼 함수
    // =========================================

    // PascalCase 변환 (예: users → Users)
    plop.setHelper('pascalCase', (text) => {
        return text
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    });

    // camelCase 변환 (예: users → users, auth-token → authToken)
    plop.setHelper('camelCase', (text) => {
        const pascal = text
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    });

    // Singular 변환 (예: users → user, tasks → task)
    plop.setHelper('singular', (text) => {
        if (text.endsWith('ies')) {
            return text.slice(0, -3) + 'y'; // categories → category
        }
        if (text.endsWith('s')) {
            return text.slice(0, -1); // users → user
        }
        return text;
    });

    // =========================================
    // 모듈 생성기
    // =========================================
    plop.setGenerator('module', {
        description: '새로운 도메인 모듈 생성 (3-Layer Architecture)',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: '모듈 이름을 입력하세요 (복수형, 예: users, projects, tasks):',
                validate: (value) => {
                    if (/.+/.test(value)) {
                        return true;
                    }
                    return '모듈 이름을 입력해주세요.';
                },
            },
            {
                type: 'confirm',
                name: 'includeAuth',
                message: '인증이 필요한 모듈인가요? (AsyncAuthRequestHandler 사용)',
                default: true,
            },
        ],
        actions: () => {
            const actions = [];

            // 1. Controller
            actions.push({
                type: 'add',
                path: 'src/modules/{{name}}/{{name}}.controller.ts',
                templateFile: 'plop-templates/module/controller.hbs',
            });

            // 2. Service
            actions.push({
                type: 'add',
                path: 'src/modules/{{name}}/{{name}}.service.ts',
                templateFile: 'plop-templates/module/service.hbs',
            });

            // 3. Repository
            actions.push({
                type: 'add',
                path: 'src/modules/{{name}}/{{name}}.repository.ts',
                templateFile: 'plop-templates/module/repository.hbs',
            });

            // 4. Routes
            actions.push({
                type: 'add',
                path: 'src/modules/{{name}}/{{name}}.routes.ts',
                templateFile: 'plop-templates/module/routes.hbs',
            });

            // 5. Schema
            actions.push({
                type: 'add',
                path: 'src/modules/{{name}}/{{name}}.schema.ts',
                templateFile: 'plop-templates/module/schema.hbs',
            });

            // 6. Types
            actions.push({
                type: 'add',
                path: 'src/modules/{{name}}/{{name}}.types.ts',
                templateFile: 'plop-templates/module/types.hbs',
            });

            return actions;
        },
    });
}
