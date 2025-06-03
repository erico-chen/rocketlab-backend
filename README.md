# Rocket Lab E-commerce Backend

A NestJS-based backend service for the Rocket Lab e-commerce platform, featuring product management, shopping cart functionality, and order processing.

## Features

### Products
- List all products
- Get product details by ID
- Create new products
- Update existing products
- Delete products

### Shopping Cart
- Create new shopping carts
- View cart contents
- Add items to cart
- Remove items from cart
- Checkout process

### Orders
- Create orders from cart
- Order status tracking
- Order history with detailed items

## Prerequisites

- Node.js (v20.12.2 or higher)
- pnpm (v10.11.0 or higher)

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd rocketlab-backend
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Set Up Database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run Database Migrations
   npx prisma migrate dev

   # Seed the Database with Initial Data
   npx prisma db seed
   ```

4. **Start the Application**
   ```bash
   # Development mode
   pnpm start:dev

   # Production mode
   pnpm build
   pnpm start:prod
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create a new product
- `PATCH /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### Cart
- `POST /cart` - Create a new cart
- `GET /cart/:id` - Get cart details
- `POST /cart/:id/items` - Add item to cart
- `DELETE /cart/:cartId/items/:productId` - Remove item from cart
- `POST /cart/:id/checkout` - Checkout cart