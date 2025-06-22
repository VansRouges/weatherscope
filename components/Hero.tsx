import SearchBar from "./Search";
import WeatherIcon from "./WeatherIcon";

export default function Hero() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center space-y-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <WeatherIcon type="cloud" className="absolute top-20 left-10 w-16 h-16 text-blue-300" />
          <WeatherIcon type="sun" className="absolute top-32 right-20 w-12 h-12 text-yellow-300" />
          <WeatherIcon type="rain" className="absolute bottom-40 left-20 w-14 h-14 text-blue-400" />
          <WeatherIcon type="snow" className="absolute bottom-60 right-10 w-10 h-10 text-blue-200" />
        </div>

        <div className="space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white">
            Discover Weather
            <span className="block text-blue-600 dark:text-blue-400">Anywhere</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get accurate forecasts for your location with real-time updates
          </p>
        </div>

        <SearchBar />
      </div>
    </main>
  );
}