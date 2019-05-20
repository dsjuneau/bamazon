//Bamazon CLI application
//node.js file for challenge 1
//Using mysql and inquirer

//Variable declarations
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

//Function declarations

// This function connects to the database and runs whatever action function was passed to it
function connectAndAct(connection, action) {
  connection.connect(function(err) {
    if (err) throw err;
    action();
  });
}

// These are the action functions
function displayProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    console.log("=======================================================");
    console.log("ID\tProduct\t\tPrice\tQuantity");
    console.log("=======================================================");
    res.forEach(element => {
      //Trick to format so that columns come out properly aligned
      let extraTab = element.product_name.length < 8 ? "\t\t" : "\t";
      console.log(
        `${element.item_id}\t${element.product_name}${extraTab}${
          element.price
        }\t${element.stock_quantity}`
      );
    });
    connection.end();
    promptUser();
  });
}

function promptUser() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Enter the ID of the product you want to buy:"
      },
      {
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase?"
      }
    ])
    .then(function(answer) {
      console.log(answer);
    });
}
//Main program
connectAndAct(connection, displayProducts);
