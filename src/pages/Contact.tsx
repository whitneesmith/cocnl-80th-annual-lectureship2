const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-slate-100 max-w-3xl mx-auto">
            Churches of Christ 80th Annual "Historical" National Lectureship
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Phone Instructions */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-slate-100 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="mr-3">📋</span>
              Phone Contact Instructions
            </h3>
            <div className="space-y-4 text-slate-700">
              <p className="text-lg">
                For additional questions regarding the Churches of Christ 80th Annual "Historical" National Lectureship, 
                call the toll free number: <strong className="text-slate-900">(800) 609-6211</strong>.
              </p>
              
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-3">If instructed to leave a message, please provide:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                    Your name
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                    Email address
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                    Phone number
                  </li>
                </ul>
              </div>
              
              <p className="text-slate-700">
                A response/reply will be given to your inquiry in a timely manner. 
                <strong className="text-slate-900"> It is extremely necessary to provide your email address.</strong>
              </p>
            </div>
          </div>

          {/* Email Contact */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">✉️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Email for Faster Response</h3>
            <p className="text-slate-200 mb-6 text-lg">
              You may also email the Churches of Christ "Historical" National Lectureship at:
            </p>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm mb-6">
              <a 
                href="mailto:cocnl1945@gmail.com"
                className="text-white text-2xl font-bold hover:text-slate-200 transition-colors duration-200"
              >
                cocnl1945@gmail.com
              </a>
            </div>
            <p className="text-slate-200 font-semibold">
              Email inquiries typically receive a faster response/reply
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;