🛒 E-Commerce Template
This is a basic e-commerce backend template that includes essential features like user registration (with roles and permissions), product management, order handling, and mobile payment integration using M-Pesa Daraja.

🚀 Tech Stack
MySQL – Relational database for data storage

Express.js – Backend web framework

Pug – Templating engine for server-side views

Vercel – Hosting platform

M-Pesa Daraja (STK Push) – C2B mobile payment integration

Cloudinary – Image storage and CDN

🛠️ Getting Started
1. Prerequisites
Node.js & npm installed

MySQL installed and running

M-Pesa Daraja API account (https://developer.safaricom.co.ke)

2. Setup
bash
Copy
Edit
# Clone the repository
git clone [https://github.com/your-username/e-commerce-template.git](https://github.com/Shamimgardobuya/E-commerce)
cd e-commerce-template

# Install dependencies
npm install

# Create and configure your .env file with:
 - Database credentials
 - M-Pesa API keys
 - JWT secret
 - Cloudinary credentials

# Create MySQL database
 (Ensure your DB name matches what's in the .env)

# Run database migrations
npx sequelize db:migrate

# Optional: Edit the product seed file to add your own products

# Seed the database with roles, permissions, users, and sample products
npx sequelize db:seed:all

# Start the server
npm start
If setup is successful, you should see the registration page when visiting the base URL.

📦 Project Routes
Endpoint	Method	Description
/register	GET/POST	Register as a customer
/register/admin	GET/POST	Register as an admin user (can add/edit products)
/products	GET	View all products
/orders/add/to/cart	POST	Add a product to cart
/orders/remove/from/cart	DELETE	Remove a product from cart
/orders/check-cart	GET	View current cart

🔐 Authentication & Authorization
Authentication is handled using JWT (JSON Web Tokens).

Roles and permissions are pre-defined and seeded into the database.

You can customize or replace JWT with any other auth service of your choice.

📸 Media & Payments
Product images are stored via Cloudinary.

Payment is integrated using M-Pesa Daraja STK Push for C2B transactions.

📬 Contributing
Feel free to fork the repo, open issues, or submit pull requests to improve this template.

📄 License
MIT License

