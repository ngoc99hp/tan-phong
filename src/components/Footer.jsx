"use client";

import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                {/* <span className="text-white font-bold">TP</span> */}
                <Image
                  src="/tanphong-removebg-preview.png"
                  alt="Logo Tân Phong"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-white font-bold">Tân Phong</div>
                <div className="text-xs text-gray-400">
                  Technology & Trading
                </div>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Công ty Cổ phần Công nghệ Thương mại Tân Phong - Đối tác tin cậy
              trong lĩnh vực công nghệ thông tin
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              {["home", "about", "products", "services", "contact"].map(
                (id, index) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      className="hover:text-primary transition-colors"
                    >
                      {
                        [
                          "Trang chủ",
                          "Giới thiệu",
                          "Sản phẩm",
                          "Dịch vụ",
                          "Liên hệ",
                        ][index]
                      }
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 shrink-0 text-primary" />
                <span className="text-sm">
                  Số 13/24 Ngô Kim Tài, Phường Lê Chân,Thành phố Hải Phòng
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="shrink-0 text-primary" />
                <a
                  href="tel:0989150269"
                  className="hover:text-primary transition-colors"
                >
                  0989 320 383
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="shrink-0 text-primary" />
                <a
                  href="mailto:tuyendvhpu@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  tuyendvhpu@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>
            © 2024 Công ty Cổ phần Công nghệ Thương mại Tân Phong. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
