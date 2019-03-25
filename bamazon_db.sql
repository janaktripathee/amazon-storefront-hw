DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;


CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(255) NOT NULL,
	department_name VARCHAR(255) NOT NULL,
	price INT NOT NULL,
	stock_quality INT NOT NULL,
	PRIMARY KEY(id)

);

INSERT INTO products(product_name, department_name, price, stock_quality) VALUES ('Apple Iphone XR','Best Buy','800','5'),
('iPad Air','Frys','249','3'),
('Samsung-Galaxy Note8','Walmart','549','8'),
('Pizza Oven','Costco','55','9'),
('AVG Internet Security','Best Buy','10','30'),
('Geometric Comforter Set','Target','44','20'),
('Macbook air','Apple Store','1400','3'),
('Pull-over Hoodie','Kohls','13','0'),
('Google Home mini','Best Buy','49','3'),
('Google home voice-activated speaker','walmart','99','2');

SELECT * FROM products;