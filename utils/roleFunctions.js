// imports the required functions as well as inquirer to be used
const inquirer = require('inquirer');
const { createDepartmentArr, createRoleArr } = require('./generalFunction');

// this function handles the viewing of all of the roles
function viewRoles(db) {
    const sql = `SELECT role.id, role.title AS role, role.salary, department.name AS department
                    FROM role
                    JOIN department ON role.department_id = department.id
                    ORDER BY role.department_id ASC`;

    // this query will return all information regarding the roles and then return the user to the main menu
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        mainMenu(db);
    });
};

// this function handles the adding of roles
function addRole(db) {
    // this pulls all of the department names
    const sql = `SELECT * FROM department`;

    // a query that will create a department array that will be used in the following inquirer prompts
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
                // this validation ensures that there is a number entered
                validate: (salary) => {
                    const isValid = Number.isInteger(salary);

                    return isValid || 'Please enter a valid salary!';
                },
                filter: (salary) => {
                    // clear the invalid input and resulting NaN prompt
                    return Number.isNaN(salary) || Number(salary) <= 0 ? '' : Number(salary);
                }   
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department does this role belong to?',
                choices: departmentArr
            }
        ]).then(response => {
            // stores the request to retrieve the department id
            const sql = `SELECT department.id
                            FROM department
                            WHERE department.name = ?`;

            // stores the chosen department as a parameter
            let params = response.department;

            // queries the department table for the department id that matches the department that was chosen in the inquirer questions above
            db.query(sql, params, (err, result) => {
                // stores the request to create a new role
                const sql = `INSERT INTO role (title, salary, department_id)
                                VALUES (?, ?, ?)`;

                // takes two of the responses from the above questions as well as the result of the prior query and stores them as a parameter
                let params = [response.role, response.salary, result[0].id];

                // creates a new role based on the above two variables
                db.query(sql, params, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
    
                    console.log('You have successfully added a role!');
                    // when the query is finished the user is returned to the main menu
                    mainMenu(db);
                });
            });
        });    
    });
};

function updateRole(db) {
    // stores a request to retrieve the role titles
    const sql = `SELECT role.title
                    FROM role`;

    // queries the roles table and return all of the titles 
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }

        // variable is created that stores an array from the above query's response
        const roleArr = createRoleArr(result);

        // pushes exit to the array as an option for the following inquirer requests
        roleArr.push('Exit');

        // stores the request to retrieve all names in the department table
        const sql = `SELECT department.name
                        FROM department`;

        // returns all names in the department table
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }

            // this variable creates an array of all of the returned department names
            const departmentArr = createDepartmentArr(result);

            // these prompts are created using the above department arrays and role arrays to help keep the program dynamic
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
                    // validates that the salary is input as an integer
                    validate: (salary) => {
                        const isValid = Number.isInteger(salary);
    
                        return isValid || 'Please enter a valid salary!';
                    },
                    filter: (salary) => {
                        // clear the invalid input and clears the NaN input
                        return Number.isNaN(salary) || Number(salary) <= 0 ? '' : Number(salary);
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
                // if the user chooses to exit they will be returned to the main menu
                if (response.role === 'Exit') {
                    mainMenu(db);    
                }

                // if the user chooses to update the name they will then be taken through the following steps
                if (response.update === 'Name') {
                    // sets the request that will be used to update the title based on the title of a role
                    const sql = `UPDATE role
                                    SET role.title = ?
                                    WHERE role.title = ?`;
                    
                    // sets the new title to what the user input above in the inquirer response and sets the title to search by based on the 
                    // choice within the role array above
                    let params = [response.title, response.role];

                    // this query sets the new title 
                    db.query(sql, params, (err, result) => {
                        if (err) {
                            console.log(err)
                        }

                        console.log('Successfully updated role!');
                        // after the user has updated the title they will be returned to the main menu
                        mainMenu(db);
                    });
                } else if (response.update === 'Salary') {
                    // if the user chooses to update the salary the below varible will store the request to be user
                    const sql = `UPDATE role
                                    SET role.salary = ?
                                    WHERE role.title = ?`;

                    // the salary paramaeter is based off of the response in the above inquirer prompts while the role to search with
                    // is chosen from the above role array
                    let params = [response.salary, response.role];

                    // this query updates the role based on the above two variables
                    db.query(sql, params, (err, result) => {
                        if (err) {
                            console.log(err);
                        }

                        console.log('Successfully updated role!');
                        // after the user has successfully update the salary they will be returned to the main menu
                        mainMenu(db);
                    })
                } else if (response.update === 'Department') {
                    // if the user decides to update the department this request will retrieve the department id
                    const sql = `SELECT department.id
                                    FROM department
                                    WHERE department.name = ?`;

                    // this parameter is set based on the department chosen from the above department array
                    let params = response.department;

                    // this query will return the department id for use in updating the role
                    db.query(sql, params, (err, result) => {
                        // this variable stores the request to update the department that a role belongs to
                        const sql = `UPDATE role
                                        SET role.department_id = ?
                                        WHERE role.title = ?`;

                        // this parameter takes the id that was given in the previous request and the role that was chosen above
                        let params = [result[0].id, response.role];

                        // uses the above two variables to update the department id for a role
                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            console.log('Successfully update role!');
                            // after the department id has been updated the user will be returned to the main menu
                            mainMenu(db);
                        })
                    })
                }
            })
        })
    })
};

function deleteRole(db) {
    // stores the request to return all titles in the role table
    const sql = `SELECT role.title
                    FROM role`;

    // queries the database and returns all titles from the role table
    db.query(sql, (err, result) => {
        // creates a role array based on the returned titles
        const roleArr = createRoleArr(result);

        // adds Exit to the array
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
            // if the user decides to exit the application they will be returned to the main menu
            if (response.role === 'Exit') {
                mainMenu();
            } else {
                if (response.delete) {
                    // stores the request to delete a role based on the title
                    const sql = `DELETE FROM role 
                                    WHERE role.title = ?`;

                    // stores the title of the role that was chosen above from the role array
                    let params = response.role;

                    // uses the above two variables to remove a role
                    db.query(sql, params, (err, response) => {
                        if (err) {
                            console.log(err);
                        }
    
                        console.log('Successfully deleted role!');
                        // after a role has been deleted the user is returned to the main menu
                        mainMenu(db);
                    });
                } else {
                    // if the user decides on the confirmation to not delete a role they will be returned to the main menu without
                    // deleting anything
                    mainMenu(db);
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