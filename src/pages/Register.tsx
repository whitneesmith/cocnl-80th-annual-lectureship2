        import React from 'react';
import { Link } from 'react-router-dom';
const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-50">
      {/* Registration Information */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Registration Information
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join us for this historic 80th Annual National Lectureship. Multiple registration options and payment methods available.
            </p>
          </div>

          {/* Online Registration CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Register Online?</h3>
              <p className="text-slate-100 mb-6">
                Use our convenient online registration form with multiple payment options including Credit Card, PayPal, and Zelle.
              </p>
<Link 
  to="/register-form" 
  className="inline-block bg-white text-slate-700 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
>
  Start Online Registration
</Link>
            </div>
          </div>

          {/* Registration Types */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Registration Types & Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Individual Registrations */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <h4 className="text-xl font-bold text-slate-900 mb-6">Individual Registration</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-slate-900">Early Bird (Until Dec 31, 2025)</p>
                      <p className="text-slate-600 text-sm">Individual Registration</p>
                    </div>
                    <span className="text-green-700 font-bold text-lg">$190</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">Regular (Starting Jan 1, 2026)</p>
                      <p className="text-slate-600 text-sm">Individual Registration</p>
                    </div>
                    <span className="text-slate-700 font-bold text-lg">$210</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-slate-900">Late (March 1-8, 2026)</p>
                      <p className="text-slate-600 text-sm">Individual Registration</p>
                    </div>
                    <span className="text-red-700 font-bold text-lg">$245</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-semibold text-slate-900">Day-to-Day</p>
                      <p className="text-slate-600 text-sm">Per day - specify date(s)</p>
                    </div>
                    <span className="text-blue-700 font-bold text-lg">$75</span>
                  </div>
                </div>
              </div>

              {/* First Speaker Photo - In the grid */}
              <div className="flex items-center justify-center">
                <img 
                  src="/speaker-at-hyatt-podium.png" 
                  alt="Speaker at lectureship"
                  className="w-full max-w-sm h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <section className="py-8 bg-gray-100 border-l-4 border-slate-400">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-start">
                <span className="text-slate-600 text-2xl mr-4 mt-1">⚠️</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Important Registration Requirement</h3>
                  <p className="text-slate-700">
                    All persons who attend and are affiliated with the 2026 Churches of Christ 80th Annual "Historical" National Lectureship 
                    <strong> MUST BE REGISTERED</strong> with the Lectureship to comply with insurance regulations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mail-In Registration */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Mail-In Registration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-200 mb-4">Send Payment To:</h4>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="font-semibold">Churches of Christ National Lectureship</p>
                  <p>289 Jonesboro Road, STE #199</p>
                  <p>McDonough, GA 30253</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-200 mb-4">Important Deadlines:</h4>
                <ul className="space-y-2 text-slate-300">
                  <li>• <strong>Mail-In Deadline:</strong> February 7, 2026</li>
                  <li>• <strong>Early Bird Pricing:</strong> Until December 31, 2025</li>
                  <li>• <strong>Late Registration:</strong> March 1-8, 2026</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Registration Options */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Georgia Residents */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="mr-3">🍑</span>
                    Georgia Residents (Special Rate)
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                      <div>
                        <span className="font-semibold text-gray-900">Early Bird Local Registration</span>
                        <p className="text-sm text-gray-600">Until December 31, 2025</p>
                      </div>
                      <span className="text-slate-600 font-bold text-xl">$175</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                      <div>
                        <span className="font-semibold text-gray-900">Regular Local Registration</span>
                        <p className="text-sm text-gray-600">Beginning January 1, 2026</p>
                      </div>
                      <span className="text-slate-600 font-bold text-xl">$195</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mt-6">
                    <p className="text-slate-800 text-sm">
                      <strong>Verification Required:</strong> Name, address, and phone number must be verified 
                      for Georgia residents to receive the discounted registration rate.
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Rates */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-50 rounded-2xl shadow-xl p-8 border border-gray-100 mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="mr-3">👥</span>
                  Group Registration Rates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">5 People Groups</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Early Bird (Until Dec 31)</span>
                        <span className="text-slate-600 font-bold">$925</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Regular (Jan 1+)</span>
                        <span className="text-slate-600 font-bold">$975</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">10 People Groups</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Early Bird (Until Dec 31)</span>
                        <span className="text-slate-600 font-bold">$1,800</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Regular (Jan 1+)</span>
                        <span className="text-slate-600 font-bold">$1,925</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Events */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="mr-3">🎉</span>
                  Special Events (Additional Tickets)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-50 rounded-xl">
                    <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">🎵</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Sunday Songfest</h4>
                    <p className="text-gray-600 text-sm mb-2">March 8, 2026 • 4:30-6:00 PM</p>
                    <p className="text-green-600 font-bold text-xl">FREE</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">👩</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Women's Division Luncheon</h4>
                    <p className="text-gray-600 text-sm mb-2">March 11, 2026 • 12:00 PM</p>
                    <p className="text-slate-600 font-bold text-xl">$60</p>
                    <p className="text-xs text-gray-500 mt-1">(On-Site Purchase Only)</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">🍽️</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">John O. Williams Memorial Banquet</h4>
                    <p className="text-gray-600 text-sm mb-2">March 12, 2026 • 6:00 PM</p>
                    <p className="text-slate-600 font-bold text-xl">$75</p>
                    <p className="text-xs text-gray-500 mt-1">Single ticket without full registration</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl shadow-xl p-8 mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="mr-3">💳</span>
                  Payment & Registration Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-200 mb-4">Mail-In Registration</h4>
                    <p className="text-slate-100 mb-4">
                      Make checks or money orders payable to:
                    </p>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <p className="font-semibold">Churches of Christ National Lectureship</p>
                      <p>289 Jonesboro Road, STE #199</p>
                      <p>McDonough, GA 30253</p>
                    </div>
                    <p className="text-slate-200 font-semibold">
                      Deadline: February 7, 2026
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-slate-200 mb-4">Digital Payment</h4>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <img 
                        src="/zelle-payment.png" 
                        alt="We Accept Zelle - cocnl1945@gmail.com"
                        className="w-full max-w-xs mx-auto"
                      />
                    </div>
                    <p className="text-slate-200 text-sm text-center">
                      Send payments to: <strong>cocnl1945@gmail.com</strong>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-slate-200 mb-4">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-slate-300 mr-3">✉️</span>
                        <span>cocnl1945@gmail.com</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-slate-300 mr-3">📞</span>
                        <span>(800) 609-6211</span>
                      </div>
                    </div>
                    <div className="bg-gray-100/20 rounded-lg p-4 mt-4">
                      <p className="text-slate-200 text-sm">
                        <strong>NSF Check Fee:</strong> $40.00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Payment Methods</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-200">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">💳</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Credit Card</h4>
                    <p className="text-slate-600 mb-4">Secure online payment with Square</p>
                    <p className="text-blue-700 font-semibold">Instant confirmation</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border border-purple-200">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">📱</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Zelle</h4>
                    <p className="text-slate-600 mb-4">Send payment to:</p>
                    <p className="text-purple-700 font-semibold">cocnl1945@gmail.com</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 text-center border border-slate-200">
                    <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">📧</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Mail Check</h4>
                    <p className="text-slate-600 mb-4">Send check or money order</p>
                    <p className="text-slate-700 font-semibold">Deadline: Feb 7, 2026</p>
                  </div>
                </div>
              </div>

              {/* Important Deadlines - ONLY Early Bird */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Important Deadlines</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                    <p className="font-semibold text-green-800">Early Bird Deadline</p>
                    <p className="text-green-700">December 31, 2025</p>
                  </div>
                </div>
              </div>

              {/* Speaker Photos Grid */}
              <div className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex items-center justify-center">
                    <img 
                      src="/speaker-at-podium-2.png" 
                      alt="Speaker presenting"
                      className="w-full max-w-sm h-auto rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <img 
                      src="/speaker-at-hyatt-podium-2.png" 
                      alt="Speaker at Hyatt Regency"
                      className="w-full max-w-sm h-auto rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <img 
                      src="/speaker-at-podium-3.png" 
                      alt="Speaker delivering message"
                      className="w-full max-w-sm h-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Section - Email Only */}
              <div className="mt-8 p-6 bg-slate-900 text-white rounded-lg text-center">
                <p className="text-slate-200 mb-6">
                  For registration assistance, please email us.
                </p>
                <div className="flex justify-center">
                  <a 
                    href="mailto:registration@cocnl.org" 
                    className="bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Register;
