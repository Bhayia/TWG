import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { OrderRecord } from '../types';
import confetti from 'canvas-confetti';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
    showToast,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Background scroll lock and escape listener
  React.useEffect(() => {
    if (!isCartOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !shippingAddress) {
      showToast('Please complete name, email, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData: Omit<OrderRecord, 'id'> = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        items: cart.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        totalAmount: cartTotal,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setConfirmedOrderId(docRef.id);
      setCheckoutStep('success');
      clearCart();

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#C98224', '#8C281C', '#D9B47A'],
        });
      } catch {}

      showToast('Your sacred order has been placed!');
    } catch (err) {
      console.error('Error placing order in Firestore:', err);
      showToast('Could not complete order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setCheckoutStep('cart');
    setConfirmedOrderId(null);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#181513] border-l border-[#4A2819] h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C98224]" />
            <h3 className="font-cinzel text-lg font-bold text-[#F6EBD4] uppercase tracking-wider">
              {checkoutStep === 'cart'
                ? 'Your Sacred Collection'
                : checkoutStep === 'checkout'
                ? 'Shipping & Contact'
                : 'Order Confirmed'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-[#F6EBD4]/70 hover:text-white hover:bg-[#4A2819]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 py-4 overflow-y-auto">
          {checkoutStep === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-[#4A2819] mx-auto" />
                  <p className="font-cinzel text-sm text-[#D9B47A]">Your collection is empty</p>
                  <p className="text-xs text-[#F6EBD4]/60">Explore our sacred Rudraksha and temple perfumes.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-2xl bg-[#12100E] border border-[#4A2819] flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.product.images[0] || '/src/assets/images/twg_rudraksha_store_1790837678024.jpg'}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#4A2819]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-cinzel text-xs font-bold text-[#F6EBD4] truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-xs text-[#C98224] font-semibold mt-0.5">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded bg-[#181513] text-[#D9B47A] hover:bg-[#4A2819]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded bg-[#181513] text-[#D9B47A] hover:bg-[#4A2819]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <form id="checkout-form" onSubmit={handleOrderSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name for delivery"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-xs focus:outline-none focus:border-[#C98224]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Order confirmation email"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-xs focus:outline-none focus:border-[#C98224]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="For courier delivery tracking"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-xs focus:outline-none focus:border-[#C98224]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">
                  Complete Shipping Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House/Flat number, Street, Landmark, City, State, PIN code"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-xs focus:outline-none focus:border-[#C98224]"
                />
              </div>
            </form>
          )}

          {checkoutStep === 'success' && (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-[#C98224] mx-auto animate-bounce" />
              <h4 className="font-cinzel text-xl font-bold uppercase text-[#F6EBD4]">
                Sacred Order Received
              </h4>
              <p className="text-xs text-[#F6EBD4]/75 font-sans leading-relaxed">
                Thank you. Your order ref is{' '}
                <span className="font-mono text-[#D9B47A] font-bold">{confirmedOrderId}</span>.
                Our Athirappilly sanctuary team will energize and carefully dispatch your sacred parcel.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Total & Buttons */}
        <div className="pt-4 border-t border-[#4A2819] space-y-3">
          {checkoutStep !== 'success' && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-cinzel text-[#D9B47A]">Sacred Total:</span>
              <span className="font-cinzel text-xl font-bold text-[#F6EBD4]">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {checkoutStep === 'cart' && cart.length > 0 && (
            <button
              onClick={() => setCheckoutStep('checkout')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Proceed to Delivery <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {checkoutStep === 'checkout' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="py-2.5 px-4 rounded-xl border border-[#4A2819] text-xs font-cinzel text-[#D9B47A]"
              >
                Back
              </button>
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Order...' : 'Confirm Sacred Purchase'}
              </button>
            </div>
          )}

          {checkoutStep === 'success' && (
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-[#4A2819] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider"
            >
              Continue Exploring
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
