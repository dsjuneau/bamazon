//Bamazon Manager CLI application
//node.js file for challenge 2
//Using mysql and inquirer

//Variable declarations
var mysql = require("mysql");
var inquirer = require("inquirer");
let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});
//Function declarations

// These are the action functions
function listProducts(isLow = false) {
  let query = isLow
    ? "SELECT * FROM products WHERE stock_quantity<5"
    : "SELECT * FROM products";

  console.log("Selecting all products...\n");
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("=======================================================");
    console.log("ID\tProduct\t\tPrice\tQuantity");
    console.log("=======================================================");
    res.forEach(element => {
      //Trick to format so that columns are properly aligned
      let extraTab = element.product_name.length < 8 ? "\t\t" : "\t";
      console.log(
        `${element.item_id}\t${element.product_name}${extraTab}${
          element.price
        }\t${element.stock_quantity}`
      );
    });
    userMenu();
  });
}

function updateStock(id, quantity) {
  console.log(id, quantity);
  connection.query(
    "SELECT stock_quantity FROM products WHERE item_id = ?",
    [id],
    function(err, res) {
      if (err) throw err;
      console.log(res);
      quantity = quantity + res[0].stock_quantity;
      connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id=?",
        [quantity, id],
        function(err) {
          if (err) throw err;

          listProducts();
        }
      );
    }
  );
}

function addStock(name, dept, price, amount) {
  connection.query(
    "INSERT INTO products (product_name, department_name, price, stock_quantity) values(?, ?, ?, ?)",
    [name, dept, price, amount],
    function(err) {
      if (err) throw err;

      listProducts();
    }
  );
}

function addMenu() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Increase the inventory of which item?  Enter id:"
      },
      {
        type: "input",
        name: "quantity",
        message:
          "How many items are being added to the inventory? Enter amount:"
      }
    ])
    .then(function(answer) {
      if (answer.id >= 1 && answer.id <= 10) {
        console.log(
          `You are adding ${answer.quantity} items to id number ${answer.id}.`
        );
        updateStock(parseInt(answer.id), parseInt(answer.quantity));
      } else {
        console.log("That id is invalid.  Please try again.");
        addMenu();
      }
    });
}

function addItemMenu() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the product's name?"
      },
      {
        type: "input",
        name: "department_name",
        message: "What is the department's name?"
      },
      {
        type: "input",
        name: "price",
        message: "What is the price per product?"
      },
      {
        type: "input",
        name: "quantity",
        message: "How many items are being initially added to the inventory?"
      }
    ])
    .then(function(answer) {
      addStock(
        answer.name,
        answer.department_name,
        parseFloat(answer.price),
        parseInt(answer.quantity)
      );
    });
}
function userMenu() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View products for sale",
          "View low inventory",
          "Add to inventory",
          "Add new product"
        ]
      }
    ])
    .then(function(answer) {
      switch (answer.choice) {
        case "View products for sale":
          listProducts();
          break;
        case "View low inventory":
          listProducts(true);
          break;
        case "Add to inventory":
          addMenu();
          break;
        case "Add new product":
          addItemMenu();
          break;
      }
    });
}

//Main program
connection.connect(function(err) {
  if (err) throw err;
  userMenu();
});
