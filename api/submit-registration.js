const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

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
      paymentMethod = 'Pending'
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !registrationType) {
      return res.status(400).json({ 
        error: 'Missing required fields: firstName, lastName, email, phone, registrationType' 
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
        'group-10-regular': 1925
      };
      
      const basePrice = prices[registrationType] || 0;
      
      // For group registrations, price is fixed regardless of quantity
      if (registrationType.includes('group-')) {
        return basePrice;
      }
      
      // For individual registrations, multiply by quantity
      return basePrice * (quantity || 1);
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
          'Total Amount',
          'Attendee Names',
          'Attendee Contacts',
          'Memorial Banquet Extra Tickets',
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
      'Registration Type': registrationType,
      'Quantity': quantity || 1,
      'Total Amount': totalAmount,
      'Attendee Names': attendeeNames || '',
      'Attendee Contacts': attendeeContacts || '',
      'Memorial Banquet Extra Tickets': specialEvents?.includes('memorial-banquet') ? 'Yes' : 'No',
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
        registrationType: registrationType,
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
