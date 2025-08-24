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
        {/* Admin route without Layout wrapper */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* All other routes with Layout wrapper */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-form" element={<RegisterForm />} />
              <Route path="/hotel" element={<Hotel />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
