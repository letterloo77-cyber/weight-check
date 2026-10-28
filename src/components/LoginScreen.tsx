import React, { useState } from 'react';
import { Lock, Scale, User, ShieldAlert, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Strict in-memory credential check
    if (username.trim() === 'Alibaba123' && password === 'whattodo123') {
      onLoginSuccess();
    } else {
      setError('Invalid login');
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('Alibaba123');
    setPassword('whattodo123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-850 border border-stone-700/80 rounded-xl shadow-2xl p-8 backdrop-blur-sm">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-stone-700/60">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-mono">
              WEIGHBRIDGE CONTROL
            </h1>
            <p className="text-xs text-stone-400 font-mono">
              EPSON LQ-310 Billing System
            </p>
          </div>
        </div>

        {/* Security / In-memory note */}
        <div className="mt-4 px-3 py-2 bg-stone-800/80 border border-stone-700/60 rounded-md text-xs text-stone-300 font-mono flex items-center justify-between">
          <span>Session: In-Memory Only</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-950/80 border border-red-500/60 rounded-lg flex items-center gap-2.5 text-red-200 text-sm animate-shake">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-medium font-mono">{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-stone-300 uppercase tracking-wider mb-1.5">
              Operator Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="off"
                autoFocus
                required
                className="w-full pl-10 pr-4 py-2.5 bg-stone-800 border border-stone-600 rounded-lg text-white font-mono text-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-stone-300 uppercase tracking-wider mb-1.5">
              Access Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="off"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-stone-800 border border-stone-600 rounded-lg text-white font-mono text-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold font-mono text-sm rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>SIGN IN TO CONSOLE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick-Fill Button */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-mono">
            Default: Alibaba123
          </span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs text-amber-400 hover:text-amber-300 font-mono underline decoration-dotted cursor-pointer"
          >
            Auto-fill credentials
          </button>
        </div>
      </div>
    </div>
  );
};
