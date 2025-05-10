
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Welcome to MyChampionship!",
      description: "Create and manage your neighborhood soccer tournaments.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-championship-primary to-championship-secondary text-white py-16 md:py-28">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Organize Your Neighborhood Soccer Championships
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
              Create tournaments, simulate matches, and crown champions with our easy-to-use platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button className="bg-white text-championship-primary hover:bg-championship-light px-8 py-6 text-lg font-medium">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-medium">
                  View Championships
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-championship-light rounded-full flex items-center justify-center mb-4 text-championship-primary font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Register Teams</h3>
                <p className="text-gray-600">
                  Add your eight teams to the championship. Each team is automatically assigned a registration order.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-championship-light rounded-full flex items-center justify-center mb-4 text-championship-primary font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Generate Brackets</h3>
                <p className="text-gray-600">
                  The system automatically creates quarterfinals, semifinals, and finals brackets with random matchups.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-championship-light rounded-full flex items-center justify-center mb-4 text-championship-primary font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Simulate & Track</h3>
                <p className="text-gray-600">
                  Simulate matches, track scores, and follow your teams all the way to the championship game!
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-championship-light rounded-lg p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-championship-primary">
                  Ready to Start Your Championship?
                </h2>
                <p className="text-gray-600 mb-8">
                  Create an account and organize your neighborhood soccer tournament in minutes.
                </p>
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  <Button className="bg-championship-primary text-white hover:bg-championship-secondary px-8 py-6 text-lg font-medium">
                    {isAuthenticated ? "Go to Dashboard" : "Create Your Tournament"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
