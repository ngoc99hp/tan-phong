'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Eye, Tag, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

/* ============================================================
   ================== CLIENT-SIDE DETAIL PAGE =================
   ============================================================ */

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.slug) {
      fetchProductDetail(params.slug);
      incrementViewCount(params.slug);
    }
  }, [params.slug]);

  const fetchProductDetail = async (slug) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/slug/${slug}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data);
        fetchRelatedProducts(data.data.category_id, data.data.id);
      } else {
        setError(data.message || 'Không tìm thấy sản phẩm');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId, currentId) => {
    try {
      const response = await fetch(`/api/products?category_id=${categoryId}&limit=3`);
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        const related = data.data[0].products
          .filter((p) => p.id !== currentId)
          .slice(0, 3);

        setRelatedProducts(related);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const incrementViewCount = async (slug) => {
    try {
      await fetch(`/api/products/slug/${slug}/view`, { method: 'POST' });
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(d));
  };

  const scrollToContact = () => router.push('/?scroll=contact');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã copy link sản phẩm!');
    }
  };

  /* ============================================================
     ================= STRUCTURED DATA JSON-LD ==================
     ============================================================ */

  const productStructuredData =
    product != null
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.image_url,
          brand: {
            '@type': 'Brand',
            name: 'Tân Phong Technology'
          },
          offers: product.price
            ? {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'VND',
                availability: 'https://schema.org/InStock'
              }
            : undefined
        }
      : null;

  /* ================== RENDER UI ==================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="bg-red-50 text-red-600 p-8 rounded-lg inline-block max-w-md">
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h2>
            <p className="mb-6">{error}</p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ArrowLeft size={20} />
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {productStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* ======== Breadcrumb ======== */}
        <div className="bg-white border-b mt-20">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-primary">
                Trang chủ
              </Link>
              <span>/</span>
              <Link href="/#products" className="text-gray-600 hover:text-primary">
                Sản phẩm
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.category_name}</span>
              <span>/</span>
              <span className="text-gray-400 line-clamp-1">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ==== Main Layout ==== */}
        <main className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ==== Main Article ==== */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-2xl shadow-lg p-8">
                {/* Title */}
                <div className="mb-6">
                  {product.badge && (
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      {product.badge}
                    </span>
                  )}

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(product.published_at || product.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      <span>{product.views_count || 0} lượt xem</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag size={16} />
                      <Link href="/#products" className="text-primary hover:underline">
                        {product.category_name}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Image */}
                {product.image_url && (
                  <div className="mb-8 rounded-xl overflow-hidden">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={800}
                      height={450}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* HTML Content */}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: product.content || '<p>Nội dung đang được cập nhật...</p>'
                  }}
                />

                {/* CTA & Price */}
                <div className="mt-12 p-8 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Giá sản phẩm</p>
                      <p className="text-3xl font-bold text-primary">
                        Liên hệ
                      </p>
                    </div>
                    <button
                      onClick={scrollToContact}
                      className="bg-primary text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl"
                    >
                      Liên hệ tư vấn ngay
                    </button>
                  </div>
                </div>

                {/* Share */}
                <div className="mt-8 pt-8 border-t">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary"
                  >
                    <Share2 size={20} />
                    <span>Chia sẻ sản phẩm</span>
                  </button>
                </div>
              </article>
            </div>

            {/* ==== Sidebar ==== */}
            <aside className="lg:col-span-1 z-50">
              <div className="bg-linear-to-br from-primary to-blue-600 rounded-2xl p-8 text-white mb-8 sticky top-24 z-50">
                <h3 className="text-xl font-bold mb-4">Cần tư vấn?</h3>
                <p className="text-blue-100 mb-6">
                  Liên hệ ngay với chúng tôi để được tư vấn chi tiết về sản phẩm này
                </p>

                <div className="space-y-4">
                  <a
                    href="tel:0989150269"
                    className="block bg-white text-primary px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-100"
                  >
                    Hotline: 0989 150 269
                  </a>

                  <button
                    onClick={scrollToContact}
                    className="w-full bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary"
                  >
                    Gửi yêu cầu tư vấn
                  </button>
                </div>
              </div>

              {/* Related products */}
              {relatedProducts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Sản phẩm liên quan</h3>
                  <div className="space-y-4">
                    {relatedProducts.map((related) => (
                      <Link
                        key={related.id}
                        href={`/products/${related.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
                          {related.image_url ? (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={related.image_url}
                                alt={related.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Tag className="text-primary" size={24} />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold group-hover:text-primary transition line-clamp-2">
                              {related.name}
                            </h4>
                            <p className="text-sm text-primary">
                              {related.price || 'Liên hệ'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
