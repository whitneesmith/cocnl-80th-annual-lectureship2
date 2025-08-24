import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { sendRegistrationEmail } from '../utils/backupEmail';

// Registration data interface for localStorage
interface RegistrationData {
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

const RegisterForm = () => {
  // Initialize EmailJS when component mounts
  useEffect(() => {
    emailjs.init('Nttdl3naYDqz18xNa');
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    registrationType: '',
    quantity: 1,
    attendeeNames: '',
    attendeeContacts: '',
    specialEvents: [] as string[],
    paymentMethod: '',
    additionalNotes: '',
    vendorTables: 0,
    advertisements: [] as string[],
    dayToDayDates: [] as string[]
  });

  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'specialEvents') {
        setFormData(prev => ({
          ...prev,
          specialEvents: checked 
            ? [...prev.specialEvents, value]
            : prev.specialEvents.filter(event => event !== value)
        }));
      } else if (name === 'advertisements') {
        setFormData(prev => ({
          ...prev,
          advertisements: checked 
            ? [...prev.advertisements, value]
            : prev.advertisements.filter(ad => ad !== value)
        }));
      } else if (name === 'dayToDayDates') {
        setFormData(prev => ({
          ...prev,
          dayToDayDates: checked 
            ? [...prev.dayToDayDates, value]
            : prev.dayToDayDates.filter(date => date !== value)
        }));
      }
    } else if (name === 'vendorTables') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Check if user has selected at least one option (registration, vendor tables, ads, or special events)
    const hasRegistration = formData.registrationType !== '';
    const hasVendorTables = formData.vendorTables > 0;
    const hasAdvertisements = formData.advertisements.length > 0;
    const hasSpecialEvents = formData.specialEvents.length > 0;
    
    if (!hasRegistration && !hasVendorTables && !hasAdvertisements && !hasSpecialEvents) {
      alert('Please select at least one option: registration type, vendor tables, advertisements, or special events.');
      setIsSubmitting(false);
      return;
    }
    
    // Only require payment method if there's a total amount due
    if (getTotalPrice() > 0 && !formData.paymentMethod) {
      alert('Please select how you plan to pay.');
      setIsSubmitting(false);
      return;
    }
    
    // Validate day-to-day registration has selected days (only if day-to-day is selected)
    if (formData.registrationType === 'day-to-day' && formData.dayToDayDates.length === 0) {
      alert('Please select at least one day to attend for day-to-day registration.');
      setIsSubmitting(false);
      return;
    }
    
    // Validate group registrations or multiple individual registrations have attendee names (only if applicable)
    if (((formData.registrationType.includes('group-5') || formData.registrationType.includes('group-10')) || 
         (formData.quantity > 1 && !formData.registrationType.includes('group-') && formData.registrationType !== 'day-to-day' && formData.registrationType !== '')) && 
        !formData.attendeeNames.trim()) {
      alert('Please list all attendee names.');
      setIsSubmitting(false);
      return;
    }
    
    // Validate contact info for multiple registrations (only if applicable)
    if (((formData.registrationType.includes('group-5') || formData.registrationType.includes('group-10')) || 
         (formData.quantity > 1 && !formData.registrationType.includes('group-') && formData.registrationType !== 'day-to-day' && formData.registrationType !== '')) && 
        !formData.attendeeContacts.trim()) {
      alert('Please provide contact information for all attendees.');
      setIsSubmitting(false);
      return;
    }

    try {
      const registrationData: RegistrationData = {
        id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        registrationType: formData.registrationType,
        quantity: formData.quantity,
        attendeeNames: formData.attendeeNames,
        attendeeContacts: formData.attendeeContacts,
        specialEvents: formData.specialEvents,
        vendorTables: formData.vendorTables,
        advertisements: formData.advertisements,
        dayToDayDates: formData.dayToDayDates,
        additionalNotes: formData.additionalNotes,
        totalAmount: getTotalPrice(),
        paymentStatus: 'pending'
      };

      const existingRegistrations = JSON.parse(localStorage.getItem('lectureship_registrations') || '[]');
      const updatedRegistrations = [registrationData, ...existingRegistrations];
      localStorage.setItem('lectureship_registrations', JSON.stringify(updatedRegistrations));

      console.log('Registration saved to localStorage:', registrationData);
      
      try {
        console.log('Attempting to send confirmation email...');
        const emailResult = await emailjs.send(
          'service_p49aqfy',
          'template_oywsajv',
          {
            to_name: `${formData.firstName} ${formData.lastName}`,
            to_email: formData.email,
            from_name: 'Churches of Christ National Lectureship',
            registration_type: formData.registrationType || 'Special Events Only',
            total_amount: getTotalPrice(),
            payment_method: formData.paymentMethod ? 
              (formData.paymentMethod === 'credit-card' ? 'Credit Card (Square)' :
               formData.paymentMethod === 'zelle' ? 'Zelle' :
               formData.paymentMethod === 'check' ? 'Mail Check' : 'Not specified') : 'Not specified',
            attendee_names: formData.attendeeNames || 'N/A',
            attendee_contacts: formData.attendeeContacts || 'N/A',
            vendor_tables: formData.vendorTables > 0 ? `${formData.vendorTables} table(s) - $${getVendorTablePrice()}` : 'None',
            advertisements: formData.advertisements.length > 0 ? formData.advertisements.join(', ') + ` - $${getAdvertisementPrice()}` : 'None',
            special_events: formData.specialEvents.length > 0 ? formData.specialEvents.join(', ') : 'None',
            day_to_day_dates: formData.dayToDayDates.length > 0 ? formData.dayToDayDates.join(', ') : 'N/A',
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
            additional_notes: formData.additionalNotes || 'None',
            quantity: formData.quantity,
            registration_id: registrationData.id
          }
        );
        console.log('Registration email sent successfully:', emailResult);
        
        console.log('Attempting to send internal notification email...');
        const internalEmailResult = await emailjs.send(
          'service_p49aqfy',
          'template_oywsajv',
          {
            to_name: 'Churches of Christ National Lectureship',
            to_email: 'cocnl1945@gmail.com',
            from_name: 'Website Registration System',
            registration_type: `NEW REGISTRATION: ${formData.firstName} ${formData.lastName}`,
            total_amount: getTotalPrice(),
            payment_method: formData.paymentMethod ? 
              (formData.paymentMethod === 'credit-card' ? 'Credit Card (Square)' :
               formData.paymentMethod === 'zelle' ? 'Zelle' :
               formData.paymentMethod === 'check' ? 'Mail Check' : 'Not specified') : 'Not specified',
            attendee_names: formData.attendeeNames || 'N/A',
            attendee_contacts: formData.attendeeContacts || 'N/A',
            vendor_tables: formData.vendorTables > 0 ? `${formData.vendorTables} table(s) - $${getVendorTablePrice()}` : 'None',
            advertisements: formData.advertisements.length > 0 ? formData.advertisements.join(', ') + ` - $${getAdvertisementPrice()}` : 'None',
            special_events: formData.specialEvents.length > 0 ? formData.specialEvents.join(', ') : 'None',
            day_to_day_dates: formData.dayToDayDates.length > 0 ? formData.dayToDayDates.join(', ') : 'N/A',
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
            additional_notes: formData.additionalNotes || 'None',
            quantity: formData.quantity,
            registration_id: registrationData.id
          }
        );
        console.log('Internal notification email sent successfully:', internalEmailResult);
        
      } catch (emailError) {
        console.error('EmailJS failed, trying backup email system:', emailError);
        
        // Try backup email system
        try {
          const backupResult = await sendRegistrationEmail({
            ...registrationData,
            paymentMethod: formData.paymentMethod
          });
          
          if (backupResult.success) {
            console.log('Backup email sent successfully');
          } else {
            throw new Error('Backup email also failed');
          }
        } catch (backupError) {
          console.error('Both email systems failed:', backupError);
          
          // Just log the failure - don't bother the user with mailto
          console.log('Registration saved to localStorage but emails failed to send');
          
          // Optionally show a subtle message to the user
          alert('Registration saved successfully! However, there was an issue sending the confirmation email. Please contact us at cocnl1945@gmail.com or (800) 609-6211 to confirm your registration was received.');
        }
      }
      
      setShowPayment(true);
      
    } catch (error: any) {
      console.error('Registration submission error:', error);
      setSubmitError(`Registration failed: ${error.message || 'Unknown error'}. Please try again or contact us at (800) 609-6211.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRegistrationPrice = () => {
    const prices: { [key: string]: number } = {
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
    const basePrice = prices[formData.registrationType] || 0;
    
    if (formData.registrationType === 'day-to-day') {
      return basePrice * formData.dayToDayDates.length;
    }
    
    if (formData.registrationType.includes('group-')) {
      return basePrice;
    }
    
    return basePrice * formData.quantity;
  };

  const getVendorTablePrice = () => {
    if (formData.vendorTables === 1) return 250;
    if (formData.vendorTables === 2) return 350;
    if (formData.vendorTables === 3) return 450;
    return 0;
  };

  const getAdvertisementPrice = () => {
    const adPrices: { [key: string]: number } = {
      'full-page-color': 225,
      'half-page-color': 175,
      'full-page-bw': 180,
      'half-page-bw': 125,
      'quarter-page-bw': 80
    };
    
    return formData.advertisements.reduce((total, ad) => {
      return total + (adPrices[ad] || 0);
    }, 0);
  };

  const getSpecialEventsPrice = () => {
    let total = 0;
    if (formData.specialEvents.includes('memorial-banquet')) {
      total += 75;
    }
    return total;
  };

  const getTotalPrice = () => {
    const registrationPrice = getRegistrationPrice();
    const vendorPrice = getVendorTablePrice();
    const adPrice = getAdvertisementPrice();
    const specialEventsPrice = getSpecialEventsPrice();
    
    return registrationPrice + vendorPrice + adPrice + specialEventsPrice;
  };

  const getPaymentLinks = () => {
    const links: { [key: string]: string } = {
      'individual-early': 'https://square.link/u/ieidynuy',
      'individual-regular': 'https://square.link/u/VdIdderF',
      'georgia-early': 'https://square.link/u/2xwzKLOF',
      'georgia-regular': 'https://square.link/u/UACAsYNa',
      'group-5-early': 'https://square.link/u/R8ten5jo',
      'group-5-regular': 'https://square.link/u/kBhQ4aaj',
      'group-10-early': 'https://square.link/u/8TgV0WNa',
      'group-10-regular': 'https://square.link/u/c9dLJDyX',
      'memorial-banquet': 'https://square.link/u/3EFbURkB',
      'vendor-1-table': 'https://square.link/u/MuxoTkEI',
      'vendor-2-tables': 'https://square.link/u/2RFSfiYv',
      'vendor-3-tables': 'https://square.link/u/VeLw36WE',
      'full-page-color': 'https://square.link/u/aDKuberx',
      'half-page-color': 'https://square.link/u/soBLCNwD',
      'full-page-bw': 'https://square.link/u/oqgDc3Ki',
      'half-page-bw': 'https://square.link/u/orWjSbJa',
      'quarter-page-bw': 'https://square.link/u/B7ON7VnH',
      'day-to-day': 'https://square.link/u/day-to-day'
    };
    return links;
  };

  if (showPayment) {
    const paymentLinks = getPaymentLinks();
    const banquetSelected = formData.specialEvents.includes('memorial-banquet');

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">✓</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Registration Submitted!</h2>
              <p className="text-slate-600">
                Thank you {formData.firstName}! Your registration has been received.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Registration Summary</h3>
              <div className="space-y-2 text-slate-700">
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Registration Type:</strong> {formData.registrationType || 'Special Events Only'}</p>
                <p><strong>Total Amount:</strong> ${getTotalPrice()}</p>
                <p><strong>Registration ID:</strong> {`reg_${Date.now().toString().slice(-8)}`}</p>
                {formData.paymentMethod && (
                  <p><strong>Payment Method:</strong> {
                    formData.paymentMethod === 'credit-card' ? '💳 Credit/Debit Card' :
                    formData.paymentMethod === 'zelle' ? '📱 Zelle' :
                    formData.paymentMethod === 'check' ? '✉️ Mail Check' : formData.paymentMethod
                  }</p>
                )}
              </div>
            </div>

            {/* Payment Instructions based on selected method */}
            {getTotalPrice() > 0 && (
              <div className="mb-8">
                {formData.paymentMethod === 'credit-card' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">💳 Complete Your Online Payment</h3>
                    <p className="text-blue-700 mb-4">
                      Click the button below to pay securely with your credit or debit card through Square.
                    </p>
                    <a
                      href="https://square.link/u/ieidynuy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-block"
                    >
                      Pay ${getTotalPrice()} with Square →
                    </a>
                  </div>
                )}

                {formData.paymentMethod === 'zelle' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-purple-900 mb-4">📱 Pay with Zelle</h3>
                    <div className="space-y-3 text-purple-700">
                      <p><strong>Send payment to:</strong> cocnl1945@gmail.com</p>
                      <p><strong>Amount:</strong> ${getTotalPrice()}</p>
                      <p><strong>Memo:</strong> {formData.firstName} {formData.lastName} - Lectureship Registration</p>
                    </div>
                    <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                      <p className="text-purple-800 text-sm">
                        💡 <strong>Important:</strong> Please include your name and "Lectureship Registration" in the Zelle memo so we can match your payment to your registration.
                      </p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'check' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-green-900 mb-4">✉️ Mail Your Check</h3>
                    <div className="space-y-3 text-green-700">
                      <p><strong>Make check payable to:</strong> Churches of Christ National Lectureship</p>
                      <p><strong>Amount:</strong> ${getTotalPrice()}</p>
                      <p><strong>Mail to:</strong></p>
                      <div className="ml-4 bg-green-100 p-3 rounded">
                        <p>Churches of Christ National Lectureship</p>
                        <p>289 Jonesboro Road, STE #199</p>
                        <p>McDonough, GA 30253</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-green-800 text-sm">
                        💡 <strong>Important:</strong> Please write your name and registration ID on the memo line of your check.
                      </p>
                    </div>
                  </div>
                )}

                {!formData.paymentMethod && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Payment Required</h3>
                    <p className="text-gray-700 mb-4">
                      Please contact us at <strong>cocnl1945@gmail.com</strong> or <strong>(800) 609-6211</strong> to arrange payment.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Free registration message */}
            {getTotalPrice() === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-green-900 mb-2">🎉 Registration Complete!</h3>
                <p className="text-green-700">
                  No payment is required for your registration. We'll see you at the event!
                </p>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-yellow-900 mb-4">📋 Next Steps</h3>
              <ul className="space-y-2 text-yellow-800">
                <li>• You should receive a confirmation email shortly</li>
                <li>• We will confirm your registration once payment is received</li>
                <li>• Contact us at cocnl1945@gmail.com with any questions</li>
                <li>• Visit our website for updates: www.cocnl1945.org</li>
              </ul>
            </div>

            <div className="text-center space-x-4">
              <button 
                onClick={() => setShowPayment(false)}
                className="bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                ← Edit Registration
              </button>
              <Link 
                to="/"
                className="bg-white text-slate-600 font-bold py-3 px-6 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors duration-200 inline-block"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <section className="py-12 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Registration Form</h1>
          <p className="text-xl text-slate-100">
            Churches of Christ 80th Annual "Historical" National Lectureship
          </p>
          <p className="text-slate-200 mt-2">March 9-13, 2026 • Atlanta, Georgia</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Atlanta"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="GA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="30303"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Registration Type</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <span className="text-blue-600 text-2xl mr-3 mt-1">ℹ️</span>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Registration Options</h4>
                    <p className="text-blue-700 text-sm">
                      You can register for the full Lectureship, select day-to-day attendance, or attend special events only. 
                      Registration type is optional if you're only purchasing vendor tables, advertisements, or special event tickets.
                    </p>
                  </div>
                </div>
              </div>
              
              <select
                name="registrationType"
                value={formData.registrationType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">No Lectureship Registration (Special Events/Vendor/Ads Only)</option>
                <option value="individual-early">Individual Early Bird - $190 (Until Dec 31, 2025)</option>
                <option value="individual-regular">Individual Regular - $210 (Starting Jan 1, 2026)</option>
                <option value="georgia-early">Georgia Resident Early Bird - $175 (Until Dec 31, 2025)</option>
                <option value="georgia-regular">Georgia Resident Regular - $195 (Starting Jan 1, 2026)</option>
                <option value="group-5-early">Group 5 People Early Bird - $925 (Until Dec 31, 2025)</option>
                <option value="group-5-regular">Group 5 People Regular - $975 (Starting Jan 1, 2026)</option>
                <option value="group-10-early">Group 10 People Early Bird - $1,800 (Until Dec 31, 2025)</option>
                <option value="group-10-regular">Group 10 People Regular - $1,925 (Starting Jan 1, 2026)</option>
                <option value="day-to-day">Day-to-Day Registration - $75 per day</option>
              </select>
            </div>

            {/* Day-to-Day Date Selection - Show only for day-to-day registration */}
            {formData.registrationType === 'day-to-day' && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Select Days to Attend</h3>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-yellow-600 text-2xl mr-3 mt-1">📅</span>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Day-to-Day Registration</h4>
                      <p className="text-yellow-700 text-sm mb-2">
                        <strong>$75 per day</strong> - Select which specific days you plan to attend.
                      </p>
                      <p className="text-yellow-700 text-sm">
                        <strong>Note:</strong> No amenities (meals, materials) are provided with day-to-day registration.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="dayToDayDates"
                      value="sunday-march-9"
                      checked={formData.dayToDayDates.includes('sunday-march-9')}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">Sunday, March 9</span>
                      <p className="text-slate-600 text-sm">Opening Day</p>
                      <p className="text-slate-500 text-xs">$75</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="dayToDayDates"
                      value="monday-march-10"
                      checked={formData.dayToDayDates.includes('monday-march-10')}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">Monday, March 10</span>
                      <p className="text-slate-600 text-sm">Day 2</p>
                      <p className="text-slate-500 text-xs">$75</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="dayToDayDates"
                      value="tuesday-march-11"
                      checked={formData.dayToDayDates.includes('tuesday-march-11')}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">Tuesday, March 11</span>
                      <p className="text-slate-600 text-sm">Day 3</p>
                      <p className="text-slate-500 text-xs">$75</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="dayToDayDates"
                      value="wednesday-march-12"
                      checked={formData.dayToDayDates.includes('wednesday-march-12')}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">Wednesday, March 12</span>
                      <p className="text-slate-600 text-sm">Day 4 - Memorial Banquet</p>
                      <p className="text-slate-500 text-xs">$75</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="dayToDayDates"
                      value="thursday-march-13"
                      checked={formData.dayToDayDates.includes('thursday-march-13')}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">Thursday, March 13</span>
                      <p className="text-slate-600 text-sm">Final Day</p>
                      <p className="text-slate-500 text-xs">$75</p>
                    </div>
                  </label>
                </div>

                {formData.dayToDayDates.length > 0 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">
                        Selected: {formData.dayToDayDates.length} day{formData.dayToDayDates.length > 1 ? 's' : ''}
                      </span>
                      <span className="text-slate-900 font-bold text-lg">
                        Total: ${formData.dayToDayDates.length * 75}
                      </span>
                    </div>
                  </div>
                )}

                {formData.dayToDayDates.length === 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      ⚠️ Please select at least one day to attend for day-to-day registration.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector - Only show for individual registrations (not day-to-day) */}
            {formData.registrationType && !formData.registrationType.includes('group-') && formData.registrationType !== 'day-to-day' && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Number of People</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <span className="text-green-600 text-xl mr-3 mt-1">👤</span>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Individual Registration</h4>
                      <p className="text-green-700 text-sm">
                        How many people are you registering? Each person gets the same registration type.
                      </p>
                      <p className="text-green-600 text-xs mt-1">
                        💡 For 5+ people, select a Group registration above for better rates!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Quantity:
                  </label>
                  <select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    {[1,2,3,4].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                  <div className="text-slate-600">
                    × ${formData.registrationType.includes('individual-early') ? '190' : 
                        formData.registrationType.includes('individual-regular') ? '210' :
                        formData.registrationType.includes('georgia-early') ? '175' :
                        formData.registrationType.includes('georgia-regular') ? '195' : '0'} = 
                    <span className="font-bold text-slate-900 ml-1">${getRegistrationPrice()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Attendee Names - Show for group registrations OR multiple individual registrations */}
            {((formData.registrationType.includes('group-5') || formData.registrationType.includes('group-10')) || 
              (formData.quantity > 1 && !formData.registrationType.includes('group-') && formData.registrationType !== 'day-to-day')) && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  {formData.registrationType.includes('group-') ? 'Group Attendee Names' : 'All Attendee Names'}
                </h3>
                <div className={`${formData.registrationType.includes('group-') ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'} border rounded-lg p-4 mb-4`}>
                  <div className="flex items-start">
                    <span className={`${formData.registrationType.includes('group-') ? 'text-blue-600' : 'text-purple-600'} text-xl mr-3 mt-1`}>
                      {formData.registrationType.includes('group-') ? '👥' : '👤'}
                    </span>
                    <div>
                      <h4 className={`font-semibold ${formData.registrationType.includes('group-') ? 'text-blue-800' : 'text-purple-800'} mb-2`}>
                        {formData.registrationType.includes('group-') ? 'Group Registration' : 'Multiple Individual Registrations'}
                      </h4>
                      <p className={`${formData.registrationType.includes('group-') ? 'text-blue-700' : 'text-purple-700'} text-sm`}>
                        {formData.registrationType.includes('group-') 
                          ? `Please list all ${formData.registrationType.includes('group-5') ? '5' : '10'} attendees below, including yourself as the primary contact.`
                          : `Please list all ${formData.quantity} attendees below, including yourself as the primary contact.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <label className="block text-slate-700 text-sm font-bold mb-2">
                  All Attendee Names *
                </label>
                <textarea
                  name="attendeeNames"
                  value={formData.attendeeNames}
                  onChange={handleInputChange}
                  placeholder={formData.registrationType.includes('group-') 
                    ? `List all ${formData.registrationType.includes('group-5') ? '5' : '10'} attendees, one name per line:\n\n${formData.firstName} ${formData.lastName} (Primary Contact)\nJohn Smith\nMary Johnson\nBob Wilson\nSarah Davis${formData.registrationType.includes('group-10') ? `\nMike Brown\nLisa Taylor\nDavid Lee\nEmma White\nChris Garcia` : ''}`
                    : `List all ${formData.quantity} attendees, one name per line:\n\n${formData.firstName} ${formData.lastName} (Primary Contact)${formData.quantity > 1 ? `\n${Array.from({length: formData.quantity - 1}, (_, i) => `Person ${i + 2} Name`).join('\n')}` : ''}`
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 h-32"
                  required
                />
                <p className="text-xs text-slate-600 mt-1">
                  {formData.registrationType.includes('group-') 
                    ? `Please include yourself as the first name, then list the remaining ${formData.registrationType.includes('group-5') ? '4' : '9'} attendees`
                    : `Please include yourself as the first name, then list the remaining ${formData.quantity - 1} attendee${formData.quantity > 2 ? 's' : ''}`
                  }
                </p>

                {/* Attendee Contact Information */}
                <div className="mt-6">
                  <label className="block text-slate-700 text-sm font-bold mb-2">
                    Attendee Contact Information
                  </label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <p className="text-yellow-800 text-sm">
                      📞 Please provide phone numbers and email addresses for all attendees (except yourself - we already have yours above)
                    </p>
                  </div>
                  <textarea
                    name="attendeeContacts"
                    value={formData.attendeeContacts}
                    onChange={handleInputChange}
                    placeholder={formData.registrationType.includes('group-') 
                      ? `Provide contact info for the other ${formData.registrationType.includes('group-5') ? '4' : '9'} attendees:\n\nJohn Smith - (555) 123-4567 - john@email.com\nMary Johnson - (555) 234-5678 - mary@email.com\nBob Wilson - (555) 345-6789 - bob@email.com\nSarah Davis - (555) 456-7890 - sarah@email.com${formData.registrationType.includes('group-10') ? `\nMike Brown - (555) 567-8901 - mike@email.com\nLisa Taylor - (555) 678-9012 - lisa@email.com\nDavid Lee - (555) 789-0123 - david@email.com\nEmma White - (555) 890-1234 - emma@email.com\nChris Garcia - (555) 901-2345 - chris@email.com` : ''}`
                      : formData.quantity > 1 ? `Provide contact info for the other ${formData.quantity - 1} attendee${formData.quantity > 2 ? 's' : ''}:\n\n${Array.from({length: formData.quantity - 1}, (_, i) => `Person ${i + 2} - (555) 123-456${i + 2} - person${i + 2}@email.com`).join('\n')}` : 'No additional contact info needed for single registration'
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 h-32"
                    required={formData.quantity > 1 || formData.registrationType.includes('group-')}
                  />
                  <p className="text-xs text-slate-600 mt-1">
                    Format: Name - Phone - Email (one person per line)
                  </p>
                </div>
              </div>
            )}

            {/* Special Events */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Special Events</h3>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3 mt-1">🎉</span>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Memorial Banquet Information</h4>
                    <p className="text-green-700 text-sm mb-2">
                      <strong>If you registered for the full Lectureship above:</strong> Your banquet ticket is already included!
                    </p>
                    <p className="text-green-700 text-sm">
                      <strong>The $75 option below is for:</strong> People who want to attend ONLY the banquet 
                      (not registering for the full Lectureship) or want to bring additional guests.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="specialEvents"
                    value="memorial-banquet"
                    checked={formData.specialEvents.includes('memorial-banquet')}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                  />
                  <div className="ml-3">
                    <span className="text-slate-700 font-medium">John O. Williams Memorial Banquet</span>
                    <p className="text-slate-600 text-sm font-medium">March 12, 2026 • 6:00 PM • $75 per ticket</p>
                    <p className="text-slate-500 text-xs mt-1">
                      For banquet-only guests or additional tickets for family/friends
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Vendor Tables Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">🏪 Vendor Tables</h3>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <span className="text-orange-600 text-2xl mr-3 mt-1">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Vendor Requirements</h4>
                    <p className="text-orange-700 text-sm mb-2">
                      <strong>All vendors MUST register</strong> for the Lectureship in addition to purchasing vendor tables (for insurance purposes).
                    </p>
                    <p className="text-orange-700 text-sm">
                      Vendor table cost must be paid in advance. Space allocated on first-come basis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="border border-slate-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-slate-900 mb-2">1 Table</h4>
                  <p className="text-2xl font-bold text-slate-600 mb-2">$250</p>
                  <label className="flex items-center justify-center">
                    <input
                      type="radio"
                      name="vendorTables"
                      value="1"
                      checked={formData.vendorTables === 1}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Select
                  </label>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-slate-900 mb-2">2 Tables</h4>
                  <p className="text-2xl font-bold text-slate-600 mb-2">$350</p>
                  <label className="flex items-center justify-center">
                    <input
                      type="radio"
                      name="vendorTables"
                      value="2"
                      checked={formData.vendorTables === 2}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Select
                  </label>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-slate-900 mb-2">3 Tables</h4>
                  <p className="text-2xl font-bold text-slate-600 mb-2">$450</p>
                  <label className="flex items-center justify-center">
                    <input
                      type="radio"
                      name="vendorTables"
                      value="3"
                      checked={formData.vendorTables === 3}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Select
                  </label>
                </div>
              </div>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="vendorTables"
                  value="0"
                  checked={formData.vendorTables === 0}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-slate-700">No vendor tables needed</span>
              </label>
            </div>

            {/* Souvenir Book Advertisements */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">📧 Souvenir Book Advertisements</h3>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <span className="text-red-600 text-2xl mr-3 mt-1">📅</span>
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Advertisement Deadline</h4>
                    <p className="text-red-700 text-sm mb-2">
                      <strong>All ads MUST BE RECEIVED by February 1, 2026</strong>
                    </p>
                    <p className="text-red-700 text-sm">
                      Email camera-ready ads to: <strong>cocnl1945@gmail.com</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Ads */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Color Advertisements</h4>
                  <div className="space-y-3">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="advertisements"
                        value="full-page-color"
                        checked={formData.advertisements.includes('full-page-color')}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                      <div className="ml-3">
                        <span className="text-slate-700 font-medium">Full Page Digital Color Ad</span>
                        <p className="text-blue-600 font-bold">$225.00</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="advertisements"
                        value="half-page-color"
                        checked={formData.advertisements.includes('half-page-color')}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                      <div className="ml-3">
                        <span className="text-slate-700 font-medium">Half Page Digital Color Ad</span>
                        <p className="text-blue-600 font-bold">$175.00</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Black & White Ads */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Black & White Advertisements</h4>
                  <div className="space-y-3">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="advertisements"
                        value="full-page-bw"
                        checked={formData.advertisements.includes('full-page-bw')}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-gray-600 focus:ring-gray-500 border-slate-300 rounded"
                      />
                      <div className="ml-3">
                        <span className="text-slate-700 font-medium">Full Page Digital B/W Ad</span>
                        <p className="text-gray-600 font-bold">$180.00</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="advertisements"
                        value="half-page-bw"
                        checked={formData.advertisements.includes('half-page-bw')}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-gray-600 focus:ring-gray-500 border-slate-300 rounded"
                      />
                      <div className="ml-3">
                        <span className="text-slate-700 font-medium">Half Page Digital B/W Ad</span>
                        <p className="text-gray-600 font-bold">$125.00</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="advertisements"
                        value="quarter-page-bw"
                        checked={formData.advertisements.includes('quarter-page-bw')}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-gray-600 focus:ring-gray-500 border-slate-300 rounded"
                      />
                      <div className="ml-3">
                        <span className="text-slate-700 font-medium">Quarter Page Digital B/W Ad</span>
                        <p className="text-gray-600 font-bold">$80.00</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection - ALWAYS SHOW IF THERE'S A TOTAL */}
            {getTotalPrice() > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">💳 Payment Method</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-blue-600 text-2xl mr-3 mt-1">ℹ️</span>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">How will you pay?</h4>
                      <p className="text-blue-700 text-sm">
                        Please let us know your preferred payment method. This helps us track payments more efficiently.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">💳 Credit Card (Square)</span>
                      <p className="text-slate-600 text-sm">Pay online using our secure Square payment links</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="zelle"
                      checked={formData.paymentMethod === 'zelle'}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">📱 Zelle</span>
                      <p className="text-slate-600 text-sm">Send payment to: cocnl1945@gmail.com</p>
                      <p className="text-slate-500 text-xs mt-1">Include your name and "Lectureship Registration" in the memo</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="check"
                      checked={formData.paymentMethod === 'check'}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">✉️ Mail Check</span>
                      <p className="text-slate-600 text-sm">Mail to: Churches of Christ National Lectureship</p>
                      <p className="text-slate-500 text-xs mt-1">289 Jonesboro Road, STE #199, McDonough, GA 30253</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Price Summary */}
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-slate-900 mb-4">💰 Total Amount</h4>
              <div className="space-y-2 text-slate-700">
                {formData.registrationType && (
                  <div className="flex justify-between">
                    <span>
                      Registration ({formData.registrationType})
                      {formData.registrationType === 'day-to-day' && formData.dayToDayDates.length > 0 && (
                        <span className="text-sm text-slate-500 block">
                          {formData.dayToDayDates.length} day{formData.dayToDayDates.length > 1 ? 's' : ''} × $75
                        </span>
                      )}
                    </span>
                    <span className="font-bold">${getRegistrationPrice()}</span>
                  </div>
                )}
                {formData.vendorTables > 0 && (
                  <div className="flex justify-between">
                    <span>Vendor Tables ({formData.vendorTables} table{formData.vendorTables > 1 ? 's' : ''})</span>
                    <span className="font-bold">${getVendorTablePrice()}</span>
                  </div>
                )}
                {formData.advertisements.length > 0 && (
                  <div className="flex justify-between">
                    <span>Advertisements ({formData.advertisements.length} ad{formData.advertisements.length > 1 ? 's' : ''})</span>
                    <span className="font-bold">${getAdvertisementPrice()}</span>
                  </div>
                )}
                {formData.specialEvents.includes('memorial-banquet') && (
                  <div className="flex justify-between">
                    <span>Memorial Banquet Tickets</span>
                    <span className="font-bold">$75</span>
                  </div>
                )}
                <div className="border-t border-slate-300 pt-2 mt-4">
                  <div className="flex justify-between text-xl font-bold text-slate-900">
                    <span>Total</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Any special accommodations or additional information..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">❌ {submitError}</p>
                  <p className="text-red-600 text-sm mt-1">Please try again or contact us at (800) 609-6211</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 transform hover:scale-105'
                } text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 text-lg`}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Submitting Registration...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
};

export default RegisterForm;
