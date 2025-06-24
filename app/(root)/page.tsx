"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecentSearches from "@/components/RecentSearches";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
   const { isSignedIn } = useUser(); // Get authentication status

  const handleRecentSearchClick = (id: string) => {
    router.push(`/forecast/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        tempUnit={tempUnit}
        setTempUnit={setTempUnit}
      />
      
      <Hero />

     {/* Show RecentSearches only if user is authenticated */}
      {isSignedIn && (
        <RecentSearches 
          tempUnit={tempUnit}
          onSearchClick={handleRecentSearchClick}
        />
      )}

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