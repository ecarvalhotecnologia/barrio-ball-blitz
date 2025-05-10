
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-championship-primary text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          MyChampionship
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-championship-light transition-colors">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-championship-light transition-colors">
                Dashboard
              </Link>
              <Link to="/history" className="hover:text-championship-light transition-colors">
                Championships
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm">Hi, {user?.name}</span>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white hover:bg-white hover:text-championship-primary"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="space-x-4">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white hover:bg-white hover:text-championship-primary"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-white text-championship-primary hover:bg-championship-light">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden container mx-auto mt-4 bg-championship-primary border-t border-championship-secondary pt-4 pb-6 px-6 space-y-4">
          <Link 
            to="/" 
            className="block hover:text-championship-light transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="block hover:text-championship-light transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/history" 
                className="block hover:text-championship-light transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Championships
              </Link>
              <div className="pt-2">
                <span className="text-sm block mb-2">Hi, {user?.name}</span>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-white hover:bg-white hover:text-championship-primary"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-white hover:bg-white hover:text-championship-primary"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-white text-championship-primary hover:bg-championship-light">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
