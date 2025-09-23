

-- Insert Users
INSERT INTO users (username, email, password_hash) VALUES
('rohan_g', 'rohan@example.com', 'hash123'),
('sneha_p', 'sneha@example.com', 'hash456');

-- Insert Products
INSERT INTO products (name, description, base_price, category) VALUES
('Classic Cotton T-Shirt', 'A 100% soft cotton round-neck t-shirt.', 699.00, 't-shirt'),
('Premium Hoodie', 'A warm and comfortable fleece hoodie.', 1499.00, 'hoodie');

-- Insert a Design by User Rohan
INSERT INTO designs (user_id, design_name, image_url) VALUES
(1, 'My First Design', '/uploads/rohan_design1.png');

-- Create an Order for User Rohan
INSERT INTO orders (user_id, total_amount, status) VALUES
(1, 2198.00, 'shipped');

-- Add Items to Rohan's Order
-- Item 1: A customized T-shirt with his design
INSERT INTO order_items (order_id, product_id, design_id, quantity, price_per_item) VALUES
(1, 1, 1, 1, 699.00);

-- Item 2: A plain hoodie without customization
INSERT INTO order_items (order_id, product_id, design_id, quantity, price_per_item) VALUES
(1, 2, NULL, 1, 1499.00);

select * from users;