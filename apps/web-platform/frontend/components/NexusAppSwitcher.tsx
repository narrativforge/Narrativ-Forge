"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
    prodUrl: "https://cognix-nexus.vercel.app",
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
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsLocal(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const DROPDOWN_WIDTH = 320;
      const left = Math.max(8, rect.right - DROPDOWN_WIDTH);
      setDropdownPos({
        top: rect.bottom + 8,
        left,
      });
    }
  }, [isOpen]);

  const dropdownElement = (
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: 320,
        backgroundColor: "rgba(11, 17, 30, 0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(56, 189, 248, 0.35)",
        borderRadius: "16px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.75), 0 0 24px rgba(56, 189, 248, 0.15)",
        padding: "12px",
        zIndex: 99999,
        fontFamily: 'Inter, "Noto Sans Myanmar", system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "8px",
          marginBottom: "10px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles style={{ width: 15, height: 15, color: "#38bdf8" }} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff", letterSpacing: "0.02em" }}>
            The Nexus Suite
          </span>
        </div>
        <span
          style={{
            fontSize: "10px",
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            padding: "2px 7px",
            borderRadius: "999px",
            fontFamily: "monospace",
          }}
        >
          Unified Ecosystem
        </span>
      </div>

      {/* User Info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 10px",
          marginBottom: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "7px",
            backgroundColor: "rgba(56, 189, 248, 0.2)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: "bold",
            color: "#38bdf8",
            flexShrink: 0,
          }}
        >
          T
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#ffffff", lineHeight: 1.2 }}>
            Thu Won (Admin)
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "2px",
            }}
          >
            <ShieldCheck style={{ width: 12, height: 12, color: "#38bdf8", flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              thuwon417@gmail.com
            </span>
          </div>
        </div>
      </div>

      {/* App List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {NEXUS_APPS.map((app) => {
          const isCurrent = app.id === currentAppId;
          const isHovered = hoveredApp === app.id;
          const targetUrl = isLocal ? app.localUrl : app.prodUrl;

          return (
            <a
              key={app.id}
              href={targetUrl}
              target={isCurrent ? "_self" : "_blank"}
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "10px",
                textDecoration: "none",
                transition: "all 0.15s ease",
                backgroundColor: isCurrent
                  ? "rgba(56, 189, 248, 0.16)"
                  : isHovered
                  ? "rgba(255, 255, 255, 0.06)"
                  : "transparent",
                border: isCurrent
                  ? "1px solid rgba(56, 189, 248, 0.4)"
                  : "1px solid transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{app.icon}</span>
                <div style={{ minWidth: 0, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: isCurrent ? "#7dd3fc" : "#ffffff",
                        lineHeight: 1.3,
                      }}
                    >
                      {app.name}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: "9px",
                          backgroundColor: "rgba(56, 189, 248, 0.3)",
                          color: "#38bdf8",
                          padding: "1px 5px",
                          borderRadius: "4px",
                          fontFamily: "monospace",
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: "1px",
                    }}
                  >
                    {app.subtitle}
                  </div>
                </div>
              </div>
              {!isCurrent && (
                <ExternalLink
                  style={{
                    width: 13,
                    height: 13,
                    color: isHovered ? "#38bdf8" : "#64748b",
                    flexShrink: 0,
                    marginLeft: "8px",
                  }}
                />
              )}
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "10px",
          paddingTop: "8px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          fontSize: "10px",
          textAlign: "center",
          color: "#64748b",
        }}
      >
        Single Sign-On · Isolated API Safe
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderRadius: "10px",
          border: isOpen ? "1px solid rgba(56, 189, 248, 0.6)" : "1px solid rgba(255, 255, 255, 0.15)",
          backgroundColor: isOpen ? "rgba(56, 189, 248, 0.18)" : "rgba(15, 22, 38, 0.9)",
          color: "#f8fafc",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: isOpen ? "0 0 14px rgba(56, 189, 248, 0.3)" : "0 2px 6px rgba(0, 0, 0, 0.2)",
          transition: "all 0.15s ease",
        }}
        title="Nexus Suite App Switcher"
      >
        <LayoutGrid style={{ width: 14, height: 14, color: "#38bdf8" }} />
        <span>Nexus Suite</span>
        <span
          style={{
            fontSize: "10px",
            backgroundColor: "rgba(56, 189, 248, 0.18)",
            color: "#38bdf8",
            padding: "2px 6px",
            borderRadius: "999px",
            fontFamily: "monospace",
          }}
        >
          6 Apps
        </span>
        <ChevronDown
          style={{
            width: 13,
            height: 13,
            color: "#94a3b8",
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.15s ease",
          }}
        />
      </button>

      {isOpen && mounted && createPortal(dropdownElement, document.body)}
    </div>
  );
}
