import { ForbiddenError, ConflictError } from '@/shared/errors/custom-error.js';

import projectRepository from './projects.repository.js';

import type { CreateProjectDto } from './projects.schema.js';

const projectService = {
    /**
     * 프로젝트 생성
     * @param userId
     * @param projectData
     */
    async createProject(userId: number, projectData: CreateProjectDto) {
        // 1. 유저가 생성한 프로젝트 개수 확인
        const userProjectCount = await projectRepository.countProjectsByUser(userId);
        if (userProjectCount >= 5) {
            throw new ForbiddenError('프로젝트는 최대 5개까지만 생성할 수 있습니다.');
        }

        // 2. 같은 이름의 프로젝트 중복 여부 확인
        const existingProject = await projectRepository.findByNameAndUser(projectData.name, userId);
        if (existingProject) {
            throw new ConflictError('같은 이름의 프로젝트가 이미 존재합니다.');
        }

        // 3. 새 프로젝트 생성
        const newProject = await projectRepository.create({
            ...projectData,
            ownerId: userId,
        });

        return newProject;
    },
};

export default projectService;
