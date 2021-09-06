const inquirer = require('inquirer');
const { createDepartmentArr, createEmployeeArr, createManagerArr, createRoleArr } = require('./generalFunction');

function allEmployees(db) {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, IFNULL(employee.manager_id, 'N/A') AS manager_id
                        FROM employee
                        JOIN role ON employee.role_id = role.id
                        JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        mainMenu(db);
        return;
    });
};

function employeeDepartments(db) {
    const sql = `SELECT department.name
                    FROM department`;

    db.query(sql, (err, result) => {
        // console.log(result);

        const departmentArr = createDepartmentArr(result);

        departmentArr.push('Exit');

        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department would you like to search by?',
                choices: departmentArr
            }
        ]).then(response => {
            if (response.department === 'Exit') {
                mainMenu(db);
            } else {
                // console.log(response);
                
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
                    mainMenu(db);
                    return;
                })
            }
        })
    })
};

function employeeManagers(db) {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name
                    FROM employee
                    WHERE employee.manager_id IS NULL`;

    db.query(sql, (err, result) => {        
        const managerArr = createManagerArr(result);

        managerArr.push('Exit');

        inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager would you like to search by?',
                choices: managerArr
            }
        ]).then(response => {
            if (response.manager === 'Exit') {
                mainMenu(db);
                return;
            } else {
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
                    mainMenu(db);
                    return;
                })
            }
        })
    })
};

function employeeRoles(db) {
    const sql = `SELECT role.title
                    FROM role`

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }

        const roleArr = createRoleArr(result);

        roleArr.push('Exit');

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to search by?',
                choices: roleArr
            }
        ]).then(response => {
            if (response.role === 'Exit') {
                mainMenu(db);
                return;
            } else {
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
                    mainMenu(db);
                    return;
                });
            }
        });
    });
}

function addEmployee(db) {
    const sql = `SELECT role.title
                    FROM role`;

    db.query(sql, (err, result) => {
        const roleArr = createRoleArr(result);

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
            const sql = `SELECT role.id
                            FROM role
                            WHERE role.title = ?`;

            let params = response.role;

            db.query(sql, params, (err, result) => {
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
                    mainMenu(db)
                    return;
                });
            });
        });       
    });
};

function updateEmployee(db) {
    const sql = `SELECT employee.first_name, employee.last_name
                    FROM employee
                    ORDER BY employee.first_name ASC`;

    db.query(sql, (err, result) => {
        const employeeArr = createEmployeeArr(result);

        employeeArr.push('Exit');

        const sql = `SELECT role.title
                        FROM role`;

        db.query(sql, (err, result) => {
            const roleArr = createRoleArr(result);

            const sql = `SELECT employee.first_name, employee.last_name
                            FROM employee
                            WHERE employee.manager_id IS NULL`;

            db.query(sql, (err, result) => {
                const managerArr = createManagerArr(result);

                managerArr.push('None');

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: "Which employee's record would you like to update?",
                        choices: employeeArr
                    },
                    {
                        type: 'list',
                        name: 'update',
                        message: 'What would you like to update?',
                        choices: ['Id', 'First Name', 'Last Name', 'Role', 'Manager'],
                        when: ({ employee }) => {
                            if (employee !== 'Exit') {
                                return true;
                            }

                            return false;
                        }
                    },
                    {
                        type: 'number',
                        name: 'id',
                        message: 'What is the new id?',
                        validate: (id) => {
                            const isValid = Number.isInteger(id);
        
                            return isValid || 'Please enter a id number!';
                        },
                        filter: (id) => {
                            // clear the invalid input
                            return Number.isNaN(id) || Number(id) <= 0 ? '' : Number(id);
                        },
                        when: ({ update }) => {
                            if (update === 'Id') {
                                return true;
                            }
        
                            return false;
                        }
                    },
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the new first name?',
                        when: ({ update }) => {
                            if(update === 'First Name') {
                                return true;
                            }
    
                            return false;
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the new last name?',
                        when: ({ update }) => {
                            if(update === 'Last Name') {
                                return true;
                            }
    
                            return false;
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the new role?',
                        choices: roleArr,
                        when: ({ update }) => {
                            if (update === 'Role') {
                                return true;
                            }

                            return false;
                        }
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the new manager?',
                        choices: managerArr,
                        when: ({ update }) => {
                            if (update === 'Manager') {
                                return true
                            }

                            return false;
                        }
                    }
                ]).then(response => {
                    if (response.employee === 'Exit') {
                        mainMenu(db);
                        return;
                    }

                    let employeeSearch = response.employee.split(' ')[0];

                    if (response.update === 'Id') {
                        const sql = `UPDATE employee
                                        SET employee.id = ?
                                        WHERE employee.first_name = ?`;

                        let params = [response.id, employeeSearch];

                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            console.log('Successfully update id!');
                            mainMenu(db);
                            return;
                        });
                    } else if (response.update === 'First Name') {
                        const sql = `UPDATE employee
                                        SET employee.first_name = ?
                                        WHERE employee.first_name = ?`;

                        let params = [response.firstName, employeeSearch];

                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            console.log('Successfully updated the first name!');
                            mainMenu(db);
                            return;
                        });
                    } else if (response.update === 'Last Name') {
                        const sql = `UPDATE employee
                                        SET employee.last_name = ?
                                        WHERE employee.first_name = ?`;

                        let params = [response.lastName, employeeSearch];

                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            console.log('Successfully updated the last name!');
                            mainMenu(db);
                            return;
                        });
                    } else if (response.update === 'Role') {
                        db.query(`SELECT role.id FROM role WHERE role.title = ?`, response.role, (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            const sql = `UPDATE employee
                                            SET employee.role_id = ?
                                            WHERE employee.first_name = ?`
                            
                            let params = [result[0].id, employeeSearch];

                            db.query(sql, params, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }

                                console.log('Successfully updated the role');
                                mainMenu(db);
                                return;
                            });
                        });
                    } else if (response.update === 'Manager') {
                        let managerSearch = response.manager.split(' ')[0];

                        const sql = `SELECT employee.id
                                        FROM employee
                                        WHERE employee.first_name = ?`;

                        let params = managerSearch;

                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            const sql = `UPDATE employee
                                            SET employee.manager_id = ?
                                            WHERE employee.first_name = ?`
                                            
                            let params = [result[0].id, employeeSearch];

                            db.query(sql, params, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }

                                console.log('Successfully updated managers');
                                mainMenu(db);
                                return;
                            });
                        });
                    }
                });
            });
        });
    });
};

function deleteEmployee(db) {
    const sql = `SELECT employee.first_name, employee.last_name
                    FROM employee`;

    db.query(sql, (err, result) => {
        const employeeArr = createEmployeeArr(result);

        employeeArr.push('Exit');

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to delete?',
                choices: employeeArr
            },
            {
                type: 'confirm',
                name: 'delete',
                message: 'Are you sure?',
                default: false,
                when: ({ employee }) => {
                    if (employee !== 'Exit') {
                        return true;
                    }

                    return false;
                }
            }
        ]).then(response => {
            if (response.employee === 'Exit') {
                mainMenu(db);
                return;
            } else {
                let employeeSearch = response.employee.split(' ')[0];

                if (response.delete) {
                    const sql = `DELETE FROM employee 
                                    WHERE employee.first_name = ?`;

                    db.query(sql, employeeSearch, (err, response) => {
                        if (err) {
                            console.log(err);
                        }

                        console.log('Successfully deleted employee!');
                        mainMenu(db);
                        return;
                    })
                } else {
                    mainMenu(db);
                    return;
                }
            }
        });
    });
};

module.exports = {
    allEmployees,
    employeeDepartments,
    employeeManagers,
    employeeRoles,
    addEmployee,
    updateEmployee,
    deleteEmployee
}