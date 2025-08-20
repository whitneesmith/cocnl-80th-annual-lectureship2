// pages/api/submit-registration.js (or your API endpoint file)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Helper functions for price calculations
    const getRegistrationPrice = (registrationType, quantity) => {
      const prices = {
        'individual-early': 190,
        'individual-regular': 210,
        'georgia-early': 175,
        'georgia-regular': 195,
        'group-5-early': 925,
        'group-5-regular': 975,
        'group-10-early': 1800,
        'group-10-regular': 1925
      };
      
      const basePrice = prices[registrationType] || 0;
      
      // For group registrations, price is fixed regardless of quantity
      if (registrationType && registrationType.includes('group-')) {
        return basePrice;
      }
      
      // For individual registrations, multiply by quantity
      return basePrice * (quantity || 1);
    };

    const getVendorTablePrice = (tables) => {
      if (tables === 1) return 250;
      if (tables === 2) return 350;
      if (tables === 3) return 450;
      return 0;
    };

    const getAdvertisementPrice = (advertisements) => {
      const adPrices = {
        'full-page-color': 225,
        'half-page-color': 175,
        'full-page-bw': 180,
        'half-page-bw': 125,
        'quarter-page-bw': 80
      };
      
      return (advertisements || []).reduce((total, ad) => {
        return total + (adPrices[ad] || 0);
      }, 0);
    };

    const getTotalPrice = (data) => {
      const registrationPrice = getRegistrationPrice(data.registrationType, data.quantity);
      const vendorPrice = getVendorTablePrice(data.vendorTables);
      const adPrice = getAdvertisementPrice(data.advertisements);
      const banquetPrice = (data.specialEvents && data.specialEvents.includes('memorial-banquet')) ? 75 : 0;
      
      return registrationPrice + vendorPrice + adPrice + banquetPrice;
    };

    // Calculate prices
    const registrationPrice = getRegistrationPrice(formData.registrationType, formData.quantity);
    const vendorPrice = getVendorTablePrice(formData.vendorTables);
    const advertisementPrice = getAdvertisementPrice(formData.advertisements);
    const totalPrice = getTotalPrice(formData);

    // Prepare data for Google Sheets
    const registrationData = {
      // Existing fields
      timestamp: new Date().toISOString(),
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || '',
      registrationType: formData.registrationType || '',
      quantity: formData.quantity || 1,
      attendeeNames: formData.attendeeNames || '',
      attendeeContacts: formData.attendeeContacts || '',
      specialEvents: Array.isArray(formData.specialEvents) ? formData.specialEvents.join(', ') : '',
      additionalNotes: formData.additionalNotes || '',
      
      // New vendor and advertisement fields
      vendorTables: formData.vendorTables || 0,
      advertisements: Array.isArray(formData.advertisements) ? formData.advertisements.join(', ') : '',
      
      // Calculated prices
      registrationPrice: registrationPrice,
      vendorPrice: vendorPrice,
      advertisementPrice: advertisementPrice,
      totalPrice: totalPrice
    };

    // Google Sheets integration (replace with your actual Google Sheets code)
    // This is a placeholder - you'll need to replace with your actual implementation
    const googleSheetsResponse = await submitToGoogleSheets(registrationData);

    // Optional: Send email notification
    if (process.env.SEND_EMAIL_NOTIFICATIONS === 'true') {
      await sendEmailNotification(registrationData);
    }

    return res.status(200).json({ 
      success: true, 
      data: registrationData,
      message: 'Registration submitted successfully'
    });

  } catch (error) {
    console.error('Registration submission error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to submit registration. Please try again.' 
    });
  }
}

// Helper function for Google Sheets (replace with your actual implementation)
async function submitToGoogleSheets(data) {
  // Your existing Google Sheets integration code goes here
  // Make sure to include the new fields in your sheet columns:
  // vendorTables, advertisements, registrationPrice, vendorPrice, advertisementPrice, totalPrice
  
  // Example structure (replace with your actual Google Sheets API calls):
  /*
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  const range = 'Sheet1!A:Z'; // Adjust range as needed
  
  const values = [[
    data.timestamp,
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.address,
    data.city,
    data.state,
    data.zipCode,
    data.registrationType,
    data.quantity,
    data.attendeeNames,
    data.attendeeContacts,
    data.specialEvents,
    data.additionalNotes,
    data.vendorTables,           // NEW
    data.advertisements,         // NEW
    data.registrationPrice,      // NEW
    data.vendorPrice,           // NEW
    data.advertisementPrice,    // NEW
    data.totalPrice             // NEW
  ]];
  
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: range,
    valueInputOption: 'RAW',
    resource: { values }
  });
  
  return response;
  */
  
  // For now, just return success
  return { success: true };
}

// Optional: Email notification function
async function sendEmailNotification(data) {
  // Add email notification logic here if desired
  // You could use services like SendGrid, Nodemailer, etc.
  
  const emailContent = `
    New Registration Received:
    
    Name: ${data.firstName} ${data.lastName}
    Email: ${data.email}
    Phone: ${data.phone}
    Registration Type: ${data.registrationType}
    
    ${data.vendorTables > 0 ? `Vendor Tables: ${data.vendorTables} table(s) - $${data.vendorPrice}` : ''}
    ${data.advertisements ? `Advertisements: ${data.advertisements} - $${data.advertisementPrice}` : ''}
    ${data.specialEvents ? `Special Events: ${data.specialEvents}` : ''}
    
    Total Price: $${data.totalPrice}
    
    Additional Notes: ${data.additionalNotes}
  `;
  
  console.log('Email notification would be sent:', emailContent);
  // Implement actual email sending here
}
