// components/ForecastCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeatherIcon from "./WeatherIcon";
import { format } from "date-fns";

interface ForecastCardProps {
  date: string; // Format: "DD/MM/YYYY"
  temp_min: number;
  temp_max: number;
  weather: {
    main: string;
    description: string;
  };
  tempUnit: "C" | "F";
}

export function ForecastCard({ date, temp_min, temp_max, weather, tempUnit }: ForecastCardProps) {
  // Parse DD/MM/YYYY format
  const parseCustomDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  // Format date as "Tue, Jun 24"
  const formattedDate = format(parseCustomDate(date), "EEE, MMM d");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WeatherIcon main={weather.main} className="w-8 h-8" />
          <span className="capitalize">{weather.description}</span>
        </div>
        <div className="text-right">
          <div className="font-bold">{temp_max}°{tempUnit}</div>
          <div className="text-sm text-muted-foreground">{temp_min}°{tempUnit}</div>
        </div>
      </CardContent>
    </Card>
  );
}