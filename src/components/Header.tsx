import { Link, useLocation } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Title */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <span className="text-slate-900 text-xl font-bold">✝</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Churches of Christ</h1>
              <p className="text-slate-200 text-sm">National Lectureship</p>
              <p className="text-slate-300 text-xs">Hosted by Atlanta Area Churches of Christ</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-slate-100 hover:text-white font-medium transition-colors duration-200 hover:underline decoration-slate-300">
              Home
            </Link>
            <Link to="/register" className="text-slate-100 hover:text-white font-medium transition-colors duration-200 hover:underline decoration-slate-300">
              Register
            </Link>
            <Link to="/hotel" className="text-slate-100 hover:text-white font-medium transition-colors duration-200 hover:underline decoration-slate-300">
              Hotel
            </Link>
            <Link to="/vendors" className="text-slate-100 hover:text-white font-medium transition-colors duration-200 hover:underline decoration-slate-300">
              Vendors
            </Link>
            <Link to="/contact" className="text-slate-100 hover:text-white font-medium transition-colors duration-200 hover:underline decoration-slate-300">
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/register-form">
              <button className="bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-slate-900 font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                Register Now
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-slate-200 hover:text-white transition-colors duration-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;