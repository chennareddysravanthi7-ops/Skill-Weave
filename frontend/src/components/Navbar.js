import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, FileQuestion, BookOpen, BarChart3, User, Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/quiz', label: 'Quiz', icon: FileQuestion },
    { path: '/learning', label: 'Learning', icon: BookOpen },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];
  
  const loginItems = [
    { path: '/student-login', label: 'Student Login', icon: User },
    { path: '/admin-login', label: 'Admin Login', icon: Shield },
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2" data-testid="nav-logo">
            <img
              src="/images/logo.png"
              alt="SkillWeave Logo"
              className="w-16 h-16 object-contain"
            />

          <span className="text-xl font-bold text-slate-900 hidden sm:block">
            SkillWeave
          </span>
        </Link>
                  
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${active 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Login buttons */}
            <div className="ml-4 flex items-center space-x-2">
              {loginItems.map((item) => {
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
