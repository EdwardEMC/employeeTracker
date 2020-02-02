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
    company();
});

function company() {

};