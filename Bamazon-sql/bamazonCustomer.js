var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');


var connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "password",
    database: "bamazon_db",
    port: 3306

});



connection.connect(function(err) {
    if (err) {
        console.log("error connecting:" + err.stack);
        return;
    }
    displayProduct();

})

function displayProduct() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        promptCustomerItem(res);

    })
}

function promptCustomerItem(item) {
    inquirer
        .prompt([{
            type: "input",
            name: 'choice',
            message: "what is the product id that you want to buy?"

        }]).then(function(val) {
       
            //checkExit(val.choice);
            var choiceId = parseInt(val.choice);
            var product = checkProductIfExists(choiceId, item);


            if (product) {
                promptCustomerQuantity(product);
            } else {
                console.log('\nThis item is not present at the moment, please check back later.');
                displayProduct();
            }
        });
}



function promptCustomerQuantity(product) {
    inquirer
        .prompt([{
            type: "input",
            name: "quantity",
            message: "How many units of the product you want to buy"

        }])
        .then(function(val) {
            //checkExit(val.quantity);
            var productQuantity = parseInt(val.quantity);
            if (productQuantity > product.stock_quantity) {
                console.log('\nThis item is out of stock.');
                displayProduct();
            } else {
                connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                    [val.name, val.id],
                    function(err, res) {
                        console.log("\n you have succefully purchased this " + product.product_name + " product with quantity " + val.quantity);
                        displayProduct();
                    })
            }
        });
}




function checkProductIfExists(choiceId, item) {
    for (var i = 0; i < item.length; i++) {
        if (item[i].id === choiceId) {
            return item[i];
        }
    }
    return null;
}
