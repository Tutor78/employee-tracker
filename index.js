const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const { allEmployees, employeeDepartments, employeeManagers, employeeRoles, addEmployee, updateEmployee, deleteEmployee } = require('./lib/employeeFunctions');
const { viewRoles, addRole, updateRole, deleteRole } = require('./lib/roleFunctions');
const { viewDepartments, addDepartment, updateDepartment, deleteDepartment } = require('./lib/departmentFunctions');

require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySql username,
        user: process.env.db_user,
        // Your MySql password
        password: process.env.db_pass,
        database: process.env.db_name
    },
    console.log('Welcome to the employee tracker!')
);

topMenu = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            name: 'topMenu',
            message: 'What would you like to do?',
            choices: ['Installation', 'Manage Database', 'Main Menu', 'Exit']
        }
    ]).then(response => {
        if (response.topMenu === 'Installation') {
            console.log('Installation coming soon!');
            topMenu();
        } else if (response.topMenu === 'Manage Database') {
            console.log('Database management coming soon!');
            topMenu();
        } else if (response.topMenu === 'Main Menu') {
            mainMenu();
        } else if (response.topMenu === 'Exit') {
            console.log('Goodbye!');
            db.end();
        }
    })
}

isntallationMenu = async () => {
    // installation menu goes here
};

databaseMenu = async () => {
    // database managerment code goes here
};

mainMenu = async () => {
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

topMenu();