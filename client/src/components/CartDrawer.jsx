import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-cream shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-bran-brown/10">
              <h2 className="text-xl font-bold text-bran-brown">Your Plate Stack</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="text-bran-brown" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-bran-brown/60">Your plate stack is... empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center border-b border-bran-brown/10 pb-4">
                    <div className="w-16 h-16 bg-wheat-gold/20 rounded-xl flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-bran-brown text-sm">{item.name}</p>
                      <p className="text-bran-brown/60 text-xs">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border border-bran-brown/20 rounded-full"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-bran-brown/20 rounded-full"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="text-bran-brown/40 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-bran-brown/10">
                <div className="flex justify-between mb-4 font-semibold text-bran-brown">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full bg-bran-brown text-white py-3 rounded-full font-semibold hover:brightness-110 transition"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
