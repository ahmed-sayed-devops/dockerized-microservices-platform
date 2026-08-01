USE inventory;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, quantity)
VALUES
('Keyboard', 'Mechanical Keyboard', 500.00, 15),
('Mouse', 'Gaming Mouse', 250.00, 30),
('Monitor', '24 inch Monitor', 3500.00, 8);

-- =====================================
-- MySQL Exporter User
-- =====================================

CREATE USER IF NOT EXISTS 'mysqlexporter'@'%' IDENTIFIED BY 'exporter123';

GRANT PROCESS,
      REPLICATION CLIENT,
      SELECT
ON *.* TO 'mysqlexporter'@'%';

FLUSH PRIVILEGES;
