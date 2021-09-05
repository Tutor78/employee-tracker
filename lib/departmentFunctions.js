const inquirer = require('inquirer');

function viewDepartments(db) {
    db.query(`SELECT department.name AS department FROM department` , (err, rows) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        menu();
        return;
    });
};

function addDepartment(db) {

};

function updateDepartment(db) {

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
                    menu();
                    return;
                });
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