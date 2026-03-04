import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden product-card">
      {/* Image container */}
      <Link href={`/product/${product.slug || product.id}`} className="relative block aspect-square overflow-hidden bg-secondary-100">
        <Image
          src={product.featuredImage || product.images?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        
        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-2 bg-white text-secondary-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
            <button className="p-2 bg-white rounded-lg text-secondary-600 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/product/${product.slug || product.id}`}>
          <h3 className="text-lg font-semibold text-secondary-900 mt-1 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-secondary-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-secondary-500 ml-2">({product.reviewCount || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-secondary-400 line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock status */}
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-sm text-orange-500 mt-2">Only {product.stock} left in stock</p>
        )}
        {product.stock === 0 && (
          <p className="text-sm text-red-500 mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
}
