//Verificacion del JWT

import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request { //crea una interfaz llamada AuthRequest que tenga todo lo que tiene Request pero además agregue userId
    userId?: number
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    //el token viene en el header: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //solo agarramos el token, no el Barer

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    try {
        const decode= jwt.verify(token, JWT_SECRET) as {userId: number};
        req.userId = decode.userId;
        next()
    } catch (err){
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}