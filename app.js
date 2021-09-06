const { topMenu } = require('./lib/menuFunctions');

function init() {
    console.log('Welcome to the employee tracker v 1.0!')

    console.log('Please choose from the following items to continue!')

    topMenu();
}

init();