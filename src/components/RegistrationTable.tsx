import React, { useState } from 'react';
import { RegistrationData } from '../utils/csvExport';

interface RegistrationTableProps {
  registrations: RegistrationData[];
  onUpdatePaymentStatus: (id: string, status: 'pending' | 'paid' | 'partial' | 'refunded') => void;
  onDeleteRegistration: (id: string) => void;
}

const RegistrationTable: React.FC<RegistrationTableProps> = ({
  registrations,
  onUpdatePaymentStatus,
  onDeleteRegistration
}) => {
  const [sortField, setSortField] = useState<keyof RegistrationData>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sort registrations
  const sortedRegistrations = [...registrations].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter registrations
  const filteredRegistrations = sortedRegistrations.filter(reg => {
    const matchesStatus = filterStatus === 'all' || reg.paymentStatus === filterStatus;
    const matchesSearch = searchTerm === '' || 
      reg.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });

  const handleSort = (field: keyof RegistrationData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (registrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Registrations Yet</h3>
        <p className="text-gray-500">Registrations will appear here as people sign up for the lectureship.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('timestamp')}
              >
                Date {sortField === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('firstName')}
              >
                Name {sortField === 'firstName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalAmount')}
              >
                Amount {sortField === 'totalAmount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRegistrations.map((registration) => (
              <tr key={registration.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(registration.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {registration.firstName} {registration.lastName}
                  </div>
                  {registration.quantity > 1 && (
                    <div className="text-xs text-gray-500">
                      {registration.quantity} people
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{registration.email}</div>
                  <div>{registration.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="font-medium">
                    {registration.registrationType || 'Special Events Only'}
                  </div>
                  {registration.dayToDayDates.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Days: {registration.dayToDayDates.join(', ')}
                    </div>
                  )}
                  {registration.vendorTables > 0 && (
                    <div className="text-xs text-blue-600">
                      {registration.vendorTables} vendor table{registration.vendorTables > 1 ? 's' : ''}
                    </div>
                  )}
                  {registration.specialEvents.length > 0 && (
                    <div className="text-xs text-purple-600">
                      Events: {registration.specialEvents.join(', ')}
                    </div>
                  )}
                  {registration.advertisements.length > 0 && (
                    <div className="text-xs text-green-600">
                      Ads: {registration.advertisements.length}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${registration.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={registration.paymentStatus}
                    onChange={(e) => onUpdatePaymentStatus(registration.id, e.target.value as any)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getPaymentStatusColor(registration.paymentStatus)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this registration?')) {
                        onDeleteRegistration(registration.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrationTable;
