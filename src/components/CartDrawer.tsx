import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  isLoading?: boolean;
}

function getLinePrice(item: any): number {
  const lineTotal = parseFloat(item.cost?.totalAmount?.amount ?? '');
  if (!Number.isNaN(lineTotal) && lineTotal > 0) return lineTotal;

  const unitPrice = parseFloat(
    item.cost?.amountPerQuantity?.amount ?? item.merchandise?.price?.amount ?? '0'
  );
  return unitPrice * (item.quantity || 1);
}

function getUnitPrice(item: any): number {
  const perQty = parseFloat(item.cost?.amountPerQuantity?.amount ?? '');
  if (!Number.isNaN(perQty) && perQty > 0) return perQty;
  return parseFloat(item.merchandise?.price?.amount ?? '0');
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  isLoading = false,
}: CartDrawerProps) {
  const items = (cart?.lines?.edges || []).filter(
    ({ node }: { node: { quantity: number } }) => node.quantity > 0
  );

  const itemCount = items.reduce(
    (sum: number, { node }: { node: { quantity: number } }) => sum + node.quantity,
    0
  );

  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount ?? '');
  const displaySubtotal = !Number.isNaN(subtotal) && subtotal > 0
    ? subtotal
    : items.reduce((sum: number, { node }: { node: any }) => sum + getLinePrice(node), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-black" />
                <h2 className="text-2xl font-display text-black">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-sm font-bold underline underline-offset-4 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map(({ node: item }: any) => {
                  const productTitle =
                    item.merchandise?.product?.title || item.merchandise?.title || 'Product';
                  const image = item.merchandise?.image?.url;
                  const unitPrice = getUnitPrice(item);
                  const linePrice = getLinePrice(item);
                  const qty = item.quantity;

                  return (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                        {image ? (
                          <img
                            src={image}
                            alt={productTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <h3 className="font-display text-lg text-black">{productTitle}</h3>
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => onRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">
                          ${linePrice.toFixed(2)}
                          {qty > 1 && (
                            <span className="text-gray-400 ml-1">
                              (${unitPrice.toFixed(2)} each)
                            </span>
                          )}
                        </p>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-full px-2 py-1 gap-4">
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                qty <= 1
                                  ? onRemoveItem(item.id)
                                  : onUpdateQuantity(item.id, qty - 1)
                              }
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold min-w-[20px] text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => onUpdateQuantity(item.id, qty + 1)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t bg-gray-50 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-display text-2xl">${displaySubtotal.toFixed(2)}</span>
                </div>
                <p className="text-gray-400 text-xs">
                  Shipping and taxes calculated at checkout.
                </p>
                <a
                  href={cart?.checkoutUrl}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg block text-center"
                >
                  {isLoading ? 'UPDATING…' : 'CHECKOUT NOW'}
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
