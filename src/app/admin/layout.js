import {
  Package,
  LayoutDashboard,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin - Tân Phong",
  description: "Quản trị hệ thống",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
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

          <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
