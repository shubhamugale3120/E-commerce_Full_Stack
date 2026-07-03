import connectDB from "@/lib/db";
import OpenAI from "openai";
import Product from "@/models/Product";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateVector(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  })
  return response.data[0].embedding;
}

export async function GET() {
    await connectDB();
    const product = await Product.find();
    await Product.deleteMany();

    const products = [
  {
    title: "Wireless Mouse",
    description: "Ergonomic wireless mouse with adjustable DPI.",
    price: 15.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300?random=1",
  },
  {
    title: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard for gaming.",
    price: 49.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300?random=2",
  },
  {
    title: "Gaming Headset",
    description: "Surround sound headset with noise-canceling mic.",
    price: 39.99,
    category: "Gaming",
    image: "https://picsum.photos/500/300?random=3",
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable speaker with deep bass and long battery.",
    price: 29.99,
    category: "Audio",
    image: "https://picsum.photos/500/300?random=4",
  },
  {
    title: "Smart Watch",
    description: "Fitness tracking smartwatch with heart rate monitor.",
    price: 79.99,
    category: "Wearables",
    image: "https://picsum.photos/500/300?random=5",
  },
  {
    title: "USB-C Hub",
    description: "7-in-1 USB-C hub for laptops.",
    price: 24.99,
    category: "Accessories",
    image: "https://picsum.photos/500/300?random=6",
  },
  {
    title: "Laptop Stand",
    description: "Aluminum adjustable laptop stand.",
    price: 32.99,
    category: "Office",
    image: "https://picsum.photos/500/300?random=7",
  },
  {
    title: "Desk Lamp",
    description: "LED desk lamp with brightness control.",
    price: 18.99,
    category: "Home",
    image: "https://picsum.photos/500/300?random=8",
  },
  {
    title: "Backpack",
    description: "Water-resistant travel backpack.",
    price: 44.99,
    category: "Bags",
    image: "https://picsum.photos/500/300?random=9",
  },
  {
    title: "Running Shoes",
    description: "Comfortable lightweight running shoes.",
    price: 69.99,
    category: "Footwear",
    image: "https://picsum.photos/500/300?random=10",
  },
  {
    title: "Cotton T-Shirt",
    description: "Soft premium cotton t-shirt.",
    price: 14.99,
    category: "Clothing",
    image: "https://picsum.photos/500/300?random=11",
  },
  {
    title: "Denim Jeans",
    description: "Slim fit blue denim jeans.",
    price: 34.99,
    category: "Clothing",
    image: "https://picsum.photos/500/300?random=12",
  },
  {
    title: "Leather Wallet",
    description: "Genuine leather wallet with RFID protection.",
    price: 22.99,
    category: "Accessories",
    image: "https://picsum.photos/500/300?random=13",
  },
  {
    title: "Sunglasses",
    description: "UV protection polarized sunglasses.",
    price: 17.99,
    category: "Fashion",
    image: "https://picsum.photos/500/300?random=14",
  },
  {
    title: "Coffee Mug",
    description: "Ceramic mug for coffee and tea.",
    price: 9.99,
    category: "Kitchen",
    image: "https://picsum.photos/500/300?random=15",
  },
  {
    title: "Water Bottle",
    description: "Insulated stainless steel bottle.",
    price: 19.49,
    category: "Fitness",
    image: "https://picsum.photos/500/300?random=16",
  },
  {
    title: "Yoga Mat",
    description: "Anti-slip yoga mat for workouts.",
    price: 26.99,
    category: "Fitness",
    image: "https://picsum.photos/500/300?random=17",
  },
  {
    title: "Dumbbell Set",
    description: "Adjustable dumbbells for home gym.",
    price: 89.99,
    category: "Fitness",
    image: "https://picsum.photos/500/300?random=18",
  },
  {
    title: "Office Chair",
    description: "Ergonomic office chair with lumbar support.",
    price: 129.99,
    category: "Furniture",
    image: "https://picsum.photos/500/300?random=19",
  },
  {
    title: "Study Table",
    description: "Modern wooden study desk.",
    price: 159.99,
    category: "Furniture",
    image: "https://picsum.photos/500/300?random=20",
  },
  {
    title: "Bookshelf",
    description: "5-tier wooden bookshelf.",
    price: 119.99,
    category: "Furniture",
    image: "https://picsum.photos/500/300?random=21",
  },
  {
    title: "Air Fryer",
    description: "Healthy oil-free cooking appliance.",
    price: 99.99,
    category: "Kitchen",
    image: "https://picsum.photos/500/300?random=22",
  },
  {
    title: "Blender",
    description: "High-speed smoothie blender.",
    price: 54.99,
    category: "Kitchen",
    image: "https://picsum.photos/500/300?random=23",
  },
  {
    title: "Rice Cooker",
    description: "Automatic non-stick rice cooker.",
    price: 42.99,
    category: "Kitchen",
    image: "https://picsum.photos/500/300?random=24",
  },
  {
    title: "Vacuum Cleaner",
    description: "Powerful cordless vacuum cleaner.",
    price: 149.99,
    category: "Home Appliances",
    image: "https://picsum.photos/500/300?random=25",
  },
  {
    title: "Hair Dryer",
    description: "Professional fast-drying hair dryer.",
    price: 35.99,
    category: "Beauty",
    image: "https://picsum.photos/500/300?random=26",
  },
  {
    title: "Electric Trimmer",
    description: "Rechargeable beard trimmer.",
    price: 27.99,
    category: "Personal Care",
    image: "https://picsum.photos/500/300?random=27",
  },
  {
    title: "Perfume",
    description: "Long-lasting premium fragrance.",
    price: 49.49,
    category: "Beauty",
    image: "https://picsum.photos/500/300?random=28",
  },
  {
    title: "Face Wash",
    description: "Refreshing daily face cleanser.",
    price: 8.99,
    category: "Skincare",
    image: "https://picsum.photos/500/300?random=29",
  },
  {
    title: "Notebook",
    description: "Hardcover ruled notebook.",
    price: 6.99,
    category: "Stationery",
    image: "https://picsum.photos/500/300?random=30",
  },
  {
    title: "Ball Pen Set",
    description: "Smooth writing premium pens.",
    price: 5.99,
    category: "Stationery",
    image: "https://picsum.photos/500/300?random=31",
  },
  {
    title: "Monitor",
    description: "24-inch Full HD IPS monitor.",
    price: 179.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300?random=32",
  },
  {
    title: "External SSD",
    description: "1TB high-speed portable SSD.",
    price: 99.99,
    category: "Storage",
    image: "https://picsum.photos/500/300?random=33",
  },
  {
    title: "Webcam",
    description: "1080p HD webcam with microphone.",
    price: 45.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300?random=34",
  },
  {
    title: "Power Bank",
    description: "20000mAh fast charging power bank.",
    price: 34.99,
    category: "Accessories",
    image: "https://picsum.photos/500/300?random=35",
  },
  {
    title: "Phone Case",
    description: "Shockproof transparent phone case.",
    price: 12.99,
    category: "Mobile Accessories",
    image: "https://picsum.photos/500/300?random=36",
  },
  {
    title: "Wireless Charger",
    description: "15W fast wireless charging pad.",
    price: 21.99,
    category: "Mobile Accessories",
    image: "https://picsum.photos/500/300?random=37",
  },
  {
    title: "Tablet",
    description: "10-inch Android tablet with 128GB storage.",
    price: 249.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300?random=38",
  },
  {
    title: "Digital Camera",
    description: "Compact digital camera with 4K recording.",
    price: 399.99,
    category: "Photography",
    image: "https://picsum.photos/500/300?random=39",
  },
  {
    title: "Drone",
    description: "Mini drone with HD camera and GPS.",
    price: 499.99,
    category: "Gadgets",
    image: "https://picsum.photos/500/300?random=40",
  }
]
  const productsWithVectors = await Promise.all(products.map(async (product) => {
    const embedding = await generateVector(product.description);
    return { ...product, embedding };
  }));
    return Response.json({message: "Database seeded successfully"}, {status: 200});
}

/**
 * this route is used to seed the database with initial product data. It connects to the database, deletes any existing products, and then adds a predefined list of products. Each product's description is converted into a vector embedding using OpenAI's embeddings API before being saved to the database.
 */