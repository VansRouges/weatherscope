import { Sun, Cloud, CloudRain, Snowflake, Zap } from "lucide-react";

interface WeatherIconProps {
  type: string;
  className?: string;
}

export default function WeatherIcon({ type, className = "w-6 h-6" }: WeatherIconProps) {
  const icons = {
    sun: Sun,
    cloud: Cloud,
    rain: CloudRain,
    snow: Snowflake,
    storm: Zap,
  };

  const IconComponent = icons[type as keyof typeof icons] || Sun;

  return (
    <IconComponent
      className={`${className} animate-pulse`}
      style={{
        animation:
          type === "sun"
            ? "spin 20s linear infinite"
            : type === "cloud"
            ? "float 3s ease-in-out infinite"
            : "pulse 2s ease-in-out infinite",
      }}
    />
  );
}