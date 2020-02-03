//========================================================================== 
//Dependencies
//==========================================================================
var mysql = require("mysql");
var inquirer = require("inquirer");

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
                    mainInq();
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
               return mainInq();
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

//function to view the budget of departments or business as whole
function budget() {
    connection.query("SELECT name FROM departments", function(err, result) {
        if(err) throw err;
        let departments = ["Total", "Back"];
        result.forEach(element => departments.unshift(element.name));
        
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "View",
                    choices: departments,
                    name: "budget"
                }
            ]).then(function(response) {
                if(response.budget==="Back") {
                    return mainInq();
                }
                else if(response.budget==="Total") {
                    let where = "";
                    return budgetQuery(where);
                }
                let what = response.budget;
                let where = "WHERE ?";
                return budgetQuery(where, what)
            });
    });
    
}

//connection query for the budget()
function budgetQuery(where, what) {
    connection.query(joined + where, [{name:what}], function(err, result) {
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
    let options = [];
    let managers = []; //making the manager id automatically be assigned instead of user input
    let roles = []; //making the role id automatically be selected instead of user input

    connection.query(joined, function(err, result) {       
        result.forEach(element => {
            if(!roles.includes(element.role_id + " " + element.title)&&!element.title.includes("Lead")) {
                roles.push(element.role_id + " " + element.title)
            }
            if(element.title.includes("Lead")) {
                managers.push(element.id + " |" + element.title + " |" + element.first_name + " |" + element.last_name);
            }
            options.push(element.first_name + " " + element.last_name);
        });
        
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which employee do you want to update?",
                    choices: options,
                    name: "employee"
                }
            ]).then(function(response) {
                updateEmp(response, roles, managers);
            });
    });
}

//function to update employee managers                              !!!!!NEED TO DO!!!!!
function upManager() {
    //choose someone to update as manager
    //swap roles
    //assign everyone the new managers ids
}

//function to add department, role, employee
function aDepartment() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to add?",
                choices: ["Department", "Role", "Employee", "Back"],
                name: "add_column"
            }
        ]).then(function(response) {
            //connection query to access all information??
            connection.query(joined, function(err, result) {
                if(err) throw err;
                switch(response.add_column.toLowerCase()) { //need to fix sub functions
                case "department":
                    newDep();
                    break;
                case "role":
                    newRole(result);
                    break;
                case "employee":
                    newEmp(result);
                    break;
                default:
                    mainInq();
            }
            });  
        });
}

//function to delete department, role or employee
function dInfo() {
    inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to remove?",
            choices: ["Department", "Role", "Employee", "Back"],
            name: "remove_column"
        }
    ]).then(function(response) {
        //connection query to access all information??
        connection.query(joined, function(err, result) {
            if(err) throw err;
            switch(response.remove_column.toLowerCase()) { //need to fix sub functions
            case "department":
                removeDep(result);
                break;
            case "role":
                removeRole(result);
                break;
            case "employee":
                removeEmp(result);
                break;
            default:
                mainInq();
        }
        });  
    });
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

//follow up inquirer for upEmployee()
function updateEmp(response, roles, managers) {
    let worker = response.employee.split(" "); 
    inquirer
        .prompt([
            {
                type: "list",
                message: "What role are they going to fill?",
                choices: roles, //get list of roles from connection query transfer them into their id's
                name: "role"
            },
            {
                type: "list",
                message: "Who is their manager?",
                choices: managers,
                name: "manager"
            }
        ]).then(function(response) {
            let role = response.role.split(" ");
            let manager_id = response.manager.split(" ");
            connection.query("UPDATE employees SET ? WHERE ? AND ?", 
            [
                {
                    role_id: role[0],
                    manager_id: manager_id[0]
                },
                {
                    first_name:worker[0]
                }, 
                {
                    last_name:worker[1]
                }
            ], 
            function(err, result) {
                if(err) throw err;
                console.log(worker.join(" ") + " has had their information been updated successfully");
                mainMenu();
            });
        });
}

//function for new department
function newDep() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the new departments name?",
                name: "new"
            }
        ]).then(function(response) {
            connection.query("INSERT INTO departments SET ?", [{name:response.new}], function(err, result) {
                if(err) throw err;
                console.table(result);
                back(aDepartment); //function to go back to chosen menu
            });
        });
}

//function for new role
function newRole(result) {
    let departments = []; //making the deparment id automatically be selected instead of user input
    result.forEach(element => {
        if(!departments.includes(element.dep_id + " " + element.name)) {
            departments.push(element.dep_id + " " + element.name)
        }
    });

    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the new roles title?",
                name: "title"
            },
            {
                type: "input",
                message: "What is the new roles salary?",
                name: "salary"
            },
            {
                type: "list",
                message: "What is the new roles department id?",
                choices: departments,
                name: "id"
            }
        ]).then(function(response) {
            let id = response.id.split(" ");
            connection.query("INSERT INTO roles SET ?", 
            [{
                title:response.title, 
                salary:response.salary, 
                role_id:id[0]
            }], 
            function(err, result) {
                if(err) throw err;
                console.table(result);
                back(aDepartment);
            });
        });
}

//function for new employee
function newEmp(result) {
    let managers = []; //making the manager id automatically be assigned instead of user input
    let roles = []; //making the role id automatically be selected instead of user input
    result.forEach(element => {
        if(!roles.includes(element.role_id + " " + element.title)) {
            roles.push(element.role_id + " " + element.title)
        }
        if(element.title.includes("Lead")) {
            managers.push(element.id + " |" + element.title + " |" + element.first_name + " |" + element.last_name);
        }
    });

    inquirer
        .prompt([
            {
                type: "input",
                message: "What is their first name?",
                name: "first"
            },
            {
                type: "input",
                message: "What is their last name?",
                name: "last"
            },
            {
                type: "list",
                message: "What is their new role id?", 
                choices: roles,
                name: "role"
            },
            {
                type: "list",
                message: "What is their managers id?",
                choices: managers,
                name: "manager"
            }
        ]).then(function(response) {
            let role = response.role.split(" ");
            let manager_id = response.manager.split(" ");
            connection.query("INSERT INTO employees SET ?", 
            [{
                first_name:response.first, 
                last_name:response.last, 
                role_id:role[0], 
                manager_id:manager_id[0]
            }], 
            function(err, result) {
                if(err) throw err;
                console.table(result);
                back(aDepartment);
            });
        });
}

//function to remove department
function removeDep(result) {
    let departments = []; //making the deparment id automatically be selected instead of user input
    result.forEach(element => {
        if(!departments.includes(element.dep_id + " " + element.name)) {
            departments.push(element.dep_id + " " + element.name)
        }
    });
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which department would you like to delete?",
                choices: departments,
                name: "item"
            }
        ]).then(function(response) {
        connection.query("DELETE FROM departments WHERE name = ?", [response.item], function(err, result) {
            if(err) throw err;
            console.log(response.item + " has been deleted sucessfully");
            mainMenu();
        });
    });
}

//function to remove role
function removeRole(result) {
    let roles = []; //making the role id automatically be selected instead of user input
    result.forEach(element => {
        if(!roles.includes(element.role_id + " " + element.title)) {
            roles.push(element.role_id + " " + element.title)
        }
    });
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which role would you like to delete?",
                choices: roles,
                name: "item"
            }
        ]).then(function(response) {
        connection.query("DELETE FROM roles WHERE title = ?", [response.item], function(err, result) {
            if(err) throw err;
            console.log(response.item + " has been deleted sucessfully");
            mainMenu();
        });
    });
}

//function to remove employee
function removeEmp(result) {
    let options = [];
    result.forEach(element => {
        options.push(element.first_name + " " + element.last_name);
    });
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee would you like to delete?",
                choices: options,
                name: "item"
            }
        ]).then(function(response) {
        let worker = response.item.split(" ");
        connection.query("DELETE FROM employees WHERE first_name = ? AND last_name = ?", [worker[0], worker[1]], function(err, result) {
            if(err) throw err;
            console.log(response.item + " has been deleted sucessfully");
            mainMenu();
        });
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

const joined = "SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.id AS role_id, roles.salary, departments.id AS dep_id, departments.name FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id ";