import { useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 glass shadow-lg shadow-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-secondary-600 bg-clip-text text-transparent">
              Speedtar
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-full border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/products" className="px-4 py-2 text-slate-600 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all">
              Products
            </Link>
            <Link href="/categories" className="px-4 py-2 text-slate-600 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all">
              Categories
            </Link>
            <Link href="/deals" className="px-4 py-2 text-accent-600 hover:text-accent-700 font-medium rounded-lg hover:bg-accent-50 transition-all">
              Deals
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link 
              href="/cart" 
              className="relative p-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
            >
              <FiShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-danger-500 to-danger-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link 
              href="/wishlist" 
              className="hidden sm:flex p-2.5 text-slate-600 hover:text-danger-500 hover:bg-danger-50 rounded-xl transition-all"
            >
              <FiHeart className="w-6 h-6" />
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block font-medium">{user.firstName}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 min-w-[180px]">
                    <Link href="/profile" className="block px-4 py-2 text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-2 border-slate-100" />
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-danger-600 hover:bg-danger-50 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/login"
                className="btn-primary text-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
            </form>
            <nav className="flex flex-col gap-2">
              <Link href="/products" className="px-4 py-3 text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl font-medium transition-all">
                Products
              </Link>
              <Link href="/categories" className="px-4 py-3 text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl font-medium transition-all">
                Categories
              </Link>
              <Link href="/deals" className="px-4 py-3 text-accent-600 hover:bg-accent-50 rounded-xl font-medium transition-all">
                Deals
              </Link>
              <Link href="/cart" className="px-4 py-3 text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl font-medium transition-all">
                Cart ({cartItemCount})
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
