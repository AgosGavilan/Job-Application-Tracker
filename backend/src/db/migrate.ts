//ACA EJECUTAMOS LAS MIGRACIONES

import fs from 'fs';
import path from 'path';
import pool from './index';

const runMigrations = async () => { //función para ejecutar las migraciones
    try {
        console.log("Conectando a la base de datos...");
        const client = await pool.connect(); //conecta a la base de datos

        const sqlPath = path.join(__dirname, 'migrations', '001_init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8'); //lee el archivo de la migración

        console.log("Ejecutando migración 001_init.sql...");
        await client.query(sql); //ejecuta la migración (001_init.sql)

        console.log('✅ Migraciones completadas'); //mensaje de éxito
        client.release(); //libera la conexión a la base de datos
        process.exit(0); //si la migración se ejecuta correctamente, se sale del proceso con un código de error 0
    } catch (err) {
        console.error('❌ Error en migraciones:', err);
        process.exit(1); //si hay un error, se sale del proceso con un código de error 1
    }
};

runMigrations();