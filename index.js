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
                    'Update Employee',
                    'View All Roles',
                    'Add Role',
                    'Update Role',
                    'View All Departments',
                    'Add Department',
                    'Update Department',
                    'Exit'
                ]
            }
        ]);
    
    if (response.search === 'View All Employees') {
        const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department
                        FROM employee
                        JOIN role ON employee.role_id = role.id
                        JOIN department ON role.department_id = department.id`;

        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
            }

            console.table(rows);
            menu();
            return;
        });
    } else if (response.search === 'View All Employees By Department') {
        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department would you like to search by?',
                choices: ['Management', 'Irrigation', 'Chemical', 'Maintenance']
            }
        ]).then(response => {
            const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department
                            FROM employee
                            JOIN role on employee.role_id = role.id
                            JOIN department ON role.department_id = department.id
                            WHERE department.id = ?`;
            let params;

            if(response.department=== 'Management') {
                params = 1;
            } else if (response.department === 'Irrigation') {
                params = 2;
            } else if (response.department === 'Chemical') {
                params = 3;
            } else {
                params = 4;
            }

            db.query(sql, params, (err, rows) => {
                if (err) {
                    console.log(err);
                }

                console.table(rows);
                menu();
                return;
            })
        })

    } else if (response.search === 'View All Employees By Manager') {
        inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager would you like to search by?',
                choices: ['Ronald Jackson', 'Timothy Gates', 'Jackson Smith']
            }
        ]).then(response => {
            const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department
                            FROM employee
                            JOIN role on employee.role_id = role.id
                            JOIN department ON role.department_id = department.id
                            WHERE employee.manager_id = ?`;
            let params;

            if (response.manager === 'Ronald Jackson') {
                params = 101;
            } else if (response.manager === 'Timothy Gates') {
                params = 102;
            } else {
                params = 103;
            }

            db.query(sql, params, (err, rows) => {
                if (err) {
                    console.log(err);
                }

                console.table(rows);
                menu();
                return;
            })

        })
    } else if (response.search === 'View All Employees By Role') {
        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to search by?',
                choices: [
                            'Area Manager', 
                            'Irrigation Tech',
                            'Spray Tech', 
                            'Crew Leader', 
                            'Crew Member'
                        ]
            }
        ]).then(response => {
            const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department
                            FROM employee
                            JOIN role ON employee.role_id = role.id
                            JOIN department ON role.department_id = department.id
                            WHERE employee.role_id = ?`;
            let params;

            if (response.role === 'Area Manager') {
                params = 1;
            } else if (response.role === 'Irrigation Tech') {
                params = 2;
            } else if (response.role === 'Spray Tech') {
                params = 3;
            } else if (response.role === 'Crew Leader') {
                params = 4;
            } else {
                params = 5;
            }

            db.query(sql, params, (err, rows) => {
                if (err) {
                    console.log(err);
                }

                console.table(rows);
                menu();
                return;
            })
        })
    }else if (response.search === 'Exit') {
        db.end();
        return;
    }
};

menu();