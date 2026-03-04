const bcrypt = require('bcryptjs');
const { User, Category, Product, Order, OrderItem, ShippingMethod, Coupon } = require('../backend/src/models');

// Seed database with test data
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Create test users
    const users = await seedUsers();
    console.log(`Created ${users.length} users`);

    // Create categories
    const categories = await seedCategories();
    console.log(`Created ${categories.length} categories`);

    // Create products
    const products = await seedProducts(categories);
    console.log(`Created ${products.length} products`);

    // Create shipping methods
    const shippingMethods = await seedShippingMethods();
    console.log(`Created ${shippingMethods.length} shipping methods`);

    // Create coupons
    const coupons = await seedCoupons();
    console.log(`Created ${coupons.length} coupons`);

    // Create sample orders
    const orders = await seedOrders(users, products);
    console.log(`Created ${orders.length} orders`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Seed users
const seedUsers = async () => {
  const usersData = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('Password123', 12),
      phone: '+1234567890',
      role: 'customer',
      isActive: true,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('Password123', 12),
      phone: '+1234567891',
      role: 'customer',
      isActive: true,
    },
    {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      password: await bcrypt.hash('Password123', 12),
      phone: '+1234567892',
      role: 'customer',
      isActive: true,
    },
  ];

  const users = [];
  for (const userData of usersData) {
    const [user, created] = await User.findOrCreate({
      where: { email: userData.email },
      defaults: userData,
    });
    if (created) users.push(user);
  }

  return users;
};

// Seed categories
const seedCategories = async () => {
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices' },
    { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, and accessories' },
    { name: 'Home & Living', slug: 'home-living', description: 'Furniture and home decor' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports equipment and outdoor gear' },
    { name: 'Books', slug: 'books', description: 'Physical and digital books' },
    { name: 'Health & Beauty', slug: 'health-beauty', description: 'Personal care and wellness products' },
  ];

  const categories = [];
  for (const catData of categoriesData) {
    const [category, created] = await Category.findOrCreate({
      where: { slug: catData.slug },
      defaults: { ...catData, isActive: true },
    });
    if (created) categories.push(category);
  }

  // Add subcategories
  const electronics = categories.find(c => c.slug === 'electronics');
  if (electronics) {
    const subcategories = [
      { name: 'Smartphones', slug: 'smartphones', description: 'Mobile phones and accessories', parentId: electronics.id },
      { name: 'Laptops', slug: 'laptops', description: 'Notebooks and laptop accessories', parentId: electronics.id },
      { name: 'Audio', slug: 'audio', description: 'Headphones, speakers, and audio equipment', parentId: electronics.id },
    ];

    for (const subData of subcategories) {
      const [sub, created] = await Category.findOrCreate({
        where: { slug: subData.slug },
        defaults: { ...subData, isActive: true },
      });
      if (created) categories.push(sub);
    }
  }

  return categories;
};

// Seed products
const seedProducts = async (categories) => {
  const audioCategory = categories.find(c => c.slug === 'audio');
  const fashionCategory = categories.find(c => c.slug === 'fashion');
  const homeCategory = categories.find(c => c.slug === 'home-living');
  const sportsCategory = categories.find(c => c.slug === 'sports-outdoors');
  const booksCategory = categories.find(c => c.slug === 'books');
  const beautyCategory = categories.find(c => c.slug === 'health-beauty');

  const productsData = [
    {
      name: 'Wireless Bluetooth Headphones',
      slug: 'wireless-bluetooth-headphones',
      description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
      price: 79.99,
      comparePrice: 129.99,
      stock: 50,
      categoryId: audioCategory?.id,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      sku: 'AUDIO-001',
      isFeatured: true,
      isActive: true,
      tags: ['headphones', 'bluetooth', 'wireless', 'audio'],
    },
    {
      name: 'Smart Fitness Watch',
      slug: 'smart-fitness-watch',
      description: 'Track your health and fitness with this advanced smartwatch featuring heart rate monitoring.',
      price: 149.99,
      comparePrice: 199.99,
      stock: 30,
      categoryId: categories.find(c => c.slug === 'electronics')?.id,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      sku: 'ELEC-002',
      isFeatured: true,
      isActive: true,
      tags: ['smartwatch', 'fitness', 'health', 'wearable'],
    },
    {
      name: 'Cotton Crew Neck T-Shirt',
      slug: 'cotton-crew-neck-tshirt',
      description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
      price: 24.99,
      stock: 100,
      categoryId: fashionCategory?.id,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      sku: 'FASH-001',
      isActive: true,
      tags: ['tshirt', 'cotton', 'clothing', 'casual'],
    },
    {
      name: 'Modern Desk Lamp',
      slug: 'modern-desk-lamp',
      description: 'LED desk lamp with adjustable brightness and color temperature.',
      price: 45.99,
      comparePrice: 59.99,
      stock: 25,
      categoryId: homeCategory?.id,
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      sku: 'HOME-001',
      isFeatured: true,
      isActive: true,
      tags: ['lamp', 'lighting', 'desk', 'home'],
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Non-slip eco-friendly yoga mat with carrying strap.',
      price: 35.99,
      stock: 40,
      categoryId: sportsCategory?.id,
      images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      sku: 'SPORT-001',
      isActive: true,
      tags: ['yoga', 'fitness', 'exercise', 'mat'],
    },
    {
      name: 'Bestseller Novel Collection',
      slug: 'bestseller-novel-collection',
      description: 'Collection of 5 bestselling fiction novels.',
      price: 49.99,
      stock: 20,
      categoryId: booksCategory?.id,
      images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
      sku: 'BOOK-001',
      isActive: true,
      tags: ['books', 'fiction', 'bestseller', 'reading'],
    },
    {
      name: 'Organic Skincare Set',
      slug: 'organic-skincare-set',
      description: 'Complete skincare routine with natural organic ingredients.',
      price: 89.99,
      comparePrice: 120.00,
      stock: 15,
      categoryId: beautyCategory?.id,
      images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      sku: 'BEAUTY-001',
      isFeatured: true,
      isActive: true,
      tags: ['skincare', 'organic', 'beauty', 'natural'],
    },
    {
      name: 'Running Shoes Pro',
      slug: 'running-shoes-pro',
      description: 'Lightweight running shoes with advanced cushioning technology.',
      price: 119.99,
      stock: 35,
      categoryId: sportsCategory?.id,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      sku: 'SPORT-002',
      isActive: true,
      tags: ['shoes', 'running', 'sports', 'footwear'],
    },
    {
      name: 'Laptop Backpack',
      slug: 'laptop-backpack',
      description: 'Water-resistant backpack with padded laptop compartment.',
      price: 54.99,
      stock: 60,
      categoryId: fashionCategory?.id,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      sku: 'FASH-002',
      isActive: true,
      tags: ['backpack', 'laptop', 'bag', 'travel'],
    },
    {
      name: 'Portable Bluetooth Speaker',
      slug: 'portable-bluetooth-speaker',
      description: 'Waterproof portable speaker with 360-degree sound.',
      price: 59.99,
      comparePrice: 79.99,
      stock: 45,
      categoryId: audioCategory?.id,
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'],
      featuredImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
      sku: 'AUDIO-002',
      isFeatured: true,
      isActive: true,
      tags: ['speaker', 'bluetooth', 'portable', 'audio'],
    },
  ];

  const products = [];
  for (const prodData of productsData) {
    if (!prodData.categoryId) continue;
    
    const [product, created] = await Product.findOrCreate({
      where: { slug: prodData.slug },
      defaults: prodData,
    });
    if (created) products.push(product);
  }

  return products;
};

// Seed shipping methods
const seedShippingMethods = async () => {
  const methodsData = [
    { name: 'Standard Shipping', description: 'Delivery within 5-7 business days', price: 5.99, estimatedDays: 7, isActive: true },
    { name: 'Express Shipping', description: 'Delivery within 2-3 business days', price: 14.99, estimatedDays: 3, isActive: true },
    { name: 'Free Shipping', description: 'Free delivery on orders over $50', price: 0.00, estimatedDays: 7, isActive: true },
  ];

  const methods = [];
  for (const methodData of methodsData) {
    const [method, created] = await ShippingMethod.findOrCreate({
      where: { name: methodData.name },
      defaults: methodData,
    });
    if (created) methods.push(method);
  }

  return methods;
};

// Seed coupons
const seedCoupons = async () => {
  const couponsData = [
    {
      code: 'WELCOME20',
      description: '20% off your first order',
      discountType: 'percentage',
      discountValue: 20.00,
      minOrderAmount: 50.00,
      maxDiscountAmount: 50.00,
      usageLimit: 1000,
      isActive: true,
    },
    {
      code: 'SAVE10',
      description: '$10 off orders over $100',
      discountType: 'fixed',
      discountValue: 10.00,
      minOrderAmount: 100.00,
      isActive: true,
    },
  ];

  const coupons = [];
  for (const couponData of couponsData) {
    const [coupon, created] = await Coupon.findOrCreate({
      where: { code: couponData.code },
      defaults: {
        ...couponData,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });
    if (created) coupons.push(coupon);
  }

  return coupons;
};

// Seed orders
const seedOrders = async (users, products) => {
  if (users.length === 0 || products.length === 0) return [];

  const ordersData = [
    {
      userId: users[0].id,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      items: [
        { productId: products[0]?.id, quantity: 1, price: products[0]?.price },
        { productId: products[1]?.id, quantity: 2, price: products[1]?.price },
      ],
    },
    {
      userId: users[1].id,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      items: [
        { productId: products[2]?.id, quantity: 3, price: products[2]?.price },
      ],
    },
  ];

  const orders = [];
  for (const orderData of ordersData) {
    const validItems = orderData.items.filter(item => item.productId);
    if (validItems.length === 0) continue;

    const subtotal = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const [order, created] = await Order.findOrCreate({
      where: { orderNumber },
      defaults: {
        orderNumber,
        userId: orderData.userId,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        paymentMethod: orderData.paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        paidAt: orderData.paymentStatus === 'paid' ? new Date() : null,
      },
    });

    if (created) {
      // Create order items
      for (const item of validItems) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        });
      }
      orders.push(order);
    }
  }

  return orders;
};

// Run seeding if called directly
if (require.main === module) {
  const { sequelize } = require('../backend/src/models');
  
  seedDatabase()
    .then(() => {
      console.log('Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
