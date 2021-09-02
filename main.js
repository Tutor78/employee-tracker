const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySql username,
        user: 'root',
        // Your MySql password
        password: process.env.db_pass,
        database: 'election'
    },
    console.log('Connected to the election database.')
);

menu = async () => {
    const response = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'search',
                message: 'Would you like to search the database?',
                choices: ['Yes', 'No']
            }
        ]);
    
    if (response.search == 'Yes') {
        db.query('SELECT * FROM candidates', (err, rows) => {
            if (err) {
                console.log(err);
            }

            console.table(rows);
            menu();
            return;
        });
    } else {
        db.end();
        return;
    }
};

menu();