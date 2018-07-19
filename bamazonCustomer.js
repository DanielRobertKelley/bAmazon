var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  display();
})

/*var table = new Table({
  head: ['Id', 'Product Name', 'Price ($)', 'Dept', 'QTY'],
});

for (var i = 0; i < res.length; i++) {
  var record = res[i];
  table.push([record.item_id, record.product_name, record.price, record.department_name, record.stock_quantity]);
}
console.log(table.toString());*/


var display = function () {
  var query = 'SELECT * FROM products'
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Stock: " + res[i].stock_quantity);
    }
    shop();
  })
};

var shop = function () {
  inquirer.prompt([{
    name: "ProductID",
    type: "input",
    message: "What product are you interested in buying?(please select a number)?",
    validate: function (value) {
      if (isNaN(value) == false) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    name: "Quantity",
    type: "input",
    message: "How many are you interested in buying?",
    validate: function (value) {
      if (isNaN(value) == false) {
        return true;
      } else {
        return false;
      }
    }
  }]).then(function (answer) {

    var query = 'SELECT * FROM Products WHERE item_ID=' + answer.Quantity;
    connection.query(query, function (err, res) {
      if (answer.Quantity <= res) {
        for (var i = 0; i < res.length; i++) {
          console.log("Thank you! Your order of " + res[i].stock_quantity + " " + res[i].product_name + " is on its way!.");
        }
      } else {
        console.log("Quantity not available, please try again");
      }
      display();
    })
  })
};