import { Button } from "@/components/ui/button";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import WeatherIcon from "./WeatherIcon";

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  tempUnit: "C" | "F";
  setTempUnit: (unit: "C" | "F") => void;
}

export default function Navbar({
  mobileMenuOpen,
  setMobileMenuOpen,
  tempUnit,
  setTempUnit,
}: NavbarProps) {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-blue-100 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <WeatherIcon type="sun" className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">WeatherScope</span>
          </div>

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
                  <Button variant="ghost" size="sm">Login</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

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
                    <Button variant="ghost" size="sm" className="justify-start">Login</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm" className="justify-start">Sign Up</Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}