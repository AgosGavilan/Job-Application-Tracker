import { Response } from 'express';
import { query } from '../db/index';
import { AuthRequest } from '../middleware/auth.middleware';

//Listar TODAS las postulaciones
export const getAllApplications = async (req: AuthRequest, res: Response) => {
    try {
        const result = await query(
            `SELECT * FROM applications
            WHERE user_id = $1
            ORDER BY applied_at DESC`,
            [req.userId]
        );
        res.json(result.rows)
    }
    catch (err) {
        console.error('Error al obtener postulaciones:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

//Obtener UNA postulacion determinada
export const getApplicationById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const result = await query(
            `SELECT * FROM applications
            WHERE id = $1 AND user_id = $2`,
            [id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Postulación no encontrada' });
        };

        res.json(result.rows[0]);
    }
    catch (err) {
        console.error('Error al obtener postulación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Crear una postulacion

export const createApplication = async (req: AuthRequest, res: Response) => {
    const { company, position, status, channel, applied_at, notes, follow_up_date } = req.body;

    if (!company || !position || !applied_at) {
        return res.status(400).json({ error: 'Empresa, puesto y fecha son obligatorios' });
    }

    try {
        const result = await query(
            `INSERT INTO applications 
            (user_id, company, position, status, channel, applied_at, notes, follow_up_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                req.userId,
                company,
                position,
                status || 'applied',
                channel || 'other',
                applied_at,
                notes || null,
                follow_up_date || null
            ]
        );
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error('Error al crear postulación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

//Actualizar una postulacion
export const updateApplication = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { company, position, status, channel, applied_at, notes, follow_up_date } = req.body;

    try {
        //verificar que la postulacion existe y pertenece al usuario
        const existing = await query(
            `SELECT id FROM applications WHERE id = $1 AND user_id = $2`,
            [id, req.userId]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: 'Postulación no encontrada' });
        }

        const result = await query(
            //COALESCE($1, company) significa: "si el valor nuevo es null, mantené el valor actual". Esto permite actualizar solo los campos que el usuario manda sin pisar los demás.
            `UPDATE applications SET
              company        = COALESCE($1, company),
              position       = COALESCE($2, position),
              status         = COALESCE($3, status),
              channel        = COALESCE($4, channel),
              applied_at     = COALESCE($5, applied_at),
              notes          = COALESCE($6, notes),
              follow_up_date = COALESCE($7, follow_up_date)
             WHERE id = $8 AND user_id = $9
             RETURNING *`,
            [company, position, status, channel, applied_at, notes, follow_up_date, id, req.userId]
        );
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error('Error al actualizar postulación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Eliminar una postulacion
export const deleteApplication = async (req: AuthRequest, res: Response) => {
    const { id } = req.params

    try {
        const result = await query(
            'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Postulación no encontrada' });
        }

        res.json({ message: 'Postulación eliminada correctamente' });
    }
    catch (err) {
        console.error('Error al eliminar postulación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}