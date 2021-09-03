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
        database: 'employees_db'
    },
    console.log('Connected to the election database.')
);

menu = async () => {
    const response = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'search',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees', 
                    'View All Employees By Department',
                    'View All Employees By Manager',
                    'View All Employees By Role',
                    'Add Employee',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'View All Roles',
                    'View All Departments',
                    'Add Department',
                    'Update Department',
                    'Exit'
                ]
            }
        ]);
    
    if (response.search == 'View All Employees') {
        db.query('SELECT * FROM employee', (err, rows) => {
            if (err) {
                console.log(err);
            }

            console.table(rows);
            menu();
            return;
        });
    } else if (response.search == 'Exit') {
        db.end();
        return;
    }
};

menu();