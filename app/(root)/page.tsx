"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecentSearches from "@/components/RecentSearches";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    { name: "San Francisco", temp: "19°C", time: "2 hours ago" },
    { name: "Miami", temp: "29°C", time: "1 day ago" },
    { name: "Chicago", temp: "12°C", time: "3 days ago" },
  ]);

  const handleLocationSelect = (location: any) => {
    console.log("Selected location:", location);
    
    // Add to recent searches
    const newSearch = {
      name: location.displayName,
      temp: "22°C", // You would get this from weather API
      time: "Just now"
    };
    
    setRecentSearches(prev => [newSearch, ...prev.slice(0, 2)]);
  };

  const handleRecentSearchClick = (name: string) => {
    console.log("Recent search clicked:", name);
    // You would trigger a new search here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        tempUnit={tempUnit}
        setTempUnit={setTempUnit}
      />
      
      <Hero 
        onLocationSelect={handleLocationSelect}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* Add RecentSearches component */}
      <RecentSearches 
        searches={recentSearches}
        tempUnit={tempUnit}
        onSearchClick={handleRecentSearchClick}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}