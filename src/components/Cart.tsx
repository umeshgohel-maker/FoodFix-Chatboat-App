import { CartItem, Theme } from '../types';
import { X, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

interface CartProps {
  cartItems: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
  theme: Theme;
}

export default function Cart({ cartItems, onRemoveFromCart, onCheckout, theme }: CartProps) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-y-0 right-0 w-full sm:w-105 shadow-2xl p-8 z-50 overflow-y-auto border-l ${theme.border} ${theme.cardBg} flex flex-col justify-between`}
    >
      <div>
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-100/15">
          <h2 className={`text-2xl font-medium flex items-center gap-2.5 tracking-tight ${theme.textPrimary} ${theme.fontClass}`}>
            <ShoppingBag className="opacity-90" size={22} />
            <span>Your Order</span>
          </h2>
          <button
            onClick={onCheckout}
            className={`p-1.5 rounded-full hover:bg-zinc-500/10 transition-colors ${theme.textSecondary} cursor-pointer`}
          >
            <X size={22} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <span className="text-3xl block">🏺</span>
            <p className={`text-sm ${theme.textSecondary} font-light tracking-wide`}>
              Your custom order is currently empty.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`flex justify-between items-center p-5 rounded-2xl border ${theme.border} bg-black/5 dark:bg-white/5`}
              >
                <div className="space-y-1">
                  <p className={`font-semibold text-sm ${theme.textPrimary} ${theme.fontClass}`}>{item.name}</p>
                  <p className={`text-xs ${theme.textSecondary} ${theme.metaFontClass}`}>
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-xs tracking-widest uppercase text-red-500 hover:text-red-600 hover:underline transition-all cursor-pointer font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className={`mt-8 border-t ${theme.border} pt-6 space-y-6`}>
          <div className="flex justify-between items-baseline">
            <span className={`text-sm uppercase tracking-widest ${theme.textSecondary} ${theme.metaFontClass}`}>
              Subtotal
            </span>
            <span className={`text-2xl font-medium tracking-tight ${theme.textPrimary} ${theme.metaFontClass}`}>
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={onCheckout}
            className={`w-full py-4.5 rounded-xl text-center text-xs uppercase tracking-widest font-semibold border ${theme.border} ${theme.buttonBg} ${theme.buttonText} ${theme.buttonHover} shadow-md transition-all active:scale-[0.98] cursor-pointer`}
          >
            Complete Order
          </button>
        </div>
      )}
    </motion.div>
  );
}
