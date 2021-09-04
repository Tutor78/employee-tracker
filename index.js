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
    console.log('Connected to the employee database.')
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
        db.query(`SELECT department.name FROM department`, (err, result) => {
            const departmentArr = [];

            for (let i = 0; i < result.length; i++) {
                departmentArr.push(result[i].name);
            }

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department would you like to search by?',
                    choices: departmentArr
                }
            ]).then(response => {
                const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department
                                FROM employee
                                JOIN role on employee.role_id = role.id
                                JOIN department ON role.department_id = department.id
                                WHERE department.name = ?`;

                let params = response.department;
    
                db.query(sql, params, (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
    
                    console.table(rows);
                    menu();
                    return;
                })
            })
            
        })
    } else if (response.search === 'View All Employees By Manager') {
        db.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee WHERE employee.manager_id IS NULL`, (err, response) => {
            const managerArr = [];

            for (let i = 0; i < response.length; i++) {
                let managerName = response[i].first_name + ' ' + response[i].last_name;
                let managerId = response[i].id

                const managerObj = {};
                managerObj.name = managerName;
                managerObj.id = managerId;

                managerArr.push(managerObj);
            }

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Which manager would you like to search by?',
                    choices: managerArr
                }
            ]).then(response => {
                const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department
                                FROM employee
                                JOIN role on employee.role_id = role.id
                                JOIN department ON role.department_id = department.id
                                WHERE employee.manager_id = ?`;
                
                let params;

                for (let i = 0; i < managerArr.length; i++) {
                    if (response.manager === managerArr[i].name) {
                        params = managerArr[i].id;
                    }
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
        })
    } else if (response.search === 'View All Employees By Role') {
        db.query(`SELECT role.title FROM role`, (err, response) => {
            if (err) {
                console.log(err);
            }

            const roleArr = [];

            for (let i = 0; i < response.length; i++) {
                roleArr.push(response[i].title);
            }

            // console.log(roleArr);

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'Which role would you like to search by?',
                    choices: roleArr
                }
            ]).then(response => {
                const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department
                                FROM employee
                                JOIN role ON employee.role_id = role.id
                                JOIN department ON role.department_id = department.id
                                WHERE role.title = ?`;

                let params = response.role;
    
                db.query(sql, params, (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
    
                    console.table(rows);
                    menu();
                    return;
                });
            });
        });
    }else if (response.search === 'Exit') {
        db.end();
        return;
    }
};

menu();