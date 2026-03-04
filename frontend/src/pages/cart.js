import { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../contexts/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.product?.price || 0) * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <FiShoppingBag className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Looks like you haven't added anything yet</p>
          <Link href="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <span className="text-slate-600">{items.length} items</span>
                <button
                  onClick={clearCart}
                  className="text-danger-600 hover:text-danger-700 flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6">
                    <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-slate-100 overflow-hidden">
                      {item.product?.featuredImage ? (
                        <img
                          src={item.product.featuredImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiShoppingBag className="w-8 h-8 text-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/product/${item.productId}`}
                        className="font-semibold text-slate-900 hover:text-primary-600 transition-colors"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-slate-500 text-sm mt-1">
                        {item.product?.category?.name}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-900">
                            ${(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-slate-400 hover:text-danger-500 transition-colors"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/products" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mt-6">
              <FiArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full btn-primary py-4">
                Proceed to Checkout
              </button>

              {shipping > 0 && (
                <p className="text-sm text-slate-500 text-center mt-4">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
