import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, LogOut, ExternalLink } from 'lucide-react';
import { Customer } from '../hooks/useCustomer';
import { getShopAccountUrl } from '../lib/shopify';

type AccountTab = 'signin' | 'signup';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  onClearMessages: () => void;
  onSignIn: (email: string, password: string) => void;
  onSignUp: (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    acceptsMarketing: boolean;
  }) => void;
  onSignOut: () => void;
  onRecoverPassword: (email: string) => void;
}

export default function AccountModal({
  isOpen,
  onClose,
  customer,
  isLoading,
  error,
  successMessage,
  onClearMessages,
  onSignIn,
  onSignUp,
  onSignOut,
  onRecoverPassword,
}: AccountModalProps) {
  const [tab, setTab] = useState<AccountTab>('signin');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || error;

  const resetForm = () => {
    setLocalError(null);
    onClearMessages();
  };

  const switchTab = (next: AccountTab) => {
    setTab(next);
    setShowForgotPassword(false);
    resetForm();
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();
    if (!email || !password) {
      setLocalError('Please enter your email and password.');
      return;
    }
    onSignIn(email, password);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();
    if (!email || !password || !firstName || !lastName) {
      setLocalError('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    onSignUp({
      email,
      password,
      firstName,
      lastName,
      phone: phone || undefined,
      acceptsMarketing,
    });
  };

  const accountUrl = getShopAccountUrl();
  const customerName =
    [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') ||
    customer?.email;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[111] w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-[32px] shadow-2xl mx-4"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <User size={22} className="text-[#3D2B1F]" />
                  <h2 className="text-2xl font-display text-[#3D2B1F]">
                    {customer ? 'My Account' : 'Account'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={22} className="text-gray-500" />
                </button>
              </div>

              {customer ? (
                <div className="space-y-6">
                  <p className="text-[#3D2B1F]/70">
                    Signed in as{' '}
                    <span className="font-semibold text-[#3D2B1F]">{customerName}</span>
                  </p>
                  <p className="text-sm text-[#3D2B1F]/50">{customer.email}</p>

                  <a
                    href={accountUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full border-2 border-[#3D2B1F]/15 text-[#3D2B1F] font-semibold hover:bg-[#3D2B1F]/5 transition-colors"
                  >
                    View orders & profile
                    <ExternalLink size={16} />
                  </a>

                  <button
                    type="button"
                    onClick={onSignOut}
                    disabled={isLoading}
                    className="w-full py-3 rounded-full bg-[#3D2B1F] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#2a1e15] transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex rounded-full bg-[#3D2B1F]/5 p-1 mb-6">
                    <button
                      type="button"
                      onClick={() => switchTab('signin')}
                      className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                        tab === 'signin'
                          ? 'bg-[#3D2B1F] text-white shadow-md'
                          : 'text-[#3D2B1F]/60 hover:text-[#3D2B1F]'
                      }`}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => switchTab('signup')}
                      className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                        tab === 'signup'
                          ? 'bg-[#3D2B1F] text-white shadow-md'
                          : 'text-[#3D2B1F]/60 hover:text-[#3D2B1F]'
                      }`}
                    >
                      Create account
                    </button>
                  </div>

                  {successMessage && (
                    <p className="mb-4 text-sm text-emerald-800 bg-emerald-50 rounded-xl px-4 py-3">
                      {successMessage}
                    </p>
                  )}

                  {displayError && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                      {displayError}
                    </p>
                  )}

                  {tab === 'signin' ? (
                    showForgotPassword ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          resetForm();
                          if (!email) {
                            setLocalError('Enter your email address.');
                            return;
                          }
                          onRecoverPassword(email);
                        }}
                        className="space-y-4"
                      >
                        <p className="text-sm text-[#3D2B1F]/60">
                          Enter your email and we&apos;ll send reset instructions if an account
                          exists.
                        </p>
                        <Field label="Email" required>
                          <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            placeholder="you@example.com"
                          />
                        </Field>
                        <button type="submit" disabled={isLoading} className={submitClass}>
                          {isLoading ? 'Sending…' : 'Send reset email'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(false);
                            resetForm();
                          }}
                          className="w-full text-sm text-[#3D2B1F]/60 hover:text-[#3D2B1F] font-medium cursor-pointer"
                        >
                          Back to sign in
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <Field label="Email" required>
                          <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            placeholder="you@example.com"
                          />
                        </Field>
                        <Field label="Password" required>
                          <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClass}
                            placeholder="••••••••"
                          />
                        </Field>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(true);
                            resetForm();
                          }}
                          className="text-sm text-[#3D2B1F]/60 hover:text-[#3D2B1F] underline underline-offset-2 cursor-pointer"
                        >
                          Forgot password?
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={submitClass}
                        >
                          {isLoading ? 'Signing in…' : 'Sign in'}
                        </button>
                      </form>
                    )
                  ) : (
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="First name" required>
                          <input
                            type="text"
                            autoComplete="given-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Last name" required>
                          <input
                            type="text"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className={inputClass}
                          />
                        </Field>
                      </div>
                      <Field label="Email" required>
                        <input
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Phone (optional)">
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={inputClass}
                          placeholder="+1 212 555 0100"
                        />
                      </Field>
                      <Field label="Password" required>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={inputClass}
                          placeholder="Min. 8 characters"
                        />
                      </Field>
                      <Field label="Confirm password" required>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <label className="flex items-start gap-3 text-sm text-[#3D2B1F]/70 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptsMarketing}
                          onChange={(e) => setAcceptsMarketing(e.target.checked)}
                          className="mt-1 rounded"
                        />
                        Send me news and special offers
                      </label>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={submitClass}
                      >
                        {isLoading ? 'Creating account…' : 'Create account'}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-2xl border-2 border-[#3D2B1F]/10 focus:border-[#3D2B1F]/30 focus:outline-none text-[#3D2B1F] placeholder:text-[#3D2B1F]/30';

const submitClass =
  'w-full py-4 rounded-full bg-[#3D2B1F] text-white font-bold hover:bg-[#2a1e15] transition-colors disabled:opacity-60 cursor-pointer mt-2';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-[#3D2B1F]/50 mb-1.5 block">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
