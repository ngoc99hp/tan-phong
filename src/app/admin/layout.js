'use client';

import { Package, LayoutDashboard, Settings, LogOut, MessageSquare, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/middleware/auth';

function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">TP</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500">Công ty Tân Phong</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 text-sm">
              <UserIcon size={16} className="text-gray-500" />
              <span className="text-gray-700">{user.fullName || user.username}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {user.role}
              </span>
            </div>
          )}
          
          {/* Logout Button */}
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminLayoutContent({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-[calc(100vh-73px)] shadow-sm">
          <nav className="p-4 space-y-2">
            <Link 
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors"
            >
              <Package size={20} />
              <span>Quản lý Sản phẩm</span>
            </Link>
            
            <Link 
              href="/admin/services"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors"
            >
              <Settings size={20} />
              <span>Quản lý Dịch vụ</span>
            </Link>

            <Link 
              href="/admin/contacts"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors"
            >
              <MessageSquare size={20} />
              <span>Quản lý Liên hệ</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}