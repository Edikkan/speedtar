import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { CartContext } from '../../contexts/CartContext';
import { FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw, FiStar, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(response.data);
      
      // Fetch related products
      const related = await axios.get(`${API_URL}/api/products?category=${response.data.categoryId}&limit=4`);
      setRelatedProducts(related.data.products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Product not found</h2>
          <Link href="/products" className="text-primary-600 hover:text-primary-700">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.featuredImage];
  const discount = product.comparePrice 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.comparePrice)) * 100)
    : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-slate-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden mb-4">
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-slate-400">No image</span>
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-danger-500 text-white font-bold px-4 py-2 rounded-xl">
                  {discount}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="category-badge mb-4">{product.category?.name || 'Product'}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-warning-400 text-warning-400" />
                ))}
              </div>
              <span className="text-slate-500">(128 reviews)</span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-slate-900">${product.price}</span>
              {product.comparePrice && (
                <span className="text-2xl text-slate-400 line-through">${product.comparePrice}</span>
              )}
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-medium text-slate-700">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-slate-500">
                {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.inventory === 0}
                className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="p-4 rounded-xl border border-slate-200 text-slate-600 hover:text-danger-500 hover:border-danger-500 hover:bg-danger-50 transition-all">
                <FiHeart className="w-6 h-6" />
              </button>
              <button className="p-4 rounded-xl border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-600 hover:bg-primary-50 transition-all">
                <FiShare2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 rounded-xl">
              <div className="text-center">
                <FiTruck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <span className="text-sm text-slate-600">Free Shipping</span>
              </div>
              <div className="text-center">
                <FiShield className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <span className="text-sm text-slate-600">Secure Payment</span>
              </div>
              <div className="text-center">
                <FiRefreshCw className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <span className="text-sm text-slate-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">You May Also Like</h2>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} className="card group">
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {p.featuredImage ? (
                      <img src={p.featuredImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{p.name}</h3>
                    <span className="text-lg font-bold text-slate-900">${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
