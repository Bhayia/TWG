import React, { useState } from 'react';
import { ProductItem } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StoreSectionProps {
  products: ProductItem[];
}

export const StoreSection: React.FC<StoreSectionProps> = ({ products }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Rudraksha', 'Perfumes', 'Incense'];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="store" className="relative py-28 bg-[#151210] border-t border-[#4A2819]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8C281C]/20 border border-[#8C281C]/40 text-xs font-cinzel font-semibold tracking-[0.25em] uppercase text-[#D9B47A] mb-3">
            <ShoppingBag className="w-3.5 h-3.5 text-[#C98224]" />
            Sacred Store
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#F6EBD4]">
            OBJECTS WITH <span className="text-[#C98224]">A STORY</span>
          </h2>

          <p className="mt-4 font-serif-cormorant italic text-lg sm:text-2xl text-[#D9B47A]">
            Carry a sacred token of the journey with you. Authenticated Himalayan Rudrakshas, pure botanical temple attars, and organic herbal incense.
          </p>

          {/* Category Filter */}
          <div className="mt-8 inline-flex p-1.5 rounded-full bg-[#181513] border border-[#4A2819]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#C98224] text-[#12100E] shadow-md'
                    : 'text-[#D9B47A]/70 hover:text-[#F6EBD4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-[#181513] border border-[#4A2819] overflow-hidden hover:border-[#C98224] transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-64 w-full bg-[#12100E] overflow-hidden">
                  <img
                    src={p.images[0] || '/src/assets/images/twg_rudraksha_store_1790837678024.jpg'}
                    alt={p.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#12100E]/80 backdrop-blur-md text-[#D9B47A] text-[10px] font-cinzel uppercase tracking-wider border border-[#4A2819]">
                    {p.category}
                  </div>
                  {p.featured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#8C281C] text-[#F6EBD4] text-[10px] font-cinzel font-bold uppercase tracking-wider">
                      Energized
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <h3 className="font-cinzel text-base font-bold text-[#F6EBD4] group-hover:text-[#D9B47A] transition-colors leading-snug line-clamp-1">
                    {p.name}
                  </h3>

                  <p className="text-xs text-[#F6EBD4]/70 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-cinzel font-bold text-[#F6EBD4]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {p.originalPrice && (
                      <span className="text-xs line-through text-[#F6EBD4]/40">
                        ₹{p.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => addToCart(p, 1)}
                  className="w-full py-2.5 rounded-xl bg-[#4A2819]/50 hover:bg-gradient-to-r hover:from-[#C98224] hover:to-[#8C281C] text-[#D9B47A] hover:text-[#F6EBD4] border border-[#4A2819] hover:border-transparent font-cinzel text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
