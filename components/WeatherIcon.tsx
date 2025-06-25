// components/WeatherIcon.tsx
import { Cloud, Droplets, Sun, CloudSun, CloudRain, CloudLightning, Snowflake } from "lucide-react";

interface WeatherIconProps {
  main?: string;  // Make optional
  type?: string;  // Add new optional prop
  className?: string;
}

export default function WeatherIcon({ main, type, className }: WeatherIconProps) {
  const weatherType = type || main || 'Cloud'; // Fallback to 'Cloud' if neither provided
  
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    clear: Sun,
    sun: Sun,
    clouds: CloudSun,
    cloud: Cloud,
    rain: CloudRain,
    snow: Snowflake,
    thunderstorm: CloudLightning,
    lightning: CloudLightning,
    drizzle: Droplets,
    mist: Cloud,
    fog: Cloud,
    haze: Cloud,
  };

  // Normalize the type to lowercase for matching
  const normalizedType = weatherType.toLowerCase();
  const IconComponent = iconMap[normalizedType] || Cloud;
  
  return <IconComponent className={className} />;
}