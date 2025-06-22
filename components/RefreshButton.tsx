"use client"
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();
  
  const handleRefresh = () => {
    router.replace(`?refresh=true`, { scroll: false });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleRefresh}>
      <RotateCw className="w-4 h-4 mr-2" />
      Refresh Data
    </Button>
  );
}