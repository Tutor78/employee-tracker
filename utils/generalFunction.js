// a function that handles creating an employee array to be used in inquirer
function createEmployeeArr(result) {
    // creates an empty array that wil be returned at the end
    const employeeArr = [];

    // loops through the employees given from the result and creates an employee array of objects
    for (let i = 0; i < result.length; i++) {
        let employeeName = result[i].first_name + ' ' + result[i].last_name;
        let employeeId = result[i].id;

        // creates an employee objet and pushes that new object to an array
        const employeeObj = {};
        employeeObj.name = employeeName;
        employeeObj.id = employeeId

        // finally the final name is pushed to the array
        employeeArr.push(employeeObj);
    }

    return employeeArr;
};

// a function that handles the creation of a manager array for use in inquirer
function createManagerArr(result) {
    // creates an empty manager array to be returned at the end
    const managerArr = [];

    // loops through the results that are given and creates a manager object that is finally pushed into the managerArr
    for (let i = 0; i < result.length; i++) {
        let managerName = result[i].first_name + ' ' + result[i].last_name;
        let managerId = result[i].id;

        const managerObj = {};
        managerObj.name = managerName;
        managerObj.id = managerId;

        managerArr.push(managerObj);
    }

    return managerArr;
};

// a function that handles the creation of an array of roles to be used in inquirer
function createRoleArr(result) {
    // creates an empty role array to be returned
    const roleArr = [];

    // loops through the result pushing the title of each role to an array
    for (let i = 0; i < result.length; i++) {
        roleArr.push(result[i].title);
    }

    return roleArr;
};

// a function that handles the creation of an array of the departments to be used by inquirer
function createDepartmentArr(result) {
    // creates an empty department array that will be returned
    const departmentArr = [];

    // loops through the results and pushes all of the department names to an array
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