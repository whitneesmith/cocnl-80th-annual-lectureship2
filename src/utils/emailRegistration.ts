// Simple email-based registration system for static websites

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  registrationType: string;
  attendeeNames: string;
  specialEvents: string[];
  dailyDates: string[];
  vendorPayment: boolean;
  souvenirBook: boolean;
  paymentMethod: string;
  additionalNotes: string;
}

export async function submitRegistration(data: RegistrationData): Promise<boolean> {
  try {
    // Format the registration data for email
    const emailBody = formatRegistrationEmail(data);
    
    // Create mailto link (this will open user's email client)
    const subject = encodeURIComponent('Churches of Christ National Lectureship Registration');
    const body = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:cocnl1945@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.open(mailtoLink);
    
    // Return success (user will send the email manually)
    return true;
  } catch (error) {
    console.error('Error creating registration email:', error);
    return false;
  }
}

function formatRegistrationEmail(data: RegistrationData): string {
  const timestamp = new Date().toLocaleString();
  
  return `
CHURCHES OF CHRIST NATIONAL LECTURESHIP REGISTRATION
Submitted: ${timestamp}

CONTACT INFORMATION:
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Address: ${data.address}
City: ${data.city}
State: ${data.state}
ZIP Code: ${data.zipCode}

REGISTRATION DETAILS:
Registration Type: ${data.registrationType}

ATTENDEE NAMES:
${data.attendeeNames}

${data.specialEvents.length > 0 ? `SPECIAL EVENTS:
${data.specialEvents.join(', ')}` : ''}

${data.dailyDates.length > 0 ? `DAILY DATES SELECTED:
${data.dailyDates.join(', ')}` : ''}

ADDITIONAL OPTIONS:
Vendor Table Payment: ${data.vendorPayment ? 'Yes' : 'No'}
Souvenir Book: ${data.souvenirBook ? 'Yes' : 'No'}

PAYMENT METHOD: ${data.paymentMethod}

${data.additionalNotes ? `ADDITIONAL NOTES:
${data.additionalNotes}` : ''}

---
This registration was submitted through the Churches of Christ National Lectureship website.
  `.trim();
}