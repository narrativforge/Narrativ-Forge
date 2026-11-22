"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../lib/api";

// In-memory cache to prevent blocking and flickering across intra-app page navigations
let cachedAuthenticated = false;
let lastAuthCheckTime = 0;
const AUTH_CACHE_TTL_MS = 60000; // 1 minute cache

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<"checking" | "authenticated" | "error">(
    cachedAuthenticated ? "authenticated" : "checking"
  );

  useEffect(() => {
    let active = true;
    const now = Date.now();

    // If verified within the last minute, skip full blocking screen
    if (cachedAuthenticated && now - lastAuthCheckTime < AUTH_CACHE_TTL_MS) {
      if (state !== "authenticated") setState("authenticated");
      return;
    }

    // Generous safety timeout: 10s instead of premature 1.2s to prevent false logouts on cloud latency
    const timer = setTimeout(() => {
      if (active && state === "checking") {
        cachedAuthenticated = false;
        setState("error");
        router.replace("/login");
      }
    }, 10000);

    api.me()
      .then(() => {
        if (!active) return;
        cachedAuthenticated = true;
        lastAuthCheckTime = Date.now();
        setState("authenticated");
      })
      .catch((err) => {
        if (!active) return;
        cachedAuthenticated = false;
        setState("error");
        router.replace("/login");
      })
      .finally(() => {
        clearTimeout(timer);
      });

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [pathname, router]);

  if (state === "checking") {
    return (
      <main className="center-state" style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#090c10" }}>
        <div
          className="card"
          style={{
            maxWidth: "380px",
            width: "90%",
            textAlign: "center",
            padding: "32px 24px",
            background: "#111820",
            border: "1px solid #26323d",
            borderRadius: "16px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              margin: "0 auto 16px",
              borderRadius: "50%",
              border: "3px solid #26323d",
              borderTopColor: "#38bdf8",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.15em", color: "#38bdf8", textTransform: "uppercase" }}>
            WORKSPACE SESSION
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#f4f7f8", margin: "8px 0 4px" }}>
            Verifying Studio Access…
          </h2>
          <p style={{ fontSize: "12px", color: "#9aa9b5", margin: 0 }}>
            Connecting to Narrativ Forge Production Cluster.
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    );
  }

  if (state === "error") return null;
  return <>{children}</>;
}
