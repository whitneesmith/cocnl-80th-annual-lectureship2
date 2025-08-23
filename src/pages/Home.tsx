import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Churches of Christ 80th Annual "Historical" National Lectureship
          </h1>
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-xl md:text-2xl text-slate-100 font-semibold mb-4 leading-relaxed">
              "One Lord… One Faith… One Baptism"
            </p>
            <p className="text-lg text-slate-200 mb-4 leading-relaxed">
              In Cooperation and Supported by the Greater Atlanta, Georgia, Area Churches of Christ
            </p>
            <p className="text-lg md:text-xl text-slate-100 font-semibold mb-2 leading-relaxed">
              Lectureship Theme: "Here We Stand" (Ephesians 6:14-17)
            </p>
            <p className="text-lg md:text-xl text-slate-200 mb-6 leading-relaxed">
              March 8-12, 2026 • Atlanta, Georgia
            </p>
            
            {/* Theme Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                A Celebration of Faith & Community
              </h2>
              <p className="text-lg md:text-xl text-slate-100 leading-relaxed">
                Join us for Five days of <span className="font-semibold text-white">Faithfulness, Fellowship, Edification, Exhortation, and Enlightenment</span> as we Celebrate the Visible Kingdom of God's Dear Son
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-slate-900 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-slate-100 transform hover:scale-105 transition-all duration-200 text-lg"
            >
              Register Now
            </Link>
            <Link 
              to="/hotel" 
              className="bg-slate-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-slate-600 transform hover:scale-105 transition-all duration-200 text-lg"
            >
              Hotel Information
            </Link>
          </div>
        </div>
      </section>
      
      {/* Event Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Event Highlights</h2>
          <p className="text-center text-gray-600 mb-12">Join us for five days of fellowship, worship, and spiritual growth</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg border border-slate-200">
              <p className="text-slate-800 font-semibold text-lg">📅 March 8-12, 2026</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg border border-slate-200">
              <p className="text-slate-800 font-semibold text-lg">📍 Atlanta, Georgia</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg border border-slate-200">
              <p className="text-slate-800 font-semibold text-lg">🏨 Courtland Grand Hotel</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-slate-50 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5 Days</h3>
              <p className="text-gray-600">March 8-12, 2026</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🏨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Venue</h3>
              <p className="text-gray-600">Courtland Grand Hotel</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inspiring Speakers</h3>
              <p className="text-gray-600">Renowned Bible scholars</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fellowship</h3>
              <p className="text-gray-600">Connect with believers nationwide</p>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img 
              src="/speaker-at-podium.png" 
              alt="Speaker at lectureship"
              className="w-full h-56 object-cover object-top rounded-lg shadow-lg"
            />
            <img 
              src="/speaker-portrait.png" 
              alt="Lectureship speaker"
              className="w-full h-56 object-cover object-center rounded-lg shadow-lg"
            />
            <img 
              src="/group-discussion.png" 
              alt="Fellowship at lectureship"
              className="w-full h-56 object-cover object-center rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Theme and Scripture Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">📖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">2026 Lectureship Theme</h3>
            </div>
            <div className="text-center mb-6">
              <h4 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                "Here We Stand"
              </h4>
              <p className="text-lg text-slate-600 font-semibold">
                Ephesians 6:14-17
              </p>
            </div>
            <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-6 pl-4 border-l-4 border-slate-400">
              "Stand firm therefore, having belted your waist with truth, and having put on the
              breastplate of righteousness, and having strapped on your feet the preparation of
              the gospel of peace; in addition to all, taking up the shield of faith with which you
              will be able to extinguish all the flaming arrows of the evil one. And take the helmet
              of salvation, and the sword of the Spirit, which is the word of God."
            </blockquote>
            <cite className="block text-slate-800 font-semibold text-lg text-center">
              — Ephesians 6:14-17 NASB
            </cite>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Pricing</h2>
          </div>

          {/* Early Bird vs Regular Pricing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Early Bird Pricing */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg border-2 border-green-200">
              <div className="text-center mb-6">
                <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                  EARLY BIRD SPECIAL
                </div>
                <p className="text-green-700 font-semibold">Valid Only Until December 31, 2025</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Individual Registration</span>
                  <span className="text-green-600 font-bold text-xl">$190.00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div>
                    <span className="text-gray-700 font-medium">Georgia Residents</span>
                    <p className="text-xs text-gray-500">Must Verify Residency</p>
                  </div>
                  <span className="text-green-600 font-bold text-xl">$175.00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Group 5 People</span>
                  <span className="text-green-600 font-bold text-xl">$925.00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Group 10 People</span>
                  <span className="text-green-600 font-bold text-xl">$1,800.00</span>
                </div>
              </div>
            </div>

            {/* Regular Pricing */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="text-center mb-6">
                <div className="inline-block bg-slate-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                  REGULAR RATES
                </div>
                <p className="text-slate-700 font-semibold">Starting January 1, 2026</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Individual Registration</span>
                  <span className="text-slate-600 font-bold text-xl">$210.00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div>
                    <span className="text-gray-700 font-medium">Georgia Residents</span>
                    <p className="text-xs text-gray-500">Must Verify Residency</p>
                  </div>
                  <span className="text-slate-600 font-bold text-xl">$195.00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Group 5 People</span>
                  <span className="text-slate-600 font-bold text-xl">$975.00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Group 10 People</span>
                  <span className="text-slate-600 font-bold text-xl">$1,925.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Registration Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-semibold text-slate-800 mb-4">Additional Registration Options</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">On-Site Individual Registration</span>
                  <span className="text-slate-600 font-bold">$260.00</span>
                </div>
                <p className="text-xs text-gray-500">For All Attendees</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700">Day-to-Day Individual Registration</span>
                    <p className="text-xs text-gray-500">No Amenities Provided</p>
                  </div>
                  <span className="text-slate-600 font-bold">$65.00</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-red-800 mb-4">Important Notice</h4>
              <p className="text-red-700 font-semibold">
                No Personal or Church Checks Will be Accepted After February 1, 2026
              </p>
            </div>
          </div>

          {/* Special Events */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-50 rounded-xl">
              <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎵</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Sunday Songfest at Hotel</h4>
              <p className="text-gray-600 text-sm mb-2">March 8, 2026 • 4:30-6:00 PM</p>
              <p className="text-green-600 font-bold text-xl">FREE</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👩</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Women's Division Luncheon</h4>
              <p className="text-gray-600 text-sm mb-2">March 11, 2026 • 12:00 PM</p>
              <p className="text-slate-600 font-bold text-xl">$60.00</p>
              <p className="text-xs text-gray-500 mt-1">On-Site Ticket Purchase Only</p>
              <p className="text-xs text-gray-500">Not Included in Lectureship Registration</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🍽️</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">John O. Williams Lectureship Memorial Banquet</h4>
              <p className="text-gray-600 text-sm mb-2">March 12, 2026 • 6:00 PM</p>
              <p className="text-green-600 font-bold text-lg">Included in Registration</p>
              <p className="text-xs text-gray-500 mt-1">Single Ticket Purchase $75.00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hotel Information</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Newly Renovated Courtland Grand Hotel in Downtown Atlanta – Special Lectureship Rates
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 shadow-lg border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="mr-3">🏨</span>
                Wyndham Courtland Grand Hotel
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <span className="text-slate-600 mr-3 mt-1">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">165 Courtland Street NE</p>
                    <p className="text-gray-600">Atlanta, Georgia 30303</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-600 mr-3">💰</span>
                  <p className="text-gray-900"><strong>$159.00 per-night</strong> (Single or Double Occupancy)</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Reservation Details:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Check-in: 4:00 PM – March 6, 2026</li>
                  <li>• Check-out: 11:00 AM – March 13, 2026</li>
                  <li>• One night room and tax charged upon making hotel reservation</li>
                  <li>• No refunds granted</li>
                </ul>
              </div>

              <div className="flex justify-center">
                <div className="bg-blue-600 text-white rounded-lg p-6 text-center max-w-md">
                  <p className="font-semibold mb-4">Online Booking</p>
                  <p className="text-blue-100 text-sm mb-4">Ensures Automatic Group Rate</p>
                  <a 
                    href="https://book.passkey.com/event/51088699/owner/326/home" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-blue-700 font-bold py-2 px-4 rounded text-sm hover:bg-blue-50 transition-colors duration-200"
                  >
                    Book Online Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lectureship Help-Desk</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📞</span>
              </div>
              <h3 className="font-semibold text-slate-200 mb-2">Phone</h3>
              <p className="text-white text-2xl font-bold">(800) 609-6211</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✉️</span>
              </div>
              <h3 className="font-semibold text-slate-200 mb-2">Email</h3>
              <p className="text-white text-xl">cocnl1945@gmail.com</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Mail-In Registration</h3>
            <p className="text-slate-200 mb-4">
              If You Choose to Mail-In Your "Registration for the Lectureship"<br />
              Kindly Remit Check or Money Order Made Payable to:
            </p>
            <p className="text-white font-bold text-lg mb-4">
              "Churches of Christ National Lectureship"
            </p>
            <div className="text-slate-200">
              <p>289 Jonesboro Road Box #199</p>
              <p>McDonough, Georgia 30253</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
