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

export const exportToCSV = (registrations: RegistrationData[]) => {
  if (registrations.length === 0) {
    alert('No registrations to export');
    return;
  }

  const headers = [
    'Registration ID',
    'Date',
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

  const csvContent = [
    headers.join(','),
    ...registrations.map(reg => [
      reg.id,
      new Date(reg.timestamp).toLocaleDateString(),
      `"${reg.firstName}"`,
      `"${reg.lastName}"`,
      reg.email,
      reg.phone,
      `"${reg.address}"`,
      `"${reg.city}"`,
      reg.state,
      reg.zipCode,
      `"${reg.registrationType || 'Special Events Only'}"`,
      reg.quantity,
      `"${reg.attendeeNames.replace(/"/g, '""')}"`,
      `"${reg.attendeeContacts.replace(/"/g, '""')}"`,
      `"${reg.specialEvents.join('; ')}"`,
      reg.vendorTables,
      `"${reg.advertisements.join('; ')}"`,
      `"${reg.dayToDayDates.join('; ')}"`,
      `"${reg.additionalNotes.replace(/"/g, '""')}"`,
      reg.totalAmount,
      reg.paymentStatus
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `lectureship_registrations_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportSummaryReport = (registrations: RegistrationData[]) => {
  if (registrations.length === 0) {
    alert('No registrations to export');
    return;
  }

  // Calculate statistics
  const stats = {
    total: registrations.length,
    paid: registrations.filter(r => r.paymentStatus === 'paid').length,
    pending: registrations.filter(r => r.paymentStatus === 'pending').length,
    partial: registrations.filter(r => r.paymentStatus === 'partial').length,
    refunded: registrations.filter(r => r.paymentStatus === 'refunded').length,
    totalRevenue: registrations.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.totalAmount, 0),
    pendingRevenue: registrations.filter(r => r.paymentStatus === 'pending').reduce((sum, r) => sum + r.totalAmount, 0),
  };

  // Registration type breakdown
  const regTypes: { [key: string]: number } = {};
  registrations.forEach(reg => {
    const type = reg.registrationType || 'Special Events Only';
    regTypes[type] = (regTypes[type] || 0) + 1;
  });

  // Special events breakdown
  const specialEvents: { [key: string]: number } = {};
  registrations.forEach(reg => {
    reg.specialEvents.forEach(event => {
      specialEvents[event] = (specialEvents[event] || 0) + 1;
    });
  });

  // Vendor tables
  const vendorTables = registrations.filter(r => r.vendorTables > 0).length;
  const totalTables = registrations.reduce((sum, r) => sum + r.vendorTables, 0);

  // Advertisements
  const advertisements = registrations.filter(r => r.advertisements.length > 0).length;
  const totalAds = registrations.reduce((sum, r) => sum + r.advertisements.length, 0);

  const reportContent = `
CHURCHES OF CHRIST NATIONAL LECTURESHIP 2026
REGISTRATION SUMMARY REPORT
Generated: ${new Date().toLocaleString()}

=== OVERVIEW ===
Total Registrations: ${stats.total}
Paid: ${stats.paid}
Pending: ${stats.pending}
Partial: ${stats.partial}
Refunded: ${stats.refunded}

=== REVENUE ===
Total Revenue (Paid): $${stats.totalRevenue}
Pending Revenue: $${stats.pendingRevenue}
Total Potential: $${stats.totalRevenue + stats.pendingRevenue}

=== REGISTRATION TYPES ===
${Object.entries(regTypes).map(([type, count]) => `${type}: ${count}`).join('\n')}

=== SPECIAL EVENTS ===
${Object.entries(specialEvents).map(([event, count]) => `${event}: ${count}`).join('\n')}

=== VENDOR INFORMATION ===
Vendors: ${vendorTables}
Total Tables: ${totalTables}

=== ADVERTISEMENTS ===
Advertisers: ${advertisements}
Total Ads: ${totalAds}

=== DETAILED REGISTRATIONS ===
${registrations.map(reg => `
ID: ${reg.id}
Name: ${reg.firstName} ${reg.lastName}
Email: ${reg.email}
Phone: ${reg.phone}
Registration: ${reg.registrationType || 'Special Events Only'}
Amount: $${reg.totalAmount}
Status: ${reg.paymentStatus}
Date: ${new Date(reg.timestamp).toLocaleString()}
${reg.specialEvents.length > 0 ? `Special Events: ${reg.specialEvents.join(', ')}` : ''}
${reg.vendorTables > 0 ? `Vendor Tables: ${reg.vendorTables}` : ''}
${reg.advertisements.length > 0 ? `Advertisements: ${reg.advertisements.join(', ')}` : ''}
${reg.additionalNotes ? `Notes: ${reg.additionalNotes}` : ''}
---`).join('\n')}
`.trim();

  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `lectureship_summary_report_${new Date().toISOString().split('T')[0]}.txt`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
