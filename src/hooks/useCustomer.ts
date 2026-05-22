import { useState, useEffect, useCallback } from 'react';
import {
  customerCreate,
  customerAccessTokenCreate,
  customerAccessTokenDelete,
  customerRecover,
  getCustomer,
} from '../lib/shopify';

const TOKEN_KEY = 'shopify_customer_token';

export interface Customer {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
}

function mapLoginError(
  errors: { message: string; code?: string }[],
  apiError?: string,
  isUnidentified?: boolean
) {
  if (isUnidentified || errors.some((e) => e.code === 'UNIDENTIFIED_CUSTOMER')) {
    return 'Incorrect email or password, or your account is not activated yet. Check your email for an activation link from Glacé Royale, then try signing in again.';
  }
  if (errors.length > 0) return errors.map((e) => e.message).join(' ');
  if (apiError) return apiError;
  return 'Something went wrong. Please try again.';
}

export function useCustomer() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const persistToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setAccessToken(token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setAccessToken(null);
      setCustomer(null);
    }
  }, []);

  const loadCustomer = useCallback(
    async (token: string) => {
      const result = await getCustomer(token);
      if (result.customer) {
        setCustomer(result.customer);
        return true;
      }
      if (result.error) {
        console.warn('Could not load customer profile:', result.error);
      }
      persistToken(null);
      return false;
    },
    [persistToken]
  );

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return;
    setAccessToken(stored);
    loadCustomer(stored);
  }, [loadCustomer]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const result = await customerAccessTokenCreate(email.trim(), password);
      if (result.accessToken) {
        persistToken(result.accessToken);
        const loaded = await loadCustomer(result.accessToken);
        if (loaded) {
          setIsAccountOpen(false);
        } else {
          setError('Signed in, but could not load your profile. Please try again.');
        }
      } else {
        setError(mapLoginError(result.errors, result.apiError, result.isUnidentified));
      }
      setIsLoading(false);
    },
    [persistToken, loadCustomer]
  );

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      acceptsMarketing?: boolean;
    }) => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const createResult = await customerCreate({
        email: input.email.trim(),
        password: input.password,
        firstName: input.firstName.trim() || undefined,
        lastName: input.lastName.trim() || undefined,
        phone: input.phone?.trim() || undefined,
        acceptsMarketing: input.acceptsMarketing,
      });

      if (createResult.needsActivation) {
        setSuccessMessage(
          'We sent an activation email to your inbox. Open the link in that email to activate your account, then sign in here.'
        );
        setIsLoading(false);
        return;
      }

      if (createResult.errors.length > 0 || createResult.apiError) {
        const msg = createResult.errors.map((e) => e.message).join(' ');
        setError(msg || createResult.apiError || 'Could not create account.');
        setIsLoading(false);
        return;
      }

      if (!createResult.customer) {
        setError('Could not create account. Please try again.');
        setIsLoading(false);
        return;
      }

      // Shopify sends an activation email; login often fails until the account is activated
      setSuccessMessage(
        'Account created! Check your email for an activation link from Glacé Royale. After you activate your account, sign in below.'
      );
      setIsLoading(false);
    },
    []
  );

  const recoverPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await customerRecover(email.trim());
    if (result.success) {
      setSuccessMessage(
        'If an account exists for that email, we sent password reset instructions.'
      );
    } else {
      setError(
        result.errors.map((e) => e.message).join(' ') ||
          result.apiError ||
          'Could not send reset email.'
      );
    }
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    if (accessToken) {
      await customerAccessTokenDelete(accessToken);
    }
    persistToken(null);
    setError(null);
    setSuccessMessage(null);
  }, [accessToken, persistToken]);

  const openAccount = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
    setIsAccountOpen(true);
  }, []);

  const closeAccount = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
    setIsAccountOpen(false);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    customer,
    isLoggedIn: !!customer,
    isAccountOpen,
    isLoading,
    error,
    successMessage,
    setError,
    clearMessages,
    openAccount,
    closeAccount,
    signIn,
    signUp,
    signOut,
    recoverPassword,
  };
}
