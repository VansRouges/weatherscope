// components/ui/RecentSearches.tsx
import { Clock, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { RecentSearch, RecentSearchesProps } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

export default function RecentSearches({ 
  tempUnit, 
  onSearchClick 
}: RecentSearchesProps) {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const response = await fetch('/api/get-history');
        if (!response.ok) throw new Error('Failed to fetch recent searches');
        const data = await response.json();
        // Sort by timestamp (newest first)
        const sortedData = data.sort((a: RecentSearch, b: RecentSearch) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setSearches(sortedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSearches();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    try {
      const response = await fetch('/api/delete-history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete search');
      }

      // Remove the deleted item from state
      setSearches(prev => prev.filter(search => search.id !== id));
    } catch (error) {
      console.error('Error deleting search:', error);
      // You might want to show a toast notification here
    }
  };

  const convertTemp = (temp: string) => {
    if (tempUnit === "F") {
      const celsius = parseInt(temp.replace("°C", ""));
      const fahrenheit = Math.round((celsius * 9) / 5 + 32);
      return `${fahrenheit}°F`;
    }
    return temp;
  };

  if (loading) return <div>Loading recent searches...</div>;
  if (error) return <div>Error: {error}</div>;
  if (searches.length === 0) return <div>No recent searches found</div>;

  console.log('Recent searches:', searches);

  return (
    <div className="max-w-2xl mx-auto mt-12 relative z-0">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-blue-500" />
        Recent Searches
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {searches.map((search) => (
          <Card 
            key={search.id} 
            className="cursor-pointer hover:shadow-md transition-shadow group relative"
            onClick={() => onSearchClick(`${search.lat}--${search.lon}`)}
          >
            <CardContent className="p-4">
              <button
                onClick={(e) => handleDelete(search.id, e)}
                className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
                aria-label="Delete search"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{search.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatTimeAgo(search.timestamp)}
                  </p>
                </div>
                <Badge variant="outline">{convertTemp(search.temp)}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
