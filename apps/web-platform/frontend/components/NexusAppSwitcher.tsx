"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, ShieldCheck, Sparkles, ChevronDown } from "lucide-react";

// ==========================================
// BESPOKE HIGH-END VECTOR GLYPHS (NO EMOJIS)
// ==========================================

function NexusMatrixIcon({ size = 15, color = "#38bdf8" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="2" width="3" height="3" rx="0.75" fill={color} />
      <rect x="6.5" y="2" width="3" height="3" rx="0.75" fill={color} />
      <rect x="11" y="2" width="3" height="3" rx="0.75" fill={color} />
      <rect x="2" y="6.5" width="3" height="3" rx="0.75" fill={color} />
      <rect x="6.5" y="6.5" width="3" height="3" rx="0.75" fill="#ffffff" />
      <rect x="11" y="6.5" width="3" height="3" rx="0.75" fill={color} />
      <rect x="2" y="11" width="3" height="3" rx="0.75" fill={color} />
      <rect x="6.5" y="11" width="3" height="3" rx="0.75" fill={color} />
      <rect x="11" y="11" width="3" height="3" rx="0.75" fill={color} />
    </svg>
  );
}

// 1. Narrativ Forge - Cinematic Anamorphic Camera & Prism
function NarrativGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="nf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="3.5" width="19" height="17" rx="4" stroke="url(#nf-grad)" strokeWidth="1.8" />
      <path d="M7 3.5v4M12 3.5v4M17 3.5v4M2.5 7.5h19" stroke="url(#nf-grad)" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="10,11.5 15.5,14.5 10,17.5" fill="url(#nf-grad)" />
    </svg>
  );
}

// 2. AuraCraft Studio - 3D Holographic Persona & Crystal Gem
function AuraCraftGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ac-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>
      <path d="M12 2.5L3.5 7.5v9L12 21.5l8.5-5v-9L12 2.5z" stroke="url(#ac-grad)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 21.5V12M12 12L3.5 7.5M12 12l8.5-4.5" stroke="url(#ac-grad)" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="7.5" r="2" fill="#f5d0fe" />
    </svg>
  );
}

// 3. Doka AI DMS - Cryptographic Vault & Verified Document Shield
function DokaGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="dk-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="url(#dk-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" stroke="url(#dk-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 15 2 2 4-4" stroke="url(#dk-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 4. Logixa Flow - Orbital Supply Chain & Flux Logistics
function LogixaGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="lf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="7" width="19" height="13.5" rx="3.5" stroke="url(#lf-grad)" strokeWidth="1.8" />
      <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" stroke="url(#lf-grad)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 11.5v4.5M9.5 14h5" stroke="url(#lf-grad)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="6.5" cy="17" r="1.2" fill="#fde68a" />
      <circle cx="17.5" cy="17" r="1.2" fill="#fde68a" />
    </svg>
  );
}

// 5. Cognix Nexus - Quantum Neural Brain Cortex & Knowledge Graph
function CognixGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="cg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="3.2" stroke="url(#cg-grad)" strokeWidth="2" />
      <circle cx="4.5" cy="7.5" r="2.2" stroke="url(#cg-grad)" strokeWidth="1.8" />
      <circle cx="19.5" cy="7.5" r="2.2" stroke="url(#cg-grad)" strokeWidth="1.8" />
      <circle cx="5.5" cy="17.5" r="2.2" stroke="url(#cg-grad)" strokeWidth="1.8" />
      <circle cx="18.5" cy="17.5" r="2.2" stroke="url(#cg-grad)" strokeWidth="1.8" />
      <path d="m6.5 8.5 3 2.5M14.5 13 17 16M17.5 8.5l-3 2.5M6.5 16.5l3-2.5" stroke="url(#cg-grad)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 6. A Little World - Celestial Infinity Heart & Star Capsule
function ALittleWorldGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="alw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
      </defs>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="url(#alw-grad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="9" r="1.5" fill="#fecdd3" />
      <circle cx="15.5" cy="9" r="1.5" fill="#fecdd3" />
    </svg>
  );
}

// ==========================================
// REGISTRY OF ALL 6 NEXUS ENGINES
// ==========================================

interface AppInfo {
  id: string;
  name: string;
  subtitle: string;
  localUrl: string;
  prodUrl: string;
  glyph: () => React.ReactElement;
  color: string;
  bgRgba: string;
  borderRgba: string;
}

const NEXUS_APPS: AppInfo[] = [
  {
    id: "narrativ",
    name: "Narrativ Forge",
    subtitle: "Anime & Video Production Studio",
    localUrl: "http://localhost:3000",
    prodUrl: "https://narrativ-forge.vercel.app",
    glyph: NarrativGlyph,
    color: "#38bdf8",
    bgRgba: "rgba(56, 189, 248, 0.12)",
    borderRgba: "rgba(56, 189, 248, 0.35)",
  },
  {
    id: "auracraft",
    name: "AuraCraft Studio",
    subtitle: "3D Persona & VTuber Live Stage",
    localUrl: "http://localhost:5180",
    prodUrl: "https://auracraft-studio.vercel.app",
    glyph: AuraCraftGlyph,
    color: "#c084fc",
    bgRgba: "rgba(192, 132, 252, 0.12)",
    borderRgba: "rgba(192, 132, 252, 0.35)",
  },
  {
    id: "doka",
    name: "Doka AI DMS",
    subtitle: "Document Management & OCR",
    localUrl: "http://localhost:5173",
    prodUrl: "https://doka-dms.vercel.app",
    glyph: DokaGlyph,
    color: "#34d399",
    bgRgba: "rgba(52, 211, 153, 0.12)",
    borderRgba: "rgba(52, 211, 153, 0.35)",
  },
  {
    id: "logixa",
    name: "Logixa Flow",
    subtitle: "B2B Logistics & Fleet Operations",
    localUrl: "http://localhost:3002",
    prodUrl: "https://logixa-flow.vercel.app",
    glyph: LogixaGlyph,
    color: "#fbbf24",
    bgRgba: "rgba(251, 191, 36, 0.12)",
    borderRgba: "rgba(251, 191, 36, 0.35)",
  },
  {
    id: "cognix",
    name: "Cognix Nexus",
    subtitle: "Second Brain & Knowledge Graph",
    localUrl: "http://localhost:3001",
    prodUrl: "https://cognix-nexus.vercel.app",
    glyph: CognixGlyph,
    color: "#818cf8",
    bgRgba: "rgba(129, 140, 248, 0.12)",
    borderRgba: "rgba(129, 140, 248, 0.35)",
  },
  {
    id: "alittleworld",
    name: "A Little World",
    subtitle: "Couple Capsule & Travel Memories",
    localUrl: "http://localhost:3004",
    prodUrl: "https://a-little-world-with-us.vercel.app",
    glyph: ALittleWorldGlyph,
    color: "#fb7185",
    bgRgba: "rgba(251, 113, 133, 0.12)",
    borderRgba: "rgba(251, 113, 133, 0.35)",
  },
];

export interface NexusAppSwitcherProps {
  currentAppId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  onSignOut?: () => void;
}

export function NexusAppSwitcher({
  currentAppId = "narrativ",
  userEmail = "thuwon417@gmail.com",
  userName = "Thu Won",
  userRole = "Admin",
  onSignOut,
}: NexusAppSwitcherProps) {
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
      const DROPDOWN_WIDTH = 340;
      const left = Math.max(12, Math.min(window.innerWidth - DROPDOWN_WIDTH - 12, rect.right - DROPDOWN_WIDTH));
      setDropdownPos({
        top: rect.bottom + 8,
        left,
      });
    }
  }, [isOpen]);

  const currentApp = NEXUS_APPS.find((a) => a.id === currentAppId) || NEXUS_APPS[0];

  const dropdownElement = (
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: 340,
        backgroundColor: "rgba(10, 14, 23, 0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "16px",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 32px rgba(56, 189, 248, 0.12)",
        padding: "14px",
        zIndex: 999999,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "10px",
          marginBottom: "10px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Sparkles style={{ width: 14, height: 14, color: "#38bdf8" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#f8fafc", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            The Nexus Suite
          </span>
        </div>
        <span
          style={{
            fontSize: "10px",
            backgroundColor: "rgba(56, 189, 248, 0.12)",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            padding: "2px 8px",
            borderRadius: "999px",
            fontWeight: 600,
            fontFamily: "monospace",
          }}
        >
          6 Engines
        </span>
      </div>

      {/* User Info Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "8px 10px",
          marginBottom: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "8px",
            background: "linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(99, 102, 241, 0.3))",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            color: "#ffffff",
            flexShrink: 0,
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#ffffff", lineHeight: 1.2 }}>
            {userName} <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: 500 }}>({userRole})</span>
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
            <ShieldCheck style={{ width: 11, height: 11, color: "#34d399", flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userEmail}
            </span>
          </div>
        </div>
      </div>

      {/* App List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {NEXUS_APPS.map((app) => {
          const isCurrent = app.id === currentAppId;
          const isHovered = hoveredApp === app.id;
          const targetUrl = isLocal ? app.localUrl : app.prodUrl;
          const GlyphComponent = app.glyph;

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
                transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                backgroundColor: isCurrent
                  ? "rgba(56, 189, 248, 0.14)"
                  : isHovered
                  ? "rgba(255, 255, 255, 0.05)"
                  : "transparent",
                border: isCurrent
                  ? `1px solid ${app.borderRgba}`
                  : isHovered
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid transparent",
                transform: isHovered ? "translateX(2px)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "11px", minWidth: 0 }}>
                {/* Bespoke Glowing Icon Container */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "9px",
                    backgroundColor: app.bgRgba,
                    border: `1px solid ${app.borderRgba}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: isHovered ? `0 0 16px ${app.bgRgba}` : "none",
                    transition: "box-shadow 0.2s ease",
                  }}
                >
                  <GlyphComponent />
                </div>

                <div style={{ minWidth: 0, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: isCurrent ? app.color : "#ffffff",
                        lineHeight: 1.3,
                      }}
                    >
                      {app.name}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: "8.5px",
                          backgroundColor: "rgba(56, 189, 248, 0.25)",
                          color: "#38bdf8",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "10.5px",
                      color: "#94a3b8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: "2px",
                    }}
                  >
                    {app.subtitle}
                  </div>
                </div>
              </div>

              {!isCurrent && (
                <ExternalLink
                  style={{
                    width: 12,
                    height: 12,
                    color: isHovered ? "#ffffff" : "#64748b",
                    flexShrink: 0,
                    marginLeft: "8px",
                    transition: "color 0.15s ease",
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
          marginTop: "12px",
          paddingTop: "9px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "#64748b",
        }}
      >
        <span>Zero Trust Ecosystem</span>
        {onSignOut ? (
          <button
            onClick={() => {
              setIsOpen(false);
              onSignOut();
            }}
            style={{
              background: "none",
              border: "none",
              color: "#f87171",
              fontSize: "10px",
              fontWeight: 600,
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            Sign out
          </button>
        ) : (
          <span style={{ color: "#34d399", fontWeight: 500 }}>SSO Synchronized</span>
        )}
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
          border: isOpen ? "1px solid rgba(56, 189, 248, 0.6)" : "1px solid rgba(255, 255, 255, 0.14)",
          backgroundColor: isOpen ? "rgba(56, 189, 248, 0.16)" : "rgba(15, 23, 42, 0.85)",
          color: "#f8fafc",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: isOpen ? "0 0 16px rgba(56, 189, 248, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.3)",
          transition: "all 0.18s ease",
        }}
        title="The Nexus Suite Unified App Switcher"
      >
        <NexusMatrixIcon size={14} color={currentApp.color || "#38bdf8"} />
        <span style={{ letterSpacing: "0.01em" }}>Nexus Suite</span>
        <span
          style={{
            fontSize: "9.5px",
            backgroundColor: "rgba(56, 189, 248, 0.18)",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            padding: "1px 6px",
            borderRadius: "999px",
            fontFamily: "monospace",
            fontWeight: 700,
          }}
        >
          6 Apps
        </span>
        <ChevronDown
          style={{
            width: 12,
            height: 12,
            color: "#94a3b8",
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {isOpen && mounted && createPortal(dropdownElement, document.body)}
    </div>
  );
}
