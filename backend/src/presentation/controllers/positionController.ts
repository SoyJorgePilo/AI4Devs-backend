import { Request, Response } from 'express';
import { getCandidatesForPosition } from '../../application/services/positionService';

export const getPositionCandidates = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'ID de posición inválido' });
        }

        const candidates = await getCandidatesForPosition(positionId);
        res.json(candidates);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};