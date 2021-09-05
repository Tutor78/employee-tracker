const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { allEmployees, employeeDepartments, employeeManagers, employeeRoles, addEmployee } = require('./lib/menuFunctions');
const { updateEmployee, searchRoles } = require('./lib/menuFunctions');
const NumberPrompt = require('inquirer/lib/prompts/number');


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
        allEmployees(db);
    } else if (response.search === 'View All Employees By Department') {
        employeeDepartments(db);
    } else if (response.search === 'View All Employees By Manager') {
        employeeManagers(db);
    } else if (response.search === 'View All Employees By Role') {
        employeeRoles(db);
    } else if (response.search === 'Add Employee') {
        addEmployee(db);
    } else if (response.search === 'Update Employee') {
        db.query(`SELECT employee.first_name, employee.last_name FROM employee ORDER BY employee.first_name ASC`, (err, result) => {
            const employeeArr = [];

            for (let i = 0; i < result.length; i++) {
                const firstName = result[i].first_name;
                const lastName = result[i].last_name;

                const employeeName = firstName + ' ' + lastName;

                employeeArr.push(employeeName);
            }

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's record would you like to update?",
                    choices: employeeArr
                }
            ]).then(response => {
                console.log(response);
            })
        })
    } else if (response.search === 'View All Roles') {
        searchRoles(db);
    } else if (response.search === 'Add Role') {

    } else if (response.search === 'Update Role') {

    } else if (response.search === 'View All Departments') {

    } else if (response.search === 'Add Department') {

    } else if (response.search === 'Update Department') {

    } else if (response.search === 'Exit') {
        db.end();
        return;
    }
};

menu();