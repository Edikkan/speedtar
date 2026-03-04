require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../src/config/database');
const { User, Category, Product } = require('../src/models');

const categories = [
  { name: 'Food & Groceries', slug: 'food-groceries' },
  { name: 'Bakery & Cakes', slug: 'bakery-cakes' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion & Clothing', slug: 'fashion-clothing' },
  { name: 'Home & Garden', slug: 'home-garden' },
  { name: 'Health & Beauty', slug: 'health-beauty' },
  { name: 'Sports & Fitness', slug: 'sports-fitness' },
  { name: 'Toys & Games', slug: 'toys-games' },
  { name: 'Books & Stationery', slug: 'books-stationery' },
  { name: 'Automotive', slug: 'automotive' },
  { name: 'Pet Supplies', slug: 'pet-supplies' },
  { name: 'Baby & Kids', slug: 'baby-kids' },
  { name: 'Office Supplies', slug: 'office-supplies' },
  { name: 'Jewelry & Watches', slug: 'jewelry-watches' },
  { name: 'Musical Instruments', slug: 'musical-instruments' },
];

const foodProducts = [
  'Organic Apples', 'Fresh Bananas', 'Premium Rice', 'Whole Wheat Bread', 'Organic Milk',
  'Free-Range Eggs', 'Grass-Fed Beef', 'Atlantic Salmon', 'Italian Pasta', 'Olive Oil',
  'Organic Honey', 'Greek Yogurt', 'Almond Butter', 'Quinoa Grain', 'Chia Seeds',
  'Organic Spinach', 'Cherry Tomatoes', 'Red Onions', 'Garlic Bulbs', 'Fresh Basil',
  'Ground Coffee', 'Green Tea', 'Dark Chocolate', 'Mixed Nuts', 'Dried Fruits',
  'Coconut Water', 'Protein Bars', 'Granola Mix', 'Breakfast Cereal', 'Instant Oatmeal',
  'Canned Beans', 'Tomato Sauce', 'Soy Sauce', 'Hot Sauce', 'BBQ Sauce',
  'Potato Chips', 'Popcorn', 'Crackers', 'Cheese Slices', 'Butter Block',
  'Frozen Pizza', 'Ice Cream', 'Frozen Vegetables', 'Frozen Berries', 'Ready Meals',
  'Sparkling Water', 'Fruit Juice', 'Energy Drinks', 'Sports Drinks', 'Kombucha',
];

const bakeryProducts = [
  'Chocolate Cake', 'Vanilla Cupcakes', 'Red Velvet Cake', 'Cheesecake', 'Carrot Cake',
  'Lemon Tart', 'Apple Pie', 'Croissants', 'Danish Pastry', 'Donuts',
  'Birthday Cake', 'Wedding Cake', 'Fruit Cake', 'Black Forest Cake', 'Tiramisu',
  'Macarons', 'Eclairs', 'Muffins', 'Brownies', 'Cookies',
  'Sourdough Bread', 'Baguette', 'Ciabatta', 'Focaccia', 'Bagels',
  'Cinnamon Rolls', 'Pretzels', 'Strudel', 'Pavlova', 'Meringue',
  'Banana Bread', 'Pumpkin Pie', 'Pecan Pie', 'Key Lime Pie', 'Cream Puffs',
  'Profiteroles', 'Baklava', 'Cannoli', 'Gelato Cake', 'Ice Cream Cake',
];

const electronicsProducts = [
  'Wireless Earbuds', 'Bluetooth Speaker', 'Smart Watch', 'Fitness Tracker', 'Power Bank',
  'USB-C Cable', 'Wireless Charger', 'Phone Case', 'Screen Protector', 'Laptop Stand',
  'Mechanical Keyboard', 'Gaming Mouse', 'Webcam HD', 'Microphone', 'LED Desk Lamp',
  'Smart Bulb', 'Security Camera', 'Video Doorbell', 'Smart Lock', 'WiFi Router',
  'External SSD', 'USB Hub', 'HDMI Cable', 'Monitor Stand', 'Laptop Sleeve',
  'Tablet Stand', 'Phone Mount', 'Car Charger', 'Portable Fan', 'Air Purifier',
  'Robot Vacuum', 'Coffee Maker', 'Electric Kettle', 'Toaster Oven', 'Blender',
  'Hair Dryer', 'Electric Shaver', 'Massage Gun', 'Digital Scale', 'Thermometer',
];

const fashionProducts = [
  'Cotton T-Shirt', 'Denim Jeans', 'Leather Jacket', 'Running Shoes', 'Sneakers',
  'Wool Sweater', 'Summer Dress', 'Business Suit', 'Casual Shirt', 'Polo Shirt',
  'Yoga Pants', 'Sports Bra', 'Swimwear', 'Winter Coat', 'Rain Jacket',
  'Baseball Cap', 'Sun Hat', 'Wool Scarf', 'Leather Belt', 'Sunglasses',
  'Backpack', 'Tote Bag', 'Wallet', 'Watch', 'Bracelet',
  'Necklace', 'Earrings', 'Ring', 'Ankle Boots', 'High Heels',
  'Flip Flops', 'Slippers', 'Socks Pack', 'Underwear Set', 'Pajamas',
  'Workout Shorts', 'Hoodie', 'Bomber Jacket', 'Cardigan', 'Blazer',
];

const homeProducts = [
  'Throw Pillow', 'Area Rug', 'Curtains Set', 'Bed Sheets', 'Comforter',
  'Towel Set', 'Shower Curtain', 'Bath Mat', 'Storage Bins', 'Laundry Basket',
  'Kitchen Organizer', 'Spice Rack', 'Cutting Board', 'Cookware Set', 'Dinnerware Set',
  'Glassware Set', 'Coffee Mugs', 'Water Bottle', 'Food Containers', 'Trash Can',
  'Desk Lamp', 'Floor Lamp', 'Wall Art', 'Mirror', 'Clock',
  'Vase', 'Candle Set', 'Picture Frames', 'Bookshelf', 'Side Table',
  'Coffee Table', 'TV Stand', 'Shoe Rack', 'Coat Hanger', 'Door Mat',
  'Garden Tools', 'Plant Pots', 'Outdoor Lights', 'BBQ Grill', 'Patio Furniture',
];

const beautyProducts = [
  'Face Moisturizer', 'Sunscreen SPF 50', 'Anti-Aging Serum', 'Eye Cream', 'Face Cleanser',
  'Toner', 'Face Mask', 'Lip Balm', 'Body Lotion', 'Hand Cream',
  'Shampoo', 'Conditioner', 'Hair Oil', 'Hair Mask', 'Styling Gel',
  'Perfume', 'Deodorant', 'Toothpaste', 'Mouthwash', 'Dental Floss',
  'Makeup Remover', 'Foundation', 'Mascara', 'Lipstick', 'Eyeshadow Palette',
  'Blush', 'Bronzer', 'Highlighter', 'Nail Polish', 'Makeup Brushes',
  'Razor', 'Shaving Cream', 'Beard Oil', 'Face Scrub', 'Body Wash',
  'Bath Bombs', 'Essential Oils', 'Cotton Pads', 'Tissues', 'Wet Wipes',
];

const sportsProducts = [
  'Yoga Mat', 'Resistance Bands', 'Dumbbells Set', 'Kettlebell', 'Jump Rope',
  'Foam Roller', 'Exercise Ball', 'Pull-Up Bar', 'Push-Up Bars', 'Ab Wheel',
  'Running Belt', 'Water Bottle', 'Gym Bag', 'Workout Gloves', 'Knee Support',
  'Tennis Racket', 'Badminton Set', 'Basketball', 'Soccer Ball', 'Volleyball',
  'Swimming Goggles', 'Swim Cap', 'Bike Helmet', 'Cycling Gloves', 'Bike Light',
  'Camping Tent', 'Sleeping Bag', 'Hiking Backpack', 'Trekking Poles', 'First Aid Kit',
  'Fishing Rod', 'Golf Clubs', 'Skateboard', 'Roller Skates', 'Frisbee',
];

const toyProducts = [
  'Building Blocks', 'Action Figure', 'Doll House', 'Remote Control Car', 'Board Game',
  'Puzzle Set', 'Art Supplies', 'Science Kit', 'Musical Toy', 'Plush Toy',
  'LEGO Set', 'Hot Wheels', 'Barbie Doll', 'Nerf Gun', 'Play-Doh',
  'Bubble Machine', 'Kite', 'Yo-Yo', 'Rubik Cube', 'Trading Cards',
  'Video Game', 'Gaming Console', 'Controller', 'VR Headset', 'Drone',
  'Robot Toy', 'Dinosaur Figure', 'Kitchen Play Set', 'Tool Set', 'Doctor Kit',
  'Train Set', 'Stuffed Animal', 'Ball Pit', 'Slide', 'Swing',
];

const bookProducts = [
  'Fiction Novel', 'Mystery Thriller', 'Science Fiction', 'Romance Novel', 'Biography',
  'Self-Help Book', 'Business Book', 'Cookbook', 'Travel Guide', 'History Book',
  'Children Book', 'Comic Book', 'Magazine', 'Journal', 'Planner',
  'Notebook', 'Sketchbook', 'Coloring Book', 'Dictionary', 'Atlas',
  'Textbook', 'Reference Book', 'Poetry Collection', 'Classic Literature', 'Fantasy Novel',
  'Horror Story', 'True Crime', 'Memoir', 'Essay Collection', 'Short Stories',
  'Pen Set', 'Pencil Case', 'Highlighter Pack', 'Sticky Notes', 'Paper Clips',
  'Stapler', 'Hole Punch', 'Scissors', 'Ruler', 'Calculator',
];

const automotiveProducts = [
  'Car Phone Mount', 'USB Car Charger', 'Dash Cam', 'GPS Navigator', 'Bluetooth Adapter',
  'Seat Covers', 'Floor Mats', 'Steering Wheel Cover', 'Sun Shade', 'Air Freshener',
  'Tire Pressure Gauge', 'Jump Starter', 'Car Vacuum', 'Window Tint', 'License Plate Frame',
  'Roof Rack', 'Bike Carrier', 'Trailer Hitch', 'Mud Flaps', 'Bug Shield',
  'LED Headlights', 'Fog Lights', 'Brake Pads', 'Oil Filter', 'Air Filter',
  'Wiper Blades', 'Car Battery', 'Tire Inflator', 'Tool Kit', 'Emergency Kit',
];

const petProducts = [
  'Dog Food', 'Cat Food', 'Pet Treats', 'Wet Food', 'Grain-Free Food',
  'Dog Collar', 'Cat Collar', 'Leash', 'Harness', 'Pet Bed',
  'Cat Tree', 'Scratching Post', 'Dog Crate', 'Pet Carrier', 'Food Bowl',
  'Water Fountain', 'Automatic Feeder', 'Pet Toys', 'Chew Toys', 'Catnip Toys',
  'Grooming Brush', 'Nail Clippers', 'Shampoo', 'Dental Care', 'Flea Treatment',
  'Litter Box', 'Cat Litter', 'Poop Bags', 'Training Pads', 'Pet Gate',
];

const babyProducts = [
  'Baby Formula', 'Baby Food', 'Diapers', 'Baby Wipes', 'Diaper Cream',
  'Baby Bottle', 'Pacifier', 'Teething Toy', 'Baby Monitor', 'Crib',
  'Changing Table', 'Baby Stroller', 'Car Seat', 'Baby Carrier', 'High Chair',
  'Baby Clothes', 'Onesies', 'Baby Socks', 'Baby Hat', 'Baby Blanket',
  'Bibs', 'Burp Cloths', 'Baby Towel', 'Baby Bath', 'Baby Shampoo',
  'Baby Lotion', 'Baby Powder', 'Nasal Aspirator', 'Thermometer', 'Humidifier',
];

const officeProducts = [
  'Printer Paper', 'Ink Cartridge', 'Toner Cartridge', 'Pens', 'Pencils',
  'Markers', 'Highlighters', 'Erasers', 'Whiteboard', 'Cork Board',
  'Desk Organizer', 'File Folders', 'Binders', 'Paper Clips', 'Rubber Bands',
  'Stapler', 'Staples', 'Tape Dispenser', 'Packing Tape', 'Scissors',
  'Letter Opener', 'Hole Punch', 'Laminator', 'Shredder', 'Label Maker',
  'Desk Chair', 'Standing Desk', 'Monitor', 'Keyboard', 'Mouse',
];

const jewelryProducts = [
  'Gold Necklace', 'Silver Bracelet', 'Diamond Ring', 'Pearl Earrings', 'Watch',
  'Pendant', 'Charm Bracelet', 'Stud Earrings', 'Hoop Earrings', 'Anklet',
  'Brooch', 'Cufflinks', 'Tie Clip', 'Money Clip', 'Keychain',
  'Engagement Ring', 'Wedding Band', 'Promise Ring', 'Birthstone Jewelry', 'Name Necklace',
  'Smart Watch', 'Fitness Band', 'Pocket Watch', 'Sunglasses', 'Reading Glasses',
];

const musicProducts = [
  'Acoustic Guitar', 'Electric Guitar', 'Bass Guitar', 'Ukulele', 'Violin',
  'Keyboard Piano', 'Digital Piano', 'Drum Set', 'Electronic Drums', 'Flute',
  'Saxophone', 'Trumpet', 'Clarinet', 'Harmonica', 'Microphone',
  'Audio Interface', 'Studio Monitors', 'Headphones', 'Guitar Amp', 'Effect Pedal',
  'Music Stand', 'Guitar Stand', 'Instrument Case', 'Guitar Strings', 'Piano Bench',
  'Sheet Music', 'Metronome', 'Tuner', 'Capo', 'Guitar Pick',
];

const allProducts = [
  ...foodProducts.map(name => ({ name, category: 'Food & Groceries' })),
  ...bakeryProducts.map(name => ({ name, category: 'Bakery & Cakes' })),
  ...electronicsProducts.map(name => ({ name, category: 'Electronics' })),
  ...fashionProducts.map(name => ({ name, category: 'Fashion & Clothing' })),
  ...homeProducts.map(name => ({ name, category: 'Home & Garden' })),
  ...beautyProducts.map(name => ({ name, category: 'Health & Beauty' })),
  ...sportsProducts.map(name => ({ name, category: 'Sports & Fitness' })),
  ...toyProducts.map(name => ({ name, category: 'Toys & Games' })),
  ...bookProducts.map(name => ({ name, category: 'Books & Stationery' })),
  ...automotiveProducts.map(name => ({ name, category: 'Automotive' })),
  ...petProducts.map(name => ({ name, category: 'Pet Supplies' })),
  ...babyProducts.map(name => ({ name, category: 'Baby & Kids' })),
  ...officeProducts.map(name => ({ name, category: 'Office Supplies' })),
  ...jewelryProducts.map(name => ({ name, category: 'Jewelry & Watches' })),
  ...musicProducts.map(name => ({ name, category: 'Musical Instruments' })),
];

const adjectives = ['Premium', 'Deluxe', 'Professional', 'Eco-Friendly', 'Organic', 'Natural', 'Luxury', 'Essential', 'Classic', 'Modern', 'Vintage', 'Handmade', 'Imported', 'Local', 'Fresh', 'Genuine', 'Authentic', 'Original', 'New', 'Improved'];

const generateSKU = (name, index) => {
  const prefix = name.substring(0, 3).toUpperCase();
  return `${prefix}-${String(index).padStart(5, '0')}`;
};

const generatePrice = () => {
  return (Math.random() * 200 + 5).toFixed(2);
};

const generateDescription = (name, category) => {
  const desc = [
    `High-quality ${name.toLowerCase()} for everyday use.`,
    `Premium ${name.toLowerCase()} designed for ${category.toLowerCase()} enthusiasts.`,
    `Best-selling ${name.toLowerCase()} with excellent reviews.`,
    `Top-rated ${name.toLowerCase()} at an affordable price.`,
    `Durable and reliable ${name.toLowerCase()} for all your needs.`,
  ];
  return desc[Math.floor(Math.random() * desc.length)];
};

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    // Create admin user
    const adminExists = await User.findOne({ where: { email: 'edikkann@gmail.com' } });
    if (!adminExists) {
      await User.create({
        id: uuidv4(),
        email: 'edikkann@gmail.com',
        password: 'C3lsius33&',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      });
      console.log('Admin user created: edikkann@gmail.com');
    } else {
      console.log('Admin user already exists.');
    }

    // Create categories
    const categoryMap = {};
    for (const cat of categories) {
      const [category, created] = await Category.findOrCreate({
        where: { slug: cat.slug },
        defaults: {
          id: uuidv4(),
          name: cat.name,
          slug: cat.slug,
          description: `Browse our collection of ${cat.name.toLowerCase()} products.`,
          isActive: true,
        },
      });
      categoryMap[cat.name] = category.id;
      if (created) console.log(`Category created: ${cat.name}`);
    }

    // Create products - we need 5000, so we'll duplicate with variations
    const productsToCreate = [];
    let productIndex = 1;

    while (productsToCreate.length < 5000) {
      for (const prod of allProducts) {
        if (productsToCreate.length >= 5000) break;
        
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const variant = Math.floor(Math.random() * 100) + 1;
        const name = productsToCreate.length < allProducts.length 
          ? prod.name 
          : `${adj} ${prod.name} ${variant}`;
        
        productsToCreate.push({
          id: uuidv4(),
          name: name,
          description: generateDescription(name, prod.category),
          price: generatePrice(),
          comparePrice: (parseFloat(generatePrice()) * 1.2).toFixed(2),
          sku: generateSKU(name, productIndex),
          inventory: Math.floor(Math.random() * 500) + 10,
          images: JSON.stringify([`https://via.placeholder.com/400x400?text=${encodeURIComponent(name)}`]),
          featuredImage: `https://via.placeholder.com/400x400?text=${encodeURIComponent(name)}`,
          isActive: true,
          isFeatured: Math.random() > 0.9,
          weight: (Math.random() * 5 + 0.1).toFixed(2),
          dimensions: JSON.stringify({ length: 10, width: 10, height: 10 }),
          tags: JSON.stringify([prod.category.toLowerCase(), 'popular', 'new']),
          categoryId: categoryMap[prod.category],
        });
        
        productIndex++;
      }
    }

    // Bulk insert products in batches
    const batchSize = 100;
    for (let i = 0; i < productsToCreate.length; i += batchSize) {
      const batch = productsToCreate.slice(i, i + batchSize);
      await Product.bulkCreate(batch, { ignoreDuplicates: true });
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsToCreate.length / batchSize)}`);
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`- Admin user: edikkann@gmail.com / C3lsius33&`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Products: ${productsToCreate.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
