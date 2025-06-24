import { Thermometer, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import WeatherIcon from "./WeatherIcon";

interface WeatherMainCardProps {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  description: string;
  tempUnit: "C" | "F";
  weatherMain: string;
}

export function WeatherMainCard({
  temp,
  feelsLike,
  tempMin,
  tempMax,
  description,
  tempUnit,
  weatherMain,
}: WeatherMainCardProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <WeatherIcon main={weatherMain} className="w-16 h-16" />
              <div>
                <div className="text-5xl font-bold">
                  {temp}°{tempUnit}
                </div>
                <div className="text-blue-100 text-lg capitalize">
                  {description}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-blue-100">
              <span className="flex items-center space-x-1">
                <Thermometer className="w-4 h-4" />
                <span>Feels like {feelsLike}°{tempUnit}</span>
              </span>
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="flex items-center space-x-2 text-blue-100">
              <ArrowUp className="w-4 h-4" />
              <span>{tempMax}°</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <ArrowDown className="w-4 h-4" />
              <span>{tempMin}°</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}