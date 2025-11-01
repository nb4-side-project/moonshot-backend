import prisma from '@/configs/prisma.js';

import type { CreateProjectDto } from './projects.schema.js';

const projectRepository = {
    /**
     * 특정 유저의 프로젝트 개수 확인
     * @param userId
     */
    async countProjectsByUser(userId: number): Promise<number> {
        return await prisma.project.count({
            where: { ownerId: userId },
        });
    },

    /**
     * 같은 이름의 프로젝트가 이미 존재하는지 확인
     * @param name
     * @param userId
     */
    async findByNameAndUser(name: string, userId: number) {
        return await prisma.project.findFirst({
            where: {
                name,
                ownerId: userId,
            },
        });
    },

    /**
     * 새 프로젝트 생성
     * @param data
     */
    async create(data: CreateProjectDto & { ownerId: number }) {
        // 1️⃣ 프로젝트 생성
        const project = await prisma.project.create({
            data,
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        // 2️⃣ 관계 기반 카운트(_count) 계산
        const projectWithCount = await prisma.project.findUnique({
            where: { id: project.id },
            include: {
                _count: {
                    select: {
                        members: true,
                        tasks: true,
                    },
                },
                tasks: {
                    select: {
                        status: true,
                    },
                },
            },
        });

        // 3️⃣ Task 상태별 count 분리
        const todoCount = projectWithCount?.tasks.filter((t) => t.status === 'todo').length ?? 0;
        const inProgressCount = projectWithCount?.tasks.filter((t) => t.status === 'in_progress').length ?? 0;
        const doneCount = projectWithCount?.tasks.filter((t) => t.status === 'done').length ?? 0;

        // 4️⃣ 최종 응답 형태 구성
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            memberCount: projectWithCount?._count.members ?? 0,
            todoCount,
            inProgressCount,
            doneCount,
        };
    },
};

export default projectRepository;
