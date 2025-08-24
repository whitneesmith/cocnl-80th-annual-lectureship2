// CSV Export utility for registration data
export interface RegistrationData {
  id: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  registrationType: string;
  quantity: number;
  attendeeNames: string;
  attendeeContacts: string;
  specialEvents: string[];
  vendorTables: number;
  advertisements: string[];
  dayToDayDates: string[];
  additionalNotes: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
}

export const exportToCSV = (registrations: RegistrationData[], filename: string = 'registrations') => {
  if (registrations.length === 0) {
    alert('No registrations to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Registration Date',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Address',
    'City',
    'State',
    'ZIP Code',
    'Registration Type',
    'Quantity',
    'Attendee Names',
    'Attendee Contacts',
    'Special Events',
    'Vendor Tables',
    'Advertisements',
    'Day-to-Day Dates',
    'Additional Notes',
    'Total Amount',
    'Payment Status'
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...registrations.map(reg => [
      reg.id,
      reg.timestamp,
      `"${reg.firstName}"`,
      `"${reg.lastName}"`,
      reg.email,
      reg.phone,
      `"${reg.address}"`,
      `"${reg.city}"`,
      reg.state,
      reg.zipCode,
      `"${reg.registrationType}"`,
      reg.quantity,
      `"${reg.attendeeNames.replace(/"/g, '""')}"`,
      `"${reg.attendeeContacts.replace(/"/g, '""')}"`,
      `"${reg.specialEvents.join(', ')}"`,
      reg.vendorTables,
      `"${reg.advertisements.join(', ')}"`,
      `"${reg.dayToDayDates.join(', ')}"`,
      `"${reg.additionalNotes.replace(/"/g, '""')}"`,
      reg.totalAmount,
      reg.paymentStatus
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportSummaryReport = (registrations: RegistrationData[]) => {
  const summary = {
    totalRegistrations: registrations.length,
    totalRevenue: registrations.reduce((sum, reg) => sum + reg.totalAmount, 0),
    paidRegistrations: registrations.filter(reg => reg.paymentStatus === 'paid').length,
    pendingPayments: registrations.filter(reg => reg.paymentStatus === 'pending').length,
    registrationTypes: {} as { [key: string]: number },
    vendorTables: registrations.reduce((sum, reg) => sum + reg.vendorTables, 0),
    specialEvents: {} as { [key: string]: number }
  };

  // Count registration types
  registrations.forEach(reg => {
    if (reg.registrationType) {
      summary.registrationTypes[reg.registrationType] = (summary.registrationTypes[reg.registrationType] || 0) + 1;
    }
  });

  // Count special events
  registrations.forEach(reg => {
    reg.specialEvents.forEach(event => {
      summary.specialEvents[event] = (summary.specialEvents[event] || 0) + 1;
    });
  });

  const summaryContent = [
    'CHURCHES OF CHRIST NATIONAL LECTURESHIP - REGISTRATION SUMMARY',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'OVERVIEW',
    `Total Registrations: ${summary.totalRegistrations}`,
    `Total Revenue: $${summary.totalRevenue}`,
    `Paid Registrations: ${summary.paidRegistrations}`,
    `Pending Payments: ${summary.pendingPayments}`,
    `Vendor Tables: ${summary.vendorTables}`,
    '',
    'REGISTRATION TYPES',
    ...Object.entries(summary.registrationTypes).map(([type, count]) => `${type}: ${count}`),
    '',
    'SPECIAL EVENTS',
    ...Object.entries(summary.specialEvents).map(([event, count]) => `${event}: ${count}`)
  ].join('\n');

  const blob = new Blob([summaryContent], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `lectureship_summary_${new Date().toISOString().split('T')[0]}.txt`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
