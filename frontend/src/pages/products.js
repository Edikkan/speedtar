import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FiSearch, FiFilter, FiGrid, FiList, FiShoppingBag, FiStar, FiChevronDown } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Products() {
  const router = useRouter();
  const { search, category } = router.query;
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, category, filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 24,
        ...(search && { search }),
        ...(category && { category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      };
      
      const response = await axios.get(`${API_URL}/api/products`, { params });
      setProducts(response.data.products);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            {search ? `Search: "${search}"` : category ? 'Category Products' : 'All Products'}
          </h1>
          <p className="text-slate-600">
            {products.length} products found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <FiFilter className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-slate-900">Filters</h3>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                      !category ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                        category === cat.id ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-700 mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Sort By</h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <FiShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'product-grid' : 'space-y-4'}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      page === i + 1
                        ? 'bg-primary-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, viewMode }) {
  if (viewMode === 'list') {
    return (
      <Link href={`/product/${product.id}`} className="card flex gap-6 p-4 group">
        <div className="w-48 h-48 flex-shrink-0 rounded-xl bg-slate-100 overflow-hidden">
          {product.featuredImage ? (
            <img src={product.featuredImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiShoppingBag className="w-12 h-12 text-slate-300" />
            </div>
          )}
        </div>
        <div className="flex-1 py-2">
          <span className="category-badge mb-2">{product.category?.name || 'Product'}</span>
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-500 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-slate-900">${product.price}</span>
            {product.comparePrice && (
              <span className="text-lg text-slate-400 line-through">${product.comparePrice}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

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
        {product.isFeatured && <span className="badge-new">New</span>}
        {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
          <span className="badge-sale">
            {Math.round((1 - parseFloat(product.price) / parseFloat(product.comparePrice)) * 100)}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <span className="category-badge mb-2">{product.category?.name || 'Product'}</span>
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="price-tag">${product.price}</span>
          {product.comparePrice && <span className="price-tag-old">${product.comparePrice}</span>}
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
