import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, ShieldCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email.trim(), password);
      onLoginSuccess(res.user, res.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.register(name.trim(), email.trim(), phone.trim());
      onLoginSuccess(res.user, res.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.login(demoEmail, 'password');
      onLoginSuccess(res.user, res.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-[#FAF8F5] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 z-10 p-6 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
          aria-label="Close authentication window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <span className="font-serif-editorial text-2xl tracking-[0.2em] font-medium text-stone-950 uppercase block">
            Vino’z
          </span>
          <span className="text-[9px] tracking-[0.3em] text-[#68242A] font-semibold uppercase block mt-0.5">
            Fashion Atelier
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 mb-6">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors relative ${
              tab === 'login'
                ? 'text-[#68242A]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Sign In
            {tab === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#68242A]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors relative ${
              tab === 'register'
                ? 'text-[#68242A]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Create Account
            {tab === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#68242A]" />
            )}
          </button>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="mb-6 p-3.5 bg-[#F4EFE6] rounded-xl border border-[#EBE4D8] space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-stone-600 text-center">
            Instant Demo Sign-In
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('sophia@example.com')}
              className="py-2 px-2.5 bg-white text-stone-800 border border-stone-300 rounded-lg text-xs font-medium hover:border-stone-900 transition-colors text-center"
            >
              Customer (Sophia)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@vinoz.com')}
              className="py-2 px-2.5 bg-[#68242A] text-white rounded-lg text-xs font-semibold hover:bg-[#521c21] transition-colors text-center flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin (Manager)</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2.5 pl-9 pr-3 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-stone-600 font-medium">Password</label>
                <span className="text-[11px] text-stone-400">Any password for demo</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2.5 pl-9 pr-3 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-stone-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#68242A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Claire Delacroix"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2.5 pl-9 pr-3 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="claire@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2.5 pl-9 pr-3 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2.5 pl-9 pr-3 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#68242A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#521c21] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
