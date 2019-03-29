var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host:"localhost",
	user:'root',
	password:"password",
	database:"bamazon_db",
	port:3306
	
});

connection.connect(function(err){
	if(err){
		console.log("error connecting:" + err.stack);
		return;
	}
	displayProduct();

})


function displayProduct(){
	connection.query('SELECT * FROM products', function(err, res){
		if(err) throw err;

		promptCustomerItem(res);

	})
}

function promptCustomerItem(item){
inquirer
	.prompt([
	{
		type:"input",
		name:'choice',
		message: "what is the product id that you want to buy?",
		validate:function(val){
			return !isNaN(val) || val.toLowerCase() === 'q';
		}

	}
	]).then(function(inquirerResponse){
		console.log(inquirerResponse)
		checkExit(inquirerResponse.choice);
		var choiceId= parseInt(inquirerResponse.choice);
		var product = checkProductIfExists(choiceId, item);

		if(product){
			promptUserForQuantity(product);
		}
		else{
			console.log('\nThis item is out of stock.');
			displayProduct();
		}
	});
}
		
		

function promptCustomerQuantity(product){
inquirer
	.prompt([
	{
		type:"input",
		name:'quantity',
		message: "How many units of the product you want to buy",
		validate:function(val){
			return val>0 || val.toLowerCase() === 'q';
		}

	}
	]).then(function(inquirerResponse){
		console.log(inquirerResponse)
		checkExit(inquirerResponse.quantity);
		var quantity= parseInt(inquirerResponse.quantity);


		if(quantity>product.stock_quantity){
			console.log('\nThis item is out of stock.');
			displayProduct();
		}
		else{

			purchase(product, quantity);
		}
	});
}


function purchase(product, quantity){
	connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
		[quantity, product.id],
		function(err, res){
			console.log("\n you have succefully purchased this "+ product.product.name +"product with quantity" + quantity);
			displayProduct();
		})
};

function checkProductIfExists(choiceId, inventory){
	for(var i=0; i< inventory.length ;i++){
		if(inventory[i].id == choiceId){
			return inventory[i];
		}
	}
	return null;


}


function checkExit(choice){
	if(choice.toLowerCase()=== 'q'){
		console.log('succefully logged out');
		process.exit(0);
	}
}










