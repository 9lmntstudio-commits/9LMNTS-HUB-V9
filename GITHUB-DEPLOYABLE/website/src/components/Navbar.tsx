import { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
const logoImage = '/images/logo.png';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: { name: string; email: string; role: string } | null;
  onLogout?: () => void;
}

export function Navbar({ currentPage, onNavigate, user, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Portfolio', id: 'portfolio' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'About', id: 'about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#FF7A00]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center group"
          >
            <img 
              src={logoImage} 
              alt="9LMNTS Studio" 
              className="h-10 w-auto group-hover:opacity-90 transition-opacity"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors ${
                  currentPage === link.id
                    ? 'text-[#FF7A00]'
                    : 'text-white hover:text-[#FF7A00]'
                }`}
              >
                {link.name}
              </button>
            ))}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF7A00]/10 text-[#FF7A00] rounded hover:bg-[#FF7A00]/20 transition-colors border border-[#FF7A00]/20"
                >
                  <User size={18} />
                  <span>{user.name}</span>
                </button>
                
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg shadow-xl z-20 overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-white/60">{user.email}</p>
                        <p className="text-xs text-[#FF7A00] mt-1 uppercase font-bold">{user.role}</p>
                      </div>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors"
                        >
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout?.();
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-[#E91E63] hover:bg-[#E91E63]/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-white hover:text-[#FF7A00] transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('start-project')}
                  className="px-6 py-2 bg-[#FF7A00] text-[#1A1A1A] rounded hover:bg-[#FF7A00]/90 transition-colors"
                >
                  Start Project
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-[#FF7A00]/20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                  currentPage === link.id
                    ? 'text-[#FF7A00] bg-[#222222]'
                    : 'text-white hover:bg-[#222222]'
                }`}
              >
                {link.name}
              </button>
            ))}
            
            {user ? (
              <>
                <div className="px-3 py-2 border-t border-white/10 mt-2">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-white/60">{user.email}</p>
                  <p className="text-xs text-[#FF7A00] mt-1 uppercase font-bold">{user.role}</p>
                </div>
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-white hover:bg-[#222222] rounded"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-[#E91E63] hover:bg-[#E91E63]/10 rounded transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-[#222222] rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onNavigate('start-project');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 px-6 py-2 bg-[#FF7A00] text-[#1A1A1A] rounded hover:bg-[#FF7A00]/90 transition-colors"
                >
                  Start Project
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}