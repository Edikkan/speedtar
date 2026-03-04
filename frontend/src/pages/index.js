import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiHeadphones, FiStar } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/featured`);
      setFeaturedProducts(response.data.slice(0, 8));
    } catch (error) {
      console.error('Failed to fetch featured products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
              Over 5,000 products available
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Products Today
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Shop from our vast collection of quality products. From electronics to groceries, 
              we have everything you need at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary text-lg px-8 py-4">
                Shop Now
                <FiArrowRight className="inline ml-2" />
              </Link>
              <Link href="/categories" className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: FiHeadphones, title: '24/7 Support', desc: 'Always here to help' },
              { icon: FiShoppingBag, title: 'Easy Returns', desc: '30-day return policy' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Shop by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Explore our wide range of categories and find exactly what you are looking for
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group card p-6 text-center hover:border-primary-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiShoppingBag className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Featured <span className="gradient-text">Products</span>
              </h2>
              <p className="text-slate-600">
                Handpicked products just for you
              </p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-primary-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative py-16 px-8 lg:px-16 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Join Our Newsletter
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Subscribe to get exclusive deals, new arrivals, and special offers directly to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-2 focus:ring-white/50"
                />
                <button type="submit" className="px-8 py-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} className="card group">
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {product.featuredImage ? (
          <img
            src={product.featuredImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <FiShoppingBag className="w-16 h-16 text-slate-300" />
          </div>
        )}
        {product.isFeatured && (
          <span className="badge-new">New</span>
        )}
        {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
          <span className="badge-sale">
            {Math.round((1 - parseFloat(product.price) / parseFloat(product.comparePrice)) * 100)}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <span className="category-badge mb-2">
          {product.category?.name || 'Product'}
        </span>
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="price-tag">${product.price}</span>
          {product.comparePrice && (
            <span className="price-tag-old">${product.comparePrice}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} className="w-4 h-4 fill-warning-400 text-warning-400" />
          ))}
          <span className="text-sm text-slate-500 ml-1">(4.8)</span>
        </div>
      </div>
    </Link>
  );
}
