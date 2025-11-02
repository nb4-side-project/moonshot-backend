import projectService from './projects.service.js';

import type { CreateProjectDto } from './projects.schema.js';
import type { Request, Response } from 'express';

const projectController = {
    /**
     * 프로젝트 생성
     * @param req
     * @param res
     */

    /**
     *
     * @param req
     * @param res
     */
    async create(req: Request, res: Response): Promise<void> {
        // JWT에서 유저 ID 추출 (미들웨어에서 세팅된다고 가정)
        const userId = req.user.id;
        const projectData = req.body as CreateProjectDto;

        const newProject = await projectService.createProject(userId, projectData);

        res.status(201).json({
            message: '프로젝트가 성공적으로 생성되었습니다.',
            data: newProject,
        });
    },
};

export default projectController;

// **프로젝트 등록**
// - 프로젝트 이름, 설명을 입력하여 프로젝트를 생성합니다.
// - 유저당 최대 5개의 프로젝트만 생성 가능합니다.

// **프로젝트 목록 조회**
// - 로그인 한 유저가 참여한 프로젝트 목록이 표시됩니다.
// - 각 프로젝트 마다 이름, 멤버 수, 상태별 할 일 수가 조회됩니다.
// - 최신순, 이름순으로 정렬 가능합니다.

// **프로젝트 수정**
// - 프로젝트를 생성한 사람만 프로젝트 수정이 가능합니다.

// **프로젝트 삭제**
// - 프로젝트를 생성한 사람만 프로젝트 삭제가 가능합니다.
// - 참여 중인 프로젝트가 삭제되었을 경우, 멤버들에게 이메일로 알림이 전송됩니다.
