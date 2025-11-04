import { CreateUserDto } from './auth.schema.js';
import prisma from '../../configs/prisma.js';

const authRepository = {
    /**
     *
     * @param email
     */
    async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    },
    /**
     *
     * @param data
     */
    async createUser(data: CreateUserDto) {
        const newUser = await prisma.user.create({
            data: {
                email: data.email,
                password: data.hashedPassword,
                name: data.name,
                profileImage: data.profileImage,
                provider: 'local',
            },
            select: {
                id: true,
            },
        });
        return newUser;
    },
};

export default authRepository;
