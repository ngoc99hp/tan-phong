'use client';

import { Target, Eye, Users } from 'lucide-react';
import Image from 'next/image';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">Giới thiệu về Tân Phong</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi là đơn vị hàng đầu trong lĩnh vực công nghệ thông tin, mang đến giải pháp toàn diện cho doanh nghiệp
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1709715357520-5e1047a2b691?w=1080&q=80"
                alt="Business Team Meeting"
                width={1080}
                height={720}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-gray-900">Lịch sử hình thành</h3>
            <p className="text-gray-600">
              Công ty Cổ phần Công nghệ Thương mại Tân Phong được thành lập với sứ mệnh mang công nghệ hiện đại đến với mọi doanh nghiệp. Qua hơn 10 năm phát triển, chúng tôi đã trở thành đối tác tin cậy của hàng trăm khách hàng trên toàn quốc.
            </p>
            <p className="text-gray-600">
              Với đội ngũ chuyên gia giàu kinh nghiệm và sự tận tâm trong từng dự án, Tân Phong không ngừng đổi mới và cải tiến để mang lại giá trị tốt nhất cho khách hàng.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-blue-50 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Target className="text-white" size={24} />
            </div>
            <h4 className="text-gray-900 mb-3">Sứ mệnh</h4>
            <p className="text-gray-600">
              Cung cấp giải pháp công nghệ thông tin toàn diện, giúp doanh nghiệp tối ưu hóa hiệu suất và phát triển bền vững
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Eye className="text-white" size={24} />
            </div>
            <h4 className="text-gray-900 mb-3">Tầm nhìn</h4>
            <p className="text-gray-600">
              Trở thành công ty công nghệ hàng đầu Việt Nam, tiên phong trong việc ứng dụng công nghệ mới
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Users className="text-white" size={24} />
            </div>
            <h4 className="text-gray-900 mb-3">Giá trị cốt lõi</h4>
            <p className="text-gray-600">
              Chất lượng - Uy tín - Đổi mới. Luôn đặt lợi ích khách hàng lên hàng đầu trong mọi quyết định
            </p>
          </div>
        </div>

        {/* Leadership */}
        <div className="text-center">
          <h3 className="text-gray-900 mb-8">Đội ngũ lãnh đạo</h3>
          <div className="flex justify-center">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md shadow-lg">
              <div className="w-32 h-32 bg-linear-to-br from-primary to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">TT</span>
              </div>
              <h4 className="text-gray-900 mb-2">Trần Hữu Trung</h4>
              <p className="text-primary mb-3 font-medium">Giám đốc điều hành</p>
              <p className="text-gray-600">
                Với hơn 15 năm kinh nghiệm trong lĩnh vực CNTT, ông Trung đã dẫn dắt Tân Phong đạt được nhiều thành tựu đáng tự hào
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}