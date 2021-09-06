const inquirer = require('inquirer');

function viewDepartments(db) {
    db.query(`SELECT department.name AS department FROM department` , (err, rows) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        mainMenu();
        return;
    });
};

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
        const sql = `INSERT INTO department (department.name) 
                        VALUES (?)`;

        let params = [response.name];

        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }

            console.log('Successfully added new department!');
            mainMenu();
            return;
        })
    })
};

function updateDepartment(db) {
    db.query('SELECT department.name FROM department', (err, result) => {
        if (err) {
            console.log(err);
        }

        const departmentArr = [];

        for (let i = 0; i < result.length; i++) {
            departmentArr.push(result[i].name);
        }

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
            if(response.department === 'None') {
                mainMenu()
                return;
            }

            const sql = `UPDATE department
                            SET department.name = ?
                            WHERE department.name = ?`

            let params = [response.name, response.department];

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }

                console.log('Successfully updated the department name!');
                mainMenu();
                return;
            })
        })
    })
};

function deleteDepartment(db) {
    db.query(`SELECT department.name FROM department`, (err, results) => {
        const departmentArr = [];

        for (let i = 0; i < results.length; i++) {
            departmentArr.push(results[i].name);
        }

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
                default: false
            }
        ]).then(response => {
            if (response.delete) {
                const sql = `DELETE FROM department WHERE department.name = ?`;
                let params = response.department;

                db.query(sql, params, (err, response) => {
                    if (err) {
                        console.log(err);
                    }

                    console.log('Successfully deleted department!');
                    mainMenu();
                    return;
                });
            } else {
                mainMenu();
                return;
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