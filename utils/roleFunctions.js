const inquirer = require('inquirer');
const { createDepartmentArr, createRoleArr } = require('./generalFunction');

function viewRoles(db) {
    const sql = `SELECT role.title AS role, role.salary, department.name AS department
                    FROM role
                    JOIN department ON role.department_id = department.id
                    ORDER BY role.department_id ASC`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        mainMenu(db);
        return;
    });
};

function addRole(db) {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, result) => {
        const departmentArr = createDepartmentArr(result);

        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the new role?',
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary for this role?',
                validate: (id) => {
                    const isValid = Number.isInteger(id);

                    return isValid || 'Please enter a id number!';
                },
                filter: (id) => {
                    // clear the invalid input
                    return Number.isNaN(id) || Number(id) <= 0 ? '' : Number(id);
                }   
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department does this role belong to?',
                choices: departmentArr
            }
        ]).then(response => {
            const sql = `SELECT department.id
                            FROM department
                            WHERE department.name = ?`;

            let params = response.department;

            db.query(sql, params, (err, result) => {
                const sql = `INSERT INTO role (title, salary, department_id)
                                VALUES (?, ?, ?)`;

                let params = [response.role, response.salary, result[0].id];

                db.query(sql, params, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
    
                    console.log('You have successfully added a role!');
                    mainMenu(db);
                    return;
                });
            });
        });    
    });
};

function updateRole(db) {
    const sql = `SELECT role.title
                    FROM role`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }

        const roleArr = createRoleArr(result);

        roleArr.push('Exit');

        const sql = `SELECT department.name
                        FROM department`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }

            const departmentArr = createDepartmentArr(result);

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What role would you like to update?',
                    choices: roleArr
                },
                {
                    type: 'list',
                    name: 'update',
                    message: 'What would you like to update?',
                    choices: ['Name', 'Salary', 'Department'],
                    when: ({ role }) => {
                        if (role !== 'Exit') {
                            return true;
                        }

                        return false;
                    }
                },
                {
                    type: 'input',
                    name: 'title',
                    message: 'What would you like to rename this role to?',
                    when: ({ update }) => {
                        if (update === 'Name') {
                            return true;
                        }

                        return false;
                    }
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'What is the new salary for this role?',
                    validate: (id) => {
                        const isValid = Number.isInteger(id);
    
                        return isValid || 'Please enter a valid salary!';
                    },
                    filter: (id) => {
                        // clear the invalid input
                        return Number.isNaN(id) || Number(id) <= 0 ? '' : Number(id);
                    },
                    when: ({ update }) => {
                        if (update === 'Salary') {
                            return true;
                        }
    
                        return false;
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'What is the new department for this role?',
                    choices: departmentArr,
                    when: ({ update }) => {
                        if (update === 'Department') {
                            return true;
                        }

                        return false;
                    }
                }
            ]).then(response => {
                if (response.role === 'Exit') {
                    mainMenu(db);
                    return;
                }

                if (response.update === 'Name') {
                    const sql = `UPDATE role
                                    SET role.title = ?
                                    WHERE role.title = ?`;
                    
                    let params = [response.title, response.role];

                    db.query(sql, params, (err, result) => {
                        if (err) {
                            console.log(err)
                        }

                        console.log('Successfully updated role!');
                        mainMenu(db);
                        return;
                    });
                } else if (response.update === 'Salary') {
                    const sql = `UPDATE role
                                    SET role.salary = ?
                                    WHERE role.title = ?`;

                    let params = [response.salary, response.role];

                    db.query(sql, params, (err, result) => {
                        if (err) {
                            console.log(err);
                        }

                        console.log('Successfully updated role!');
                        mainMenu(db);
                        return;
                    })
                } else if (response.update === 'Department') {
                    const sql = `SELECT department.id
                                    FROM department
                                    WHERE department.name = ?`;

                    let params = response.department;

                    db.query(sql, params, (err, result) => {
                        const sql = `UPDATE role
                                        SET role.department_id = ?
                                        WHERE role.title = ?`;

                        let params = [result[0].id, response.role];

                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            console.log('Successfully update role!');
                            mainMenu(db);
                            return;
                        })
                    })
                }
            })
        })
    })
};

function deleteRole(db) {
    const sql = `SELECT role.title
                    FROM role`;

    db.query(sql, (err, result) => {
        const roleArr = createRoleArr(result);

        roleArr.push('Exit');

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to delete?',
                choices: roleArr
            },
            {
                type: 'confirm',
                name: 'delete',
                message: 'Are you sure?',
                default: false,
                when: ({ role }) => {
                    if (role !== 'Exit') {
                        return true;
                    }

                    return false;
                }
            }
        ]).then(response => {
            if (response.role === 'Exit') {
                mainMenu();
                return;
            } else {
                if (response.delete) {
                    const sql = `DELETE FROM role WHERE role.title = ?`;
                    let params = response.role;
    
                    db.query(sql, params, (err, response) => {
                        if (err) {
                            console.log(err);
                        }
    
                        console.log('Successfully deleted role!');
                        mainMenu(db);
                        return;
                    });
                } else {
                    mainMenu(db);
                    return;
                }
            }
        });
    });
};

module.exports = {
    viewRoles,
    addRole,
    updateRole,
    deleteRole
}