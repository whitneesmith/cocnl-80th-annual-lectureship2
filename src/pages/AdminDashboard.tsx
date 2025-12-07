import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegistrationTable from '../components/RegistrationTable';
import { RegistrationData, exportToCSV, exportSummaryReport } from '../utils/csvExport';
import { getAllRegistrations, exportRegistrationsForBackup, importRegistrationsFromBackup } from '../utils/registrationStorage';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
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

  // Load registrations from all storage sources on component mount
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Loading registrations from all storage sources...');
      
      try {
        // Use the new centralized storage system
        const allRegistrations = getAllRegistrations();
        console.log('Total registrations found:', allRegistrations.length);
        console.log('Registrations loaded:', allRegistrations);
        
        setRegistrations(allRegistrations);
        
        // Also check individual storage locations for debugging
        const localStorage_main = localStorage.getItem('lectureship_registrations');
        const localStorage_shared = localStorage.getItem('lectureship_shared_registrations');
        
        console.log('Debug - Main localStorage:', localStorage_main ? JSON.parse(localStorage_main).length + ' items' : 'empty');
        console.log('Debug - Shared localStorage:', localStorage_shared ? JSON.parse(localStorage_shared).length + ' items' : 'empty');
        
      } catch (error) {
        console.error('Error loading registrations:', error);
        
        // Fallback to old method
        const savedRegistrations = localStorage.getItem('lectureship_registrations');
        if (savedRegistrations) {
          try {
            const parsed = JSON.parse(savedRegistrations);
            console.log('Fallback - loaded from main localStorage:', parsed.length);
            setRegistrations(parsed);
          } catch (parseError) {
            console.error('Error parsing fallback registrations:', parseError);
          }
        } else {
          console.log('No registrations found in any storage location');
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

  // Save registrations to multiple storage locations whenever they change
  useEffect(() => {
    if (isAuthenticated && registrations.length > 0) {
      // Save to main localStorage
      localStorage.setItem('lectureship_registrations', JSON.stringify(registrations));
      
      // Save to shared localStorage
      localStorage.setItem('lectureship_shared_registrations', JSON.stringify(registrations));
      
      // Save backup with timestamp
      const backupKey = `lectureship_backup_${new Date().toISOString().split('T')[0]}`;
      localStorage.setItem(backupKey, JSON.stringify(registrations));
      
      console.log('Registrations saved to multiple storage locations');
    }
  }, [registrations, isAuthenticated]);

  const handleUpdatePaymentStatus = (id: string, status: 'pending' | 'paid' | 'partial' | 'refunded') => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, paymentStatus: status } : reg
      )
    );
    console.log(`Updated payment status for ${id} to ${status}`);
  };

  const handleDeleteRegistration = (id: string) => {
    setRegistrations(prev => prev.filter(reg => reg.id !== id));
    console.log(`Deleted registration ${id}`);
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
      
      // Clear all storage locations
      localStorage.removeItem('lectureship_registrations');
      localStorage.removeItem('lectureship_shared_registrations');
      
      // Clear backup keys
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('lectureship_backup_')) {
          localStorage.removeItem(key);
        }
      }
      
      console.log('All registration data cleared');
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
          
          // Also save to storage system
          const success = importRegistrationsFromBackup(JSON.stringify(data));
          if (success) {
            alert(`Imported ${data.length} registrations successfully!`);
          } else {
            alert('Import completed but there was an issue saving to storage.');
          }
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
    const dataStr = exportRegistrationsForBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lectureship_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRefreshData = () => {
    console.log('Refreshing registration data...');
    const allRegistrations = getAllRegistrations();
    setRegistrations(allRegistrations);
    alert(`Refreshed! Found ${allRegistrations.length} total registrations.`);
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
        {/* Debug Information - Remove this after troubleshooting */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-900 mb-4">🔍 Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Registrations in state:</strong> {registrations.length}</p>
            <p><strong>Main localStorage:</strong> {localStorage.getItem('lectureship_registrations') ? JSON.parse(localStorage.getItem('lectureship_registrations') || '[]').length + ' items' : 'Empty'}</p>
            <p><strong>Shared localStorage:</strong> {localStorage.getItem('lectureship_shared_registrations') ? JSON.parse(localStorage.getItem('lectureship_shared_registrations') || '[]').length + ' items' : 'Empty'}</p>
            <p><strong>Backup keys found:</strong> {
              Array.from({length: localStorage.length}, (_, i) => localStorage.key(i))
                .filter(key => key && key.startsWith('lectureship_backup_')).length
            }</p>
            <p><strong>Total unique registrations:</strong> {getAllRegistrations().length}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                console.log('=== FULL DEBUG INFO ===');
                console.log('Current registrations state:', registrations);
                console.log('Main localStorage:', localStorage.getItem('lectureship_registrations'));
                console.log('Shared localStorage:', localStorage.getItem('lectureship_shared_registrations'));
                console.log('All registrations from getAllRegistrations():', getAllRegistrations());
                
                // List all backup keys
                const backupKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.startsWith('lectureship_backup_')) {
                    backupKeys.push(key);
                  }
                }
                console.log('Backup keys:', backupKeys);
              }}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              🔍 Log Full Debug Info
            </button>
            
            <button
              onClick={handleRefreshData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh Now
            </button>
          </div>
        </div>

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

        {/* Enhanced Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
          
          {/* Registration Management */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Registration Management</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleRefreshData}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
              
              <button
                onClick={handleAddTestData}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🧪 Add Test Registration
              </button>
              
              <button
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ➕ Add Manual Registration
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

          {/* Data Export/Import */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Data Export/Import</h3>
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
            </div>
          </div>

          {/* Email Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">📧 Email-Based Registration Tracking</h3>
            <p className="text-blue-700 text-sm mb-3">
              Since registrations are now sent via email, you can manually add them here when you receive registration emails.
            </p>
            <div className="text-blue-600 text-sm">
              <p><strong>📥 Check your email for:</strong></p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Subject: "NEW REGISTRATION: [Name]"</li>
                <li>Subject: "DATABASE ENTRY: [Name]"</li>
                <li>Registration confirmation emails</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Manual Registration Entry Form */}
        {showManualEntry && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">➕ Add Manual Registration</h2>
              <button
                onClick={() => setShowManualEntry(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>💡 Tip:</strong> Use this form to manually add registrations from emails or phone calls. 
                You can copy/paste information from registration emails you receive.
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              
              const newRegistration: RegistrationData = {
                id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString(),
                firstName: formData.get('firstName') as string,
                lastName: formData.get('lastName') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                address: formData.get('address') as string,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                zipCode: formData.get('zipCode') as string,
                registrationType: formData.get('registrationType') as string,
                quantity: parseInt(formData.get('quantity') as string) || 1,
                attendeeNames: formData.get('attendeeNames') as string,
                attendeeContacts: formData.get('attendeeContacts') as string,
                specialEvents: formData.get('specialEvents') ? (formData.get('specialEvents') as string).split(',').map(s => s.trim()).filter(s => s) : [],
                vendorTables: parseInt(formData.get('vendorTables') as string) || 0,
                advertisements: formData.get('advertisements') ? (formData.get('advertisements') as string).split(',').map(s => s.trim()).filter(s => s) : [],
                dayToDayDates: formData.get('dayToDayDates') ? (formData.get('dayToDayDates') as string).split(',').map(s => s.trim()).filter(s => s) : [],
                additionalNotes: formData.get('additionalNotes') as string,
                totalAmount: parseFloat(formData.get('totalAmount') as string) || 0,
                paymentStatus: formData.get('paymentStatus') as 'pending' | 'paid' | 'partial' | 'refunded'
              };

              setRegistrations(prev => [newRegistration, ...prev]);
              setShowManualEntry(false);
              alert('Registration added successfully!');
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input name="firstName" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input name="lastName" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input name="phone" type="tel" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input name="address" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input name="city" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input name="state" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input name="zipCode" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Type</label>
                  <select name="registrationType" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Special Events Only</option>
                    <option value="individual-early">Individual Early Bird - $190</option>
                    <option value="individual-regular">Individual Regular - $210</option>
                    <option value="georgia-early">Georgia Resident Early Bird - $175</option>
                    <option value="georgia-regular">Georgia Resident Regular - $195</option>
                    <option value="group-5-early">Group 5 People Early Bird - $925</option>
                    <option value="group-5-regular">Group 5 People Regular - $975</option>
                    <option value="group-10-early">Group 10 People Early Bird - $1,800</option>
                    <option value="group-10-regular">Group 10 People Regular - $1,925</option>
                    <option value="day-to-day">Day-to-Day Registration - $75 per day</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input name="quantity" type="number" min="1" defaultValue="1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount ($)</label>
                  <input name="totalAmount" type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select name="paymentStatus" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Attendee Names</label>
                <textarea name="attendeeNames" rows={3} placeholder="One name per line" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Events (comma-separated)</label>
                <input name="specialEvents" type="text" placeholder="memorial-banquet" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea name="additionalNotes" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              
              <div className="mt-6 flex gap-4">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  ✅ Add Registration
                </button>
                <button type="button" onClick={() => setShowManualEntry(false)} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
