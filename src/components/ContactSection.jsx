'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setSubmitStatus({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }
      
      setSubmitStatus({ type: 'success', message: data.message });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hãy để lại thông tin, chúng tôi sẽ liên hệ tư vấn cho bạn trong thời gian sớm nhất
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Company Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-gray-900 font-semibold mb-2">Thông tin liên hệ</h4>
              <p className="text-gray-600 text-sm mb-4">Công ty Cổ phần Công nghệ Thương mại Tân Phong</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                  <p className="text-gray-600 text-sm">
                    Số 13 lô 7 Quán Nam, Ngô Kim Tài, Phường Kênh Dương, Quận Lê Chân, Hải Phòng
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="text-primary flex-shrink-0" size={20} />
                  <a href="tel:0989150269" className="text-gray-600 hover:text-primary">
                    0989 150 269
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="text-primary flex-shrink-0" size={20} />
                  <a href="mailto:contact@tanphong.vn" className="text-gray-600 hover:text-primary">
                    contact@tanphong.vn
                  </a>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="text-primary mt-1 flex-shrink-0" size={20} />
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
              <a href="tel:0989150269" className="text-3xl font-bold hover:underline">
                0989 150 269
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-gray-900 font-semibold mb-2">Gửi tin nhắn cho chúng tôi</h4>
              <p className="text-gray-600 text-sm mb-6">
                Điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi trong vòng 24h
              </p>

              {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123 456 789"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Tư vấn sản phẩm..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Nội dung tin nhắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung cần tư vấn..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>Đang gửi...</>
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
                Số 13 lô 7 Quán Nam, Ngô Kim Tài, Phường Kênh Dương, Quận Lê Chân, Hải Phòng
              </p>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.4961234567!2d106.68269!3d20.86234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDUxJzQ0LjQiTiAxMDbCsDQwJzU3LjciRQ!5e0!3m2!1svi!2s!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Tân Phong Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}