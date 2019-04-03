var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


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
	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;
        console.table(res);
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
	]).then(function(val){
		checkExit(val.choice);
		var choiceId= parseInt(val.choice);
		var product = checkProductIfExists(choiceId, item);
    //console.log(product);

		if(product){
			promptCustomerQuantity(product);
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
    
		//console.log(inquirerResponse,"responseofwar")
		checkExit(inquirerResponse.stock_quality);
		var productQuantity= parseInt(inquirerResponse.stock_quality);
   console.log(productQuantity,"productquantity");
   console.log(product.stock_quality,"productstock");


		if(productQuantity > product.stock_quality){
			console.log('\nThis item is out of stock.');
			displayProduct();
		}
		else{

			purchase(product, quantity);
		}
	});
}


function purchase(product, quantity){
    console.log(quantity, "quantity")
	connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
		[quantity, product.id],
		function(err, res){
			console.log("\n you have succefully purchased this "+ product.product_name +"product with quantity" + quantity);
			displayProduct();
		})
};

function checkProductIfExists(choiceId, item){
	for(var i=0; i< item.length ;i++){
		if(item[i].id === choiceId){
			return item[i];
		}
	}
	return null;


}


function checkExit(choice){
    console.log(choice,"choice");
	if(choice.toLowerCase()=== 'q'){
		console.log('succefully logged out');
		process.exit(0);
	}
}










