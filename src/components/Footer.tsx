
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-championship-dark text-white py-10 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MyChampionship</h3>
            <p className="text-sm opacity-75">
              The ultimate platform for managing your neighborhood soccer tournaments.
              Create brackets, track scores, and crown champions!
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-75 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm opacity-75 hover:opacity-100 transition-opacity">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-sm opacity-75 hover:opacity-100 transition-opacity">
                  Past Championships
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm opacity-75 hover:opacity-100 transition-opacity">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm opacity-75">
                <span>Email: support@mychampionship.com</span>
              </li>
              <li className="text-sm opacity-75">
                <span>Phone: +1 (123) 456-7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-75">
            &copy; {currentYear} MyChampionship. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-sm opacity-75 hover:opacity-100 transition-opacity">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm opacity-75 hover:opacity-100 transition-opacity">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
