// these variables are required to make the below functions work correctly
const inquirer = require('inquirer');
const { createDepartmentArr } = require('./generalFunction');

// this function is used to view all departments
function viewDepartments(db) {
    // this variable holds the sql request to view all information about the departments table
    const sql = `SELECT *
                    FROM department`;

    // this query uses the above variable to query the database 
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }

        // after the information is displayed the user is returned to the mwin menu
        console.table(rows);
        mainMenu(db);
    });
};

// this functions handles adding a new department to the departments table
function addDepartment(db) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of this new department?',
            validate: (name) => {
                if (name) {
                    return true;
                }

                return 'Please enter a valid department name!';
            }
        }
    ]).then(response => {
        // holds the sql query to be used to insert a new department
        const sql = `INSERT INTO department (department.name) 
                        VALUES (?)`;

        // this paramater holds the name of the new department
        let params = response.name;

        // this query uses the above two variables to add a new department to the department table
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }

            // after a department is added successfully the user is returned to the main menu
            console.log('Successfully added new department!');
            mainMenu(db);
        })
    })
};

// this function is used to update a department
function updateDepartment(db) {
    // this variable holds the sql to create a department array 
    const sql = `SELECT department.name
                    FROM department`;

    // this query is used to get the names of the current departments
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }

        // this function creates a department array to be used in the inquirer prompts below
        const departmentArr = createDepartmentArr(result);

        // this pushes an exit option to the newly created array
        departmentArr.push('Exit');

        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department would you like to update?',
                choices: departmentArr
            },
            {
                type: 'input',
                name: 'name',
                message: 'What is the new name for this department?',
                validate: (name) => {
                    if (name) {
                        return true;
                    }

                    return 'You must enter a valid department name!';
                },
                when: ({ department }) => {
                    if (department !== 'Exit') {
                        return true;
                    }

                    return false;
                }
            }
        ]).then(response => {
            // if the user decides to exit they are returned to the main menu
            if(response.department === 'Exit') {
                mainMenu(db)
            }

            // this sql holds the query to update a department that is located by name
            const sql = `UPDATE department
                            SET department.name = ?
                            WHERE department.name = ?`

            // this variable holds the parameters for the new name as well as the old nome of the department
            let params = [response.name, response.department];

            // this query uses the above two variables to update a department's name
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }

                // after a department is successfully updated the user is returned to the main menu
                console.log('Successfully updated the department name!');
                mainMenu(db);
            })
        })
    })
};

// This function is used to delete a department from the department table
function deleteDepartment(db) {
    // this variable holds the request to retrieve all of the names in the department table
    const sql = `SELECT department.name
                    FROM department`;

    // this query retrieves the name from the department table using the above variable
    db.query(sql, (err, result) => {
        // this creates an array holding all of the names of the department table for use in the inquirer question below
        const departmentArr = createDepartmentArr(result);

        // this adds an exit option to the department array
        departmentArr.push('Exit');

        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department would you like to delete?',
                choices: departmentArr
            },
            {
                type: 'confirm',
                name: 'delete',
                message: 'Are you sure?',
                default: false,
                when: ({ department }) => {
                    if (department !== 'Exit') {
                        return true;
                    }

                    return false;
                }
            }
        ]).then(response => {
            // if the user decides to exit they will be returned to the main menu
            if (response.department === 'Exit') {
                mainMenu(db);
            } else {
                if (response.delete) {
                    // if the user agrees to delete a department it is located by name and deleted
                    const sql = `DELETE FROM department 
                                    WHERE department.name = ?`;
                    // this hold the name of the department chosen in the above inquirer prompts
                    let params = response.department;
    
                    // this query uses the above two variables to delete a department from the department table
                    db.query(sql, params, (err, response) => {
                        if (err) {
                            console.log(err);
                        }

                        // after the department is deleted the user is returned to the menu
                        console.log('Successfully deleted department!');
                        mainMenu(db);
                        return;
                    });
                } else {
                    // if the user decides to not delete the chosen department they are returned to the main menu
                    mainMenu(db);
                }
            }
        });
    });
};

module.exports = {
    viewDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
};