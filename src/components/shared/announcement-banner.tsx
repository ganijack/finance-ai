"use client";

import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/announcements");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Check if user dismissed this specific announcement
          const dismissed = localStorage.getItem(`dismissed_announcement_${data[0].id}`);
          if (!dismissed) {
            setAnnouncements(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      }
    };

    fetchAnnouncements();
  }, []);

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[0];

  const handleDismiss = () => {
    localStorage.setItem(`dismissed_announcement_${current.id}`, "true");
    setIsVisible(false);
  };

  return (
    <div className="bg-zinc-600 px-4 py-2.5 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-x-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-x-3">
          <Megaphone className="h-5 w-5 text-white opacity-80" aria-hidden="true" />
          <p className="text-sm/6 font-medium text-white">
            <strong className="mr-2">{current.title}</strong>
            <span className="opacity-90">{current.content}</span>
          </p>
        </div>
        <div className="flex flex-1 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-white hover:bg-zinc-500 hover:text-white"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
