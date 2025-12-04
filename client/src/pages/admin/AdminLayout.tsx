import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, Users, Globe, Bell, User, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Produtos", path: "/products" },
    { icon: Users, label: "Clientes", path: "/customers" },
    { icon: Globe, label: "Domínios", path: "/domains" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Horizontal Menu */}
      <header className="bg-black text-white shadow-lg relative z-50">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Brand and Menu */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 mr-2 rounded-md hover:bg-gray-800 transition-colors"
                data-testid="button-mobile-menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Brand */}
              <div className="mr-4 md:mr-12">
                <h1 className="text-lg md:text-xl font-bold">TikTok Shop Creator</h1>
              </div>

              {/* Desktop Navigation Menu */}
              <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
                {menuItems.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        className={`group flex flex-col items-center py-5 px-3 transition-all duration-200 cursor-pointer relative ${
                          isActive
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                        style={{
                          color: !isActive ? undefined : undefined
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = 'rgba(0, 153, 149, 0.85)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = '';
                          }
                        }}
                        data-testid={`link-${item.label.toLowerCase()}`}
                      >
                        <span className="text-sm font-medium relative">
                          {item.label}
                          <div 
                            className={`absolute left-0 right-0 h-0.5 mt-1 transition-all duration-300 ${
                              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                            style={{ 
                              backgroundColor: '#009995',
                              transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                              transformOrigin: 'center'
                            }}
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right side - Notifications and Profile */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-800 text-gray-400 hover:text-white"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Avatar */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-gray-600 transition-all">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin User" />
                  <AvatarFallback className="bg-gray-700 text-white text-sm">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-400">admin@example.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-3 border-t border-gray-800">
              {menuItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`flex items-center py-3 px-2 rounded-md transition-all ${
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.label.toLowerCase()}`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="flex-1 overflow-auto">
        <div className="px-6 py-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}