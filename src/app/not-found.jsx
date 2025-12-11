// app/not-found.jsx
import Link from 'next/link';
import { Home, Search, Mail } from 'lucide-react';

export const metadata = {
  title: '404 - Không tìm thấy trang | Tân Phong Technology',
  description: 'Trang bạn đang tìm không tồn tại hoặc đã bị xóa.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-red-600" size={40} />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Oops! Không tìm thấy trang
            </h2>
            
            <p className="text-gray-600 text-lg mb-8">
              Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc URL không chính xác.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all group"
            >
              <Home className="text-primary group-hover:scale-110 transition-transform" size={24} />
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                Về trang chủ
              </span>
            </Link>

            <Link
              href="/#products"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all group"
            >
              <Search className="text-primary group-hover:scale-110 transition-transform" size={24} />
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                Xem sản phẩm
              </span>
            </Link>

            <Link
              href="/#contact"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all group"
            >
              <Mail className="text-primary group-hover:scale-110 transition-transform" size={24} />
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                Liên hệ
              </span>
            </Link>
          </div>

          {/* CTA */}
          <div className="border-t pt-8">
            <p className="text-gray-600 mb-4">
              Cần hỗ trợ? Liên hệ ngay với chúng tôi
            </p>
            <a
              href="tel:0989150269"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Hotline: 0989 150 269
            </a>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-gray-500 text-sm mt-8">
          Mã lỗi: 404 - Page Not Found
        </p>
      </div>
    </div>
  );
}