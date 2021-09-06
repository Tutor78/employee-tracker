function createEmployeeArr(result) {
    const employeeArr = [];

    for (let i = 0; i < result.length; i++) {
        let firstName = result[i].first_name;
        let lastName = result[i].last_name;

        let employeeName = firstName + ' ' + lastName;

        employeeArr.push(employeeName);
    }

    return employeeArr;
};

function createManagerArr(result) {
    const managerArr = [];

    for (let i = 0; i < result.length; i++) {
        let managerName = result[i].first_name + ' ' + result[i].last_name;
        let managerId = result[i].id

        const managerObj = {};
        managerObj.name = managerName;
        managerObj.id = managerId;

        managerArr.push(managerObj);
    }

    return managerArr;
};

function createRoleArr(result) {
    const roleArr = [];

    for (let i = 0; i < result.length; i++) {
        roleArr.push(result[i].title);
    }

    return roleArr;
};

function createDepartmentArr(result) {
    const departmentArr = [];

    for (let i = 0; i < result.length; i++) {
        departmentArr.push(result[i].name);
    }

    return departmentArr;
};

module.exports = {
    createEmployeeArr,
    createManagerArr,
    createRoleArr,
    createDepartmentArr
}