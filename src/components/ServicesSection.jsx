'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Code, Package, Wrench, GraduationCap, Users } from 'lucide-react';
import Image from 'next/image';

// Map icon names từ database sang Lucide components
const iconMap = {
  'Lightbulb': Lightbulb,
  'Code': Code,
  'Package': Package,
  'Wrench': Wrench,
  'GraduationCap': GraduationCap,
  'Users': Users,
};

export function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services?is_active=true');
      const data = await response.json();

      if (data.success) {
        setServices(data.data);
      } else {
        setError(data.message || 'Không thể tải dữ liệu dịch vụ');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Dịch vụ của chúng tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đang tải dữ liệu dịch vụ...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">Dịch vụ của chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đồng hành toàn diện từ tư vấn, phát triển đến triển khai và bảo trì hệ thống
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto">
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1080&q=80"
              alt="Professional IT Services Team"
              width={1080}
              height={600}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Package;
              
              return (
                <div 
                  key={service.id}
                  className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="text-primary" size={28} />
                  </div>
                  <h4 className="text-gray-900 font-semibold mb-3">{service.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center mb-16">
            <p className="text-gray-600">Chưa có dịch vụ nào</p>
          </div>
        )}

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-16">
          <h3 className="text-gray-900 text-center mb-12">Tại sao chọn Tân Phong?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">70+</span>
              </div>
              <h5 className="text-gray-900 font-semibold mb-2">Năm kinh nghiệm</h5>
              <p className="text-gray-600 text-sm">Chuyên môn sâu về CNTT, EdTech và ERP</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">50+</span>
              </div>
              <h5 className="text-gray-900 font-semibold mb-2">Khách hàng</h5>
              <p className="text-gray-600 text-sm">Tin tưởng và hài lòng với dịch vụ</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">24/7</span>
              </div>
              <h5 className="text-gray-900 font-semibold mb-2">Hỗ trợ</h5>
              <p className="text-gray-600 text-sm">Sẵn sàng hỗ trợ mọi lúc mọi nơi</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">100%</span>
              </div>
              <h5 className="text-gray-900 font-semibold mb-2">Chất lượng</h5>
              <p className="text-gray-600 text-sm">Cam kết chất lượng dịch vụ hàng đầu</p>
            </div>
          </div>
        </div>

        {/* Service Process */}
        <div className="mb-16">
          <h3 className="text-gray-900 text-center mb-12">Quy trình làm việc chuyên nghiệp</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h5 className="text-gray-900 font-semibold mb-2">Tư vấn & Phân tích</h5>
              <p className="text-gray-600 text-sm">Tìm hiểu nhu cầu, phân tích yêu cầu chi tiết</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h5 className="text-gray-900 font-semibold mb-2">Thiết kế & Lên kế hoạch</h5>
              <p className="text-gray-600 text-sm">Thiết kế giải pháp, lập roadmap triển khai</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h5 className="text-gray-900 font-semibold mb-2">Phát triển & Triển khai</h5>
              <p className="text-gray-600 text-sm">Xây dựng, test và triển khai hệ thống</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h5 className="text-gray-900 font-semibold mb-2">Bảo trì & Hỗ trợ</h5>
              <p className="text-gray-600 text-sm">Bảo trì liên tục, hỗ trợ 24/7</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-r from-primary to-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-white mb-4">Bạn cần tư vấn về giải pháp CNTT?</h3>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn miễn phí và đưa ra giải pháp tối ưu nhất cho doanh nghiệp của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToContact}
              className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Liên hệ tư vấn ngay
            </button>
            <a 
              href="tel:0989150269"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors font-medium"
            >
              Hotline: 0989 150 269
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}