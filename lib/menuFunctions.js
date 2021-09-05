const inquirer = require('inquirer');

function allEmployees(db) {
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
};

function employeeDepartments(db) {
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
};

function employeeManagers(db) {
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
};

function employeeRoles(db) {
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
}

function addEmployee(db) {
    db.query(`SELECT role.title FROM role`, (err, result) => {
        const roleArr = [];

        for (let i = 0; i < result.length; i++) {
            roleArr.push(result[i].title);
        }

        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the employees first name?',
                validate: (first_name) => {
                    if (first_name) {
                        return true;
                    }
                    
                    console.log('You must enter a valid first name!');
                    return false;
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the employees last name?',
                validate: (last_name) => {
                    if (last_name) {
                        return true;
                    }

                    console.log('You must enter a valide last name!');
                    return false;
                }
            },
            {
                type: 'number',
                name: 'employeeId',
                message: "What is the employee's id:",
                validate: (managerId) => {
                    const isValid = Number.isInteger(managerId);

                    return isValid || 'Please enter a id number!';
                },
                filter: (managerId) => {
                    // clear the invalid input
                    return Number.isNaN(managerId) || Number(managerId) <= 0 ? '' : Number(managerId);
                }
            },
            {
                type: 'list',
                name: 'role',
                message: 'What role does this employee have?',
                choices: roleArr
            },
            {
                type: 'confirm',
                name: 'manager',
                message: 'Does this employee have a manager?',
                default: true
            },
            {
                type: 'number',
                name: 'managerId',
                message: "What is the manager's id:",
                validate: (managerId) => {
                    const isValid = Number.isInteger(managerId);

                    return isValid || 'Please enter a id number!';
                },
                filter: (managerId) => {
                    // clear the invalid input
                    return Number.isNaN(managerId) || Number(managerId) <= 0 ? '' : Number(managerId);
                },
                when: ({ manager }) => {
                    if (manager) {
                        return true;
                    }

                    return false;
                }
            }
        ]).then(response => {
            db.query(`SELECT role.id FROM role WHERE role.title = ?`, response.role, (err, result) => {
                roleId = (result[0].id);

                if (response.manager === false) {
                    managerId = null;
                } else {
                    managerId = response.managerId;
                }
    
                const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
                                VALUES (?, ?, ?, ?, ?)`;
    
                let params = [response.employeeId, response.first_name, response.last_name, roleId, managerId];
    
                db.query(sql, params, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
    
                    console.log('Employee added successfully!');
                    menu()
                    return;
                });
            });
        });       
    });
};

function updateEmployee(db) {

};

function searchRoles(db) {
    db.query(`SELECT role.title AS role, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id`, (err, rows) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        menu();
        return;
    });
};

module.exports = {
    allEmployees,
    employeeDepartments,
    employeeManagers,
    employeeRoles,
    addEmployee,
    updateEmployee,
    searchRoles
}