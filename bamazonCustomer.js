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
  console.log("connected as id " + connection.threadId);
  connection.end();
  start();
});

function display(res) {
	var table = new Table({
		head: ['Item ID', 'Product Name', 'Department', 'Cost', 'Stock']
		, colWidths: [10, 45, 40, 8, 8]
	});
	for (var i = 0; i < res.length; i++) {
		table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
	}
	console.log(table.toString());
}

var start = function() {

  connection.query("SELECT * FROM products", function(err, res){
    display(res);

    var shop = [];
    for ( var i = 0; i < res.length; i++) {
      shop.push(res[i].product_name);
    }
    inquirer.prompt([{
      name: "Item",
      type: "input",
      message:"Which item are you interested in buying(please select its number)?"
    },
    {
      name:"Quantity",
      type:"input",
      message:"How many are you interested in buying?"
    }])
    .then(function(answer){
      console.log(answer);
      var item = answer.item;
      console.log(item);
      var buying = res[item-1];
      console.log(buying);
      var update = buying.stock_quantity - answer.quantity;
      if (update >= 0 ) {
        connection.query('UPDATE products SET ? WHERE item_id = ?', [{stock_quantity:update }, item_id]);
        start();
      }
      else {
        console.log("I'm sorry but the quantity you have selected is not available. Please select a different amount. Thank you.");
        start();
      }
    })
  })
}