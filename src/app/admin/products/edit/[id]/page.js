// src/app/admin/products/edit/[id]/page.js
'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import RichTextEditor để tránh SSR issues
const RichTextEditor = dynamic(
  () => import('@/components/RichTextEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="border border-gray-300 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

export default function EditProductPage({ params }) {
  const router = useRouter();
  
  // Unwrap params Promise với React.use()
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    content: '',
    price: '',
    badge: '',
    image_url: '',
    meta_title: '',
    meta_description: '',
    is_featured: false,
    is_active: true,
    display_order: 0,
    published_at: ''
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchCategories();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        const product = data.data;
        setFormData({
          category_id: product.category_id || '',
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          content: product.content || '',
          price: product.price || '',
          badge: product.badge || '',
          image_url: product.image_url || '',
          meta_title: product.meta_title || '',
          meta_description: product.meta_description || '',
          is_featured: product.is_featured || false,
          is_active: product.is_active !== false,
          display_order: product.display_order || 0,
          published_at: product.published_at 
            ? new Date(product.published_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Không tìm thấy sản phẩm'
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Không thể tải thông tin sản phẩm'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleContentChange = (html) => {
    setFormData({
      ...formData,
      content: html
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.name || !formData.slug) {
      setSubmitStatus({
        type: 'error',
        message: 'Vui lòng điền đầy đủ các trường bắt buộc'
      });
      return;
    }

    setSaving(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          category_id: parseInt(formData.category_id),
          display_order: parseInt(formData.display_order) || 0
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Cập nhật sản phẩm thành công!'
        });
        
        setTimeout(() => {
          router.push('/admin/products');
        }, 1500);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Có lỗi xảy ra khi cập nhật sản phẩm'
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Không thể kết nối đến server'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
          <p className="text-gray-600 mt-1">ID: #{productId}</p>
        </div>
      </div>

      {/* Status Message */}
      {submitStatus && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          submitStatus.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {submitStatus.type === 'success' ? (
            <CheckCircle size={20} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
          )}
          <p>{submitStatus.message}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        {/* Basic Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Tên sản phẩm */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: ERP Tổng hợp cho Doanh nghiệp Vừa và Nhỏ"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
                disabled={saving}
              />
            </div>

            {/* Slug */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="VD: erp-tong-hop-sme"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
                disabled={saving}
              />
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
                disabled={saving}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Giá */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="VD: Từ 150.000.000đ"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                disabled={saving}
              />
            </div>

            {/* Mô tả ngắn */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả ngắn gọn về sản phẩm (hiển thị trong danh sách)"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                disabled={saving}
              />
            </div>

            {/* Badge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge (nhãn)
              </label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="VD: Best Seller, Hot, Mới"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                disabled={saving}
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                disabled={saving}
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL hình ảnh
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                disabled={saving}
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="h-32 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="md:col-span-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  disabled={saving}
                />
                <span className="text-sm font-medium text-gray-700">Sản phẩm nổi bật</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  disabled={saving}
                />
                <span className="text-sm font-medium text-gray-700">Đang hoạt động</span>
              </label>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nội dung chi tiết</h3>
          <div className="space-y-6">
            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung bài viết
              </label>
              <RichTextEditor 
                content={formData.content}
                onChange={handleContentChange}
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-2">
                Viết nội dung chi tiết về sản phẩm. Sử dụng các công cụ định dạng để tạo bài viết đẹp mắt.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tối ưu SEO</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Meta Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title (Tiêu đề SEO)
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                placeholder="Tự động lấy từ tên sản phẩm"
                maxLength={200}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Tối đa 60-70 ký tự | Hiện tại: {formData.meta_title.length} ký tự
              </p>
            </div>

            {/* Meta Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description (Mô tả SEO)
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                placeholder="Nhập mô tả ngắn gọn cho SEO (hiển thị trên Google)"
                rows={3}
                maxLength={320}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Tối đa 150-160 ký tự | Hiện tại: {formData.meta_description.length} ký tự
              </p>
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày xuất bản
              </label>
              <input
                type="date"
                name="published_at"
                value={formData.published_at}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={20} />
                Cập nhật sản phẩm
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}