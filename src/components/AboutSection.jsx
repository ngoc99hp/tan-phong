'use client';

import { Target, Eye, Users, Cpu, Shield, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Về Tân Phong Technology</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Đối tác chuyển đổi số đáng tin cậy – Mang giải pháp công nghệ hiện đại đến doanh nghiệp và tổ chức giáo dục Việt Nam
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Hình ảnh */}
          <div className="order-2 md:order-1">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1709715357520-5e1047a2b691?w=1080&q=80"
                alt="Business Team Meeting"
                width={1080}
                height={720}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Nội dung giới thiệu */}
          <div className="space-y-6 order-1 md:order-2">
            <h3 className="text-3xl font-bold text-gray-900">Hành trình của chúng tôi</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Thành lập ngày 23/08/2017 với tên đầy đủ <strong>Công ty Cổ phần Công nghệ Tin học Thương mại Tân Phong</strong>, 
              chúng tôi bắt đầu từ một đội ngũ kỹ sư đam mê công nghệ tại Hải Phòng và nhanh chóng mở rộng tầm ảnh hưởng ra toàn quốc.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Đến nay, Tân Phong đã trở thành đối tác chiến lược của hàng trăm doanh nghiệp và tổ chức giáo dục trong hành trình chuyển đổi số, 
              cung cấp các giải pháp ERP, EdTech, phát triển phần mềm theo yêu cầu và dịch vụ bảo trì – bảo dưỡng hệ thống CNTT chuyên nghiệp.
            </p>
          </div>
        </div>

        {/* Lĩnh vực chuyên môn */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-10">Lĩnh vực chuyên sâu</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl text-center">
              <Cpu className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-xl mb-2">Giải pháp ERP & Chuyển đổi số</h4>
              <p className="text-gray-600">Triển khai hệ thống quản trị doanh nghiệp toàn diện, tự động hóa quy trình</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl text-center">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-xl mb-2">EdTech & Giáo dục số</h4>
              <p className="text-gray-600">Phát triển nền tảng học trực tuyến, quản lý trường học và nội dung số</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-xl mb-2">Bảo trì & Hạ tầng CNTT</h4>
              <p className="text-gray-600">Dịch vụ bảo hành, bảo trì 24/7, nâng cấp hệ thống máy chủ và mạng</p>
            </div>
          </div>
        </div>

        {/* Sứ mệnh - Tầm nhìn - Giá trị */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
              <Target className="text-white" size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Sứ mệnh</h4>
            <p className="text-gray-600">
              Đồng hành cùng doanh nghiệp và tổ chức giáo dục Việt Nam trong hành trình chuyển đổi số, 
              giúp nâng cao hiệu quả vận hành và chất lượng giáo dục thông qua công nghệ hiện đại.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
              <Eye className="text-white" size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Tầm nhìn</h4>
            <p className="text-gray-600">
              Đến năm 2030, trở thành một trong những công ty công nghệ hàng đầu miền Bắc Việt Nam 
              trong lĩnh vực ERP, EdTech và dịch vụ chuyển đổi số.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
              <Users className="text-white" size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Giá trị cốt lõi</h4>
            <p className="text-gray-600">
              <strong>Chuyên nghiệp – Sáng tạo – Trách nhiệm – Tận tâm</strong><br />
              Luôn đặt sự thành công của khách hàng làm thước đo cho sự phát triển của Tân Phong.
            </p>
          </div>
        </div>

        {/* Lãnh đạo */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-10">Lãnh đạo công ty</h3>
          <div className="flex flex-col md:flex-row justify-center gap-10">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm shadow-xl">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">TT</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">Ông Trần Hữu Trung</h4>
              <p className="text-blue-600 font-semibold mb-3">Giám đốc Điều hành</p>
              <p className="text-gray-600">
                Hơn 18 năm kinh nghiệm trong lĩnh vực công nghệ thông tin, từng đảm nhiệm vị trí lãnh đạo các dự án chuyển đổi số lớn tại Việt Nam và khu vực.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}