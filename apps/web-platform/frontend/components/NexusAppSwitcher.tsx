"use client";

import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid, ExternalLink, ShieldCheck, Sparkles, ChevronDown } from "lucide-react";

interface AppInfo {
  id: string;
  name: string;
  subtitle: string;
  localUrl: string;
  prodUrl: string;
  icon: string;
  color: string;
}

const NEXUS_APPS: AppInfo[] = [
  {
    id: "narrativ",
    name: "Narrativ Forge",
    subtitle: "Anime & Video Production Studio",
    localUrl: "http://localhost:3000",
    prodUrl: "https://narrativ-forge.vercel.app",
    icon: "🎬",
    color: "#38bdf8",
  },
  {
    id: "auracraft",
    name: "AuraCraft Studio",
    subtitle: "3D Persona & VTuber Live Stage",
    localUrl: "http://localhost:5180",
    prodUrl: "https://auracraft-studio.vercel.app",
    icon: "🎭",
    color: "#a855f7",
  },
  {
    id: "doka",
    name: "Doka AI DMS",
    subtitle: "Document Management & OCR",
    localUrl: "http://localhost:5173",
    prodUrl: "https://doka-dms.vercel.app",
    icon: "📑",
    color: "#10b981",
  },
  {
    id: "logixa",
    name: "Logixa Flow",
    subtitle: "B2B Logistics & Fleet Operations",
    localUrl: "http://localhost:3002",
    prodUrl: "https://logixa-flow.vercel.app",
    icon: "🚚",
    color: "#f59e0b",
  },
  {
    id: "cognix",
    name: "Cognix Nexus",
    subtitle: "Second Brain & Knowledge Graph",
    localUrl: "http://localhost:3001",
    prodUrl: "https://cognix-nexus-frontend.onrender.com",
    icon: "🧠",
    color: "#ec4899",
  },
  {
    id: "alittleworld",
    name: "A Little World",
    subtitle: "Couple Capsule & Travel Memories",
    localUrl: "http://localhost:3004",
    prodUrl: "https://a-little-world-with-us.vercel.app",
    icon: "💖",
    color: "#f43f5e",
  },
];

export function NexusAppSwitcher({ currentAppId = "narrativ" }: { currentAppId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLocal(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
          isOpen
            ? "bg-sky-500/20 border-sky-500/50 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
            : "bg-neutral-900/80 hover:bg-neutral-800/80 border-neutral-700/60 text-neutral-300 hover:text-white"
        }`}
        title="Nexus Suite App Switcher"
      >
        <LayoutGrid className="h-4 w-4 text-sky-400" />
        <span>Nexus Suite</span>
        <span className="text-[10px] bg-sky-500/15 text-sky-400 px-1.5 py-0.5 rounded-full font-mono">
          6 Apps
        </span>
        <ChevronDown className={`h-3 w-3 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-neutral-950/95 backdrop-blur-xl border border-sky-500/30 rounded-2xl shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-bold text-white tracking-wide">The Nexus Suite</span>
            </div>
            <span className="text-[10px] bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-mono">
              Unified Ecosystem
            </span>
          </div>

          <div className="mb-2.5 p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-xs font-bold text-sky-400 flex-shrink-0">
              T
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">Thu Won (Admin)</div>
              <div className="text-[10px] text-neutral-400 truncate flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-sky-400 flex-shrink-0" />
                <span>thuwon417@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {NEXUS_APPS.map((app) => {
              const isCurrent = app.id === currentAppId;
              const targetUrl = isLocal ? app.localUrl : app.prodUrl;
              return (
                <a
                  key={app.id}
                  href={targetUrl}
                  target={isCurrent ? "_self" : "_blank"}
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    isCurrent
                      ? "bg-sky-500/15 border border-sky-500/40 text-sky-200"
                      : "hover:bg-neutral-900 border border-transparent text-neutral-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base flex-shrink-0">{app.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span>{app.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-sky-500/30 text-sky-300 px-1.5 py-0.2 rounded font-mono">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">{app.subtitle}</div>
                    </div>
                  </div>
                  {!isCurrent && <ExternalLink className="h-3.5 w-3.5 text-neutral-500 flex-shrink-0 ml-2" />}
                </a>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-neutral-800 text-[10px] text-center text-neutral-400">
            Single Sign-On · Isolated API Safe
          </div>
        </div>
      )}
    </div>
  );
}
