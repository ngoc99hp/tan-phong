"use client";

import { useState, useEffect } from "react";
import { Package, GraduationCap, Zap, Settings } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';

// Map icon names từ database sang Lucide components
const iconMap = {
  Package: Package,
  GraduationCap: GraduationCap,
  Zap: Zap,
  Settings: Settings,
};

export function ProductsSection() {
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Lấy sản phẩm nổi bật, đang hoạt động
      const response = await fetch("/api/products?is_active=true");
      const data = await response.json();

      if (data.success) {
        // Lọc mỗi category chỉ lấy 3 sản phẩm nổi bật
        const filteredData = data.data
          .map((categoryGroup) => ({
            ...categoryGroup,
            products: categoryGroup.products
              .filter((p) => p.is_featured) // Chỉ lấy sản phẩm nổi bật
              .slice(0, 3), // Giới hạn 3 sản phẩm
          }))
          .filter((categoryGroup) => categoryGroup.products.length > 0); // Chỉ giữ category có sản phẩm

        setProductCategories(filteredData);
      } else {
        setError(data.message || "Không thể tải dữ liệu sản phẩm");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  // Loading state
  if (loading) {
    return (
      <section id="products" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Sản phẩm của chúng tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đang tải dữ liệu sản phẩm...
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
      <section id="products" className="py-20 bg-gray-50">
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

  // Empty state
  if (productCategories.length === 0) {
    return (
      <section id="products" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Chưa có sản phẩm nào</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">Giải pháp & Sản phẩm</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đa dạng giải pháp công nghệ chuyên nghiệp, đáp ứng mọi nhu cầu của
            doanh nghiệp
          </p>
        </div>

        {/* Product Categories */}
        {productCategories.map((categoryGroup, idx) => {
          // Lấy icon component từ icon name trong database
          const IconComponent = iconMap[categoryGroup.category.icon] || Package;

          return (
            <div key={categoryGroup.category.id} className="mb-16 last:mb-0">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <IconComponent className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-gray-900">
                    {categoryGroup.category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {categoryGroup.products.length} sản phẩm nổi bật
                  </p>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {categoryGroup.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        // Hiển thị ảnh nếu có
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          onError={(e) => {
                            // Nếu ảnh lỗi, ẩn đi và hiển thị icon
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        // Hiển thị icon nếu không có ảnh
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                          <IconComponent className="text-primary" size={32} />
                        </div>
                      )}

                      {product.badge && (
                        <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h4 className="text-gray-900 font-semibold mb-2 line-clamp-2 min-h-14">
                        {product.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-18">
                        {product.description}
                      </p>
                      {/* <div className="text-primary font-bold text-lg mb-4">
                        {product.price}
                      </div> */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors text-center"
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        onClick={scrollToContact}
                        className="w-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white py-2 rounded-lg font-medium transition-colors mt-2"
                      >
                        Liên hệ tư vấn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA Banner */}
        <div className="mt-16 bg-linear-to-r from-primary to-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-white mb-4">Chưa tìm thấy giải pháp phù hợp?</h3>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn chi tiết về các giải pháp phù
            hợp nhất với nhu cầu của doanh nghiệp bạn
          </p>
          <button
            onClick={scrollToContact}
            className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Tư vấn ngay
          </button>
        </div>
      </div>
    </section>
  );
}
