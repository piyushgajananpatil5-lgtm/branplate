import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <h1 className="text-4xl font-display font-bold text-bran-brown mb-10">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-bran-brown/60">
          Your plate stack is empty. <Link to="/shop" className="text-leaf-green underline">Go shop.</Link>
        </p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center gap-4 border-b border-bran-brown/10 pb-6">
              <div className="w-20 h-20 bg-wheat-gold/20 rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-bran-brown">{item.name}</p>
                <p className="text-bran-brown/60 text-sm">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 border rounded-full">−</button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 border rounded-full">+</button>
              </div>
              <p className="w-20 text-right font-semibold text-bran-brown">₹{item.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm">Remove</button>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <span className="text-xl font-semibold text-bran-brown">Subtotal: ₹{subtotal}</span>
            <Link to="/checkout" className="bg-bran-brown text-cream px-8 py-3 rounded-full font-semibold hover:brightness-110 transition">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
