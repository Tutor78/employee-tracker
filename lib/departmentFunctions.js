const inquirer = require('inquirer');

function viewDepartments(db) {
    const sql = `SELECT department.name AS department
                    FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        mainMenu(db);
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
            mainMenu(db);
            return;
        })
    })
};

function updateDepartment(db) {
    const sql = `SELECT department.name
                    FROM department`;

    db.query(sql, (err, result) => {
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
            if(response.department === 'Exit') {
                mainMenu(db)
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
                mainMenu(db);
                return;
            })
        })
    })
};

function deleteDepartment(db) {
    const sql = `SELECT department.name
                    FROM department`;

    db.query(sql, (err, results) => {
        const departmentArr = [];

        for (let i = 0; i < results.length; i++) {
            departmentArr.push(results[i].name);
        }

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
            if (response.department === 'Exit') {
                mainMenu(db);
            } else {
                if (response.delete) {
                    const sql = `DELETE FROM department WHERE department.name = ?`;
                    let params = response.department;
    
                    db.query(sql, params, (err, response) => {
                        if (err) {
                            console.log(err);
                        }
    
                        console.log('Successfully deleted department!');
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
    viewDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
};