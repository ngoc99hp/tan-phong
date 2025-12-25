"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      setSubmitStatus({
        type: "error",
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message:
            data.message ||
            "Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        // Scroll to success message
        setTimeout(() => {
          const element = document.getElementById("contact-form");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Có lỗi xảy ra. Vui lòng thử lại sau.",
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Không thể kết nối đến server. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline.",
      });
    } finally {
      setIsSubmitting(false);

      // Auto hide success message after 10 seconds
      if (submitStatus?.type === "success") {
        setTimeout(() => setSubmitStatus(null), 10000);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when user starts typing
    if (submitStatus?.type === "error") {
      setSubmitStatus(null);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hãy để lại thông tin, chúng tôi sẽ liên hệ tư vấn cho bạn trong thời
            gian sớm nhất
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Company Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-gray-900 font-semibold mb-2">
                Thông tin liên hệ
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Công ty Cổ phần Công nghệ Thương mại Tân Phong
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 shrink-0" size={20} />
                  <p className="text-gray-600 text-sm">
                    Số 13/24 Ngô Kim Tài, Phường Lê Chân,Thành phố Hải Phòng
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-primary shrink-0" size={20} />
                  <a
                    href="tel:0989150269"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    0989 320 383
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-primary shrink-0" size={20} />
                  <a
                    href="mailto:contact@tanphong.vn"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    tuyendvhpu@gmail.com
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-primary mt-1 shrink-0" size={20} />
                  <div className="text-sm">
                    <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                    <p className="text-gray-600">Thứ 7: 8:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-linear-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <h4 className="text-white font-semibold mb-2">Hotline hỗ trợ</h4>
              <p className="text-blue-100 text-sm mb-4">
                Liên hệ ngay để được tư vấn
              </p>
              <a
                href="tel:0989150269"
                className="text-3xl font-bold hover:underline block"
              >
                0989 320 383
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2" id="contact-form">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-gray-900 font-semibold mb-2">
                Gửi tin nhắn cho chúng tôi
              </h4>
              <p className="text-gray-600 text-sm mb-6">
                Điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi trong
                vòng 24h
              </p>

              {/* Status Messages */}
              {submitStatus && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle size={20} className="shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block font-medium">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block font-medium">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0989 150 269"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block font-medium">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Tư vấn giải pháp ERP..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block font-medium">
                    Nội dung tin nhắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung cần tư vấn..."
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="p-6 border-b">
              <h4 className="text-gray-900 font-semibold">Bản đồ đường đi</h4>
              <p className="text-gray-600 text-sm mt-1">
                Số 13/24 Ngô Kim Tài, Phường Lê Chân,Thành phố Hải Phòng
              </p>
            </div>
            <iframe
              src="https://www.google.com/maps?q=Số%2013/24%20Ngô%20Kim%20Tài,%20Phường%20Lê%20Chân,%20Thành%20phố%20Hải%20Phòng&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Số 13/24 Ngô Kim Tài, Lê Chân, Hải Phòng"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
