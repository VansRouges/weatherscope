"use client";
import { useState, useEffect } from "react"
import { Search, Menu, X, MapPin, Clock, Sun, Cloud, CloudRain, Snowflake, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

// Mock data for autocomplete suggestions
const mockCities = [
  { name: "New York", country: "US", temp: "22°C" },
  { name: "London", country: "UK", temp: "15°C" },
  { name: "Tokyo", country: "JP", temp: "28°C" },
  { name: "Paris", country: "FR", temp: "18°C" },
  { name: "Sydney", country: "AU", temp: "25°C" },
  { name: "Berlin", country: "DE", temp: "16°C" },
  { name: "Toronto", country: "CA", temp: "20°C" },
  { name: "Mumbai", country: "IN", temp: "32°C" },
]

// Mock recent searches for logged-in users
const mockRecentSearches = [
  { name: "San Francisco", temp: "19°C", time: "2 hours ago" },
  { name: "Miami", temp: "29°C", time: "1 day ago" },
  { name: "Chicago", temp: "12°C", time: "3 days ago" },
]

const WeatherIcon = ({ type, className = "w-6 h-6" }: { type: string; className?: string }) => {
  const icons = {
    sun: Sun,
    cloud: Cloud,
    rain: CloudRain,
    snow: Snowflake,
    storm: Zap,
  }

  const IconComponent = icons[type as keyof typeof icons] || Sun

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
  )
}

export default function Home() {
  // const clerkUser = await currentUser();
  // if (!clerkUser) redirect('/sign-in');
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<typeof mockCities>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C")
  const { isSignedIn, user } = useUser()

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = mockCities.filter(
        (city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.country.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
      setError("")
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  const handleSearch = async (cityName?: string) => {
    const query = cityName || searchQuery
    if (!query.trim()) return

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const city = mockCities.find((c) => c.name.toLowerCase() === query.toLowerCase())

      if (city) {
        setSearchQuery(city.name)
        setShowSuggestions(false)
        // Here you would typically navigate to weather details or show results
        console.log("Weather data for:", city.name)
      } else {
        setError("City not found. Please try another location.")
      }
      setIsLoading(false)
    }, 1000)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    setError("")
  }

  const convertTemp = (temp: string) => {
    if (tempUnit === "F") {
      const celsius = Number.parseInt(temp.replace("°C", ""))
      const fahrenheit = Math.round((celsius * 9) / 5 + 32)
      return `${fahrenheit}°F`
    }
    return temp
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-blue-100 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <WeatherIcon type="sun" className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">WeatherScope</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
                className="text-slate-600 dark:text-slate-300"
              >
                °{tempUnit}
              </Button>

              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">Sign Up</Button>
                  </SignUpButton>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-100 dark:border-slate-700">
              <div className="flex flex-col space-y-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
                  className="justify-start"
                >
                  Temperature: °{tempUnit}
                </Button>

                {isSignedIn ? (
                  <div className="px-3">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm" className="justify-start">
                        Login
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm" className="justify-start">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center space-y-8">
          {/* Animated Weather Icons Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <WeatherIcon type="cloud" className="absolute top-20 left-10 w-16 h-16 text-blue-300" />
            <WeatherIcon type="sun" className="absolute top-32 right-20 w-12 h-12 text-yellow-300" />
            <WeatherIcon type="rain" className="absolute bottom-40 left-20 w-14 h-14 text-blue-400" />
            <WeatherIcon type="snow" className="absolute bottom-60 right-10 w-10 h-10 text-blue-200" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4 relative z-10">
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white">
              Discover Weather
              <span className="block text-blue-600 dark:text-blue-400">Anywhere</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get accurate forecasts for your location with real-time updates and detailed insights
            </p>
          </div>

          {/* Search Component */}
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="relative">
              <div className="flex">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search for a city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pr-10 h-14 text-lg border-2 border-blue-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    disabled={isLoading}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Button
                  onClick={() => handleSearch()}
                  disabled={isLoading || !searchQuery.trim()}
                  className="ml-2 h-14 px-6"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-2 border-blue-200 dark:border-slate-600">
                  <CardContent className="p-0">
                    {suggestions.map((city, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(city.name)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between border-b last:border-b-0 border-blue-100 dark:border-slate-600"
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-slate-900 dark:text-white">{city.name}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{city.country}</span>
                        </div>
                        <Badge variant="secondary">{convertTemp(city.temp)}</Badge>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Recent Searches (for logged-in users) */}
          {isSignedIn && (
            <div className="max-w-2xl mx-auto mt-12 relative z-10">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Recent Searches
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {mockRecentSearches.map((search, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
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
          )}
        </div>
      </main>

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
  )
}
