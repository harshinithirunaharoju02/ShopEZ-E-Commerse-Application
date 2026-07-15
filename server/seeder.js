import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Database cleared...');

    // Create users (pre-save hook will hash passwords)
    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true,
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'user123',
        isAdmin: false,
      },
    ]);

    const adminUser = createdUsers[0]._id;

    console.log('Users seeded...');

    // Create Categories
    const categories = await Category.create([
      { name: 'Electronics', description: 'Gadgets, smartphones, laptops and accessories' },
      { name: 'Fashion', description: 'Clothing, footwear, bags and wear' },
      { name: 'Home & Kitchen', description: 'Household appliances, kitchenware and decor' },
      { name: 'Books', description: 'Fiction, non-fiction, educational and journals' },
    ]);

    console.log('Categories seeded...');

    const electronicsId = categories.find((c) => c.name === 'Electronics')._id;
    const fashionId = categories.find((c) => c.name === 'Fashion')._id;
    const homeKitchenId = categories.find((c) => c.name === 'Home & Kitchen')._id;
    const booksId = categories.find((c) => c.name === 'Books')._id;

    // Create Products
    await Product.create([
      {
        user: adminUser,
        name: 'iPhone 15 Pro Max',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=60',
        description: 'Experience the titanium design, groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.',
        category: electronicsId,
        price: 1199.99,
        countInStock: 8,
        isFeatured: true,
      },
      {
        user: adminUser,
        name: 'Sony WH-1000XM4 Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
        description: 'Industry-leading noise canceling wireless over-ear headphones with focal sound control, Speak-to-Chat tech, and 30-hour battery life.',
        category: electronicsId,
        price: 348.0,
        countInStock: 12,
        isFeatured: true,
      },
      {
        user: adminUser,
        name: 'Nike Air Max Sneakers',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60',
        description: 'Classic athletic styling meets premium lightweight comfort with the visible Air Max cushioning and durable mesh and leather build.',
        category: fashionId,
        price: 129.99,
        countInStock: 25,
        isFeatured: true,
      },
      {
        user: adminUser,
        name: 'Premium Leather Biker Jacket',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60',
        description: 'Crafted from 100% genuine top-grain cowhide leather. Slim fit style featuring asymmetrical zip closure, lapels, and functional zippered pockets.',
        category: fashionId,
        price: 249.99,
        countInStock: 5,
        isFeatured: false,
      },
      {
        user: adminUser,
        name: 'Minimalist Ceramic Coffee Mug',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=60',
        description: 'Handcrafted stoneware coffee mug with a sleek matte finish, comfortable large handle, and 12oz capacity. Safe for dishwasher and microwave.',
        category: homeKitchenId,
        price: 18.5,
        countInStock: 40,
        isFeatured: false,
      },
      {
        user: adminUser,
        name: 'The Great Gatsby - Hardcover Edition',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60',
        description: 'F. Scott Fitzgerald\'s masterpiece set in the Roaring Twenties. Beautiful cloth-bound hardcover edition with gold foil accents.',
        category: booksId,
        price: 14.99,
        countInStock: 15,
        isFeatured: false,
      },
      {
        user: adminUser,
        name: 'Apple Watch Series 9',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=60',
        description: 'Stay connected, track workouts, and monitor health with a bright always-on display and advanced sensors.',
        category: electronicsId,
        price: 399.99,
        countInStock: 18,
        isFeatured: true,
      },
      {
        user: adminUser,
        name: 'ChefMate Blender Pro',
        image: 'https://images.unsplash.com/photo-1570560252456-2af2f6d8f7d5?w=600&auto=format&fit=crop&q=60',
        description: 'A powerful countertop blender with multiple presets, durable stainless steel blades, and a large jar for smoothies and soups.',
        category: homeKitchenId,
        price: 89.5,
        countInStock: 22,
        isFeatured: false,
      },
      {
        user: adminUser,
        name: 'Classic Canvas Tote Bag',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60',
        description: 'A versatile everyday tote made from durable canvas with roomy interiors and a clean minimalist look.',
        category: fashionId,
        price: 34.99,
        countInStock: 30,
        isFeatured: false,
      },
    ]);

    console.log('Products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data seed: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Database cleared completely!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
