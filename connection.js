var mysql = require("mysql");
var inquirer = require("inquirer");

//Handling connect to the database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,               // Your port; if not 3306
    user: "root",             // Your username
    password: "Barista!993",  // Your password
    database: "business_db"   // Database name
});
  
//connecting to database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    mainMenu();
});

function mainMenu() {
    connection.query("SELECT * FROM employee", function(err, result) {
        if(err) throw err;
        console.table(result);
        mainInq();//inquirer to ask what the user wants to do
    });
};

//function to view department, role or employee
function vDeparment() {

}

//function to view employees by manager
function vManagement() {

}

//function to view the budget of departments and business as whole
function budget() {

}

//function to update employee role
function upEmployee() {

}

//function to update employee managers
function upManager() {

}

//function to add department, role, employee
function aDepartment() {

}

//function to delete department, role or employee
function dInfo() {

}

//========================================================================== 
//Inquirer functions
//==========================================================================
//inquirer for mainMenu()
function mainInq() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View Departments", "View employees by manger", "View budget", "Update an employee", "Update a manager", "Add department, role or employee", "Delete department, role or employee"],
                name: "user_action"
            }
        ]).then(function(response) {
            //switch case for options
            switch(response.user_action) {
                case "View Departments":
                    vDeparment();
                    break;
                case "View employees by manger":
                    vManagement();
                    break;
                case "View budget":
                    budget();
                    break;
                case "Update an employee":
                    upEmployee();
                    break;
                case "Update a manager":
                    upManager();
                    break;
                case "Add department, role or employee":
                    aDepartment();
                    break;
                case "Delete department, role or employee":
                    dInfo();
                    break;
                default:
                    mainMenu();
            }
        });
} 