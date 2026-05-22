import { useState, useEffect, useCallback } from 'react';
import { createCart, getCart, addToCart, updateCartQuantity, removeFromCart, getProducts } from '../lib/shopify';
import { Product, Theme, THEMES, AddToCartOptions } from '../types';

function mapShopifyProduct(shopifyProduct: any): Product {
  const node = shopifyProduct.node;
  let theme: Theme = 'vanilla';
  const title = node.title.toLowerCase();
  const tags = (node.tags || []).map((t: string) => t.toLowerCase());
  
  if (title.includes('chocolate') || tags.includes('chocolate')) theme = 'chocolate';
  else if (title.includes('strawberry') || tags.includes('strawberry')) theme = 'strawberry';
  else if (title.includes('mint') || tags.includes('mint')) theme = 'mint';

  const variant = node.variants.edges[0]?.node;
  const imageUrls =
    node.images?.edges?.map((edge: { node: { url: string } }) => edge.node.url) || [];

  return {
    id: variant?.id || node.id,
    name: node.title,
    price: node.priceRange?.minVariantPrice?.amount
      ? `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`
      : '$0.00',
    description: node.description || '',
    image: imageUrls[0] || '',
    images: imageUrls,
    color: THEMES[theme].bg,
    theme: theme,
  };
}


export function useShopify() {
  const [cart, setCart] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Cart
  useEffect(() => {
    async function initialize() {
      // 1. Fetch products
      const fetchedProducts = await getProducts();
      if (fetchedProducts) {
        setProducts(fetchedProducts.map(mapShopifyProduct));
      }

      // 2. Fetch or create cart
      const storedCartId = localStorage.getItem('shopify_cart_id');
      if (storedCartId) {
        let existingCart = await getCart(storedCartId);
        if (existingCart) {
          const zeroQtyLines =
            existingCart.lines?.edges?.filter(
              (edge: { node: { quantity: number } }) => edge.node.quantity <= 0
            ) ?? [];
          for (const edge of zeroQtyLines) {
            existingCart = await removeFromCart(storedCartId, edge.node.id);
          }
          if (zeroQtyLines.length > 0 && existingCart) {
            existingCart = (await getCart(storedCartId)) ?? existingCart;
          }
          setCart(existingCart);
          return;
        }
      }
      
      const newCart = await createCart();
      if (newCart) {
        localStorage.setItem('shopify_cart_id', newCart.id);
        setCart(newCart);
      }
    }
    initialize();
  }, []);

  const syncCart = useCallback(async (cartId: string, fallback: any) => {
    const freshCart = await getCart(cartId);
    setCart(freshCart ?? fallback);
    return freshCart ?? fallback;
  }, []);

  const handleAddToCart = useCallback(
    async (product: Product, options: AddToCartOptions = {}) => {
      const { quantity = 1, redirectToCheckout = false } = options;
      if (!cart?.id || !product.id) return;
      setIsLoading(true);
      const updatedCart = await addToCart(cart.id, product.id, quantity);
      if (updatedCart) {
        const synced = await syncCart(cart.id, updatedCart);
        if (redirectToCheckout && synced?.checkoutUrl) {
          window.location.href = synced.checkoutUrl;
        } else {
          setIsCartOpen(true);
        }
      }
      setIsLoading(false);
    },
    [cart, syncCart]
  );

  const handleUpdateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) return;
      setIsLoading(true);
      if (quantity < 1) {
        const updatedCart = await removeFromCart(cart.id, lineId);
        if (updatedCart) await syncCart(cart.id, updatedCart);
      } else {
        const updatedCart = await updateCartQuantity(cart.id, lineId, quantity);
        if (updatedCart) await syncCart(cart.id, updatedCart);
      }
      setIsLoading(false);
    },
    [cart, syncCart]
  );

  const handleRemoveItem = useCallback(
    async (lineId: string) => {
      if (!cart?.id) return;
      setIsLoading(true);
      const updatedCart = await removeFromCart(cart.id, lineId);
      if (updatedCart) await syncCart(cart.id, updatedCart);
      setIsLoading(false);
    },
    [cart, syncCart]
  );

  return {
    cart,
    products,
    isCartOpen,
    setIsCartOpen,
    isLoading,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
  };
}
