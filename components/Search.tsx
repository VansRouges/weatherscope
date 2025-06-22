"use client"
import { useState, useEffect } from "react";
import { Search, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

interface SimplifiedLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  displayName: string;
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [suggestions, setSuggestions] = useState<SimplifiedLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLocationSelect = (location: SimplifiedLocation) => {
    const locationId = `${location.lat}--${location.lon}`;
    router.push(`/forecast/${locationId}`);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      if (debouncedQuery.length > 2) {
        setIsLoading(true);
        setError("");
        try {
          const response = await fetch(`/api/location?q=${debouncedQuery}`);
          if (!response.ok) throw new Error("Failed to fetch locations");
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (err) {
          setError("Failed to fetch locations. Please try again.");
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchLocations();
  }, [debouncedQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setError("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 relative z-10">
      <div className="relative">
        <div className="flex">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onKeyPress={(e) => e.key === "Enter" && searchQuery.length > 0 && handleLocationSelect(suggestions[0])}
              className="pr-10 h-14 text-lg border-2 border-blue-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
              disabled={isLoading}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button
            onClick={() => searchQuery.length > 0 && handleLocationSelect(suggestions[0])}
            disabled={isLoading || searchQuery.length === 0}
            className="ml-2 h-14 px-6"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </div>

        {showSuggestions && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-2 border-blue-200 dark:border-slate-600">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center text-slate-500">Searching...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between border-b last:border-b-0 border-blue-100 dark:border-slate-600"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        {location.name}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {location.state ? `${location.state}, ` : ""}{location.country}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500">
                  {debouncedQuery.length > 2 ? "No locations found" : "Type 3+ characters to search"}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}