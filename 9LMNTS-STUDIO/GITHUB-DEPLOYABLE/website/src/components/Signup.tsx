import { useState } from 'react';
import { UserPlus, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SignupProps {
  onNavigate: (page: string) => void;
}

export function Signup({ onNavigate }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-662c70dc/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            password,
            name,
            role: isAdmin ? 'admin' : 'user',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Signup error:', data.error);
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#00D4FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#E91E63]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-block"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#E91E63] flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.3)]">
              <UserPlus size={32} />
            </div>
          </button>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-white/60">Join 9LMNTS Studio today</p>
        </div>

        {/* Signup Form */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                <CheckCircle size={32} className="text-[#10B981]" />
              </div>
              <h2 className="text-xl font-bold mb-2">Account Created!</h2>
              <p className="text-white/60 mb-4">
                Your email has been automatically confirmed.
              </p>
              <p className="text-sm text-white/40">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="bg-[#E91E63]/10 border border-[#E91E63]/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#E91E63]">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isAdmin" className="text-sm text-white/60">
                  Sign up as Admin
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00D4FF] text-black font-bold rounded-xl hover:bg-[#33E0FF] transition-colors shadow-[0_0_20px_rgba(0,212,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-[#00D4FF] hover:text-[#33E0FF] font-bold transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}