"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, Pause, RotateCcw, Sparkles, Layers, Sliders, 
  Terminal, Video, Maximize2, Minimize2, ZoomIn, ZoomOut, 
  Search, Plus, CheckCircle2, RefreshCw, Cpu, Activity, Clock
} from "lucide-react";

interface TrackRow {
  id: string;
  name: string;
  duration: string;
  color: string;
  segments: { width: string; color: string; label: string }[];
}

export const SpatialNodeCanvas: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtube.com/watch?v=travel_tokyo_reel");
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [isReplaying, setIsReplaying] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeStep, setActiveStep] = useState(7);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "12:12:01 [Input] Raw video ingested from multi-track timeline",
    "12:12:03 [Analysis] 42 beat markers detected at 120 BPM tempo",
    "12:12:05 [SpeedRamp] Applied 1.35x velocity curve on movement clips",
    "12:12:07 [ColorGrade] Applied Teal & Orange filmic LUT (3D curves)",
    "12:12:09 [Dubbing] Synced bilingual subtitles and audio viseme ducking",
    "12:12:10 [Render] Generated 9:16 vertical stream with zero frame drop",
  ]);

  const tracks: TrackRow[] = [
    {
      id: "trk-1",
      name: "Track 01 (Hero Clips)",
      duration: "0:05.0",
      color: "#38bdf8",
      segments: [
        { width: "28%", color: "#38bdf8", label: "Clip 1A" },
        { width: "35%", color: "#0ea5e9", label: "Clip 1B" },
        { width: "37%", color: "#0284c7", label: "Clip 1C" },
      ],
    },
    {
      id: "trk-2",
      name: "Track 02 (B-Roll Motion)",
      duration: "0:04.2",
      color: "#10b981",
      segments: [
        { width: "40%", color: "#10b981", label: "Walkway" },
        { width: "30%", color: "#059669", label: "Coffee" },
        { width: "30%", color: "#34d399", label: "Drone" },
      ],
    },
    {
      id: "trk-3",
      name: "Track 03 (Color LUT)",
      duration: "0:06.0",
      color: "#f59e0b",
      segments: [
        { width: "50%", color: "#f59e0b", label: "Teal/Orange" },
        { width: "50%", color: "#d97706", label: "Golden Hour" },
      ],
    },
    {
      id: "trk-4",
      name: "Track 04 (SFX / Beat Grid)",
      duration: "0:05.5",
      color: "#ec4899",
      segments: [
        { width: "25%", color: "#ec4899", label: "Drop 1" },
        { width: "25%", color: "#db2777", label: "Drop 2" },
        { width: "50%", color: "#f472b6", label: "Outro" },
      ],
    },
    {
      id: "trk-5",
      name: "Track 05 (Bilingual Subs)",
      duration: "0:05.0",
      color: "#a855f7",
      segments: [
        { width: "100%", color: "#a855f7", label: "Subtitle Waveform" },
      ],
    },
  ];

  // Replay animation pulse
  useEffect(() => {
    if (!isReplaying || reduceMotion) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 7 ? 1 : prev + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [isReplaying, reduceMotion]);

  const handleRestartReplay = () => {
    setActiveStep(1);
    setIsReplaying(true);
  };

  return (
    <div style={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid #1e293b", backgroundColor: "#060913", height: "750px", display: "flex", flexDirection: "column", userSelect: "none", color: "#f1f5f9" }}>
      {/* Top Floating Input Bar */}
      <div style={{ position: "absolute", top: "16px", left: "24px", right: "24px", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", pointerEvents: "auto", backgroundColor: "rgba(10, 15, 29, 0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid #1e293b", padding: "8px 16px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
          <span style={{ fontSize: "10px", fontFamily: "monospace", fontWeight: "bold", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.08em", backgroundColor: "rgba(8, 47, 73, 0.6)", padding: "2px 8px", borderRadius: "4px", border: "1px solid rgba(14, 116, 144, 0.4)" }}>
            Spatial Canvas
          </span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#ffffff" }}>Narrativ Node Pipeline</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", pointerEvents: "auto", backgroundColor: "rgba(10, 15, 29, 0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid #1e293b", padding: "6px 8px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube or Raw Video URL..."
            style={{ width: "280px", backgroundColor: "#05070f", border: "1px solid #1e293b", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", color: "#e2e8f0", fontFamily: "monospace", outline: "none" }}
          />
          <button 
            type="button"
            style={{ padding: "6px 14px", backgroundColor: "#0284c7", color: "#ffffff", fontWeight: 600, border: "none", borderRadius: "8px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", transition: "background 0.15s ease", boxShadow: "0 2px 8px rgba(2, 132, 199, 0.4)" }}
          >
            <Plus style={{ width: 14, height: 14 }} />
            <span>Add Node</span>
          </button>
        </div>
      </div>

      {/* Infinite Canvas Viewport */}
      <div 
        className="w-full h-full relative overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
          transition: "transform 0.25s ease-out",
        }}
      >
        {/* SVG Bezier Wire Connections Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ minWidth: "1200px", minHeight: "700px" }}>
          <defs>
            <linearGradient id="wireCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="wireGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="wirePurple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="wireOrange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Wires: Timeline (Left) -> Claude AI Agent (Center) */}
          <path
            d="M 440 215 C 500 215, 520 280, 580 280"
            fill="none"
            stroke="url(#wireCyan)"
            strokeWidth="2.5"
            strokeDasharray={reduceMotion ? "none" : "6 4"}
            filter="url(#glow)"
            className={reduceMotion ? "" : "animate-pulse"}
          />
          <path
            d="M 440 260 C 500 260, 520 310, 580 310"
            fill="none"
            stroke="url(#wireGreen)"
            strokeWidth="2.5"
            strokeDasharray={reduceMotion ? "none" : "6 4"}
            filter="url(#glow)"
          />
          <path
            d="M 440 310 C 500 310, 520 340, 580 340"
            fill="none"
            stroke="url(#wireOrange)"
            strokeWidth="2.5"
            filter="url(#glow)"
          />
          <path
            d="M 440 360 C 500 360, 520 370, 580 370"
            fill="none"
            stroke="url(#wirePurple)"
            strokeWidth="2.5"
            filter="url(#glow)"
          />

          {/* Wires: Claude AI Agent (Center) -> Outputs (Right) */}
          <path
            d="M 910 270 C 970 270, 990 190, 1050 190"
            fill="none"
            stroke="url(#wireCyan)"
            strokeWidth="2.5"
            strokeDasharray={reduceMotion ? "none" : "6 4"}
            filter="url(#glow)"
          />
          <path
            d="M 910 320 C 970 320, 990 320, 1050 320"
            fill="none"
            stroke="url(#wirePurple)"
            strokeWidth="2.5"
            filter="url(#glow)"
          />
          <path
            d="M 910 370 C 970 370, 990 450, 1050 450"
            fill="none"
            stroke="url(#wireGreen)"
            strokeWidth="2.5"
            filter="url(#glow)"
          />
        </svg>

        {/* Floating Flying Video Clip Particles (Animated along bezier) */}
        {!reduceMotion && (
          <div className="absolute top-[260px] left-[480px] z-20 pointer-events-none transform -translate-y-1/2 animate-bounce">
            <div className="px-2 py-1 rounded-md bg-cyan-500/20 border border-cyan-400 text-[10px] font-mono text-cyan-200 shadow-lg shadow-cyan-500/30 flex items-center gap-1">
              <Video className="w-3 h-3 text-cyan-400" />
              <span>Frame #128</span>
            </div>
          </div>
        )}

        {/* CARD 1: Multi-Track Video Timeline Node (Left) */}
        <div 
          className="absolute top-20 left-12 w-[390px] bg-[#0c1222]/95 border border-slate-700/80 rounded-2xl shadow-2xl z-20 p-4 space-y-3"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Multi-Track Sequencer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                Tracks 5
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                30 fps
              </span>
            </div>
          </div>

          {/* Track Rows */}
          <div className="space-y-2">
            {tracks.map((t) => (
              <div key={t.id} className="relative group">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-slate-300">{t.name}</span>
                  <span className="font-mono text-slate-500 text-[10px]">{t.duration}</span>
                </div>
                {/* Track Bar with Segments */}
                <div className="h-6 w-full bg-[#05070f] border border-slate-800 rounded-lg flex overflow-hidden p-0.5 relative">
                  {t.segments.map((seg, idx) => (
                    <div
                      key={idx}
                      style={{ width: seg.width, backgroundColor: `${seg.color}33`, borderColor: seg.color }}
                      className="h-full border-r border-slate-700/50 flex items-center justify-center text-[9px] font-mono text-white/90 overflow-hidden px-1"
                    >
                      {seg.label}
                    </div>
                  ))}
                  {/* Socket on right */}
                  <div 
                    className="absolute -right-2 top-1.5 w-3 h-3 rounded-full border-2 border-[#0c1222]"
                    style={{ backgroundColor: t.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/70 flex justify-between items-center text-[10px] text-slate-400">
            <span>Audio Viseme Ducking: <strong>Active (-14dB)</strong></span>
            <span className="text-cyan-400 font-mono">00:00:16.6</span>
          </div>
        </div>

        {/* CARD 2: Claude / Narrativ AI Agent Processing Node (Center) */}
        <div 
          className="absolute top-24 left-[580px] w-[330px] bg-[#0c1222]/95 border-2 border-cyan-500/50 rounded-2xl shadow-2xl z-20 p-4 space-y-3"
          style={{ backdropFilter: "blur(12px)", boxShadow: "0 0 35px rgba(56, 189, 248, 0.15)" }}
        >
          {/* Header with Starburst Logo */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">Narrativ AI Agent</span>
                <span className="text-[10px] text-slate-400 font-mono">Multimodal Synthesis Engine</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-[#05070f] border border-slate-800">
              <span className="text-[9px] text-slate-500 uppercase font-semibold block">Steps</span>
              <span className="font-bold font-mono text-cyan-300">{activeStep}/7</span>
            </div>
            <div className="p-2 rounded-xl bg-[#05070f] border border-slate-800">
              <span className="text-[9px] text-slate-500 uppercase font-semibold block">Keyframes</span>
              <span className="font-bold font-mono text-purple-300">42</span>
            </div>
            <div className="p-2 rounded-xl bg-[#05070f] border border-slate-800">
              <span className="text-[9px] text-slate-500 uppercase font-semibold block">Chains</span>
              <span className="font-bold font-mono text-emerald-300">6 Live</span>
            </div>
          </div>

          {/* Processing Indicator */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Running - 6 Signals Chained</span>
              <span className="text-cyan-400 font-mono font-semibold">{(activeStep / 7 * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${(activeStep / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* Terminal Logs Box */}
          <div className="bg-[#05070f] border border-slate-800/80 rounded-xl p-2.5 space-y-1 h-32 overflow-y-auto font-mono text-[10px]">
            <div className="text-slate-500 flex items-center gap-1 mb-1 border-b border-slate-800/60 pb-1">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>Real-Time Processing Stream</span>
            </div>
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="text-slate-300 leading-tight">
                {log}
              </div>
            ))}
          </div>

          {/* Sockets on edges */}
          <div className="absolute -left-2.5 top-[50px] w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0c1222]" />
          <div className="absolute -left-2.5 top-[80px] w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c1222]" />
          <div className="absolute -left-2.5 top-[110px] w-3 h-3 rounded-full bg-amber-400 border-2 border-[#0c1222]" />
          <div className="absolute -left-2.5 top-[140px] w-3 h-3 rounded-full bg-purple-400 border-2 border-[#0c1222]" />

          <div className="absolute -right-2.5 top-[50px] w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0c1222]" />
          <div className="absolute -right-2.5 top-[100px] w-3 h-3 rounded-full bg-purple-400 border-2 border-[#0c1222]" />
          <div className="absolute -right-2.5 top-[150px] w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c1222]" />
        </div>

        {/* CARD 3 & 4: Output Destination Nodes (Right) */}
        <div className="absolute top-16 left-[1050px] w-[240px] space-y-4 z-20">
          {/* Node: 9:16 Vertical Travel Reel */}
          <div className="bg-[#0c1222]/95 border border-cyan-500/40 rounded-2xl shadow-xl p-3.5 space-y-2 backdrop-blur relative">
            <div className="absolute -left-2 top-4 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0c1222]" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">9:16 Vertical Reel</span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">1080x1920</span>
            </div>
            <div className="w-full h-24 bg-[#05070f] rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/60 via-purple-950/40 to-transparent" />
              <span className="text-[10px] font-mono text-cyan-300 z-10 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Render Ready
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Beat-synced with speed ramps & location badge overlay.</div>
          </div>

          {/* Node: 16:9 YouTube Cinematic Master */}
          <div className="bg-[#0c1222]/95 border border-slate-800 rounded-2xl shadow-xl p-3.5 space-y-2 backdrop-blur relative">
            <div className="absolute -left-2 top-4 w-3 h-3 rounded-full bg-purple-400 border-2 border-[#0c1222]" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">16:9 YouTube Master</span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">4K UHD</span>
            </div>
            <div className="w-full h-16 bg-[#05070f] rounded-lg border border-slate-800 flex items-center justify-center text-[10px] text-slate-400">
              Master timeline with audio stems
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Dock */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 bg-[#0c1222]/90 backdrop-blur border border-slate-800/90 px-4 py-2 rounded-2xl shadow-2xl">
        <button
          type="button"
          onClick={() => setZoomLevel(1.0)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Fit Canvas"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.1))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-cyan-300 font-semibold px-2 min-w-[45px] text-center">
            {(zoomLevel * 100).toFixed(0)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(1.2, prev + 0.1))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Auto Layout */}
        <button
          type="button"
          onClick={() => {
            setZoomLevel(0.85);
          }}
          className="px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Auto layout</span>
        </button>

        {/* Restart Replay */}
        <button
          type="button"
          onClick={handleRestartReplay}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-600/90 hover:bg-cyan-500 text-xs font-semibold text-white shadow-md shadow-cyan-600/25 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restart replay</span>
        </button>

        {/* Reduce Motion */}
        <button
          type="button"
          onClick={() => setReduceMotion(!reduceMotion)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            reduceMotion ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "hover:bg-slate-800 text-slate-400"
          }`}
        >
          <span>{reduceMotion ? "Motion: Off" : "Reduce motion"}</span>
        </button>
      </div>
    </div>
  );
};
