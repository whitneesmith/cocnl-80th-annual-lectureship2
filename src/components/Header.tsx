import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              <p className="text-slate-300 text-xs hidden sm:block">Hosted by Atlanta Area Churches of Christ</p>
            </div>
          </div>

          {/* Desktop Navigation */}
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

          {/* Desktop CTA Button */}
          <div className="hidden lg:block">
            <Link to="/register-form">
              <button className="bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-slate-900 font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                Register Now
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-200 hover:text-white transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-slate-100 hover:text-white hover:bg-slate-700 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/register" 
                className="block px-3 py-2 text-slate-100 hover:text-white hover:bg-slate-700 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
              <Link 
                to="/hotel" 
                className="block px-3 py-2 text-slate-100 hover:text-white hover:bg-slate-700 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hotel
              </Link>
              <Link 
                to="/vendors" 
                className="block px-3 py-2 text-slate-100 hover:text-white hover:bg-slate-700 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Vendors
              </Link>
              <Link 
                to="/contact" 
                className="block px-3 py-2 text-slate-100 hover:text-white hover:bg-slate-700 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/register-form" 
                className="block px-3 py-2 bg-slate-400 text-slate-900 hover:bg-slate-500 rounded-md font-bold transition-colors duration-200 mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;</parameter>
<parameter name="taskTitle">Create working mobile header</parameter>
</invoke>
