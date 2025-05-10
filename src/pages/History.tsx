
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Championship, getChampionships } from "@/utils/tournamentUtils";

const History = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Not authorized",
        description: "Please log in to view championship history",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      const storedChampionships = getChampionships();
      const completedChampionships = storedChampionships.filter(c => c.completed);
      
      // Sort by creation date (most recent first)
      const sortedChampionships = [...completedChampionships].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setChampionships(sortedChampionships);
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
              <h1 className="text-2xl font-bold text-gray-800">Championship History</h1>
              <p className="text-gray-600">
                View the results of all completed championships.
              </p>
            </div>
            
            <Link to="/create-championship">
              <Button className="bg-championship-primary hover:bg-championship-secondary">
                Create New Championship
              </Button>
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-pulse h-6 w-32 bg-gray-200 rounded mx-auto mb-4" />
            <div className="animate-pulse h-4 w-48 bg-gray-200 rounded mx-auto" />
          </div>
        ) : championships.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Winner</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Runner-up</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">3rd Place</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">4th Place</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {championships.map((championship) => (
                    <tr key={championship.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{championship.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(championship.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-championship-primary">
                          {championship.winner?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {championship.runnerUp?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {championship.thirdPlace?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {championship.fourthPlace?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link to={`/championship/${championship.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-10 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No completed championships
            </h3>
            <p className="text-gray-600 mb-6">
              Complete a championship to see its results here.
            </p>
            <Link to="/create-championship">
              <Button className="bg-championship-primary hover:bg-championship-secondary">
                Create Championship
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default History;
