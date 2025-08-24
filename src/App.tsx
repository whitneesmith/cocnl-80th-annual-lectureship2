import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from './pages/Home';
import Register from './pages/Register';
import RegisterForm from './pages/RegisterForm';
import Hotel from './pages/Hotel';
import Vendors from './pages/Vendors';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin route - standalone without Layout */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Regular pages with Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/register-form" element={<Layout><RegisterForm /></Layout>} />
        <Route path="/hotel" element={<Layout><Hotel /></Layout>} />
        <Route path="/vendors" element={<Layout><Vendors /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
