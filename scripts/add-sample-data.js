const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sampleProducts = [
  {
    name: "Men's Classic T-Shirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear. Available in multiple colors and sizes.",
    price: 29.99,
    original_price: 39.99,
    category: "mens",
    subcategory_id: "660e8400-e29b-41d4-a716-446655440001",
    sku: "MENS-TS-001",
    stock_quantity: 50,
    brand: "MHCloth",
    status: "active",
    is_featured: true,
    is_on_sale: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy", "Gray"],
    tags: ["casual", "cotton", "comfortable"],
    image_urls: ["/placeholder-image.svg"]
  },
  {
    name: "Women's Elegant Blouse",
    description: "Elegant blouse perfect for office wear or casual outings. Made from premium fabric.",
    price: 49.99,
    original_price: 59.99,
    category: "womens",
    subcategory_id: "660e8400-e29b-41d4-a716-446655440007",
    sku: "WOMENS-BL-001",
    stock_quantity: 30,
    brand: "MHCloth",
    status: "active",
    is_featured: true,
    is_on_sale: true,
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Pink", "Light Blue"],
    tags: ["elegant", "office", "premium"],
    image_urls: ["/placeholder-image.svg"]
  },
  {
    name: "Kids' Comfortable Hoodie",
    description: "Warm and comfortable hoodie for kids. Perfect for cold weather.",
    price: 34.99,
    original_price: 44.99,
    category: "kids",
    subcategory_id: "660e8400-e29b-41d4-a716-446655440013",
    sku: "KIDS-HD-001",
    stock_quantity: 25,
    brand: "MHCloth",
    status: "active",
    is_featured: false,
    is_on_sale: true,
    sizes: ["2T", "3T", "4T", "5T"],
    colors: ["Red", "Blue", "Green"],
    tags: ["warm", "comfortable", "kids"],
    image_urls: ["/placeholder-image.svg"]
  },
  {
    name: "Men's Formal Shirt",
    description: "Professional formal shirt suitable for business meetings and formal occasions.",
    price: 69.99,
    original_price: 79.99,
    category: "mens",
    subcategory_id: "660e8400-e29b-41d4-a716-446655440002",
    sku: "MENS-FS-001",
    stock_quantity: 20,
    brand: "MHCloth",
    status: "active",
    is_featured: false,
    is_on_sale: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink"],
    tags: ["formal", "business", "professional"],
    image_urls: ["/placeholder-image.svg"]
  },
  {
    name: "Women's Summer Dress",
    description: "Beautiful summer dress perfect for warm weather and casual outings.",
    price: 54.99,
    original_price: 64.99,
    category: "womens",
    subcategory_id: "660e8400-e29b-41d4-a716-446655440008",
    sku: "WOMENS-SD-001",
    stock_quantity: 15,
    brand: "MHCloth",
    status: "active",
    is_featured: true,
    is_on_sale: true,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral", "Blue", "Yellow"],
    tags: ["summer", "casual", "beautiful"],
    image_urls: ["/placeholder-image.svg"]
  },
  {
    name: "Men's Denim Jeans",
    description: "Classic denim jeans with perfect fit and comfort. Available in various washes.",
    price: 79.99,
    original_price: 89.99,
    category: "mens",
    subcategory_id: "660e8400-e29b-41d4-a716-446655440004",
    sku: "MENS-DJ-001",
    stock_quantity: 35,
    brand: "MHCloth",
    status: "active",
    is_featured: false,
    is_on_sale: true,
    sizes: ["30x32", "32x32", "34x32", "36x32"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    tags: ["denim", "classic", "comfortable"],
    image_urls: ["/placeholder-image.svg"]
  },
  {
    name: "Women's Casual Pants",
    description: "Comfortable casual pants perfect for everyday wear and office use.",
    price: 44.99,
    original_price: 54.99,
    category: "womens",
    subcategory_id: "660e8400-e29b-41d4-a716-446655440009",
    sku: "WOMENS-CP-001",
    stock_quantity: 28,
    brand: "MHCloth",
    status: "active",
    is_featured: false,
    is_on_sale: true,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Khaki"],
    tags: ["casual", "comfortable", "office"],
    image_urls: ["/placeholder-image.svg"]
  },
  {
    name: "Kids' Fun T-Shirt",
    description: "Colorful and fun t-shirt for kids with cute designs and comfortable fabric.",
    price: 19.99,
    original_price: 24.99,
    category: "kids",
    subcategory_id: "660e8400-e29b-41d4-a716-446655440014",
    sku: "KIDS-FT-001",
    stock_quantity: 40,
    brand: "MHCloth",
    status: "active",
    is_featured: true,
    is_on_sale: true,
    sizes: ["2T", "3T", "4T", "5T", "6T"],
    colors: ["Red", "Blue", "Green", "Yellow"],
    tags: ["fun", "colorful", "kids"],
    image_urls: ["/placeholder-image.svg"]
  }
];

async function addSampleData() {
  console.log('🚀 Adding sample product data...');
  
  try {
    // First check if products table exists
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Products table does not exist. Please run the database setup first.');
      console.log('💡 Run: node scripts/apply-schema.js for instructions');
      return;
    }
    
    // Check if there are already products
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error checking existing products:', countError.message);
      return;
    }
    
    if (count > 0) {
      console.log(`⚠️  Found ${count} existing products. Skipping sample data insertion.`);
      console.log('💡 If you want to add sample data, please clear the products table first.');
      return;
    }
    
    console.log('📝 Inserting sample products...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of sampleProducts) {
      try {
        const { error } = await supabase
          .from('products')
          .insert(product);
        
        if (error) {
          console.error(`❌ Error inserting ${product.name}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Added: ${product.name}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error inserting ${product.name}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Sample data insertion completed:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Sample products added successfully!');
      console.log('🚀 Your application should now display products.');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

addSampleData().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
});
