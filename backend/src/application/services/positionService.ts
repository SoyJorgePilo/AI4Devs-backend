import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCandidatesForPosition = async (positionId: number) => {
    const position = await prisma.position.findUnique({
        where: { id: positionId },
    });

    if (!position) {
        throw new Error('Posición no encontrada');
    }

    const candidates = await prisma.application.findMany({
        where: { positionId: positionId },
        select: {
            candidate: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            interviewStep: {
                select: {
                    name: true,
                },
            },
            interviews: {
                select: {
                    score: true,
                },
            },
        },
    });

    return candidates.map((application) => {
        const averageScore = application.interviews.length > 0
            ? application.interviews.reduce((sum, interview) => sum + (interview.score || 0), 0) / application.interviews.length
            : null;

        return {
            candidate_name: `${application.candidate.firstName} ${application.candidate.lastName}`,
            current_interview_step: application.interviewStep.name,
            average_score: averageScore,
        };
    });
};