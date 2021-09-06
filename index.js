const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const { allEmployees, employeeDepartments, employeeManagers, employeeRoles, addEmployee, updateEmployee, deleteEmployee } = require('./lib/employeeFunctions');
const { viewRoles, addRole, updateRole, deleteRole } = require('./lib/roleFunctions');
const { viewDepartments, addDepartment, updateDepartment, deleteDepartment } = require('./lib/departmentFunctions');

require('dotenv').config();


topMenu = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            name: 'topMenu',
            message: 'What would you like to do?',
            choices: ['Manage Database', 'Main Menu', 'Exit']
        }
    ]).then(response => {
        if (response.topMenu === 'Manage Database') {
            const db = mysql.createConnection(
                {
                    host: 'localhost',
                    // Your MySql username,
                    user: process.env.db_user,
                    // Your MySql password
                    password: process.env.db_pass,
                    database: 'employees_db'
                },
                console.log('Connected to the employee databse!')
            );

            databaseMenu(db);
        } else if (response.topMenu === 'Main Menu') {
            // Connect to database
            const db = mysql.createConnection(
                {
                    host: 'localhost',
                    // Your MySql username,
                    user: process.env.db_user,
                    // Your MySql password
                    password: process.env.db_pass,
                    database: 'employees_db'
                },
                console.log('Connected to the employee database!')
            );
            mainMenu(db);
        } else if (response.topMenu === 'Exit') {
            console.log('Goodbye!');
            process.exit();
        }
    })
}

databaseMenu = async (db) => {
    const response = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'database',
                message: 'What would you like to do?',
                choices: ['View Tables', 'Retrieve Table Information', 'Reset Database', 'Exit']
            }
        ]).then(response => {
            if (response.database === 'View Tables') {
                const sql = `SHOW TABLES`;

                db.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                    }

                    console.table(result);

                    databaseMenu(db);
                    return;
                })
            } else if (response.database === 'Retrieve Table Information') {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'table',
                        message: 'Which table would you like more information about?',
                        choices: ['Department', 'Role', 'Employee']
                    }
                ]).then(response => {
                    const sql = `SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, COLUMN_KEY, IS_NULLABLE
                                    FROM INFORMATION_SCHEMA.COLUMNS
                                    WHERE TABLE_NAME = ?`;

                    let params = response.table.toLowerCase();

                    db.query(sql, params, (err, result) => {
                        console.table(result);

                        databaseMenu(db);
                        return;
                    })
                })
            } else if (response.database === 'Reset Database') {
                console.log('This feature is coming soon!');
                databaseMenu();
                return;
            } else if (response.database === 'Exit') {
                topMenu();
                return;
            }  
        })
};

mainMenu = async (db) => {
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
                    'Delete Employee',
                    'View All Roles',
                    'Add Role',
                    'Update Role',
                    'Delete Role',
                    'View All Departments',
                    'Add Department',
                    'Update Department',
                    'Delete Department',
                    'Exit'
                ]
            }
        ]);

    // console.log(response);
    
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
        updateEmployee(db);
    } else if (response.search === 'Delete Employee') {
        deleteEmployee(db);
    } else if (response.search === 'View All Roles') {
        viewRoles(db);
    } else if (response.search === 'Add Role') {
        addRole(db);
    } else if (response.search === 'Update Role') {
        updateRole(db);
    } else if (response.search === 'Delete Role') {
        deleteRole(db);
    } else if (response.search === 'View All Departments') {
        viewDepartments(db);
    } else if (response.search === 'Add Department') {
        addDepartment(db);
    } else if (response.search === 'Update Department') {
        updateDepartment(db);
    } else if (response.search === 'Delete Department') {
        deleteDepartment(db);
    } else if (response.search === 'Exit') {
        topMenu();
    }
};

function init() {
    console.log('Welcome to the employee tracker v 1.0!')

    console.log('Please choose from the following items to continue!')

    topMenu();
}

init();