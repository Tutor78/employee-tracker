const inquirer = require('inquirer');

function viewRoles(db) {
    db.query(`SELECT role.title AS role, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id`, (err, rows) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        menu();
        return;
    });
};

function addRole(db) {

};

function updateRole(db) {

};

function deleteRole(db) {
    db.query(`SELECT role.title FROM role`, (err, result) => {
        const roleArr = [];

        for (let i = 0; i < result.length; i++) {
            roleArr.push(result[i].title);
        }

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
                default: false
            }
        ]).then(response => {
            if (response.delete) {
                const sql = `DELETE FROM role WHERE role.title = ?`;
                let params = response.role;

                db.query(sql, params, (err, response) => {
                    if (err) {
                        console.log(err);
                    }

                    console.log('Successfully deleted role!');
                    menu();
                    return;
                });
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