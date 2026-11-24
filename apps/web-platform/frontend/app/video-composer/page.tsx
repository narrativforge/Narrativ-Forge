"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppShell } from "../../components/app-shell";
import { apiBase } from "../../lib/api";
import { SpatialNodeCanvas } from "../../components/SpatialNodeCanvas";
import {
  Film,
  Pause,
  Play,
  RotateCcw,
  FileTerminal,
  Mic,
  Music,
  MessageSquare,
  Zap,
  CheckCircle2,
  MapPin,
  Sparkles,
  Sliders,
  Compass,
  Layers,
  Video,
  Camera,
  Check,
  Music2,
  Clock,
  ArrowRight,
  Network,
} from "lucide-react";

interface VideoClipItem {
  id: string;
  title: string;
  provider: string;
  duration_seconds: number;
  source_url: string;
  transition: string;
  poster_url?: string;
  subtitle?: string;
}

type LocalRenderJob = { id: string; title: string; createdAt: string; duration: number; status: "planned" | "ready"; command: string };
const RENDER_QUEUE_KEY = "narrativ-local-render-queue-v1";

const TRAVEL_THEMES = [
  { id: "epic_adventure", name: "Epic Cinematic Wanderlust", bpm: 120, vibe: "Majestic & Grand", color: "#38bdf8" },
  { id: "lofi_sunset", name: "Lo-Fi Sunset Chill", bpm: 85, vibe: "Dreamy & Warm", color: "#f59e0b" },
  { id: "tropical_breeze", name: "Tropical Island Breeze", bpm: 104, vibe: "Sunny & Upbeat", color: "#10b981" },
  { id: "velocity_cyber", name: "Fast City Velocity", bpm: 130, vibe: "Modern & High Energy", color: "#a855f7" },
];

const COLOR_PRESETS = [
  { id: "teal_and_orange", name: "Teal & Orange", desc: "Blockbuster Hollywood travel contrast", sample: "linear-gradient(135deg, #0e7490, #ea580c)" },
  { id: "golden_hour", name: "Golden Hour", desc: "Warm sunset glow and gentle highlights", sample: "linear-gradient(135deg, #b45309, #f59e0b)" },
  { id: "vintage_film", name: "35mm Vintage Film", desc: "Kodak film aesthetic with lifted blacks", sample: "linear-gradient(135deg, #78350f, #d97706)" },
  { id: "vibrant_paradise", name: "Vibrant Paradise", desc: "Deep blues and saturated tropical greens", sample: "linear-gradient(135deg, #047857, #0284c7)" },
  { id: "cinematic_moody", name: "Cinematic Moody", desc: "High contrast and muted shadows", sample: "linear-gradient(135deg, #1e293b, #475569)" },
];

export default function VideoComposerPage() {
  const [activeTab, setActiveTab] = useState<"travel_reel" | "spatial_canvas" | "storyboard">("spatial_canvas");

  // Storyboard Clips State
  const [clips, setClips] = useState<VideoClipItem[]>([
    {
      id: "clip_01",
      title: "Kling AI - Neo Bagan Cyberpunk Flight",
      provider: "kling_ai",
      duration_seconds: 6.0,
      source_url: "https://storage.googleapis.com/sample/kling_clip1.mp4",
      transition: "cross_dissolve",
      poster_url: "https://image.pollinations.ai/prompt/Dawn%20breaks%20over%20futuristic%20Bagan%20temples%2C%20mist%20rising%2C%20cyberpunk%20flying%20airship%2C%20anime%20style%2C%208k%20crisp%20lineart?width=720&height=1280&model=flux&nologo=true",
      subtitle: "The ancient seal is awakening beneath the sacred pagoda...",
    },
    {
      id: "clip_02",
      title: "Runway Gen-3 - Mech Awakening Close-Up",
      provider: "runway_gen3",
      duration_seconds: 4.5,
      source_url: "https://storage.googleapis.com/sample/runway_clip2.mp4",
      transition: "cut",
      poster_url: "https://image.pollinations.ai/prompt/Giant%20anime%20mech%20eye%20glows%20with%20neon%20cyan%20energy%2C%20anime%20lineart%2C%20high%20contrast%2C%20masterpiece?width=720&height=1280&model=flux&nologo=true",
      subtitle: "Awaken, Unit-01! The sky sanctuary needs your blade!",
    },
    {
      id: "clip_03",
      title: "Luma Dream Machine - Solar Flare Blast",
      provider: "luma_dream_machine",
      duration_seconds: 5.0,
      source_url: "https://storage.googleapis.com/sample/luma_clip3.mp4",
      transition: "anime_flash",
      poster_url: "https://image.pollinations.ai/prompt/Shadow%20beast%20emerges%20from%20dimensional%20tear%2C%20solar%20flare%20speed%20lines%2C%20dramatic%20shadows%2C%20anime%20masterpiece?width=720&height=1280&model=flux&nologo=true",
      subtitle: "Warning: Celestial solar core threshold exceeded! Full release!",
    },
  ]);

  // Travel Reel State
  const [locationBadge, setLocationBadge] = useState("Bagan, Myanmar");
  const [selectedTheme, setSelectedTheme] = useState("epic_adventure");
  const [selectedColor, setSelectedColor] = useState("teal_and_orange");
  const [targetDuration, setTargetDuration] = useState(30);
  const [enableSpeedRamps, setEnableSpeedRamps] = useState(true);
  const [isGeneratingReel, setIsGeneratingReel] = useState(false);
  const [travelClips, setTravelClips] = useState([
    { id: "t1", title: "Bagan Sunset & Ancient Pagodas", duration_seconds: 6.0, source_url: "/raw_media/bagan_sunset.mp4" },
    { id: "t2", title: "Hot Air Balloon Flight Over Old City", duration_seconds: 8.0, source_url: "/raw_media/balloon_flight.mp4" },
    { id: "t3", title: "Traditional Village Pathway Walk", duration_seconds: 5.5, source_url: "/raw_media/village_walk.mp4" },
    { id: "t4", title: "Golden Hour River Reflection & Boats", duration_seconds: 7.0, source_url: "/raw_media/river_reflection.mp4" },
  ]);
  const [newTravelTitle, setNewTravelTitle] = useState("");
  const [newTravelUrl, setNewTravelUrl] = useState("");
  const [newTravelDuration, setNewTravelDuration] = useState("6.0");

  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newProvider, setNewProvider] = useState("kling_ai");
  const [newDuration, setNewDuration] = useState("5.0");
  const [bgmVolume, setBgmVolume] = useState(25);

  // Playback Monitor State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [ffmpegCommand, setFfmpegCommand] = useState<string | null>(null);
  const [isCompiled, setIsCompiled] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileStatus, setCompileStatus] = useState("");
  const [renderJobs, setRenderJobs] = useState<LocalRenderJob[]>([]);
  const queueImportRef = useRef<HTMLInputElement>(null);

  const totalDuration = activeTab === "travel_reel"
    ? targetDuration
    : clips.reduce((acc, c) => acc + c.duration_seconds, 0);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(window.localStorage.getItem(RENDER_QUEUE_KEY) || "[]");
      if (Array.isArray(saved)) setRenderJobs(saved.filter((job): job is LocalRenderJob => Boolean(job && typeof job.id === "string" && typeof job.command === "string")));
    } catch { /* ignored */ }
  }, []);

  const saveRenderJobs = (next: LocalRenderJob[]) => {
    setRenderJobs(next);
    window.localStorage.setItem(RENDER_QUEUE_KEY, JSON.stringify(next.slice(0, 20)));
  };

  const exportRenderQueue = () => {
    const blob = new Blob([JSON.stringify({ format: "narrativ-local-render-queue", version: 1, jobs: renderJobs }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "narrativ-render-queue.json"; anchor.click(); URL.revokeObjectURL(url);
  };

  const importRenderQueue = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    try {
      const value: unknown = JSON.parse(await file.text());
      if (!value || typeof value !== "object" || (value as { format?: string }).format !== "narrativ-local-render-queue" || !Array.isArray((value as { jobs?: unknown[] }).jobs)) throw new Error("Invalid render queue");
      const incoming = (value as { jobs: unknown[] }).jobs.filter((job): job is LocalRenderJob => Boolean(job && typeof (job as LocalRenderJob).id === "string" && typeof (job as LocalRenderJob).command === "string" && typeof (job as LocalRenderJob).title === "string"));
      saveRenderJobs([...renderJobs, ...incoming.filter((job) => !renderJobs.some((existing) => existing.id === job.id))]);
    } catch { window.alert("This file is not a valid Narrativ local render queue."); }
  };

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0.0;
          }
          return Math.round((prev + 0.1) * 10) / 10;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  // Find active clip for Storyboard
  let accumulatedTime = 0;
  let activeClip = clips[0];
  for (const c of clips) {
    if (currentTime >= accumulatedTime && currentTime <= accumulatedTime + c.duration_seconds) {
      activeClip = c;
      break;
    }
    accumulatedTime += c.duration_seconds;
  }

  const handleAddClip = () => {
    if (!newUrl.trim() || !newTitle.trim()) return;
    const item: VideoClipItem = {
      id: `clip_${Date.now()}`,
      title: newTitle,
      provider: newProvider,
      duration_seconds: parseFloat(newDuration) || 5.0,
      source_url: newUrl,
      transition: "cut",
    };
    setClips([...clips, item]);
    setNewUrl("");
    setNewTitle("");
  };

  const handleAddTravelClip = () => {
    if (!newTravelTitle.trim()) return;
    setTravelClips([
      ...travelClips,
      {
        id: `t_${Date.now()}`,
        title: newTravelTitle,
        duration_seconds: parseFloat(newTravelDuration) || 6.0,
        source_url: newTravelUrl || `/raw_media/${newTravelTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.mp4`,
      },
    ]);
    setNewTravelTitle("");
    setNewTravelUrl("");
  };

  const handleCompileTimeline = async () => {
    if (isCompiling || clips.length === 0) return;
    setIsCompiling(true);
    setCompileStatus("Building a local render plan...");
    setIsCompiled(true);
    try {
      const res = await fetch(`${apiBase}/video-composer/render-ffmpeg-spec`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Anime Battle Episode 1 Final Cut",
          video_clips: clips,
          target_aspect_ratio: "9:16",
        }),
      });
      let command: string;
      if (res.ok) {
        const data = await res.json();
        command = data.ffmpeg_command;
      } else {
        command = `ffmpeg -y -f lavfi -i color=c=black:s=1080x1920:r=30:d=${totalDuration} -c:v libx264 -b:a 192k output_shorts_1080x1920.mp4`;
      }
      setFfmpegCommand(command);
      const newJob: LocalRenderJob = {
        id: `job_${Date.now()}`,
        title: "Anime Battle Episode 1 Final Cut",
        createdAt: new Date().toISOString(),
        duration: totalDuration,
        status: "ready",
        command,
      };
      saveRenderJobs([newJob, ...renderJobs]);
      setCompileStatus("Render plan compiled and saved to local queue.");
    } catch {
      const fallbackCommand = `ffmpeg -y -f lavfi -i color=c=black:s=1080x1920:r=30:d=${totalDuration} -c:v libx264 -b:a 192k output_shorts_1080x1920.mp4`;
      setFfmpegCommand(fallbackCommand);
      saveRenderJobs([
        {
          id: `job_${Date.now()}`,
          title: "Anime Battle Episode 1 (Offline fallback)",
          createdAt: new Date().toISOString(),
          duration: totalDuration,
          status: "planned",
          command: fallbackCommand,
        },
        ...renderJobs,
      ]);
      setCompileStatus("Offline fallback command saved to local queue.");
    } finally {
      setIsCompiling(false);
      setTimeout(() => setCompileStatus(""), 4000);
    }
  };

  const handleGenerateTravelReel = async () => {
    if (isGeneratingReel || travelClips.length === 0) return;
    setIsGeneratingReel(true);
    setCompileStatus("Analyzing footage beats and generating travel montage...");
    try {
      const res = await fetch(`${apiBase}/video-composer/travel-reel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_clips: travelClips,
          location_badge: locationBadge,
          theme_id: selectedTheme,
          color_grade_id: selectedColor,
          target_duration_seconds: targetDuration,
          enable_speed_ramps: enableSpeedRamps,
        }),
      });
      let command: string;
      if (res.ok) {
        const data = await res.json();
        command = data.timeline.ffmpeg_command;
      } else {
        command = `ffmpeg -y -f concat -safe 0 -i inputs.txt -vf "scale=1080:1920,curves=preset=vintage" -c:v libx264 -crf 22 travel_reel_${locationBadge.toLowerCase().replace(/[^a-z0-9]/g, "_")}.mp4`;
      }
      setFfmpegCommand(command);
      const newJob: LocalRenderJob = {
        id: `job_reel_${Date.now()}`,
        title: `Travel Reel: ${locationBadge}`,
        createdAt: new Date().toISOString(),
        duration: targetDuration,
        status: "ready",
        command,
      };
      saveRenderJobs([newJob, ...renderJobs]);
      setCompileStatus("Travel Reel compiled! Saved to Local Render Queue.");
    } catch {
      const fallback = `ffmpeg -y -f concat -safe 0 -i inputs.txt -vf "scale=1080:1920,curves=preset=vintage" -c:v libx264 -crf 22 travel_reel_${locationBadge.toLowerCase().replace(/[^a-z0-9]/g, "_")}.mp4`;
      setFfmpegCommand(fallback);
      setCompileStatus("Offline travel reel command generated.");
    } finally {
      setIsGeneratingReel(false);
      setTimeout(() => setCompileStatus(""), 4000);
    }
  };

  const currentTheme = TRAVEL_THEMES.find((t) => t.id === selectedTheme) || TRAVEL_THEMES[0];
  const currentColor = COLOR_PRESETS.find((c) => c.id === selectedColor) || COLOR_PRESETS[0];

  return (
    <AppShell title="Multi-Track Video Clip Composer">
      <div className="ds-stack" style={{ gap: "20px" }}>
        {/* Composer Header Banner */}
        <div
          className="ds-card"
          style={{
            padding: "24px",
            background: "linear-gradient(135deg, rgba(14, 116, 144, 0.35), rgba(15, 23, 42, 0.95))",
            border: "1px solid rgba(56, 189, 248, 0.3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="eyebrow" style={{ color: "#38bdf8" }}>AI VIDEO COMPOSITION & MONTAGE ENGINE</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>
                Multi-Track & Smart Travel Reel Studio
              </h2>
              <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "6px", maxWidth: "600px" }}>
                Transform raw footage into beat-synced travel reels or compose multi-track anime story sequences with audio dubbing and auto-ducking.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8", backgroundColor: "#0b1424", padding: "6px 12px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                Timeline: <b style={{ color: "#38bdf8" }}>{currentTime.toFixed(1)}s</b> / {totalDuration.toFixed(1)}s
              </div>
              {activeTab === "travel_reel" ? (
                <button
                  type="button"
                  onClick={handleGenerateTravelReel}
                  disabled={isGeneratingReel || travelClips.length === 0}
                  className="ds-button primary"
                  style={{ fontSize: "12px", padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#38bdf8", color: "#000", fontWeight: 700 }}
                >
                  {isGeneratingReel ? "Analyzing Beats..." : <><Sparkles size={14} /> Auto-Generate Travel Reel</>}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompileTimeline}
                  disabled={isCompiling || clips.length === 0}
                  className="ds-button primary"
                  style={{ fontSize: "12px", padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {isCompiling ? "Building plan..." : isCompiled ? <><CheckCircle2 size={14} /> Compiled Ready!</> : <><Zap size={14} /> Compile & Export</>}
                </button>
              )}
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveTab("spatial_canvas")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: activeTab === "spatial_canvas" ? "1px solid #10b981" : "1px solid #1e293b",
                backgroundColor: activeTab === "spatial_canvas" ? "rgba(16, 185, 129, 0.15)" : "#0b1424",
                color: activeTab === "spatial_canvas" ? "#34d399" : "#94a3b8",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Network size={16} /> Spatial Node Workflow Canvas (video_2026-11-21 Style)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("travel_reel")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: activeTab === "travel_reel" ? "1px solid #38bdf8" : "1px solid #1e293b",
                backgroundColor: activeTab === "travel_reel" ? "rgba(56, 189, 248, 0.15)" : "#0b1424",
                color: activeTab === "travel_reel" ? "#38bdf8" : "#94a3b8",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Compass size={16} /> Smart Travel Reel & Beat-Sync Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("storyboard")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: activeTab === "storyboard" ? "1px solid #a855f7" : "1px solid #1e293b",
                backgroundColor: activeTab === "storyboard" ? "rgba(168, 85, 247, 0.15)" : "#0b1424",
                color: activeTab === "storyboard" ? "#c084fc" : "#94a3b8",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Film size={16} /> Multi-Track AI Storyboard Composer
            </button>
          </div>
        </div>

        {/* Tab: Spatial AI Node Workflow Canvas (video_2026-11-21 Style) */}
        {activeTab === "spatial_canvas" && <SpatialNodeCanvas />}

        {/* Tab 1: Smart Travel Reel & Beat-Sync Studio */}
        {activeTab === "travel_reel" && (
          <div style={{ display: "grid", gap: "20px" }}>
            {/* Travel Configuration Bar */}
            <div className="ds-card" style={{ padding: "20px" }}>
              <div className="eyebrow" style={{ color: "#38bdf8", marginBottom: "12px" }}>TRAVEL REEL SMART SETTINGS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                {/* Location Badge */}
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                    <MapPin size={12} style={{ color: "#38bdf8" }} /> Location & Destination Badge
                  </label>
                  <input
                    type="text"
                    value={locationBadge}
                    onChange={(e) => setLocationBadge(e.target.value)}
                    placeholder="e.g. Inle Lake, Shan State"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", backgroundColor: "#070b13", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "13px" }}
                  />
                </div>

                {/* Music Theme Selector */}
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                    <Music2 size={12} style={{ color: currentTheme.color }} /> Beat-Synced Music Theme
                  </label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", backgroundColor: "#070b13", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "13px" }}
                  >
                    {TRAVEL_THEMES.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name} ({theme.bpm} BPM - {theme.vibe})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Grade Preset */}
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                    <Sliders size={12} style={{ color: "#f59e0b" }} /> Cinematic Color Grade
                  </label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", backgroundColor: "#070b13", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "13px" }}
                  >
                    {COLOR_PRESETS.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name} - {color.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Duration & Speed Ramping */}
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                    <Clock size={12} style={{ color: "#10b981" }} /> Target Duration & Dynamics
                  </label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <select
                      value={targetDuration}
                      onChange={(e) => setTargetDuration(parseInt(e.target.value))}
                      style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", backgroundColor: "#070b13", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "13px" }}
                    >
                      <option value={15}>15s (Shorts/TikTok Sprint)</option>
                      <option value={30}>30s (Standard Travel Reel)</option>
                      <option value={60}>60s (Cinematic Highlight)</option>
                    </select>
                    <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#e2e8f0", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={enableSpeedRamps}
                        onChange={(e) => setEnableSpeedRamps(e.target.checked)}
                      />
                      Velocity
                    </label>
                  </div>
                </div>
              </div>

              {/* Color Swatch Preview */}
              <div style={{ marginTop: "16px", padding: "10px 14px", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: currentColor.sample }} />
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Selected Look: <b style={{ color: "#f8fafc" }}>{currentColor.name}</b> ({currentColor.desc})
                </div>
              </div>
            </div>

            {/* Travel Raw Footage Sequence & Stage */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 340px) 1fr", gap: "20px" }}>
              {/* 9:16 Travel Player Preview */}
              <div
                style={{
                  height: "440px",
                  borderRadius: "12px",
                  backgroundColor: "#05070d",
                  border: "2px solid #1e293b",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", backgroundColor: "#38bdf8", color: "#000" }}>
                    9:16 TRAVEL REEL
                  </span>
                  <span style={{ fontSize: "11px", color: currentTheme.color, fontWeight: 600 }}>
                    {currentTheme.bpm} BPM BEAT-SYNC
                  </span>
                </div>

                <div style={{ textAlign: "center", margin: "auto 0" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                    <Camera size={44} style={{ color: "#38bdf8" }} />
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
                    {travelClips[0]?.title || "Raw Travel Sequence"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                    {travelClips.length} raw cuts · Auto-Whip Pan · Speed Ramping
                  </div>
                </div>

                {/* Animated Travel Title Badge */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      backdropFilter: "blur(8px)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                      fontSize: "13px",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <MapPin size={14} style={{ color: "#38bdf8" }} />
                    {locationBadge}
                  </div>
                </div>
              </div>

              {/* Travel Clips & Beat-Timeline */}
              <div className="ds-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div className="eyebrow" style={{ color: "#38bdf8" }}>RAW FOOTAGE SCENE LIST ({travelClips.length} CLIPS)</div>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Target: {targetDuration}s Montage</span>
                  </div>

                  <div style={{ display: "grid", gap: "8px", maxHeight: "240px", overflowY: "auto", paddingRight: "4px" }}>
                    {travelClips.map((clip, idx) => (
                      <div
                        key={clip.id}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "8px",
                          backgroundColor: "#070b13",
                          border: "1px solid #1e293b",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#38bdf8", fontWeight: 700 }}>
                            {idx + 1}
                          </span>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#f8fafc" }}>{clip.title}</div>
                            <div style={{ fontSize: "11px", color: "#64748b" }}>{clip.duration_seconds}s · Local Raw Footage</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "11px", color: idx % 2 === 1 ? "#a855f7" : "#38bdf8", fontWeight: 600 }}>
                            {enableSpeedRamps ? (idx % 2 === 1 ? "0.65x Slow-mo" : "1.35x Movement") : "1.0x Normal"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setTravelClips(travelClips.filter((c) => c.id !== clip.id))}
                            style={{ background: "none", border: "none", color: "#ef4444", fontSize: "11px", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Raw Footage Input */}
                  <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "8px", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Add raw clip title (e.g. Sunset Boat)"
                      value={newTravelTitle}
                      onChange={(e) => setNewTravelTitle(e.target.value)}
                      style={{ padding: "7px 10px", borderRadius: "8px", backgroundColor: "#0b1424", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "12px" }}
                    />
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Duration (s)"
                      value={newTravelDuration}
                      onChange={(e) => setNewTravelDuration(e.target.value)}
                      style={{ padding: "7px 10px", borderRadius: "8px", backgroundColor: "#0b1424", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "12px" }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTravelClip}
                      className="ds-button"
                      style={{ padding: "7px 14px", fontSize: "12px", backgroundColor: "#1e293b", color: "#38bdf8" }}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "20px", borderTop: "1px solid #1e293b", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Backblaze B2 & Google Drive direct export ready
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateTravelReel}
                    disabled={isGeneratingReel || travelClips.length === 0}
                    className="ds-button primary"
                    style={{ padding: "10px 20px", fontSize: "13px", backgroundColor: "#38bdf8", color: "#000", fontWeight: 700 }}
                  >
                    {isGeneratingReel ? "Compiling Beat Reel..." : <><Sparkles size={14} /> Auto-Generate 9:16 Travel Reel</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Existing Multi-Track AI Storyboard Composer */}
        {activeTab === "storyboard" && (
          <div style={{ display: "grid", gap: "20px" }}>
            {/* Live Video Monitor Stage */}
            <div className="ds-card" style={{ padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 340px) 1fr", gap: "20px" }}>
                {/* 9:16 Video Player Screen */}
                <div
                  style={{
                    height: "440px",
                    borderRadius: "14px",
                    backgroundColor: "#05070d",
                    backgroundImage: activeClip?.poster_url ? `linear-gradient(180deg, rgba(5, 7, 13, 0.4) 0%, rgba(5, 7, 13, 0.75) 100%), url("${activeClip.poster_url}")` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: isPlaying ? "2px solid #38bdf8" : "2px solid #1e293b",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "16px",
                    boxShadow: isPlaying ? "0 0 30px rgba(56, 189, 248, 0.25)" : "0 8px 32px rgba(0,0,0,0.7)",
                    transition: "all 0.4s ease",
                  }}
                >
                  {/* Top Bar with Live Indicator */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", backgroundColor: isPlaying ? "#38bdf8" : "#1e293b", color: isPlaying ? "#000" : "#94a3b8", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      {isPlaying && <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#0284c7", display: "inline-block" }} />}
                      9:16 SHORTS PREVIEW
                    </span>
                    <span style={{ fontSize: "11px", color: "#f8fafc", textTransform: "uppercase", fontWeight: 700, textShadow: "0 2px 4px rgba(0,0,0,0.8)", backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 8px", borderRadius: "4px" }}>
                      {activeClip ? activeClip.provider.replace("_", " ") : "READY"}
                    </span>
                  </div>

                  {/* Center Motion Status & Title */}
                  <div style={{ textAlign: "center", zIndex: 10, margin: "auto 0" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                      <div style={{ padding: "12px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        {isPlaying ? <Film size={32} style={{ color: "#38bdf8" }} /> : <Pause size={32} style={{ color: "#94a3b8" }} />}
                      </div>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                      {activeClip ? activeClip.title : "Timeline Idle"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#38bdf8", marginTop: "4px", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      Active Transition: <span style={{ color: "#c084fc", textTransform: "uppercase" }}>{activeClip?.transition || "cut"}</span>
                    </div>
                  </div>

                  {/* Dynamic Subtitle Box & Audio Wave */}
                  <div style={{ textAlign: "center", zIndex: 10 }}>
                    <div
                      style={{
                        backgroundColor: "rgba(0,0,0,0.85)",
                        backdropFilter: "blur(8px)",
                        color: "#fef08a",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        border: "1px solid rgba(251, 191, 36, 0.4)",
                        fontSize: "12px",
                        fontWeight: 600,
                        display: "inline-block",
                        maxWidth: "100%",
                        lineHeight: 1.4,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.8)",
                      }}
                    >
                      "{activeClip?.subtitle || "Awaken, Unit-01! The sky sanctuary needs your blade!"}"
                    </div>
                  </div>
                </div>

                {/* Playback Controls & Inspect Panel */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="eyebrow" style={{ marginBottom: "8px" }}>TIMELINE PLAYBACK MONITOR</div>
                    <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                      Real-time simulation of cut transitions, multi-voice dialogue timing, and synchronized background score.
                    </p>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "16px" }}>
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="ds-button"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: isPlaying ? "#ef4444" : "#38bdf8", color: isPlaying ? "#fff" : "#000", fontWeight: 700 }}
                      >
                        {isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play Sequence</>}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsPlaying(false); setCurrentTime(0.0); }}
                        className="ds-button"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <RotateCcw size={14} /> Reset Time
                      </button>
                    </div>

                    <div style={{ marginTop: "24px" }}>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Active Clip Inspector:</div>
                      {activeClip && (
                        <div style={{ backgroundColor: "#0b1424", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "12px", color: "#e2e8f0" }}>
                          <div><b>Title:</b> {activeClip.title}</div>
                          <div><b>Source:</b> {activeClip.provider.toUpperCase()}</div>
                          <div><b>Duration:</b> {activeClip.duration_seconds}s</div>
                          <div><b>Transition In:</b> {activeClip.transition}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {ffmpegCommand && (
                    <div style={{ marginTop: "16px", backgroundColor: "#05070d", padding: "12px", borderRadius: "8px", border: "1px solid #334155" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#4ade80", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <FileTerminal size={12} /> Generated FFmpeg Command
                        </span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard?.writeText(ffmpegCommand)}
                          style={{ fontSize: "10px", color: "#38bdf8", background: "none", border: "none", cursor: "pointer" }}
                        >
                          Copy command
                        </button>
                      </div>
                      <pre style={{ fontSize: "10px", color: "#94a3b8", whiteSpace: "pre-wrap", maxHeight: "60px", overflowY: "auto", margin: 0 }}>
                        {ffmpegCommand}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Import Clip Box */}
            <div className="ds-card" style={{ padding: "18px" }}>
              <div className="eyebrow" style={{ marginBottom: "8px" }}>IMPORT EXTERNAL AI VIDEO CLIP</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", alignItems: "end" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Video Title / Scene Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Runway Mech Duel"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", backgroundColor: "#0b1424", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>External Source URL (MP4/WebM)</label>
                  <input
                    type="text"
                    placeholder="https://.../clip.mp4"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", backgroundColor: "#0b1424", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>AI Video Engine</label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", backgroundColor: "#0b1424", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "12px" }}
                  >
                    <option value="kling_ai">Kling AI</option>
                    <option value="runway_gen3">Runway Gen-3</option>
                    <option value="luma_dream_machine">Luma Dream Machine</option>
                    <option value="openai_sora">OpenAI Sora</option>
                    <option value="pika_labs">Pika Labs</option>
                    <option value="local_upload">Local Raw Video</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Duration (Seconds)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", backgroundColor: "#0b1424", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleAddClip}
                    className="ds-button"
                    style={{ width: "100%", padding: "7px 12px", fontSize: "12px", backgroundColor: "#1e293b", color: "#38bdf8" }}
                  >
                    + Add Clip to Timeline
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Multi-Track Timeline */}
            <div className="ds-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="eyebrow">ACTIVE MULTI-TRACK TIMELINE</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#94a3b8" }}>
                  <span>BGM Auto-Ducking:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bgmVolume}
                    onChange={(e) => setBgmVolume(parseInt(e.target.value))}
                    style={{ width: "80px" }}
                  />
                  <span>{bgmVolume}%</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#070b13", padding: "16px", borderRadius: "12px", border: "1px solid #1e293b" }}>
                {/* Track 1: Video Track */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "90px", fontSize: "11px", fontWeight: 700, color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: "4px" }}><Film size={12} /> Video Track</div>
                  <div style={{ flex: 1, display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                    {clips.map((c, i) => (
                      <div
                        key={c.id}
                        style={{
                          flex: `0 0 ${Math.max(c.duration_seconds * 28, 140)}px`,
                          padding: "10px",
                          borderRadius: "8px",
                          backgroundColor: activeClip?.id === c.id ? "#1e3a5f" : "#1e293b",
                          border: activeClip?.id === c.id ? "2px solid #38bdf8" : "1px solid #334155",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {i + 1}. {c.title}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "10px", color: "#94a3b8" }}>
                          <span style={{ textTransform: "uppercase" }}>{c.provider.replace("_", " ")}</span>
                          <span style={{ color: "#38bdf8", fontWeight: 700 }}>{c.duration_seconds}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Track 2: Dubbing Audio Track */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "90px", fontSize: "11px", fontWeight: 700, color: "#a855f7", display: "inline-flex", alignItems: "center", gap: "4px" }}><Mic size={12} /> Dubbing Voice</div>
                  <div style={{ flex: 1, display: "flex", gap: "8px" }}>
                    <div style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", backgroundColor: "rgba(168, 85, 247, 0.15)", border: "1px dashed #a855f7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#e9d5ff" }}>Voice Binding: <b>Shinji Kazama (ja-JP-KeitaNeural) & Lead Actor</b></span>
                      <span style={{ fontSize: "10px", color: "#c084fc", fontWeight: 700 }}>Synced (Edge-TTS)</span>
                    </div>
                  </div>
                </div>

                {/* Track 3: BGM Track */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "90px", fontSize: "11px", fontWeight: 700, color: "#f59e0b", display: "inline-flex", alignItems: "center", gap: "4px" }}><Music size={12} /> Score BGM</div>
                  <div style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#fef3c7" }}>Audio Track: <b>"Cyberpunk Neo-Tokyo Ambient Pulse" (BPM: 124)</b></span>
                    <span style={{ fontSize: "10px", color: "#f59e0b", fontWeight: 700 }}>Volume: {bgmVolume}% (Duck on speech)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Local Render Queue (Universal) */}
        <div className="ds-card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div className="eyebrow">LOCAL RENDER QUEUE & JOBS</div>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                Compiled video plans and FFmpeg scripts ready for rendering and cloud storage backup.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {renderJobs.length > 0 && (
                <>
                  <button type="button" className="ds-button" onClick={exportRenderQueue} style={{ fontSize: "12px" }}>Export JSON</button>
                  <button type="button" className="ds-button" onClick={() => saveRenderJobs([])} style={{ fontSize: "12px" }}>Clear local queue</button>
                </>
              )}
              <button type="button" className="ds-button" onClick={() => queueImportRef.current?.click()} style={{ fontSize: "12px" }}>Import JSON</button>
              <input ref={queueImportRef} type="file" accept="application/json,.json" className="hidden" onChange={importRenderQueue} />
            </div>
          </div>
          <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
            {renderJobs.length ? renderJobs.map((job) => (
              <div key={job.id} style={{ padding: "10px 14px", border: "1px solid #1e293b", borderRadius: "8px", background: "#0b1424", display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                <div>
                  <strong style={{ color: "#e2e8f0", fontSize: "13px" }}>{job.title}</strong>
                  <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "3px" }}>{job.duration.toFixed(1)}s · {new Date(job.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button type="button" onClick={() => { navigator.clipboard?.writeText(job.command).catch(() => undefined); }} className="ds-button" style={{ fontSize: "11px" }}>Copy command</button>
                  <button type="button" onClick={() => saveRenderJobs(renderJobs.filter((item) => item.id !== job.id))} className="ds-button" style={{ fontSize: "11px" }}>Remove</button>
                </div>
              </div>
            )) : (
              <p style={{ color: "#64748b", fontSize: "12px" }}>No local render plans yet. Generate a travel reel or compile a timeline to create one.</p>
            )}
          </div>
        </div>
        <p aria-live="polite" className="sr-only">{compileStatus}</p>
      </div>
    </AppShell>
  );
}
