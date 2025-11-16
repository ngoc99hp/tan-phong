'use client';

import { Server, Wrench, Lightbulb, Shield, Cloud, Headphones } from 'lucide-react';
import Image from 'next/image';

export function ServicesSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      icon: Server,
      title: 'Giải pháp CNTT',
      description: 'Tư vấn và triển khai hệ thống CNTT cho doanh nghiệp, từ cơ sở hạ tầng đến ứng dụng phần mềm'
    },
    {
      icon: Wrench,
      title: 'Sửa chữa & Bảo trì',
      description: 'Dịch vụ sửa chữa, bảo trì thiết bị công nghệ chuyên nghiệp với thời gian phản hồi nhanh chóng'
    },
    {
      icon: Lightbulb,
      title: 'Tư vấn công nghệ',
      description: 'Tư vấn giải pháp công nghệ phù hợp, tối ưu hóa chi phí và nâng cao hiệu quả hoạt động'
    },
    {
      icon: Shield,
      title: 'An ninh mạng',
      description: 'Bảo vệ hệ thống thông tin, phòng chống tấn công mạng và đảm bảo an toàn dữ liệu'
    },
    {
      icon: Cloud,
      title: 'Điện toán đám mây',
      description: 'Triển khai và quản lý hệ thống cloud, giúp doanh nghiệp linh hoạt và tiết kiệm chi phí'
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ kỹ thuật sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi'
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">Dịch vụ của chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cung cấp đầy đủ các dịch vụ công nghệ thông tin, đáp ứng mọi nhu cầu của doanh nghiệp
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto">
            <Image
              src="https://images.unsplash.com/photo-1517850308794-7793767fdb81?w=1080&q=80"
              alt="IT Support Services"
              width={1080}
              height={600}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="text-primary" size={28} />
              </div>
              <h4 className="text-gray-900 font-semibold mb-3">{service.title}</h4>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-r from-primary to-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-white mb-4">Bạn cần tư vấn về giải pháp CNTT?</h3>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn miễn phí và đưa ra giải pháp tốt nhất cho doanh nghiệp của bạn
          </p>
          <button 
            onClick={scrollToContact}
            className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Liên hệ tư vấn ngay
          </button>
        </div>
      </div>
    </section>
  );
}