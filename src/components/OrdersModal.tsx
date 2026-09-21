import React, { useEffect, useState } from 'react';
import { X, Package, Truck, ShoppingBag, Search, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductById?: (id: string) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchError, setSearchError] = useState('');

  const loadGuestOrders = async () => {
    setLoading(true);
    setSearchError('');
    try {
      // Get saved order IDs from localStorage
      const savedIdsRaw = localStorage.getItem('vinoz_order_history');
      const savedIds: string[] = savedIdsRaw ? JSON.parse(savedIdsRaw) : [];

      if (savedIds.length > 0) {
        const results = await Promise.all(
          savedIds.map(async (id) => {
            try {
              return await api.getOrderById(id);
            } catch {
              return null;
            }
          })
        );
        setOrders(results.filter((o): o is Order => o !== null));
      } else {
        // Show demo order for first-time preview if no orders placed yet
        try {
          const sample = await api.getOrderById('vnz-order-1');
          if (sample) setOrders([sample]);
        } catch {
          setOrders([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadGuestOrders();
    }
  }, [isOpen]);

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderId.trim()) return;
    setLoading(true);
    setSearchError('');
    try {
      const order = await api.getOrderById(searchOrderId.trim());
      // Prepend if not already in list
      setOrders((prev) => {
        const filtered = prev.filter((o) => o.id !== order.id);
        return [order, ...filtered];
      });
      setSearchOrderId('');
    } catch (err: any) {
      setSearchError('Order ID not found. Please check your order reference number.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-[#FAF8F5] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 z-10 my-6">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#68242A]" />
            <div>
              <h2 className="font-serif-editorial text-xl font-semibold text-stone-900">
                Track Guest Order
              </h2>
              <p className="text-[11px] text-stone-500">
                Lookup tracking numbers and shipment progress without needing an account
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order ID Lookup Search Bar */}
        <div className="p-4 bg-white/70 border-b border-stone-200">
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. vnz-order-1)..."
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg py-2 pl-9 pr-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#68242A]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#68242A] hover:bg-[#521c21] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shrink-0 disabled:opacity-50"
            >
              Lookup
            </button>
          </form>
          {searchError && (
            <p className="text-[11px] text-rose-600 mt-2 font-medium">{searchError}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              Fetching order status...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="font-serif-editorial text-base text-stone-700">No recent orders found</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Enter your Order ID above or place an order in the boutique to track shipment status.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-xs text-stone-900">
                      Order #{order.id}
                    </span>
                    <span className="text-[11px] text-stone-400 ml-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Processing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-12 object-cover rounded bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                        <p className="text-stone-500 text-[11px]">
                          Size: {item.size} • {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-stone-900">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery & Tracking */}
                {order.trackingNumber ? (
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-700" />
                      <span>Tracking Number: <strong>{order.trackingNumber}</strong></span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase">In Transit</span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-stone-50 border border-stone-100 rounded-lg text-xs text-stone-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Preparing for dispatch • Tracking number will update shortly</span>
                  </div>
                )}

                {/* Footer Breakdown */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-stone-500">
                    Recipient: {order.customer.fullName} ({order.customer.city})
                  </span>
                  <span className="font-bold text-stone-950 text-sm">
                    Total: ${order.total.toFixed(2)} USD
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
