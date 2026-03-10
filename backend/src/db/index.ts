//ACA CONECTAMOS A LA BASE DE DATOS (POSTGRES)

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); //carga las variables de entorno desde el archivo .env en el entorno del proceso (process.env)

const pool = new Pool({ //crea una instancia de Pool para manejar la conexión a la base de datos
    connectionString: process.env.DATABASE_URL, //la conexión a la base de datos se define en la variable de entorno DATABASE_URL
});

pool.on('error', (err) => { //maneja errores de conexión a la base de datos
    console.error('Error en la conexión a la base de datos', err);
    process.exit(-1); //si hay un error, se sale del proceso con un código de error -1
});

export const query = (text: string, params?: unknown[]) => { //función para ejecutar consultas a la base de datos
    return pool.query(text, params); //ejecuta la consulta a la base de datos
  };

export default pool;

