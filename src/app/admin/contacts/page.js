'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Filter, Eye, Check, Clock, X } from 'lucide-react';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [filterStatus]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const url = filterStatus === 'all' 
        ? '/api/contact' 
        : `/api/contact?status=${filterStatus}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingStatus(id);
      const response = await fetch('/api/contact', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setContacts(contacts.map(contact => 
          contact.id === id ? { ...contact, status: newStatus } : contact
        ));
        
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { label: 'Mới', color: 'bg-blue-100 text-blue-700', icon: Clock },
      processing: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: Check }
    };

    const config = statusConfig[status] || statusConfig.new;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Liên hệ</h1>
          <p className="text-gray-600 mt-1">Xem và xử lý các yêu cầu liên hệ từ khách hàng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {contacts.length}
          </div>
          <div className="text-sm text-gray-600">Tổng liên hệ</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {contacts.filter(c => c.status === 'new').length}
          </div>
          <div className="text-sm text-gray-600">Mới</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {contacts.filter(c => c.status === 'processing').length}
          </div>
          <div className="text-sm text-gray-600">Đang xử lý</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {contacts.filter(c => c.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Hoàn thành</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</span>
          <div className="flex gap-2 ml-4">
            {['all', 'new', 'processing', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Tất cả' : status === 'new' ? 'Mới' : status === 'processing' ? 'Đang xử lý' : 'Hoàn thành'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Người liên hệ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thông tin</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tiêu đề</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thời gian</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Không có liên hệ nào
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">#{contact.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} />
                          {contact.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          {contact.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{contact.subject || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {formatDate(contact.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Chi tiết liên hệ #{selectedContact.id}</h3>
                <p className="text-sm text-gray-600">{formatDate(selectedContact.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Thông tin người liên hệ</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Họ và tên</label>
                    <div className="text-sm font-medium text-gray-900 mt-1">{selectedContact.name}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <div className="text-sm text-gray-900 mt-1">{selectedContact.email}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Số điện thoại</label>
                    <div className="text-sm text-gray-900 mt-1">{selectedContact.phone}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Trạng thái</label>
                    <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              {selectedContact.subject && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Tiêu đề</h4>
                  <p className="text-sm text-gray-900">{selectedContact.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Nội dung tin nhắn</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Cập nhật trạng thái</h4>
                <div className="flex gap-2">
                  {['new', 'processing', 'completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedContact.id, status)}
                      disabled={updatingStatus === selectedContact.id || selectedContact.status === status}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        selectedContact.status === status
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingStatus === selectedContact.id ? 'Đang cập nhật...' : 
                        status === 'new' ? 'Mới' : 
                        status === 'processing' ? 'Đang xử lý' : 
                        'Hoàn thành'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-6">
              <button
                onClick={() => setSelectedContact(null)}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}