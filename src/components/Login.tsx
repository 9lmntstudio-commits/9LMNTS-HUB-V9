import { useState } from 'react';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface LoginProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (user: any, accessToken: string) => void;
}

export function Login({ onNavigate, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Login error:', signInError);
        // Provide more helpful error messages
        if (signInError.message === 'Invalid login credentials') {
          setError('Invalid email or password. Please check your credentials or sign up for a new account.');
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        console.log('Login successful, getting user details...');
        
        // Get user details directly from Supabase
        const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData) {
          console.error('Error getting user:', userError);
          setError('Failed to get user details');
          setLoading(false);
          return;
        }

        console.log('User details retrieved:', userData.email, 'Role:', userData.user_metadata?.role);

        const userInfo = {
          id: userData.id,
          email: userData.email || '',
          name: userData.user_metadata?.name || '',
          role: userData.user_metadata?.role || 'user'
        };

        onLoginSuccess(userInfo, data.session.access_token);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
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
              <LogIn size={32} />
            </div>
          </button>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to access 9LMNTS Studio</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-[#E91E63]/10 border border-[#E91E63]/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#E91E63]">{error}</p>
              </div>
            )}

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
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#00D4FF] text-black font-bold rounded-xl hover:bg-[#33E0FF] transition-colors shadow-[0_0_20px_rgba(0,212,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('signup')}
                className="text-[#00D4FF] hover:text-[#33E0FF] font-bold transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
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