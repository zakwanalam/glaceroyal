const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/** Shared cart fields — must be identical across create, add, update, remove, and get. */
const CART_FIELDS = `
  id
  checkoutUrl
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 10) {
    edges {
      node {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          amountPerQuantity {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
            }
            price {
              amount
              currencyCode
            }
            product {
              title
            }
          }
        }
      }
    }
  }
`;

export async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    });

    const body = await result.json();

    if (body.errors) {
      console.error('Shopify API Error:', body.errors[0].message);
      return { status: result.status, body, error: body.errors[0].message };
    }

    return { status: result.status, body, data: body.data };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return { status: 500, error: 'Error fetching from Shopify' };
  }
}

export async function getProducts() {
  const query = `
    query getProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query });
  return response.data?.products?.edges || [];
}

export async function createCart() {
  const query = `
    mutation createCart {
      cartCreate {
        cart {
          ${CART_FIELDS}
        }
      }
    }
  `;
  const response = await shopifyFetch({ query });
  return response.data?.cartCreate?.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ${CART_FIELDS}
        }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  };

  const response = await shopifyFetch({ query, variables });
  return response.data?.cartLinesAdd?.cart;
}

export async function updateCartQuantity(cartId: string, lineId: string, quantity: number) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ${CART_FIELDS}
        }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [{ id: lineId, quantity }],
  };

  const response = await shopifyFetch({ query, variables });
  return response.data?.cartLinesUpdate?.cart;
}

export async function removeFromCart(cartId: string, lineId: string) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ${CART_FIELDS}
        }
      }
    }
  `;
  const variables = {
    cartId,
    lineIds: [lineId],
  };

  const response = await shopifyFetch({ query, variables });
  return response.data?.cartLinesRemove?.cart;
}

export async function getCart(cartId: string) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ${CART_FIELDS}
      }
    }
  `;
  const variables = { cartId };
  const response = await shopifyFetch({ query, variables });
  return response.data?.cart;
}
