"use client";
import Image from "next/image";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";

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

export default async function Home() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
