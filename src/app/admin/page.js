'use client';

import { useState, useEffect } from 'react';
import { Package, Layers, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalContacts: 0,
    featuredProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsRes = await fetch('/api/products?is_active=true');
      const productsData = await productsRes.json();
      
      // Fetch categories
      const categoriesRes = await fetch('/api/categories');
      const categoriesData = await categoriesRes.json();

      // Fetch contacts
      const contactsRes = await fetch('/api/contact?status=new');
      const contactsData = await contactsRes.json();

      if (productsData.success && categoriesData.success) {
        // Flatten products
        const allProducts = productsData.data.flatMap(group => group.products);
        const featuredCount = allProducts.filter(p => p.is_featured).length;

        setStats({
          totalProducts: allProducts.length,
          totalCategories: categoriesData.total,
          totalContacts: contactsData.success ? contactsData.total : 0,
          featuredProducts: featuredCount
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      title: 'Danh mục',
      value: stats.totalCategories,
      icon: Layers,
      color: 'bg-green-500',
      link: '/admin/categories'
    },
    {
      title: 'Sản phẩm nổi bật',
      value: stats.featuredProducts,
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/admin/products'
    },
    {
      title: 'Liên hệ',
      value: stats.totalContacts,
      icon: MessageSquare,
      color: 'bg-orange-500',
      link: '/admin/contacts'
    }
  ];

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan hệ thống quản trị</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <h3 className="text-gray-600 font-medium">{stat.title}</h3>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/admin/products/create"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all"
          >
            <Package className="text-primary" size={24} />
            <div>
              <h4 className="font-medium text-gray-900">Thêm sản phẩm</h4>
              <p className="text-sm text-gray-600">Tạo sản phẩm mới</p>
            </div>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all"
          >
            <Layers className="text-primary" size={24} />
            <div>
              <h4 className="font-medium text-gray-900">Quản lý sản phẩm</h4>
              <p className="text-sm text-gray-600">Xem danh sách</p>
            </div>
          </Link>

          <Link
            href="/admin/services"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all"
          >
            <MessageSquare className="text-primary" size={24} />
            <div>
              <h4 className="font-medium text-gray-900">Quản lý dịch vụ</h4>
              <p className="text-sm text-gray-600">Xem danh sách</p>
            </div>
          </Link>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin hệ thống</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Phiên bản</span>
            <span className="font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Database</span>
            <span className="font-medium text-gray-900">PostgreSQL (Neon)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Framework</span>
            <span className="font-medium text-gray-900">Next.js 15</span>
          </div>
        </div>
      </div>
    </div>
  );
}