import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

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
    
    const hasRegistration = formData.registrationType !== '';
    const hasVendorTables = formData.vendorTables > 0;
    const hasAdvertisements = formData.advertisements.length > 0;
    const hasSpecialEvents = formData.specialEvents.length > 0;
    
    if (!hasRegistration && !hasVendorTables && !hasAdvertisements && !hasSpecialEvents) {
      alert('Please select at least one option: registration type, vendor tables, advertisements, or special events.');
      setIsSubmitting(false);
      return;
    }
    
    if (getTotalPrice() > 0 && !formData.paymentMethod) {
      alert('Please select how you plan to pay.');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.registrationType === 'day-to-day' && formData.dayToDayDates.length === 0) {
      alert('Please select at least one day to attend for day-to-day registration.');
      setIsSubmitting(false);
      return;
    }
    
    if (((formData.registrationType.includes('group-5') || formData.registrationType.includes('group-10')) || 
         (formData.quantity > 1 && !formData.registrationType.includes('group-') && formData.registrationType !== 'day-to-day')) && 
        !formData.attendeeNames.trim()) {
      alert('Please list all attendee names.');
      setIsSubmitting(false);
      return;
    }
    
    if (((formData.registrationType.includes('group-5') || formData.registrationType.includes('group-10')) || 
         (formData.quantity > 1 && !formData.registrationType.includes('group-') && formData.registrationType !== 'day-to-day')) && 
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
      
      const paymentMethodDisplay = formData.paymentMethod === 'credit-card' ? 'Credit/Debit Card (Square)' :
                                   formData.paymentMethod === 'zelle' ? 'Zelle (cocnl1945@gmail.com)' :
                                   formData.paymentMethod === 'check' ? 'Mail Check' : 'Not specified';
      
      try {
        await emailjs.send(
          'service_p49aqfy',
          'template_oywsajv',
          {
            to_name: `${formData.firstName} ${formData.lastName}`,
            to_email: formData.email,
            from_name: 'Churches of Christ National Lectureship',
            registration_type: formData.registrationType || 'Special Events Only',
            total_amount: getTotalPrice(),
            payment_method: paymentMethodDisplay,
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
          },
          'Nttdl3naYDqz18xNa'
        );
        console.log('Registration email sent successfully');
        
        await emailjs.send(
          'service_p49aqfy',
          'template_oywsajv',
          {
            to_name: 'Churches of Christ National Lectureship',
            to_email: 'cocnl1945@gmail.com',
            from_name: 'Website Registration System',
            registration_type: `NEW REGISTRATION: ${formData.firstName} ${formData.lastName}`,
            total_amount: getTotalPrice(),
            payment_method: `PAYMENT METHOD: ${paymentMethodDisplay}`,
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
          },
          'Nttdl3naYDqz18xNa'
        );
        console.log('Internal notification email sent');
        
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
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

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">✓</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Registration Complete!</h2>
              <p className="text-slate-600">
                Thank you {formData.firstName}! Your registration has been submitted.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Registration Summary</h3>
              <div className="space-y-2 text-slate-700">
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Registration Type:</strong> {formData.registrationType || 'Special Events Only'}</p>
                {formData.specialEvents.includes('memorial-banquet') && (
                  <p><strong>Memorial Banquet:</strong> $75</p>
                )}
                {formData.paymentMethod && (
                  <p><strong>Payment Method:</strong> {
                    formData.paymentMethod === 'credit-card' ? '💳 Credit/Debit Card' :
                    formData.paymentMethod === 'zelle' ? '📱 Zelle' :
                    formData.paymentMethod === 'check' ? '✉️ Mail Check' : formData.paymentMethod
                  }</p>
                )}
                <p><strong>Total Amount:</strong> ${getTotalPrice()}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Next Steps:</h3>
              <div className="text-blue-800 space-y-2">
                <p>✅ <strong>Confirmation email sent</strong> to {formData.email}</p>
                <p>📧 <strong>Payment instructions</strong> included in your email</p>
                <p>📞 <strong>Questions?</strong> Call us at (800) 609-6211</p>
              </div>
            </div>

            <div className="mt-8 text-center space-x-4">
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
            
            {/* Contact Information */}
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

            {/* Registration Type */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Registration Type</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <span className="text-blue-600 text-2xl mr-3 mt-1">ℹ️</span>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Registration Options</h4>
                    <p className="text-blue-700 text-sm">
                      You can register for the full Lectureship or attend special events only. 
                      Registration type is optional if you're only attending the Memorial Banquet.
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
                <option value="">No Lectureship Registration (Special Events Only)</option>
                <option value="individual-early">Individual Early Bird - $190 (Until Dec 31, 2025)</option>
                <option value="individual-regular">Individual Regular - $210 (Starting Jan 1, 2026)</option>
                <option value="georgia-early">Georgia Resident Early Bird - $175 (Until Dec 31, 2025)</option>
                <option value="georgia-regular">Georgia Resident Regular - $195 (Starting Jan 1, 2026)</option>
                <option value="group-5-early">Group 5 People Early Bird - $925 (Until Dec 31, 2025)</option>
                <option value="group-5-regular">Group 5 People Regular - $975 (Starting Jan 1, 2026)</option>
                <option value="group-10-early">Group 10 People Early Bird - $1,800 (Until Dec 31, 2025)</option>
                <option value="group-10-regular">Group 10 People Regular - $1,925 (Starting Jan 1, 2026)</option>
              </select>
            </div>

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

            {/* Payment Method Selection */}
            {getTotalPrice() > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">💳 How will you pay?</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-blue-600 text-2xl mr-3 mt-1">ℹ️</span>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Payment Method Selection</h4>
                      <p className="text-blue-700 text-sm">
                        Please let us know how you plan to pay so we can track your registration properly. 
                        You'll receive payment instructions after submitting this form.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">💳 Credit/Debit Card</span>
                      <p className="text-slate-600 text-sm">Pay online with Square</p>
                      <p className="text-green-600 text-xs font-medium">✓ Instant processing</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="zelle"
                      checked={formData.paymentMethod === 'zelle'}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300"
                    />
                    <div className="ml-3">
                      <span className="text-slate-700 font-medium">📱 Zelle</span>
                      <p className="text-slate-600 text-sm">Send to: cocnl1945@gmail.com</p>
                      <p className="text-green-600 text-xs font-medium">✓ No fees</p>
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
                      <p className="text-slate-600 text-sm">Traditional payment</p>
                      <p className="text-orange-600 text-xs font-medium">⏰ Allow extra time</p>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === '' && getTotalPrice() > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      ⚠️ Please select how you plan to pay so we can provide the correct instructions.
                    </p>
                  </div>
                )}

                {/* Price Summary */}
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">💰 Total Amount</h4>
                  <div className="space-y-2 text-slate-700">
                    {formData.registrationType && (
                      <div className="flex justify-between">
                        <span>Registration ({formData.registrationType})</span>
                        <span className="font-bold">${getRegistrationPrice()}</span>
                      </div>
                    )}
                    {formData.specialEvents.includes('memorial-banquet') && (
                      <div className="flex justify-between">
                        <span>Memorial Banquet</span>
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
              </div>
            )}

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
                  'Submit Registration'
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
