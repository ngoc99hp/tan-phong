// AdminServicesPage (fixed version)
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Icon map
const iconOptions = [
  { value: 'Lightbulb', label: '💡 Ý tưởng' },
  { value: 'Code', label: '💻 Lập trình' },
  { value: 'Package', label: '📦 Gói dịch vụ' },
  { value: 'Wrench', label: '🔧 Bảo trì' },
  { value: 'GraduationCap', label: '🎓 Giáo dục' },
  { value: 'Users', label: '👥 Đội ngũ' }
];

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'Lightbulb',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      const data = await response.json();

      if (data.success) setServices(data.data || []);
      else setFormStatus({ type: 'error', message: data.error || 'Lỗi khi tải dịch vụ' });
    } catch (error) {
      setFormStatus({ type: 'error', message: 'Không thể kết nối đến server' });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const openCreateForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      icon: 'Lightbulb',
      is_active: true,
      display_order: 0
    });
    setEditingService(null);
    setFormStatus(null);
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      icon: 'Lightbulb',
      is_active: true,
      display_order: 0
    });
    setEditingService(null);
    setFormStatus(null);
    setIsCreating(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      setFormStatus({ type: 'error', message: 'Vui lòng điền tiêu đề và slug' });
      return;
    }

    setIsSaving(true);
    setFormStatus(null);

    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus({
          type: 'success',
          message: editingService ? 'Cập nhật thành công!' : 'Thêm mới thành công!'
        });

        await fetchServices();
        setTimeout(() => resetForm(), 1200);
      } else {
        setFormStatus({ type: 'error', message: data.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setFormStatus({ type: 'error', message: 'Không thể kết nối server' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description || '',
      icon: service.icon || 'Lightbulb',
      is_active: service.is_active,
      display_order: service.display_order || 0
    });
    setEditingService(service);
    setIsCreating(true);
    setFormStatus(null);

    setTimeout(() => {
      document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setServices(prev => prev.filter(s => s.id !== id));
        setDeleteConfirm(null);
      } else alert('Lỗi: ' + data.message);

    } catch (error) {
      alert('Không thể kết nối để xóa dịch vụ');
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Dịch vụ</h1>
          <p className="text-gray-600 mt-1">Thêm, sửa, xóa các dịch vụ của công ty</p>
        </div>

        {!isCreating && (
          <button
            onClick={() => {
              openCreateForm();
              setTimeout(() => {
                document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium"
          >
            <Plus size={20} /> Thêm dịch vụ mới
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8" id="service-form">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
            </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
          </div>

          {formStatus && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              formStatus.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {formStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm">{formStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border rounded-lg"
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleFormChange}
                    className="w-5 h-5"
                  />
                  <span>Đang hoạt động</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <button type="button" onClick={resetForm} className="px-6 py-2.5 border rounded-lg">
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-primary text-white rounded-lg disabled:opacity-50"
              >
                {isSaving ? 'Đang lưu...' : editingService ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Tiêu đề</th>
                <th className="px-6 py-4 text-left">Icon</th>
                <th className="px-6 py-4 text-left">Mô tả</th>
                <th className="px-6 py-4 text-left">Thứ tự</th>
                <th className="px-6 py-4 text-left">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredServices.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-gray-500">Không có dịch vụ nào</td></tr>
              ) : (
                filteredServices.map(service => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{service.id}</td>

                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium">{service.title}</div>
                      <div className="text-xs text-gray-500">{service.slug}</div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {iconOptions.find(opt => opt.value === service.icon)?.label || service.icon}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 line-clamp-2">
                      {service.description || '-'}
                    </td>

                    <td className="px-6 py-4 text-sm">{service.display_order}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {service.is_active ? (
                          <>
                            <Eye size={16} className="text-green-600" />
                            <span className="text-xs text-green-600">Hoạt động</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={16} className="text-gray-400" />
                            <span className="text-xs text-gray-400">Tắt</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => setDeleteConfirm(service)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Xác nhận xóa</h3>
                <p className="text-gray-600">
                  Bạn có chắc muốn xóa <strong>"{deleteConfirm.title}"</strong>? Hành động không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-gray-100 rounded-lg">Hủy</button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg"
              >Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
