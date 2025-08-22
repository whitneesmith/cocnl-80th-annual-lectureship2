import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      registrationType,
      quantity,
      attendeeNames,
      attendeeContacts,
      specialEvents,
      additionalNotes,
      paymentMethod = 'Pending',
      vendorTables,
      advertisements,
      dayToDayDates
    } = req.body;

    // Updated validation - only require name, email, phone
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ 
        error: 'Missing required fields: firstName, lastName, email, phone' 
      });
    }

    // Validate that at least one option is selected
    const hasRegistration = registrationType && registrationType !== '';
    const hasVendorTables = vendorTables > 0;
    const hasAdvertisements = advertisements && advertisements.length > 0;
    const hasSpecialEvents = specialEvents && specialEvents.length > 0;
    
    if (!hasRegistration && !hasVendorTables && !hasAdvertisements && !hasSpecialEvents) {
      return res.status(400).json({ 
        error: 'Please select at least one option: registration, vendor tables, advertisements, or special events' 
      });
    }

    // Calculate total amount based on registration type and quantity
    const calculateTotalAmount = () => {
      const prices = {
        'individual-early': 190,
        'individual-regular': 210,
        'georgia-early': 175,
        'georgia-regular': 195,
        'group-5-early': 925,
        'group-5-regular': 975,
        'group-10-early': 1800,
        'group-10-regular': 1925,
        'day-to-day': 75
      };
      
      let total = 0;
      
      // Registration price
      if (registrationType && registrationType !== '') {
        const basePrice = prices[registrationType] || 0;
        
        if (registrationType === 'day-to-day') {
          // For day-to-day, multiply by number of days
          const daysCount = dayToDayDates ? dayToDayDates.split(',').length : 0;
          total += basePrice * daysCount;
        } else if (registrationType.includes('group-')) {
          // For group registrations, price is fixed
          total += basePrice;
        } else {
          // For individual registrations, multiply by quantity
          total += basePrice * (quantity || 1);
        }
      }
      
      // Vendor tables
      if (vendorTables === 1) total += 250;
      if (vendorTables === 2) total += 350;
      if (vendorTables === 3) total += 450;
      
      // Advertisements
      if (advertisements && advertisements.length > 0) {
        const adPrices = {
          'full-page-color': 225,
          'half-page-color': 175,
          'full-page-bw': 180,
          'half-page-bw': 125,
          'quarter-page-bw': 80
        };
        
        advertisements.forEach(ad => {
          total += adPrices[ad] || 0;
        });
      }
      
      // Special events
      if (specialEvents && specialEvents.includes('memorial-banquet')) {
        total += 75;
      }
      if (specialEvents && specialEvents.includes('womens-luncheon')) {
        total += 60;
      }
      
      return total;
    };

    const totalAmount = calculateTotalAmount();

    // Initialize Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/spreadsheets/'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    // Get the first sheet (or create one if it doesn't exist)
    let sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      sheet = await doc.addSheet({ 
        title: 'Registrations',
        headerValues: [
          'Timestamp',
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
          'Day-to-Day Dates',
          'Total Amount',
          'Attendee Names',
          'Attendee Contacts',
          'Vendor Tables',
          'Advertisements',
          'Memorial Banquet',
          'Womens Luncheon',
          'Additional Notes',
          'Payment Status',
          'Payment Method'
        ]
      });
    }

    // Prepare the row data
    const rowData = {
      'Timestamp': new Date().toISOString(),
      'First Name': firstName,
      'Last Name': lastName,
      'Email': email,
      'Phone': phone,
      'Address': address || '',
      'City': city || '',
      'State': state || '',
      'ZIP Code': zipCode || '',
      'Registration Type': registrationType || 'None',
      'Quantity': quantity || 1,
      'Day-to-Day Dates': dayToDayDates || '',
      'Total Amount': totalAmount,
      'Attendee Names': attendeeNames || '',
      'Attendee Contacts': attendeeContacts || '',
      'Vendor Tables': vendorTables || 0,
      'Advertisements': advertisements ? advertisements.join(', ') : '',
      'Memorial Banquet': specialEvents?.includes('memorial-banquet') ? 'Yes' : 'No',
      'Womens Luncheon': specialEvents?.includes('womens-luncheon') ? 'Yes' : 'No',
      'Additional Notes': additionalNotes || '',
      'Payment Status': 'Pending',
      'Payment Method': paymentMethod
    };

    // Add the row to the sheet
    await sheet.addRow(rowData);

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        name: `${firstName} ${lastName}`,
        email: email,
        registrationType: registrationType || 'Special Events Only',
        totalAmount: totalAmount,
        timestamp: rowData.Timestamp
      }
    });

  } catch (error) {
    console.error('Registration submission error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to submit registration',
      details: error.message
    });
  }
}
