// components/ui/RecentSearches.tsx
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentSearch {
  name: string;
  temp: string;
  time: string;
}

interface RecentSearchesProps {
  searches: RecentSearch[];
  tempUnit: "C" | "F";
  onSearchClick: (name: string) => void;
}

export default function RecentSearches({ 
  searches, 
  tempUnit, 
  onSearchClick 
}: RecentSearchesProps) {
  const convertTemp = (temp: string) => {
    if (tempUnit === "F") {
      const celsius = parseInt(temp.replace("°C", ""));
      const fahrenheit = Math.round((celsius * 9) / 5 + 32);
      return `${fahrenheit}°F`;
    }
    return temp;
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 relative z-0">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-blue-500" />
        Recent Searches
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {searches.map((search, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSearchClick(search.name)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{search.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{search.time}</p>
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