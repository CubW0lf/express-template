import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(process.cwd(), '.env');

const dbConnect = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Test de la connexion à la base de données
dbConnect.connect((err) => {
    if (err) console.log('Mysql connection error: ', err);
    else console.log('Mysql connected');
});

export default dbConnect;