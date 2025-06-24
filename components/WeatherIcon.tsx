import { Cloud, Droplets, Sun, CloudSun, CloudRain, CloudLightning, Snowflake } from "lucide-react";

interface WeatherIconProps {
  main: string;
  className?: string;
}

export default function WeatherIcon({ main, className }: WeatherIconProps) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Clear: Sun,
    Clouds: CloudSun,
    Rain: CloudRain,
    Snow: Snowflake,
    Thunderstorm: CloudLightning,
    Drizzle: Droplets,
    Mist: Cloud,
    Fog: Cloud,
    Haze: Cloud,
  };

  const IconComponent = iconMap[main] || Cloud;
  return <IconComponent className={className} />;
}