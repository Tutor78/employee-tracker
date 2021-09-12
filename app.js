const { topMenu } = require('./utils/menuFunctions');

// function to start the application
function init() {
    console.log('Welcome to the employee tracker v 1.0!')

    console.log('Please choose from the following items to continue!')

    topMenu();
}

init();