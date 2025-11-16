'use client';

import { Monitor, Code, Radio } from 'lucide-react';
import Image from 'next/image';

export function ProductsSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const products = [
    {
      category: 'Máy tính',
      icon: Monitor,
      description: 'Máy tính và thiết bị ngoại vi chất lượng cao',
      items: [
        {
          name: 'Máy tính để bàn Dell OptiPlex',
          description: 'Hiệu năng cao, ổn định cho văn phòng',
          price: '15.000.000đ',
          badge: 'Bán chạy'
        },
        {
          name: 'Laptop HP EliteBook',
          description: 'Mỏng nhẹ, hiệu suất vượt trội',
          price: '22.000.000đ',
        },
        {
          name: 'Màn hình LG UltraWide',
          description: 'Màn hình rộng 34 inch, độ phân giải cao',
          price: '8.500.000đ',
        }
      ]
    },
    {
      category: 'Phần mềm',
      icon: Code,
      description: 'Giải pháp phần mềm cho doanh nghiệp',
      items: [
        {
          name: 'Phần mềm quản lý ERP',
          description: 'Quản lý toàn diện hoạt động doanh nghiệp',
          price: '50.000.000đ',
          badge: 'Khuyến mãi'
        },
        {
          name: 'Phần mềm kế toán',
          description: 'Giải pháp kế toán chuyên nghiệp',
          price: '12.000.000đ',
        },
        {
          name: 'Microsoft 365',
          description: 'Bộ công cụ văn phòng chính hãng',
          price: '2.500.000đ/năm',
        }
      ]
    },
    {
      category: 'Viễn thông',
      icon: Radio,
      description: 'Thiết bị viễn thông và mạng doanh nghiệp',
      items: [
        {
          name: 'Tổng đài IP Panasonic',
          description: 'Hệ thống tổng đài hiện đại, đa tính năng',
          price: '35.000.000đ',
        },
        {
          name: 'Switch Cisco Catalyst',
          description: 'Thiết bị chuyển mạch doanh nghiệp',
          price: '18.000.000đ',
          badge: 'Mới'
        },
        {
          name: 'Camera hội nghị Logitech',
          description: 'Camera HD cho phòng họp',
          price: '12.500.000đ',
        }
      ]
    }
  ];

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">Sản phẩm của chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đa dạng sản phẩm công nghệ với chất lượng cao, giá cả cạnh tranh
          </p>
        </div>

        {/* Product Categories */}
        {products.map((category, idx) => (
          <div key={idx} className="mb-16 last:mb-0">
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <category.icon className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-gray-900">{category.category}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {category.items.map((product, productIdx) => (
                <div key={productIdx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                      <category.icon className="text-primary" size={32} />
                    </div>
                    {product.badge && (
                      <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-gray-900 font-semibold mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="text-primary font-bold text-lg mb-4">{product.price}</div>
                    <button 
                      onClick={scrollToContact}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Liên hệ đặt hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}