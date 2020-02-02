//========================================================================== 
//Dependencies
//==========================================================================
var mysql = require("mysql");
var inquirer = require("inquirer");

// process.on('warning', function(w){
//     console.log(' => Suman interactive warning => ', w.stack || w);
// });

//========================================================================== 
//Database Connection Area
//==========================================================================
var connection = mysql.createConnection({ //Handling connect to the database
    host: "localhost",
    port: 3306,               // Your port; if not 3306
    user: "root",             // Your username
    password: "Barista!993",  // Your password
    database: "business_db"   // Database name
});
connection.connect(function(err) { //connecting to database
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    mainMenu();
});

//========================================================================== 
//Functions Area
//==========================================================================
//function for main menu options
function mainMenu() {
    connection.query("SELECT * FROM employees", function(err, result) {
        if(err) throw err;
        // console.table(result); //change to random entry picture
        mainInq();//inquirer to ask what the user wants to do
    });
};

//function to view department, role or employee
function vDeparment() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "View",
                choices: ["Departments", "Roles", "Employees", "Back"],
                name: "view"
            }
        ]).then(function(response) {
            switch(response.view.toLowerCase()) {
                case "departments":
                    connection.query("SELECT * FROM departments", function(err, result) {
                        if(err) throw err;
                        console.table(result);
                        back(vDeparment); //function to go back to chosen menu
                    });
                    break;
                case "roles":
                    connection.query("SELECT * FROM roles", function(err, result) {
                        if(err) throw err;
                        console.table(result);
                        back(vDeparment);
                    });
                    break;
                case "employees":
                    connection.query("SELECT * FROM employees", function(err, result) {
                        if(err) throw err;
                        console.table(result);
                        back(vDeparment);
                    });
                    break;
                default:
                    back(mainMenu);
            }
        });
}

//function to view employees by manager
function vManagement() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "View",
                choices: ["Sales", "Engineering", "Legal", "Finance", "Back"],
                name: "role"
            }
        ]).then(function(response) {
            if(response.role === "Back") {
                back(mainMenu);
            }
            connection.query(
                joined + "WHERE departments.name = ?", 
                [response.role], function(err, result) { 
                    if(err) throw err;
                    console.table(result);
                    back(vManagement);
                }
            );
        });
}

//function to view the budget of departments and business as whole
function budget() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "View",
                choices: ["Total", "Sales", "Engineering", "Legal", "Finance", "Back"],
                name: "budget"
            }
        ]).then(function(response) {
            if(response.budget==="Total") {
                let WHERE = "";
                budgetQuery(WHERE);
            }
            else if(response.budget==="Back") {
                back(mainMenu);
            }
            let WHERE = "WHERE department.role = " + response.budget.toLowerCase();
            budgetQuery(WHERE)
        });
}

//connection query for the budget()
function budgetQuery(where) {
    connection.query(joined + where, function(err, result) {
        if(err) throw err;
        console.table(result);
        let total = 0;
        result.forEach(element => {total += parseInt(element.salary)})
        console.log("Total expenditure: $" + total + " per year.");
        back(budget);
    });
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
//Extra Inquirer Functions
//==========================================================================
//inquirer for mainMenu()
function mainInq() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: 
                    [
                        "View business areas", 
                        "View employees by manger", 
                        "View budget", 
                        "Update an employee", 
                        "Update a manager", 
                        "Add department, role or employee", 
                        "Delete department, role or employee",
                        "Exit"
                    ],
                name: "user_action"
            }
        ]).then(function(response) {
            //switch case for options
            switch(response.user_action) {
                case "View business areas":
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
                    connection.end();
            }
        });
} 

//inquirer to return to main menu
function back(whereto) {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Back",
                choices: ["Back"],
                name: "back"
            }
        ]).then(function(response) {
            whereto();
        });
}

//========================================================================== 
//Query strings
//==========================================================================

const joined = "SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, departments.name FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id ";