  function Hotel() {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hotel Information</h1>
          <p className="text-xl text-gray-300">Your home away from home in Atlanta</p>
        </div>
      </section>

      {/* Hotel Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Wyndham Courtland Grand Hotel</h2>
            <p className="text-xl text-gray-600">Experience luxury in the heart of downtown Atlanta</p>
          </div>

          {/* Atlanta Skyline */}
          <div className="mb-12">
            <img 
              src="https://images.pexels.com/photos/134643/pexels-photo-134643.jpeg?auto=compress&cs=tinysrgb&h=350"
              alt="Atlanta skyline at night with light trails and towering skyscrapers"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Hotel Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-slate-600 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">165 Courtland Street NE<br />Atlanta, GA 30303</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="h-6 w-6 text-slate-600 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Main Phone</p>
                    <p className="text-gray-600">(404) 659-6500</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="h-6 w-6 text-slate-600 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Room Rate</p>
                    <p className="text-gray-600">$159.00 per night<br />Single or Double Occupancy</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Important Notes</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2">•</span>
                  Attendees must secure their own individual hotel accommodations
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2">•</span>
                  One (1) night room and tax deposit charged at reservation
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2">•</span>
                  Deposit applied towards guest's bill upon check-in
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2">•</span>
                  No refunds will be granted
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Check-in/Check-out Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Check-In & Check-Out Policy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-green-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Check-In</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">Friday, March 6, 2026</p>
              <p className="text-lg text-gray-600">4:00 P.M.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-red-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Check-Out</h3>
              <p className="text-2xl font-bold text-red-600 mb-2">Friday, March 13, 2026</p>
              <p className="text-lg text-gray-600">11:00 A.M.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Information */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How to Make Reservations</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">By Phone</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-700">(888) 310-7807</p>
                  <p className="text-gray-600 mt-2">Reservation Hotline</p>
                </div>
                
                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Important Instructions:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">1.</span>
                      Call the reservation hotline
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">2.</span>
                      Identify yourself as a member of the <strong>"Churches of Christ National Lectureship"</strong>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">3.</span>
                      This ensures you receive the Lectureship group rate
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-green-900 mb-6">Online</h3>
              
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 mb-6">
                  <p className="text-gray-600 mb-4">Use the special group booking link:</p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <a 
                      href="https://book.passkey.com/event/51088699/owner/326/home" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      https://book.passkey.com/event/51088699/owner/326/home
                    </a>
                  </div>
                </div>
                
                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <p className="text-green-800 font-semibold">
                    Online booking ensures automatic group rate application
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Amenities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Hotel Amenities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-slate-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Free WiFi</h3>
              <p className="text-gray-600 text-sm">High-speed internet throughout</p>
            </div>

            <div className="text-center">
              <div className="text-slate-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Downtown Location</h3>
              <p className="text-gray-600 text-sm">Heart of Atlanta</p>
            </div>

            <div className="text-center">
              <div className="text-slate-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Meeting Facilities</h3>
              <p className="text-gray-600 text-sm">Conference rooms available</p>
            </div>

            <div className="text-center">
              <div className="text-slate-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Dining Options</h3>
              <p className="text-gray-600 text-sm">Restaurant and room service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Hotel Questions */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Hotel Questions?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Hotel Direct</h3>
              <p className="text-2xl font-bold text-slate-200">(404) 659-6500</p>
              <p className="text-slate-300 mt-2">Wyndham Courtland Grand Hotel</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Lectureship Support</h3>
              <p className="text-2xl font-bold text-slate-200">(800) 609-6211</p>
              <p className="text-slate-300 mt-2">For group rate assistance</p>
              <p className="text-slate-300 mt-2">Email: cocnl1945@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hotel;