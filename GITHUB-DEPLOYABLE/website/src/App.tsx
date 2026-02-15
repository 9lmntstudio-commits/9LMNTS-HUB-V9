import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { ServicesPage } from "./components/ServicesPage";
import { PricingPage } from "./components/PricingPage";
import { AboutPage } from "./components/AboutPage";
import { UnifiedStartProjectPage } from './components/UnifiedStartProjectPage';
import { PortfolioPage } from "./components/PortfolioPage";
import { AdminDashboardFull } from "./components/AdminDashboardFull";
import { CRM } from "./components/CRM";
import { ClientPortal } from "./components/ClientPortal";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { getSupabaseClient } from './utils/supabase/client';
import { mapServiceId } from './utils/serviceMapping';
import { Analytics } from '@vercel/analytics/react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabaseClient();

        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log('Found existing session, getting user details...');
          
          // Get user details directly from Supabase
          const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !userData) {
            console.error('Session validation failed:', userError);
            setLoading(false);
            return;
          }

          console.log('Session validated successfully:', userData.email);
          
          const userInfo = {
            id: userData.id,
            email: userData.email || '',
            name: userData.user_metadata?.name || '',
            role: userData.user_metadata?.role || 'user'
          };
          
          setUser(userInfo);
          setAccessToken(session.access_token);
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleNavigate = (page: string, plan?: string) => {
    // Protect admin route
    if (page === 'admin' && (!user || user.role !== 'admin')) {
      setCurrentPage('login');
      return;
    }

    // Map plan value to actual service ID
    const mappedPlan = plan ? mapServiceId(plan) : undefined;
    
    setCurrentPage(page);
    if (mappedPlan) {
      setSelectedPlan(mappedPlan);
    }
  };

  const handleLoginSuccess = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    
    // Redirect to admin if user is admin, otherwise home
    if (userData.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "services":
        return <ServicesPage onNavigate={handleNavigate} />;
      case "pricing":
        return <PricingPage onNavigate={handleNavigate} />;
      case "portfolio":
        return <PortfolioPage onNavigate={handleNavigate} />;
      case "about":
        return <AboutPage onNavigate={handleNavigate} />;
      case "start-project":
      case "ai-project":
      case "creative-project":
        return (
          <UnifiedStartProjectPage
            selectedPlan={selectedPlan}
            selectedServiceType={currentPage === 'ai-project' ? 'ai' : currentPage === 'creative-project' ? 'creative' : undefined}
            onNavigate={handleNavigate}
          />
        );
      case "login":
        return <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
      case "signup":
        return <Signup onNavigate={handleNavigate} />;
      case "admin":
        // Only allow admin users
        if (!user || user.role !== 'admin') {
          return <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
        }
        return <AdminDashboardFull onNavigate={handleNavigate} user={user} accessToken={accessToken} onLogout={handleLogout} />;
      case "crm":
        return <CRM onNavigate={handleNavigate} />;
      case "client-portal":
        return <ClientPortal onNavigate={handleNavigate} />;
      case "event-os-demo":
        return <HomePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const isStandalonePage = [
    "admin",
    "crm",
    "client-portal",
    "event-os-demo",
    "login",
    "signup",
  ].includes(currentPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#E91E63] animate-pulse" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Analytics />
      {!isStandalonePage && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main>{renderPage()}</main>
      {!isStandalonePage && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}