// all variables to be used in the various menus
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// imports the functions that are needed for the main menu
const { allEmployees, employeeDepartments, employeeManagers, employeeRoles, addEmployee, updateEmployee, deleteEmployee } = require('./employeeFunctions');
const { viewRoles, addRole, updateRole, deleteRole } = require('./roleFunctions');
const { viewDepartments, addDepartment, updateDepartment, deleteDepartment } = require('./departmentFunctions');

require('dotenv').config();

// handles the top menu based on the inquirer responses
function topMenuHandler(response) {
    // creates a connection to the database
    const db = mysql.createConnection(
        {
            host: 'localhost',
            user: process.env.db_user,
            password: process.env.db_pass,
            database: 'employees_db'
        },
        console.log('Connected to the employee database!')
    );

    // if the user decides to view the database they will be redirected to the database menu
    if (response.topMenu === 'Manage Database') {
        databaseMenu(db);
    } else if (response.topMenu === 'Main Menu') {
        // if the user chooses the main menu they will be directed to the main menu function
        mainMenu(db);
    } else if (response.topMenu === 'Exit') {
        // exits the application back to the command line
        console.log('Goodbye!');
        process.exit();
    }
};

// function that handles the database menu based off the inquirer respnonses
function databaseMenuHandler(response, db) {
    // if the user decides to view the tables this function will log the tables
    if (response.database === 'View Tables') {
        const sql = `SHOW TABLES`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }

            console.table(result);

            databaseMenu(db);
        })
    } else if (response.database === 'Retrieve Table Information') {
        // if the user decides to retrieve database information this will guide them through

        inquirer.prompt([
            {
                type: 'list',
                name: 'table',
                message: 'Which table would you like more information about?',
                choices: ['Department', 'Role', 'Employee']
            }
        ]).then(response => {
            // this is the information that one would get if they chose to describe a table
            const sql = `SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, COLUMN_KEY, IS_NULLABLE
                            FROM INFORMATION_SCHEMA.COLUMNS
                            WHERE TABLE_NAME = ?`;

            // this takes the response and makes it all lowercase to coincide with the tables within the database
            let params = response.table.toLowerCase();

            // database query to display the results
            db.query(sql, params, (err, result) => {
                console.table(result);

                databaseMenu(db);
            })
        })
    } else if (response.database === 'Exit') {
        // if the user decides to exit they will be returned to the top menu which is described above
        topMenu();
    } 
};

// this function handles the main menu using inquirer responses
function mainMenuHandler(response, db) {
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
        // if the user decides to exit this sends them back to the top menu function which is declared above
        topMenu();
    }
};

// this is the first menu that a user is presented with
topMenu = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            name: 'topMenu',
            message: 'What would you like to do?',
            choices: ['Manage Database', 'Main Menu', 'Exit']
        }
    ])

    topMenuHandler(response);
};

// function that deals with options for viewing the database
databaseMenu = async (db) => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            name: 'database',
            message: 'What would you like to do?',
            choices: ['View Tables', 'Retrieve Table Information', 'Exit']
        }
    ])

    databaseMenuHandler(response, db);
};

// this function handles all main menu requests for function information please check the relevant file
mainMenu = async (db) => {
    const response = await inquirer.prompt([
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

    mainMenuHandler(response, db);
};

module.exports = {
    topMenu
};