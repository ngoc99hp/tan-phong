"use client";

import { ArrowRight, Award, Users, TrendingUp } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="pt-20 min-h-screen flex items-center bg-linear-to-br from-blue-50 to-white"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-medium">
              Công nghệ & Thương mại
            </div>

            <h1 className="text-gray-900">
              Công ty Cổ phần Công nghệ Thương mại Tân Phong
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Đối tác tin cậy trong <strong>Tư vấn Giải pháp CNTT</strong>,{" "}
              <strong>Phát triển Phần mềm</strong>, <strong>EdTech</strong>,{" "}
              <strong>ERP</strong> và <strong>Chuyển đổi số</strong> cho doanh
              nghiệp
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection("products")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl"
              >
                Khám phá Giải pháp
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all"
              >
                Tư vấn miễn phí
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="text-blue-600" size={24} />
                  <div className="text-3xl font-bold text-gray-900">10+</div>
                </div>
                <p className="text-sm text-gray-600">Năm kinh nghiệm</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="text-blue-600" size={24} />
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                </div>
                <p className="text-sm text-gray-600">Khách hàng</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="text-blue-600" size={24} />
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                </div>
                <p className="text-sm text-gray-600">Hải lòng</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1689467892123-107febc3311f?w=1080&q=80"
                alt="Modern Technology Office"
                width={1080}
                height={720}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
