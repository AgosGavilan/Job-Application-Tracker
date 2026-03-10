//Logica del registro y login

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = '7d';

//REGISTRO DE USUARIO --------------------------------------------------------------
export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    //validacion
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        //verificar si el email ya existe
        const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }

        //hashear la contraseña
        const password_hash = await bcrypt.hash(password, 10);

        //guardar el usuario en la base de datos
        const result = await query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email', [name, email, password_hash]); //guardar el usuario en la base de datos y devolver el id, name y email
        //VALUES ($1, $2, $3) son solo placeholders, son reemplazados con name, email y password_hash

        const user = result.rows[0]; //obtener el primer usuario de la base de datos porque rows siempre es un array

        //generamos el JWT
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); //con el userId y el expiresIn genera el payload y con el JWT_SECRET la firma.

        res.status(201).json({ token, user });
    } catch (error) {
        console.error('Error al registrar el usuario', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

//LOGIN DE USUARIO --------------------------------------------------------------
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
    }

    try {
        //buscar el usuario por email
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales Incorrectas' })
        }

        const user = result.rows[0]

        //comparar la contraseña con el hash
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales Inconrrectas' })
        }

        //generar el JWT
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}