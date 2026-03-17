import { Response } from 'express';
import { query } from '../db/index';
import { AuthRequest } from '../middleware/auth.middleware';

//Resumen
export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        // Totales por estado
        const byStatus = await query(
            //COUNT(*) cuenta cuantas filas hay
            //::int convierte el resultado a numero entero
            //as count le pone un nombre al resultado para poder accederlo como row.count.
            `SELECT status, COUNT(*)::int as count
         FROM applications
         WHERE user_id = $1
         GROUP BY status`, //a las respuestas, las agrupa por estado
            [req.userId]
        );

        // Total general
        const total = await query(
            `SELECT COUNT(*)::int as count
         FROM applications
         WHERE user_id = $1`,
            [req.userId]
        );

        // Tasa de respuesta: cualquier estado distinto de 'applied' cuenta como respuesta
        const responded = await query(
            `SELECT COUNT(*)::int as count
         FROM applications
         WHERE user_id = $1 AND status != 'applied'`,
            [req.userId]
        );

        // Tiempo promedio en días entre applied_at y updated_at para los que tuvieron respuesta
        const avgTime = await query(
            `SELECT ROUND(AVG(updated_at::date - applied_at))::int as avg_days
         FROM applications
         WHERE user_id = $1 AND status != 'applied'`,
            [req.userId]
        );

        const totalCount = total.rows[0].count;
        const respondedCount = responded.rows[0].count;
        const responseRate = totalCount > 0
            ? Math.round((respondedCount / totalCount) * 100)
            : 0;

        res.json({
            total: totalCount,
            byStatus: byStatus.rows,
            responseRate,
            avgResponseDays: avgTime.rows[0].avg_days || 0,
        });
    } catch (err) {
        console.error('Error en getSummary:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Semanalmente
export const getWeekly = async (req: AuthRequest, res: Response) => {
    try {
      // Postulaciones agrupadas por semana (últimas 8 semanas)
      const result = await query(
        `SELECT
           TO_CHAR(DATE_TRUNC('week', applied_at), 'DD/MM') as week,
           COUNT(*)::int as count
         FROM applications
         WHERE user_id = $1
           AND applied_at >= NOW() - INTERVAL '8 weeks'
         GROUP BY DATE_TRUNC('week', applied_at)
         ORDER BY DATE_TRUNC('week', applied_at) ASC`,
        [req.userId]
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error('Error en getWeekly:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };