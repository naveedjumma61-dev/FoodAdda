import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting HostelAdda database seed...');

  // Clear existing records in correct order
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.rider.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.setting.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 1. Create Default Settings
  const settings = await prisma.setting.create({
    data: {
      platformName: 'HostelAdda',
      currency: 'PKR',
      campusDeliveryFee: 89,
      hostelDeliveryFee: 70,
      campusMinimumOrder: 500,
      hostelMinimumOrder: 300,
      contactPhone: '+92 301 555-ADDA',
      contactEmail: 'support@hosteladda.com',
    },
  });
  console.log('⚙️ Created default settings.');

  // 2. Create Hostels
  const hostelsData = [
    {
      name: 'Iqbal Hall (Boys Hostel 3)',
      address: 'COMSATS University Islamabad, Park Road',
      location: 'Chak Shehzad',
      campus: 'COMSATS University Islamabad',
      deliveryCharge: 70,
    },
    {
      name: 'Liaquat Hall (Boys Hostel 1)',
      address: 'COMSATS University Islamabad, Park Road',
      location: 'Chak Shehzad',
      campus: 'COMSATS University Islamabad',
      deliveryCharge: 70,
    },
    {
      name: 'Jinnah Hall (Boys Hostel 2)',
      address: 'COMSATS University Islamabad, Park Road',
      location: 'Chak Shehzad',
      campus: 'COMSATS University Islamabad',
      deliveryCharge: 70,
    },
    {
      name: 'Fatima Jinnah Hall (Girls Hostel 1)',
      address: 'COMSATS University Islamabad, Park Road',
      location: 'Chak Shehzad',
      campus: 'COMSATS University Islamabad',
      deliveryCharge: 70,
    },
    {
      name: 'Abasyn Boys Hostel Block A',
      address: 'Abasyn University Campus, Park Road',
      location: 'Chak Shehzad',
      campus: 'Abasyn University Islamabad',
      deliveryCharge: 70,
    },
    {
      name: 'Abasyn Girls Hostel',
      address: 'Abasyn University Campus, Park Road',
      location: 'Chak Shehzad',
      campus: 'Abasyn University Islamabad',
      deliveryCharge: 70,
    },
    {
      name: 'Hostel City Street 3 - Royal Executive Hostel',
      address: 'Hostel City Street 3, Chak Shehzad',
      location: 'Hostel City Islamabad',
      campus: 'Hostel City',
      deliveryCharge: 70,
    },
    {
      name: 'Hostel City Street 5 - Scholar Boys Hostel',
      address: 'Hostel City Street 5, Chak Shehzad',
      location: 'Hostel City Islamabad',
      campus: 'Hostel City',
      deliveryCharge: 70,
    },
    {
      name: 'COMSATS Main Academic Block Gate 1',
      address: 'Park Road, Chak Shehzad',
      location: 'Campus Academic Zone',
      campus: 'COMSATS University Islamabad',
      deliveryCharge: 89,
    },
  ];

  const createdHostels = [];
  for (const h of hostelsData) {
    const hostel = await prisma.hostel.create({ data: h });
    createdHostels.push(hostel);
  }
  console.log(`🏢 Created ${createdHostels.length} hostels.`);

  // Password hashes
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const riderPasswordHash = await bcrypt.hash('rider123', 10);
  const customerPasswordHash = await bcrypt.hash('student123', 10);

  // 3. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'HostelAdda Admin',
      email: 'admin@hosteladda.com',
      phone: '0300-1122334',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      campus: 'COMSATS Islamabad',
      hostel: 'Admin Operations Hub',
    },
  });
  console.log('👑 Created Admin user (admin@hosteladda.com / admin123).');

  // 4. Create 5 Riders
  const ridersSeed = [
    { name: 'Ali Raza', email: 'rider1@hosteladda.com', phone: '0315-7744332', vehicleType: 'Honda CD 70', plateNumber: 'ICT-RI-8841' },
    { name: 'Kamran Shah', email: 'rider2@hosteladda.com', phone: '0300-8899221', vehicleType: 'Yamaha YBR 125', plateNumber: 'ICT-LE-4412' },
    { name: 'Zeeshan Ahmed', email: 'rider3@hosteladda.com', phone: '0345-2233119', vehicleType: 'Honda 125', plateNumber: 'ICT-KV-9090' },
    { name: 'Bilal Hussain', email: 'rider4@hosteladda.com', phone: '0333-5566778', vehicleType: 'United 70', plateNumber: 'ICT-BW-1122' },
    { name: 'Usman Tariq', email: 'rider5@hosteladda.com', phone: '0312-9988776', vehicleType: 'Road Prince 70', plateNumber: 'ICT-RP-3344' },
  ];

  const createdRiders = [];
  for (const r of ridersSeed) {
    const user = await prisma.user.create({
      data: {
        name: r.name,
        email: r.email,
        phone: r.phone,
        passwordHash: riderPasswordHash,
        role: Role.RIDER,
        campus: 'COMSATS & Hostel City',
      },
    });

    const rider = await prisma.rider.create({
      data: {
        userId: user.id,
        phone: r.phone,
        vehicleType: r.vehicleType,
        plateNumber: r.plateNumber,
        active: true,
        available: true,
      },
    });
    createdRiders.push({ user, rider });
  }
  console.log(`🛵 Created ${createdRiders.length} riders (rider1@hosteladda.com - rider5@hosteladda.com / rider123).`);

  // 5. Create 10 Customers
  const customersSeed = [
    { name: 'Hamza Khan', email: 'student1@hosteladda.com', phone: '0304-9871234', campus: 'COMSATS University Islamabad', hostel: 'Iqbal Hall (Boys Hostel 3)' },
    { name: 'Areeba Malik', email: 'student2@hosteladda.com', phone: '0301-4455667', campus: 'Abasyn University Islamabad', hostel: 'Abasyn Girls Hostel' },
    { name: 'Zain Ul Abideen', email: 'student3@hosteladda.com', phone: '0321-7788990', campus: 'COMSATS University Islamabad', hostel: 'Hostel City Street 5 - Scholar Boys Hostel' },
    { name: 'Bilal Farooq', email: 'student4@hosteladda.com', phone: '0332-1122445', campus: 'COMSATS University Islamabad', hostel: 'Liaquat Hall (Boys Hostel 1)' },
    { name: 'Fatima Noor', email: 'student5@hosteladda.com', phone: '0345-9988112', campus: 'COMSATS University Islamabad', hostel: 'Fatima Jinnah Hall (Girls Hostel 1)' },
    { name: 'Hassan Ali', email: 'student6@hosteladda.com', phone: '0313-2233445', campus: 'Abasyn University Islamabad', hostel: 'Abasyn Boys Hostel Block A' },
    { name: 'Maryam Siddiqui', email: 'student7@hosteladda.com', phone: '0306-6677889', campus: 'COMSATS University Islamabad', hostel: 'Fatima Jinnah Hall (Girls Hostel 1)' },
    { name: 'Daniyal Ahmed', email: 'student8@hosteladda.com', phone: '0334-8899001', campus: 'Hostel City', hostel: 'Hostel City Street 3 - Royal Executive Hostel' },
    { name: 'Sana Javed', email: 'student9@hosteladda.com', phone: '0322-4455778', campus: 'Abasyn University Islamabad', hostel: 'Abasyn Girls Hostel' },
    { name: 'Saad Rehman', email: 'student10@hosteladda.com', phone: '0308-1122998', campus: 'COMSATS University Islamabad', hostel: 'Jinnah Hall (Boys Hostel 2)' },
  ];

  const createdCustomers = [];
  for (const c of customersSeed) {
    const user = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        passwordHash: customerPasswordHash,
        role: Role.CUSTOMER,
        campus: c.campus,
        hostel: c.hostel,
      },
    });

    // Create saved address
    await prisma.userAddress.create({
      data: {
        userId: user.id,
        hostelId: createdHostels[0].id,
        building: c.hostel,
        room: 'Room 214',
        instructions: 'Please call upon reaching gate.',
        isDefault: true,
      },
    });

    createdCustomers.push(user);
  }
  console.log(`🎓 Created ${createdCustomers.length} student customers (student1@hosteladda.com - student10@hosteladda.com / student123).`);

  // 6. Create 5 Restaurants
  const restaurantsSeed = [
    {
      id: 'campus-cafe-shawarma',
      name: 'Campus Cafe & Shawarma Hub',
      description: 'Loaded Arabic Shawarmas, Zinger burgers & Platters',
      category: 'Fast Food',
      logoImage: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1200&auto=format&fit=crop&q=80',
      phone: '+92 312 8884321',
      address: 'Near COMSATS Gate 1, Park Road, Islamabad',
      location: 'COMSATS Gate 1',
      openingHours: '10:00 AM - 03:00 AM',
      deliveryFee: 40,
      minimumOrder: 200,
      active: true,
    },
    {
      id: 'hostel-city-biryani',
      name: 'Hostel City Biryani & Pulao',
      description: 'Authentic Karachi spiced student Biryani & Kabab',
      category: 'Biryani',
      logoImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
      phone: '+92 301 5551201',
      address: 'Shop 4-5, Main Market, Hostel City, Islamabad',
      location: 'Hostel City Main Market',
      openingHours: '11:00 AM - 02:30 AM',
      deliveryFee: 40,
      minimumOrder: 250,
      active: true,
    },
    {
      id: 'burger-point',
      name: 'Burger Point & Fries Box',
      description: 'Juicy smashed beef & crunchy buttermilk zinger burgers',
      category: 'Burger',
      logoImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80',
      phone: '+92 333 4441920',
      address: 'Plaza 2, Main Boulevard, Hostel City, Islamabad',
      location: 'Hostel City / Abasyn Junction',
      openingHours: '12:00 PM - 04:00 AM',
      deliveryFee: 50,
      minimumOrder: 350,
      active: true,
    },
    {
      id: 'pizza-corner',
      name: 'Pizza Corner & Stone Oven',
      description: 'Cheesy crust pizzas with generous desi toppings',
      category: 'Pizza',
      logoImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1200&auto=format&fit=crop&q=80',
      phone: '+92 345 7772390',
      address: 'Commercial Block B, Park Road, Chak Shehzad, Islamabad',
      location: 'Chak Shehzad Park Road',
      openingHours: '12:00 PM - 02:00 AM',
      deliveryFee: 50,
      minimumOrder: 500,
      active: true,
    },
    {
      id: 'juice-hub',
      name: 'Juice Hub & Shake Factory',
      description: '100% Fresh seasonal fruit juices and thick dairy shakes',
      category: 'Juice',
      logoImage: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=1200&auto=format&fit=crop&q=80',
      phone: '+92 321 9900112',
      address: 'Shop 2, Student Corner, Park Road, Islamabad',
      location: 'COMSATS Commercial Area',
      openingHours: '09:00 AM - 02:00 AM',
      deliveryFee: 30,
      minimumOrder: 180,
      active: true,
    },
  ];

  const createdRestaurants = [];
  for (const r of restaurantsSeed) {
    const res = await prisma.restaurant.create({ data: r });
    createdRestaurants.push(res);
  }
  console.log(`🍲 Created ${createdRestaurants.length} partner restaurants.`);

  // 7. Create 30+ Menu Items
  const menuItemsSeed = [
    // Campus Cafe
    {
      restaurantId: createdRestaurants[0].id,
      name: 'Special Loaded Arabic Shawarma',
      description: 'Charcoal grilled shredded chicken breast, pickled cucumber, crispy fries, loaded with authentic toum garlic tahini sauce in fresh pita.',
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 240,
      available: true,
    },
    {
      restaurantId: createdRestaurants[0].id,
      name: 'Mega Crispy Zinger Burger',
      description: 'Extra crunchy deep-fried chicken thigh fillet marinated in secret spices, iceberg lettuce, signature house burger sauce.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      category: 'Burger',
      price: 450,
      available: true,
    },
    {
      restaurantId: createdRestaurants[0].id,
      name: 'Chicken Shawarma Platter with Fries',
      description: 'Generous portion of cut chicken shawarma meat over salted crinkle-cut fries with hummus and garlic dip.',
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 420,
      available: true,
    },
    {
      restaurantId: createdRestaurants[0].id,
      name: 'Club Sandwich Supreme Box',
      description: 'Triple layer toasted sandwich with roast chicken, fried egg, cheddar cheese, and fries.',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 360,
      available: true,
    },
    {
      restaurantId: createdRestaurants[0].id,
      name: 'Crispy Fried Chicken (2 Pcs + Bun + Dip)',
      description: 'Golden spiced broast chicken pieces served with soft garlic bun and tartar sauce.',
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 380,
      available: true,
    },
    {
      restaurantId: createdRestaurants[0].id,
      name: 'Doodh Patti Karak Chai',
      description: 'Cardamom infused pure milk tea cooked on slow coal flame.',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      category: 'Tea & Cafe',
      price: 90,
      available: true,
    },

    // Hostel City Biryani
    {
      restaurantId: createdRestaurants[1].id,
      name: 'Chicken Dum Biryani (Student Special)',
      description: 'Aromatic basmati rice cooked with succulent chicken piece, boiled egg, spicy aloo, served with fresh raita and mint salad.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      category: 'Biryani',
      price: 300,
      available: true,
    },
    {
      restaurantId: createdRestaurants[1].id,
      name: 'Double Boti Special Dum Biryani',
      description: 'Two succulent pieces of chicken, extra aloo, boiled egg, saffron spiced long basmati grains.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      category: 'Biryani',
      price: 420,
      available: true,
    },
    {
      restaurantId: createdRestaurants[1].id,
      name: 'Beef Nalli & Boti Biryani',
      description: 'Tender slow-cooked beef shank bone marrow with fragrant spiced saffron rice and roasted spices.',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
      category: 'Biryani',
      price: 450,
      available: true,
    },
    {
      restaurantId: createdRestaurants[1].id,
      name: 'Chicken Yakhni Pulao (Bannu Style)',
      description: 'Mild traditional beef-stock infused pulao rice with tender chicken, black pepper, and whole spices.',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80',
      category: 'Biryani',
      price: 320,
      available: true,
    },
    {
      restaurantId: createdRestaurants[1].id,
      name: 'Chicken Seekh Kabab Roll (2 Pcs)',
      description: 'Spicy grilled minced chicken kabab wrapped in golden crispy paratha with garlic mayo.',
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 260,
      available: true,
    },
    {
      restaurantId: createdRestaurants[1].id,
      name: 'Shami Kabab (2 Pcs with Raita)',
      description: 'Handmade lentils and minced beef patties shallow fried to golden perfection.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
      category: 'Desi Food',
      price: 120,
      available: true,
    },

    // Burger Point
    {
      restaurantId: createdRestaurants[2].id,
      name: 'Double Smashed Beef Cheese Burger',
      description: 'Two 100% prime ground beef patties smashed crispy with caramelized onions, double American cheddar cheese, pickles, and smoked secret relish.',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
      category: 'Burger',
      price: 580,
      available: true,
    },
    {
      restaurantId: createdRestaurants[2].id,
      name: 'Mighty Monster Zinger Tower',
      description: 'Double crispy fried chicken fillet, double cheese slice, hashbrown, spicy chipotle sauce in brioche bun.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      category: 'Burger',
      price: 620,
      available: true,
    },
    {
      restaurantId: createdRestaurants[2].id,
      name: 'Classic Jalapeno Beef Burger',
      description: 'Charbroiled beef patty, pickled spicy jalapenos, melted mozzarella, and chipotle mayo.',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
      category: 'Burger',
      price: 490,
      available: true,
    },
    {
      restaurantId: createdRestaurants[2].id,
      name: 'Cheesy Pizza Loaded Fries Box',
      description: 'Crispy seasoned French fries topped with pizza marinara sauce, diced chicken fajita, jalapenos, and melted mozzarella cheese.',
      image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 380,
      available: true,
    },
    {
      restaurantId: createdRestaurants[2].id,
      name: 'Curly Fries with Garlic Mayo Dip',
      description: 'Spiral cut seasoned crispy potato fries served with house garlic dip.',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 220,
      available: true,
    },
    {
      restaurantId: createdRestaurants[2].id,
      name: 'Crispy Chicken Nuggets (10 Pcs)',
      description: 'Golden bite-sized chicken nuggets with honey mustard and garlic dip.',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 320,
      available: true,
    },

    // Pizza Corner
    {
      restaurantId: createdRestaurants[3].id,
      name: 'Chicken Tikka Supreme Pizza (Medium 10")',
      description: 'Traditional spiced tikka chicken chunks, onions, green capsicum, black olives, tomato pizza sauce, and heavy stringy mozzarella cheese.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
      category: 'Pizza',
      price: 750,
      available: true,
    },
    {
      restaurantId: createdRestaurants[3].id,
      name: 'Chicken Fajita Feast Pizza (Small 7")',
      description: 'Personal student pizza with marinated Mexican chicken fajita, capsicum, sweet corn, mushrooms, and cheddar mozzarella blend.',
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=80',
      category: 'Pizza',
      price: 450,
      available: true,
    },
    {
      restaurantId: createdRestaurants[3].id,
      name: 'Creamy Mughlai Stuffed Crust Pizza (Large 13")',
      description: 'Creamy white base with Mughlai chicken boti, sliced onions, mushrooms, and cheesy ring border.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
      category: 'Pizza',
      price: 1150,
      available: true,
    },
    {
      restaurantId: createdRestaurants[3].id,
      name: 'Garlic Bread with Melted Cheese (4 Pcs)',
      description: 'Toasted French baguette brushed with roasted garlic butter, parsley, and golden melted cheese.',
      image: 'https://images.unsplash.com/photo-1619881589083-d95c1c876412?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 250,
      available: true,
    },
    {
      restaurantId: createdRestaurants[3].id,
      name: 'Spicy Chicken Wings (6 Pcs BBQ)',
      description: 'Oven baked crispy chicken wings tossed in smoky spicy BBQ glaze.',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 340,
      available: true,
    },
    {
      restaurantId: createdRestaurants[3].id,
      name: 'Oven Baked Pasta Alfredo',
      description: 'Penne pasta in rich creamy parmesan alfredo sauce with seasoned chicken chunks and golden mozzarella top.',
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=800&auto=format&fit=crop&q=80',
      category: 'Fast Food',
      price: 480,
      available: true,
    },

    // Juice Hub
    {
      restaurantId: createdRestaurants[4].id,
      name: 'Fresh Pomegranate (Kandahari Anar) Juice',
      description: 'Cold-pressed 100% pure fresh red pomegranate juice with a pinch of black salt (Kala Namak).',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80',
      category: 'Juice',
      price: 280,
      available: true,
    },
    {
      restaurantId: createdRestaurants[4].id,
      name: 'Thick Mango Shake with Vanilla Scoop',
      description: 'Rich Chaunsa mango pulp blended with chilled whole milk and topped with creamy ice cream scoop & dry fruits.',
      image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&auto=format&fit=crop&q=80',
      category: 'Juice',
      price: 240,
      available: true,
    },
    {
      restaurantId: createdRestaurants[4].id,
      name: 'Oreo Nutella Freak Shake',
      description: 'Crushed Oreo cookies, rich chocolate milk, Nutella swirl, chocolate syrup, and whipped cream top.',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
      category: 'Juice',
      price: 320,
      available: true,
    },
    {
      restaurantId: createdRestaurants[4].id,
      name: 'Fresh Seasonal Orange / Mosambi Juice',
      description: 'Freshly squeezed sweet citrus juice served chilled with ice.',
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80',
      category: 'Juice',
      price: 200,
      available: true,
    },
    {
      restaurantId: createdRestaurants[4].id,
      name: 'Banana Peanut Butter Protein Shake',
      description: 'Fresh bananas, peanut butter, milk, oats, and honey. Great for gym and sports students.',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80',
      category: 'Juice',
      price: 260,
      available: true,
    },
    {
      restaurantId: createdRestaurants[4].id,
      name: 'Mint Lemonade Chiller',
      description: 'Crushed fresh mint leaves, lemon juice, soda, and black salt served over crushed ice.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
      category: 'Juice',
      price: 180,
      available: true,
    },
  ];

  const createdMenuItems = [];
  for (const item of menuItemsSeed) {
    const mi = await prisma.menuItem.create({ data: item });
    createdMenuItems.push(mi);
  }
  console.log(`🍔 Created ${createdMenuItems.length} dishes across all partner restaurants.`);

  // 8. Create 15 Sample Orders
  const orderStatuses: OrderStatus[] = [
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
    OrderStatus.PREPARING,
    OrderStatus.CONFIRMED,
    OrderStatus.RIDER_ASSIGNED,
    OrderStatus.DELIVERED,
    OrderStatus.DELIVERED,
    OrderStatus.DELIVERED,
    OrderStatus.DELIVERED,
    OrderStatus.DELIVERED,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.PENDING,
    OrderStatus.READY,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ];

  for (let i = 0; i < 15; i++) {
    const customer = createdCustomers[i % createdCustomers.length];
    const restaurant = createdRestaurants[i % createdRestaurants.length];
    const rider = createdRiders[i % createdRiders.length];
    const status = orderStatuses[i];

    // Pick 2 menu items from this restaurant
    const restItems = createdMenuItems.filter((mi) => mi.restaurantId === restaurant.id);
    const item1 = restItems[0] || createdMenuItems[0];
    const item2 = restItems[1] || createdMenuItems[1];

    const subtotal = item1.price * 2 + item2.price;
    const deliveryFee = 70;
    const discount = i % 3 === 0 ? 50 : 0;
    const total = subtotal + deliveryFee - discount;
    const orderNumber = `STU-${10480 + i}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        restaurantId: restaurant.id,
        riderId: status !== OrderStatus.PENDING && status !== OrderStatus.CONFIRMED ? rider.rider.id : null,
        status,
        subtotal,
        deliveryFee,
        discount,
        total,
        deliveryAddress: `${customer.hostel || 'Hostel City'}, Room ${200 + i}`,
        customerPhone: customer.phone,
        instructions: 'Please call when arriving at turnstile gate.',
        paymentMethod: 'COD',
      },
    });

    // Create order items
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: item1.id,
        quantity: 2,
        price: item1.price,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: item2.id,
        quantity: 1,
        price: item2.price,
      },
    });

    // Create customer notification
    await prisma.notification.create({
      data: {
        userId: customer.id,
        orderId: order.id,
        title: `Order ${orderNumber} ${status.toLowerCase().replace(/_/g, ' ')}`,
        message: `Your order from ${restaurant.name} is currently ${status.toLowerCase().replace(/_/g, ' ')}.`,
        read: status === OrderStatus.DELIVERED,
      },
    });
  }

  console.log('📦 Created 15 realistic campus orders with items and notifications.');
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
