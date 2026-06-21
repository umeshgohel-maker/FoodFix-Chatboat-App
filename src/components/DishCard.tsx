import { Dish, Theme } from '../types';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface DishCardProps {
  key?: string | number;
  dish: Dish;
  index: number;
  onAddToCart: (dish: Dish) => void;
  theme: Theme;
}

export default function DishCard({ dish, index, onAddToCart, theme }: DishCardProps) {
  const numberStr = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`p-8 rounded-3xl border ${theme.border} ${theme.cardBg} flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300 relative overflow-hidden group`}
    >
      {/* Decorative vertical boutique thread on hover */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-350 scale-y-0 group-hover:scale-y-100 ${theme.buttonBg}`} />

      <div className="flex items-start gap-5">
        {/* Gallery-style item numbering */}
        <span className={`text-xs ${theme.textSecondary} ${theme.metaFontClass} tracking-widest pt-1 flex items-center gap-1.5`}>
          <span>[{numberStr}]</span>
        </span>

        <div className="space-y-1.5 max-w-lg">
          <h3 className={`text-xl font-medium tracking-tight ${theme.textPrimary} ${theme.fontClass}`}>
            {dish.name}
          </h3>
          <p className={`text-sm leading-relaxed ${theme.textSecondary} font-sans font-light`}>
            {dish.description}
          </p>
          <div className="pt-2 flex items-center gap-3">
            <span className={`text-lg font-semibold tracking-tight ${theme.textPrimary} ${theme.metaFontClass}`}>
              ${dish.price.toFixed(2)}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${theme.textSecondary} opacity-30`} />
            <span className={`text-[10px] uppercase tracking-widest ${theme.textSecondary} ${theme.metaFontClass}`}>
              Local Organics
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onAddToCart(dish)}
        className={`sm:self-center self-start flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm border ${theme.border} ${theme.buttonBg} ${theme.buttonText} ${theme.buttonHover} shadow-sm cursor-pointer transition-all active:scale-95`}
      >
        <Plus size={16} />
        <span className={theme.metaFontClass}>Add to Order</span>
      </button>
    </motion.div>
  );
}
