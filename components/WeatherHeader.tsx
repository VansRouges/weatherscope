import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherHeaderProps {
  name: string;
  country: string;
  lat: number;
  lon: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  tempUnit: "C" | "F";
  onToggleUnit: () => void;
}

export function WeatherHeader({
  name,
  country,
  lat,
  lon,
  onRefresh,
  isRefreshing,
  tempUnit,
  onToggleUnit,
}: WeatherHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <MapPin className="w-6 h-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {name}, {country}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {lat.toFixed(4)}°, {lon.toFixed(4)}°
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleUnit}
        >
          °{tempUnit}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
}