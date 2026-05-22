function normalizeEnv(value: string | undefined): string {
  return (value ?? '').trim().replace(/^["']|["']$/g, '');
}

const domain = normalizeEnv(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN);
const storefrontAccessToken = normalizeEnv(
  import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
);

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

export function getShopAccountUrl() {
  const storeDomain = (domain || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `https://${storeDomain}/account`;
}

export async function shopifyFetch({
  query,
  variables,
  customerAccessToken,
}: {
  query: string;
  variables?: Record<string, unknown>;
  customerAccessToken?: string;
}) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
  };
  if (customerAccessToken) {
    headers['Shopify-Storefront-Customer-Access-Token'] = customerAccessToken;
  }

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    });

    const body = await result.json();

    if (body.errors?.length) {
      const message = body.errors.map((e: { message: string }) => e.message).join(' ');
      console.error('Shopify API Error:', message);
      return { status: result.status, body, error: message, errors: body.errors };
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

export interface CustomerUserError {
  field: string[] | null;
  message: string;
  code?: string;
}

function getCustomerErrors(
  payload: { customerUserErrors?: CustomerUserError[] } | null | undefined
): CustomerUserError[] {
  return payload?.customerUserErrors?.filter((e) => e.message) ?? [];
}

export async function customerCreate(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;
  const response = await shopifyFetch({ query, variables: { input } });
  const payload = response.data?.customerCreate;
  return {
    customer: payload?.customer ?? null,
    errors: getCustomerErrors(payload),
    apiError: response.error,
    needsActivation: getCustomerErrors(payload).some(
      (e) => e.code === 'CUSTOMER_DISABLED'
    ),
  };
}

export async function customerAccessTokenCreate(email: string, password: string) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;
  const response = await shopifyFetch({
    query,
    variables: { input: { email, password } },
  });
  const payload = response.data?.customerAccessTokenCreate;
  const errors = getCustomerErrors(payload);
  return {
    accessToken: payload?.customerAccessToken?.accessToken ?? null,
    expiresAt: payload?.customerAccessToken?.expiresAt ?? null,
    errors,
    apiError: response.error,
    isUnidentified: errors.some((e) => e.code === 'UNIDENTIFIED_CUSTOMER'),
  };
}

export async function customerRecover(email: string) {
  const query = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;
  const response = await shopifyFetch({ query, variables: { email: email.trim() } });
  const payload = response.data?.customerRecover;
  return {
    errors: getCustomerErrors(payload),
    apiError: response.error,
    success: getCustomerErrors(payload).length === 0 && !response.error,
  };
}

export async function customerAccessTokenDelete(customerAccessToken: string) {
  const query = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `;
  const response = await shopifyFetch({
    query,
    variables: { customerAccessToken },
    customerAccessToken,
  });
  return !response.error;
}

export async function getCustomer(customerAccessToken: string) {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
      }
    }
  `;
  const response = await shopifyFetch({
    query,
    variables: { customerAccessToken },
    customerAccessToken,
  });

  if (response.error) {
    return { customer: null, error: response.error };
  }

  return { customer: response.data?.customer ?? null, error: null };
}
