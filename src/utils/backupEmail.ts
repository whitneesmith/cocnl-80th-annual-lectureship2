  // Backup email solution using Formspree (works with any hosting)
export const sendRegistrationEmail = async (registrationData: any) => {
  try {
    // Using Formspree as backup email service (free tier: 50 emails/month)
    const response = await fetch('https://formspree.io/f/xpznvqko', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _replyto: registrationData.email,
        _subject: `New Lectureship Registration - ${registrationData.firstName} ${registrationData.lastName}`,
        _cc: 'cocnl1945@gmail.com',
        name: `${registrationData.firstName} ${registrationData.lastName}`,
        email: registrationData.email,
        phone: registrationData.phone,
        address: `${registrationData.address}, ${registrationData.city}, ${registrationData.state} ${registrationData.zipCode}`,
        registration_type: registrationData.registrationType || 'Special Events Only',
        total_amount: `$${registrationData.totalAmount}`,
        payment_method: registrationData.paymentMethod || 'Not specified',
        attendee_names: registrationData.attendeeNames || 'N/A',
        attendee_contacts: registrationData.attendeeContacts || 'N/A',
        vendor_tables: registrationData.vendorTables > 0 ? `${registrationData.vendorTables} table(s)` : 'None',
        advertisements: registrationData.advertisements.length > 0 ? registrationData.advertisements.join(', ') : 'None',
        special_events: registrationData.specialEvents.length > 0 ? registrationData.specialEvents.join(', ') : 'None',
        day_to_day_dates: registrationData.dayToDayDates.length > 0 ? registrationData.dayToDayDates.join(', ') : 'N/A',
        additional_notes: registrationData.additionalNotes || 'None',
        quantity: registrationData.quantity,
        registration_id: registrationData.id,
        timestamp: new Date(registrationData.timestamp).toLocaleString(),
        message: `
NEW REGISTRATION DETAILS:

Registration ID: ${registrationData.id}
Timestamp: ${new Date(registrationData.timestamp).toLocaleString()}

CONTACT INFORMATION:
Name: ${registrationData.firstName} ${registrationData.lastName}
Email: ${registrationData.email}
Phone: ${registrationData.phone}
Address: ${registrationData.address}, ${registrationData.city}, ${registrationData.state} ${registrationData.zipCode}

REGISTRATION DETAILS:
Type: ${registrationData.registrationType || 'Special Events Only'}
Quantity: ${registrationData.quantity}
Total Amount: $${registrationData.totalAmount}
Payment Method: ${registrationData.paymentMethod || 'Not specified'}

${registrationData.attendeeNames ? `ATTENDEE NAMES:\n${registrationData.attendeeNames}\n` : ''}
${registrationData.attendeeContacts ? `ATTENDEE CONTACTS:\n${registrationData.attendeeContacts}\n` : ''}
${registrationData.vendorTables > 0 ? `VENDOR TABLES: ${registrationData.vendorTables}\n` : ''}
${registrationData.advertisements.length > 0 ? `ADVERTISEMENTS: ${registrationData.advertisements.join(', ')}\n` : ''}
${registrationData.specialEvents.length > 0 ? `SPECIAL EVENTS: ${registrationData.specialEvents.join(', ')}\n` : ''}
${registrationData.dayToDayDates.length > 0 ? `DAY-TO-DAY DATES: ${registrationData.dayToDayDates.join(', ')}\n` : ''}
${registrationData.additionalNotes ? `ADDITIONAL NOTES:\n${registrationData.additionalNotes}` : ''}
        `
      })
    });

    if (response.ok) {
      console.log('Backup email sent successfully via Formspree');
      return { success: true };
    } else {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
  } catch (error) {
    console.error('Backup email failed:', error);
    return { success: false, error };
  }
};

// Simple mailto fallback
export const createMailtoLink = (registrationData: any) => {
  const subject = encodeURIComponent(`New Lectureship Registration - ${registrationData.firstName} ${registrationData.lastName}`);
  const body = encodeURIComponent(`
NEW REGISTRATION DETAILS:

Registration ID: ${registrationData.id}
Timestamp: ${new Date(registrationData.timestamp).toLocaleString()}

CONTACT INFORMATION:
Name: ${registrationData.firstName} ${registrationData.lastName}
Email: ${registrationData.email}
Phone: ${registrationData.phone}
Address: ${registrationData.address}, ${registrationData.city}, ${registrationData.state} ${registrationData.zipCode}

REGISTRATION DETAILS:
Type: ${registrationData.registrationType || 'Special Events Only'}
Quantity: ${registrationData.quantity}
Total Amount: $${registrationData.totalAmount}
Payment Method: ${registrationData.paymentMethod || 'Not specified'}

${registrationData.attendeeNames ? `ATTENDEE NAMES:\n${registrationData.attendeeNames}\n\n` : ''}
${registrationData.attendeeContacts ? `ATTENDEE CONTACTS:\n${registrationData.attendeeContacts}\n\n` : ''}
${registrationData.vendorTables > 0 ? `VENDOR TABLES: ${registrationData.vendorTables}\n\n` : ''}
${registrationData.advertisements.length > 0 ? `ADVERTISEMENTS: ${registrationData.advertisements.join(', ')}\n\n` : ''}
${registrationData.specialEvents.length > 0 ? `SPECIAL EVENTS: ${registrationData.specialEvents.join(', ')}\n\n` : ''}
${registrationData.dayToDayDates.length > 0 ? `DAY-TO-DAY DATES: ${registrationData.dayToDayDates.join(', ')}\n\n` : ''}
${registrationData.additionalNotes ? `ADDITIONAL NOTES:\n${registrationData.additionalNotes}\n\n` : ''}

Please confirm receipt of this registration.
  `);

  return `mailto:cocnl1945@gmail.com?subject=${subject}&body=${body}`;
};
