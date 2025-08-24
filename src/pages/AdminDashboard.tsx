import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegistrationTable from '../components/RegistrationTable';
import { RegistrationData, exportToCSV, exportSummaryReport } from '../utils/csvExport';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    totalRevenue: 0,
    pendingRevenue: 0
  });

  // Admin password - you can change this to whatever you want
  const ADMIN_PASSWORD = 'cocnl2026admin';

  // Check if already authenticated on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPasswordInput('');
    setPasswordError('');
  };

  // Load registrations from localStorage on component mount
  useEffect(() => {
    if (isAuthenticated) {
      const savedRegistrations = localStorage.getItem('lectureship_registrations');
      if (savedRegistrations) {
        try {
          const parsed = JSON.parse(savedRegistrations);
          setRegistrations(parsed);
        } catch (error) {
          console.error('Error loading registrations:', error);
        }
      }
    }
  }, [isAuthenticated]);

  // Calculate stats whenever registrations change
  useEffect(() => {
    const total = registrations.length;
    const paid = registrations.filter(reg => reg.paymentStatus === 'paid').length;
    const pending = registrations.filter(reg => reg.paymentStatus === 'pending').length;
    const totalRevenue = registrations
      .filter(reg => reg.paymentStatus === 'paid')
      .reduce((sum, reg) => sum + reg.totalAmount, 0);
    const pendingRevenue = registrations
      .filter(reg => reg.paymentStatus === 'pending')
      .reduce((sum, reg) => sum + reg.totalAmount, 0);

    setStats({ total, paid, pending, totalRevenue, pendingRevenue });
  }, [registrations]);

  // Save registrations to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('lectureship_registrations', JSON.stringify(registrations));
    }
  }, [registrations, isAuthenticated]);

  const handleUpdatePaymentStatus = (id: string, status: 'pending' | 'paid' | 'partial' | 'refunded') => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, paymentStatus: status } : reg
      )
    );
  };

  const handleDeleteRegistration = (id: string) => {
    setRegistrations(prev => prev.filter(reg => reg.id !== id));
  };

  const handleAddTestData = () => {
    const testRegistration: RegistrationData = {
      id: `test_${Date.now()}`,
      timestamp: new Date().toISOString(),
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      address: '123 Main Street',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30303',
      registrationType: 'individual-early',
      quantity: 1,
      attendeeNames: 'John Smith',
      attendeeContacts: '',
      specialEvents: ['memorial-banquet'],
      vendorTables: 0,
      advertisements: [],
      dayToDayDates: [],
      additionalNotes: 'Test registration',
      totalAmount: 265, // 190 + 75
      paymentStatus: 'pending'
    };

    setRegistrations(prev => [testRegistration, ...prev]);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL registration data? This cannot be undone.')) {
      setRegistrations([]);
      localStorage.removeItem('lectureship_registrations');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          setRegistrations(data);
          alert(`Imported ${data.length} registrations successfully!`);
        } else {
          alert('Invalid file format. Please select a valid JSON backup file.');
        }
      } catch (error) {
        alert('Error reading file. Please select a valid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportBackup = () => {
    const dataStr = JSON.stringify(registrations, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lectureship_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-slate-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🔒</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Admin Access Required
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Churches of Christ National Lectureship 2026
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin password"
              />
            </div>

            {passwordError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                {passwordError}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Access Dashboard
              </button>
            </div>

            <div className="text-center">
              <Link 
                to="/"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                ← Back to Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Churches of Christ National Lectureship 2026</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🔓 Logout
              </button>
              <Link 
                to="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Revenue Collected</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⏰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.pendingRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => exportToCSV(registrations)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              disabled={registrations.length === 0}
            >
              📊 Export CSV
            </button>
            
            <button
              onClick={() => exportSummaryReport(registrations)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={registrations.length === 0}
            >
              📋 Export Summary Report
            </button>
            
            <button
              onClick={handleExportBackup}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              disabled={registrations.length === 0}
            >
              💾 Export Backup
            </button>
            
            <label className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer">
              📁 Import Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleAddTestData}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🧪 Add Test Data
            </button>
            
            <button
              onClick={handleClearAllData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              disabled={registrations.length === 0}
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* Registration Table */}
        <RegistrationTable
          registrations={registrations}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          onDeleteRegistration={handleDeleteRegistration}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
