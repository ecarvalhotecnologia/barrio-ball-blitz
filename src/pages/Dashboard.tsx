
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getChampionships, Championship } from "@/utils/tournamentUtils";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Not authorized",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Load championships from local storage
    try {
      const storedChampionships = getChampionships();
      setChampionships(storedChampionships);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load championships",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate, toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.name}! Manage your championships here.
              </p>
            </div>
            <Link to="/create-championship">
              <Button className="bg-championship-primary hover:bg-championship-secondary">
                Create New Championship
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Your Championships</h2>
          
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-pulse h-6 w-32 bg-gray-200 rounded mx-auto mb-4" />
              <div className="animate-pulse h-4 w-48 bg-gray-200 rounded mx-auto" />
            </div>
          ) : championships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {championships.map((championship) => (
                <div key={championship.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{championship.name}</h3>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>{new Date(championship.createdAt).toLocaleDateString()}</span>
                      <span>{championship.teams.length} teams</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Status:</span>
                        <span className={`text-sm font-medium ${championship.completed ? "text-green-600" : "text-blue-600"}`}>
                          {championship.completed ? "Completed" : "In Progress"}
                        </span>
                      </div>
                      
                      {championship.completed && championship.winner && (
                        <div className="flex justify-between">
                          <span className="text-sm">Winner:</span>
                          <span className="text-sm font-medium text-championship-primary">
                            {championship.winner.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <Link to={`/championship/${championship.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-10 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No championships yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first championship to get started.
              </p>
              <Link to="/create-championship">
                <Button className="bg-championship-primary hover:bg-championship-secondary">
                  Create Championship
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Championships</span>
                <span className="text-xl font-semibold">{championships.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="text-xl font-semibold">
                  {championships.filter(c => c.completed).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">In Progress</span>
                <span className="text-xl font-semibold">
                  {championships.filter(c => !c.completed).length}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link to="/create-championship" className="block p-3 rounded-md hover:bg-gray-50 transition-colors">
                <div className="font-medium">Create Championship</div>
                <div className="text-sm text-gray-500">Set up a new championship with 8 teams</div>
              </Link>
              <Link to="/history" className="block p-3 rounded-md hover:bg-gray-50 transition-colors">
                <div className="font-medium">View Championships History</div>
                <div className="text-sm text-gray-500">See all past championship results</div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
