/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShoppingCart, Compass, HelpCircle, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DishCard from './components/DishCard';
import Cart from './components/Cart';
import Chatbot from './components/Chatbot';
import { Dish, CartItem, Theme } from './types';

// The premium boutique culinary collection
const DISHES: Dish[] = [
  {
    id: '1',
    name: 'Truffle Wagyu Burger',
    price: 24.50,
    description: 'Artisanal pan-seared Wagyu beef patty, French black truffle aioli, aged reserve gruyère, on a toasted artisan cloud brioche bun.'
  },
  {
    id: '2',
    name: 'Heirloom Margherita Flatbread',
    price: 19.00,
    description: 'Slow-roasted San Marzano heirloom tomatoes, fresh hand-pulled buffalo mozzarella, organic micro-basil, first-press estate olive oil.'
  },
  {
    id: '3',
    name: 'Smoked Little Gem Caesar',
    price: 16.50,
    description: 'Crisp hand-harvested little gem lettuce, pecan-wood hot-smoked sourdough croutons, 24-month aged Parmigiano-Reggiano, Caesar emulsion.'
  },
  {
    id: '4',
    name: 'Gianduja Chocolate Tart',
    price: 14.00,
    description: 'Decadent Piedmont hazelnut chocolate ganache, Brittany sea salt, edible gold leaf, soft vanilla bean crème.'
  },
  {
    id: '5',
    name: 'Cold-Pressed Lavender Lemonade',
    price: 8.00,
    description: 'Fresh organic Meyer lemons, organic lavender blossom raw honey, lightly infused sparkling spring water.'
  }
];

// Curated designer themes focusing on Minimalist Monochrome (Premium Boutique)
const THEMES: Theme[] = [
  {
    id: 'atelier-paper',
    name: 'Atelier Paper',
    emoji: '▫️',
    bg: 'bg-[#F7F7F7]',
    headerBg: 'bg-white/95 border-[#E4E4E7]',
    cardBg: 'bg-white hover:border-zinc-900',
    textPrimary: 'text-[#121212]',
    textSecondary: 'text-[#71717A]',
    border: 'border-[#E4E4E7]',
    buttonBg: 'bg-[#121212]',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-[#27272A]',
    badgeBg: 'bg-[#121212]',
    badgeText: 'text-white',
    fontClass: 'font-serif',
    metaFontClass: 'font-sans',
  },
  {
    id: 'onyx-luxe',
    name: 'Onyx Luxe',
    emoji: '🖤',
    bg: 'bg-[#0A0A0A]',
    headerBg: 'bg-[#121212]/95 border-[#1F1F1F]',
    cardBg: 'bg-[#121212] hover:border-zinc-300',
    textPrimary: 'text-[#FAFAFA]',
    textSecondary: 'text-[#8E8E93]',
    border: 'border-[#1F1F1F]',
    buttonBg: 'bg-[#FAFAFA]',
    buttonText: 'text-[#0A0A0A]',
    buttonHover: 'hover:bg-[#E4E4E7]',
    badgeBg: 'bg-[#FAFAFA]',
    badgeText: 'text-[#0A0A0A]',
    fontClass: 'font-serif',
    metaFontClass: 'font-mono',
  },
  {
    id: 'ivory-cream',
    name: 'Ivory Cream',
    emoji: '🏺',
    bg: 'bg-[#FAF7F2]',
    headerBg: 'bg-[#FCFAF7]/95 border-[#ECE7DC]',
    cardBg: 'bg-[#FCFAF7] hover:border-zinc-850',
    textPrimary: 'text-[#242424]',
    textSecondary: 'text-[#877F70]',
    border: 'border-[#ECE7DC]',
    buttonBg: 'bg-[#242424]',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-zinc-805',
    badgeBg: 'bg-[#877F70]',
    badgeText: 'text-white',
    fontClass: 'font-serif',
    metaFontClass: 'font-serif',
  },
  {
    id: 'studio-tech',
    name: 'Studio Tech',
    emoji: '📐',
    bg: 'bg-white',
    headerBg: 'bg-white/95 border-black',
    cardBg: 'bg-white hover:bg-zinc-50 border-black',
    textPrimary: 'text-black',
    textSecondary: 'text-zinc-600',
    border: 'border-black',
    buttonBg: 'bg-black',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-zinc-800',
    badgeBg: 'bg-black',
    badgeText: 'text-white',
    fontClass: 'font-mono',
    metaFontClass: 'font-mono',
  },
  {
    id: 'classic-orange',
    name: 'Classic Delivery',
    emoji: '🍔',
    bg: 'bg-zinc-50',
    headerBg: 'bg-white border-zinc-100',
    cardBg: 'bg-white hover:border-orange-500',
    textPrimary: 'text-zinc-900',
    textSecondary: 'text-zinc-500',
    border: 'border-zinc-200',
    buttonBg: 'bg-orange-600',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-orange-500',
    badgeBg: 'bg-orange-600',
    badgeText: 'text-white',
    fontClass: 'font-sans',
    metaFontClass: 'font-sans',
  }
];

export default function App() {
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (dish: Dish) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen ${activeTheme.bg} transition-colors duration-500 px-4 py-8 sm:px-8 font-sans`}>
      {/* Dynamic Header */}
      <header className={`max-w-5xl mx-auto h-22 rounded-3xl px-6 sm:px-10 border shadow-sm backdrop-blur-md flex justify-between items-center transition-all duration-500 sticky top-4 z-40 ${activeTheme.headerBg}`}>
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${activeTheme.buttonBg} animate-pulse`} />
          <h1 className={`text-xl sm:text-2xl font-semibold uppercase tracking-widest transition-all duration-550 ${activeTheme.textPrimary} ${activeTheme.fontClass}`}>
            Food Fix<span className="opacity-40">.</span>
          </h1>
        </div>

        {/* Action Elements */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className={`p-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 relative border ${activeTheme.border} ${activeTheme.textPrimary} bg-transparent cursor-pointer`}
          >
            <ShoppingCart size={20} />
            <AnimatePresence>
              {cartTotalCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={`absolute -top-1.5 -right-1.5 ${activeTheme.badgeBg} ${activeTheme.badgeText} text-[9px] font-bold rounded-full h-5.5 w-5.5 flex items-center justify-center shadow-md ${activeTheme.metaFontClass}`}
                >
                  {cartTotalCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Vibe Selection Panel */}
      <section className="max-w-5xl mx-auto mt-10 mb-8 p-6 rounded-3xl border border-dashed border-zinc-400/20 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className={`flex items-center gap-2 text-xs uppercase tracking-widest font-semibold ${activeTheme.textSecondary} ${activeTheme.metaFontClass}`}>
            <Compass size={14} className="opacity-80" />
            <span>Vibe Curator</span>
          </div>
          <p className={`text-xs ${activeTheme.textSecondary} font-light`}>
            Select a custom sensory mood to transform the catalog interface dynamically.
          </p>
        </div>

        {/* Dynamic Theme Switching Pills */}
        <div className="flex flex-wrap gap-2.5">
          {THEMES.map((theme) => {
            const isSelected = activeTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-350 flex items-center gap-2 relative overflow-hidden active:scale-95 ${
                  isSelected
                    ? `${activeTheme.buttonBg} ${activeTheme.buttonText} border ${activeTheme.border} shadow-sm`
                    : `bg-transparent ${activeTheme.textPrimary} border ${activeTheme.border} hover:opacity-80`
                }`}
              >
                <span>{theme.emoji}</span>
                <span className={activeTheme.metaFontClass}>{theme.name}</span>
                {isSelected && (
                  <motion.span
                    layoutId="activeThemeDot"
                    className="h-1 w-1 rounded-full bg-current"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Curated Catalog Items */}
      <main className="max-w-5xl mx-auto space-y-6 pb-24">
        <div className="py-4 border-b border-zinc-400/10 flex justify-between items-baseline">
          <p className={`text-xs uppercase tracking-widest ${activeTheme.textSecondary} ${activeTheme.metaFontClass}`}>
            Curated Plates / Spring Edition
          </p>
          <p className={`text-[10px] tracking-wide ${activeTheme.textSecondary} opacity-40 ${activeTheme.metaFontClass}`}>
            [{DISHES.length}] Available Selections
          </p>
        </div>

        <div className="space-y-6">
          {DISHES.map((dish, idx) => (
            <DishCard
              key={dish.id}
              dish={dish}
              index={idx}
              onAddToCart={addToCart}
              theme={activeTheme}
            />
          ))}
        </div>
      </main>

      {/* Cart Sidebar drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <Cart
            cartItems={cartItems}
            onRemoveFromCart={removeFromCart}
            onCheckout={() => setIsCartOpen(false)}
            theme={activeTheme}
          />
        )}
      </AnimatePresence>

      {/* Support chat module mapping to active theme */}
      <Chatbot theme={activeTheme} />
    </div>
  );
}

