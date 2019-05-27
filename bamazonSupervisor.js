//Bamazon Supervisor CLI application
//node.js file for challenge 3
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
function listSales() {
  let query =
    "SELECT department_id, departments.department_name, overheadcosts, sum(productsales) as productsales, sum(productsales)-overheadcosts as totalprofit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name";

  console.log("Selecting all sales...\n");
  connection.query(query, function(err, res) {
    if (err) throw err;

    console.log(
      "==================================================================================================================="
    );
    console.log(
      "Depart ID\tDepart Name\tOverhead Costs\tProduct Sales\tTotal Profit"
    );
    console.log(
      "==================================================================================================================="
    );
    res.forEach(element => {
      //Trick to format so that columns are properly aligned
      let extraTab = element.department_name.length < 8 ? "\t\t" : "\t";
      console.log(
        `${element.department_id}\t\t${element.department_name}${extraTab}${
          element.overheadcosts
        }\t\t${element.productsales}\t\t${element.totalprofit}`
      );
    });
    superMenu();
  });
}

function addDepartment(id, dept, overhead) {
  connection.query(
    "INSERT INTO departments (department_id, department_name, overheadcosts) values(?, ?, ?)",
    [id, dept, overhead],
    function(err) {
      if (err) throw err;

      listSales();
    }
  );
}

function addDepartmentMenu() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_id",
        message: "What is the department ID?"
      },
      {
        type: "input",
        name: "department_name",
        message: "What is the department's name?"
      },
      {
        type: "input",
        name: "overhead",
        message: "What is the overhead of the department?"
      }
    ])
    .then(function(answer) {
      addDepartment(
        answer.department_id,
        answer.department_name,
        answer.overhead
      );
    });
}
function superMenu() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "choice",
        message: "What would you like to do?",
        choices: ["View product sales by department", "Create new department"]
      }
    ])
    .then(function(answer) {
      switch (answer.choice) {
        case "View product sales by department":
          listSales();
          break;
        case "Create new department":
          addDepartmentMenu();
          break;
      }
    });
}

//Main program
connection.connect(function(err) {
  if (err) throw err;
  superMenu();
});
