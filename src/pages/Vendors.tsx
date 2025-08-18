const Vendors = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Vendor Information
          </h1>
          <p className="text-xl text-slate-100 max-w-3xl mx-auto">
            Join us as a vendor at the 80th Annual Churches of Christ National Lectureship. 
            Connect with attendees from across the nation and showcase your products or services.
          </p>
        </div>
      </section>

      {/* Souvenir Book Advertisement Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Lectureship Souvenir Book Advertisement Information</h2>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 mb-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📧</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Email Ads to:</h3>
                <p className="text-slate-600 text-lg font-bold">cocnl1945@gmail.com</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-slate-800 mb-4">Color Advertisements</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700 font-medium">Full Page Digital Color Ad</span>
                      <span className="text-slate-600 font-bold">$225.00</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700 font-medium">Half Page Digital Color Ad</span>
                      <span className="text-slate-600 font-bold">$175.00</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Camera Ready Required</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-slate-800 mb-4">Black & White Advertisements</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700 font-medium">Full Page Digital B/W Ad</span>
                      <span className="text-slate-600 font-bold">$180.00</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700 font-medium">Half Page Digital B/W Ad</span>
                      <span className="text-slate-600 font-bold">$125.00</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700 font-medium">Quarter Page Digital B/W Ad</span>
                      <span className="text-slate-600 font-bold">$80.00</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Camera Ready Required</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-red-600 text-2xl mr-4 mt-1">⚠️</span>
                  <div>
                    <h4 className="text-lg font-bold text-red-800 mb-2">Important Advertisement Deadline</h4>
                    <p className="text-red-700 font-semibold mb-2">
                      All Ads "MUST BE RECEIVED NO LATER THAN FEBRUARY 1, 2026."
                    </p>
                    <p className="text-red-700 text-sm">
                      The Churches of Christ National Lectureship Reserves the Right to Refuse Any Ads For Publication Which Are Deemed to be Unsuitable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Lectureship Vendor Information</h2>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              {/* Important Notice */}
              <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-yellow-600 text-2xl mr-4 mt-1">⚠️</span>
                  <div>
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">Important Vendor Requirements</h4>
                    <p className="text-yellow-700 font-semibold mb-2">
                      All Vendors "MUST REGISTER" With the Churches of Christ National Lectureship for Insurance Purposes "IN ADDITION" to Vendor Table Cost.
                    </p>
                    <p className="text-yellow-700 text-sm mb-2">
                      Exhibit Space Will be Allocated on a First-Come Basis.
                    </p>
                    <p className="text-yellow-700 text-sm mb-2">
                      The Lectureship Assumes No Liability for Product Damages or Losses and Reserves the Right to Refuse Exhibit Space to Anyone Whose Products Are Deemed to be Unsuitable.
                    </p>
                    <p className="text-yellow-700 font-semibold">
                      Vendor Table Cost "MUST BE" Paid in Advance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Table Rental Pricing */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="mr-3">🏪</span>
                  Table Rental Pricing
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pricing */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                      <div>
                        <span className="font-semibold text-gray-900">One (1) Vendor Table</span>
                      </div>
                      <span className="text-slate-600 font-bold text-xl">$250.00</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                      <div>
                        <span className="font-semibold text-gray-900">Two (2) Vendor Tables</span>
                      </div>
                      <span className="text-slate-600 font-bold text-xl">$350.00</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                      <div>
                        <span className="font-semibold text-gray-900">Three (3) Vendor Tables</span>
                      </div>
                      <span className="text-slate-600 font-bold text-xl">$450.00</span>
                    </div>
                  </div>

                  {/* Table Example Image */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800">Table Example</h4>
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src="/vendor-table-black.png" 
                        alt="Example of vendor table setup"
                        className="w-full h-64 object-contain bg-white"
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Example of vendor table
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-8 text-center">
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                
                <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-slate-200 font-semibold mb-4">Ready to advertise or become a vendor?</p>
                  <p className="text-slate-200 mb-4">
                    Contact us today to secure your advertisement space or vendor table 
                    at this historic 80th Annual National Lectureship.
                  </p>
                  <p className="text-white text-xl font-bold">cocnl1945@gmail.com</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vendors;
