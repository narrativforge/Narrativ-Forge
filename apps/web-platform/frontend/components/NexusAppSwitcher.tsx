"use client";

import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

interface AppInfo {
  id: string;
  name: string;
  subtitle: string;
  url: string;
  icon: string;
  color: string;
}

const NEXUS_APPS: AppInfo[] = [
  {
    id: "narrativ",
    name: "Narrativ Forge",
    subtitle: "Anime & Video Production Studio",
    url: "http://localhost:3000",
    icon: "🎬",
    color: "#38bdf8",
  },
  {
    id: "auracraft",
    name: "AuraCraft Studio",
    subtitle: "3D Persona & VTuber Live Stage",
    url: "http://localhost:5180",
    icon: "🎭",
    color: "#a855f7",
  },
  {
    id: "doka",
    name: "Doka AI DMS",
    subtitle: "Document Management & OCR",
    url: "http://localhost:5173",
    icon: "📑",
    color: "#10b981",
  },
  {
    id: "logixa",
    name: "Logixa Flow",
    subtitle: "B2B Logistics & Fleet Operations",
    url: "http://localhost:3002",
    icon: "🚚",
    color: "#f59e0b",
  },
  {
    id: "cognix",
    name: "Cognix Nexus",
    subtitle: "Second Brain & Knowledge Graph",
    url: "http://localhost:3001",
    icon: "🧠",
    color: "#ec4899",
  },
  {
    id: "alittleworld",
    name: "A Little World",
    subtitle: "Couple Capsule & Travel Memories",
    url: "http://localhost:3004",
    icon: "💖",
    color: "#f43f5e",
  },
];

export function NexusAppSwitcher({ currentAppId = "narrativ" }: { currentAppId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          borderRadius: "8px",
          border: isOpen ? "1px solid #38bdf8" : "1px solid #1e293b",
          backgroundColor: isOpen ? "rgba(56, 189, 248, 0.15)" : "#0b1424",
          color: isOpen ? "#38bdf8" : "#94a3b8",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        title="Nexus Suite App Switcher / App များ ကူးပြောင်းရန်"
      >
        <LayoutGrid size={15} style={{ color: "#38bdf8" }} />
        <span>Nexus Suite</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "8px",
            width: "300px",
            backgroundColor: "#080d1a",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            borderRadius: "14px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            zIndex: 100,
            padding: "12px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "8px", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} style={{ color: "#38bdf8" }} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc" }}>The Nexus Suite</span>
            </div>
            <span style={{ fontSize: "10px", color: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.12)", padding: "2px 6px", borderRadius: "999px", border: "1px solid rgba(56, 189, 248, 0.25)" }}>
              6 Apps
            </span>
          </div>

          {/* User Account Info */}
          <div style={{ padding: "8px", backgroundColor: "#050811", border: "1px solid #1e293b", borderRadius: "8px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "6px", backgroundColor: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
              T
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#e2e8f0" }}>Thuwon Admin</div>
              <div style={{ fontSize: "10px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={11} style={{ color: "#38bdf8" }} />
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>thuwon417@gmail.com</span>
              </div>
            </div>
          </div>

          {/* App List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {NEXUS_APPS.map((app) => {
              const isCurrent = app.id === currentAppId;
              return (
                <a
                  key={app.id}
                  href={app.url}
                  target={isCurrent ? "_self" : "_blank"}
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    border: isCurrent ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid transparent",
                    backgroundColor: isCurrent ? "rgba(56, 189, 248, 0.1)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "15px" }}>{app.icon}</span>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: isCurrent ? "#38bdf8" : "#e2e8f0", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{app.name}</span>
                        {isCurrent && (
                          <span style={{ fontSize: "9px", backgroundColor: "#0284c7", color: "#fff", padding: "1px 5px", borderRadius: "4px" }}>Active</span>
                        )}
                      </div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>{app.subtitle}</div>
                    </div>
                  </div>
                  {!isCurrent && <ExternalLink size={12} style={{ color: "#64748b" }} />}
                </a>
              );
            })}
          </div>

          <div style={{ borderTop: "1px solid #1e293b", marginTop: "8px", paddingTop: "6px", textAlign: "center", fontSize: "10px", color: "#64748b" }}>
            Unified Supabase Auth · SSO
          </div>
        </div>
      )}
    </div>
  );
}
