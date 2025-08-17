function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Event Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-slate-200">80th Annual "Historical" National Lectureship</h3>
            <p className="text-slate-300 max-w-3xl mx-auto">
              Join us for Five days of Faithfulness, Fellowship, Edification, Exhortation, and Enlightenment as we celebrate the Visible Kingdom of God's Dear Son
            </p>
            <div className="flex items-center space-x-4 text-slate-200">
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                <span className="font-semibold">March 8-12, 2026</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span className="font-semibold">Atlanta, GA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-200 hover:underline">Registration</a></li>
              <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-200 hover:underline">Hotel Information</a></li>
              <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-200 hover:underline">Vendor Tables</a></li>
              <li><a href="#" className="text-slate-100 hover:text-white transition-colors duration-200 hover:underline">Schedule</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="space-y-2 text-slate-300">
              <p className="flex items-center">
                <span className="mr-2">📞</span>
                (800) 609-6211
              </p>
              <p className="flex items-center">
                <span className="mr-2">✉️</span>
                cocnl1945@gmail.com
              </p>
              <p className="flex items-start">
                <span className="mr-2 mt-1">📍</span>
                <span>
                  289 Jonesboro Road, STE #199<br />
                  McDonough, GA 30253
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>&copy; 2026 Churches of Christ 80th Annual "Historical" National Lectureship. All rights reserved.</p>
          <p className="mt-2 text-sm">"One Lord… One Faith… One Baptism" • 1945-2026</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;