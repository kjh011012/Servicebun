import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  X, MapPin, Calendar, Award, TrendingUp, ChevronRight,
  Sparkles, Star, Gift, ArrowUpRight, ArrowDownRight, Clock, Shield, Stamp,
} from "lucide-react";

type TabType = "passport" | "visits" | "achievements" | "points";

const stampCollection = [
  { id: 1, village: "홍천 행복마을", icon: "🍓", category: "체험마을", date: "2026.03.01", season: "봄", experiences: ["딸기 따기", "도자기 만들기"], pointsEarned: 350, img: "https://images.unsplash.com/photo-1622940000668-6c6bd414ec1c?w=600&h=400&fit=crop", rotation: -4 },
  { id: 2, village: "양평 달빛마을", icon: "🌙", category: "치유마을", date: "2026.02.15", season: "겨울", experiences: ["힐링 산책", "명상 체험"], pointsEarned: 280, img: "https://images.unsplash.com/photo-1766757084313-8d0f199482ea?w=600&h=400&fit=crop", rotation: 3 },
  { id: 3, village: "가평 자연마을", icon: "🌿", category: "치유마을", date: "2026.01.20", season: "겨울", experiences: ["산림욕", "약초 체험"], pointsEarned: 200, img: "https://images.unsplash.com/photo-1732253852563-6e30c9a7cc41?w=600&h=400&fit=crop", rotation: -2 },
  { id: 4, village: "강릉 바다마을", icon: "🐟", category: "체험마을", date: "2025.12.10", season: "겨울", experiences: ["어업 체험", "해산물 요리"], pointsEarned: 320, img: "https://images.unsplash.com/photo-1712990349963-ab5dbd54a450?w=600&h=400&fit=crop", rotation: 5 },
  { id: 5, village: "안동 하회마을", icon: "🏯", category: "전통마을", date: "2025.09.15", season: "가을", experiences: ["한옥 체험", "탈 만들기"], pointsEarned: 400, img: "https://images.unsplash.com/photo-1710388766264-07a47a416e93?w=600&h=400&fit=crop", rotation: -6 },
  { id: 6, village: "제주 감귤마을", icon: "🍊", category: "체험마을", date: "2025.11.05", season: "가을", experiences: ["감귤 따기"], pointsEarned: 180, img: "https://images.unsplash.com/photo-1668934802889-4408c9d33e4e?w=600&h=400&fit=crop", rotation: 2 },
  { id: 7, village: "하동 녹차마을", icon: "🍵", category: "체험마을", date: "2025.10.20", season: "가을", experiences: ["녹차 따기", "제다 체험"], pointsEarned: 250, img: "https://images.unsplash.com/photo-1760884966322-207bd5afdd77?w=600&h=400&fit=crop", rotation: -3 },
];

const achievements = [
  { id: 1, icon: "👣", name: "첫 발걸음", desc: "첫 마을 방문 완료", grade: "common", done: true, reward: "+500 EXP, +1,000P", dateEarned: "2025.09.15" },
  { id: 2, icon: "🗺️", name: "여행가", desc: "5개 마을 방문 달성", grade: "rare", done: true, reward: "+1,500 EXP", dateEarned: "2025.11.05" },
  { id: 3, icon: "🌍", name: "대탐험가", desc: "20개 마을 방문하기", grade: "epic", done: false, progress: "7/20", reward: "+5,000 EXP" },
  { id: 4, icon: "🌸", name: "사계절 여행", desc: "4계절 모두 방문하기", grade: "legendary", done: false, progress: "3/4", reward: "칭호: 사계절 여행가" },
  { id: 5, icon: "🌾", name: "첫 수확", desc: "첫 농업 체험 완료", grade: "common", done: true, reward: "+300 EXP", dateEarned: "2025.09.15" },
  { id: 6, icon: "🎨", name: "공예 마스터", desc: "공예 체험 10회 달성", grade: "epic", done: false, progress: "4/10", reward: "칭호: 공예 달인" },
  { id: 7, icon: "🍳", name: "요리왕", desc: "요리 체험 5회 달성", grade: "rare", done: false, progress: "2/5", reward: "+2,000 EXP" },
  { id: 8, icon: "🌅", name: "새벽 탐험", desc: "일출 시간에 방문하기", grade: "legendary", done: false, progress: "0/1", reward: "희귀 배지" },
  { id: 9, icon: "❓", name: "???", desc: "숨겨진 업적", grade: "hidden", done: false, reward: "???" },
];

const pointHistory = [
  { date: "2026.03.14", desc: "홍천 행복마을 딸기 체험", points: 150, type: "earn" },
  { date: "2026.03.12", desc: "AR 보물찾기 미션 완료", points: 100, type: "earn" },
  { date: "2026.03.10", desc: "양평 숙박비 할인 사용", points: -500, type: "use" },
  { date: "2026.03.01", desc: "홍천 행복마을 방문", points: 350, type: "earn" },
  { date: "2026.02.15", desc: "양평 달빛마을 방문", points: 280, type: "earn" },
  { date: "2026.02.10", desc: "특산품 구매 할인", points: -200, type: "use" },
  { date: "2026.01.20", desc: "가평 자연마을 방문", points: 200, type: "earn" },
  { date: "2025.12.10", desc: "강릉 바다마을 방문", points: 320, type: "earn" },
];

const gradeConfig: Record<string, { color: string; bg: string; border: string; label: string; glow: string }> = {
  common: { color: "#8B9DA7", bg: "rgba(139,157,167,0.08)", border: "rgba(139,157,167,0.2)", label: "일반", glow: "none" },
  rare: { color: "#4A90E2", bg: "rgba(74,144,226,0.08)", border: "rgba(74,144,226,0.25)", label: "희귀", glow: "0 0 20px rgba(74,144,226,0.15)" },
  epic: { color: "#9B59B6", bg: "rgba(155,89,182,0.08)", border: "rgba(155,89,182,0.25)", label: "영웅", glow: "0 0 24px rgba(155,89,182,0.2)" },
  legendary: { color: "#FFB800", bg: "rgba(255,184,0,0.08)", border: "rgba(255,184,0,0.3)", label: "전설", glow: "0 0 28px rgba(255,184,0,0.2)" },
  hidden: { color: "#555", bg: "rgba(85,85,85,0.06)", border: "rgba(85,85,85,0.15)", label: "???", glow: "none" },
};

const seasonColors: Record<string, string> = {
  "봄": "#FF8FAB", "여름": "#4CAF50", "가을": "#FF8C42", "겨울": "#64B5F6",
};

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function PassportPage() {
  const [tab, setTab] = useState<TabType>("passport");
  const [selectedStamp, setSelectedStamp] = useState<typeof stampCollection[0] | null>(null);
  const [stampFilter, setStampFilter] = useState<string>("all");
  const [achieveFilter, setAchieveFilter] = useState<string>("all");

  const tabs: { key: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "passport", label: "여권", icon: <Stamp size={16} /> },
    { key: "visits", label: "방문 기록", icon: <MapPin size={16} />, count: stampCollection.length },
    { key: "achievements", label: "업적", icon: <Award size={16} />, count: achievements.filter(a => a.done).length },
    { key: "points", label: "포인트", icon: <TrendingUp size={16} /> },
  ];

  const filteredStamps = stampFilter === "all" ? stampCollection : stampCollection.filter(s => s.category === stampFilter);
  const filteredAchievements = achieveFilter === "all" ? achievements
    : achieveFilter === "done" ? achievements.filter(a => a.done)
    : achievements.filter(a => !a.done && a.grade !== "hidden");

  const totalEarned = pointHistory.filter(p => p.type === "earn").reduce((s, p) => s + p.points, 0);
  const totalUsed = Math.abs(pointHistory.filter(p => p.type === "use").reduce((s, p) => s + p.points, 0));

  return (
    <div className="min-h-[calc(100vh-80px)]" style={{ background: "linear-gradient(165deg, #0F1A08 0%, #1A2E0A 30%, #1E3A12 60%, #152B0C 100%)" }}>
      {/* Decorative background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(45,80,22,0.15), transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,184,0,0.06), transparent 70%)" }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2D5016, #4A7023)" }}>
              <span style={{ fontSize: "20px" }}>🎫</span>
            </div>
            <div>
              <h1 className="text-white" style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>디지털 여권</h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>나의 농촌 여행 기록을 한눈에</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ═══ LEFT PANEL — Profile Passport Book ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:w-[400px] shrink-0"
          >
            {/* Passport Book Card */}
            <div className="rounded-[28px] overflow-hidden" style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}>
              {/* Passport Header */}
              <div className="relative px-6 pt-6 pb-4">
                {/* Holographic strip */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #FFB800, #4A90E2, #9B59B6, #FF6B35, #2D5016, #FFB800)" }} />

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "3px" }}>DIGITAL PASSPORT</span>
                  </div>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>KR-2024-001234</span>
                </div>

                {/* Avatar & Info */}
                <div className="flex items-start gap-5">
                  <div className="relative">
                    <div className="w-[88px] h-[88px] rounded-2xl overflow-hidden" style={{
                      background: "linear-gradient(135deg, #FFB800, #FFC933)",
                      padding: "3px",
                      boxShadow: "0 8px 24px rgba(255,184,0,0.25)",
                    }}>
                      <div className="w-full h-full rounded-[13px] bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex items-center justify-center">
                        <span style={{ fontSize: "36px" }}>👤</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] flex items-center justify-center" style={{ boxShadow: "0 2px 8px rgba(76,175,80,0.4)", border: "2px solid #1A2E0A" }}>
                      <span style={{ fontSize: "12px" }}>✓</span>
                    </div>
                  </div>

                  <div className="flex-1 pt-1">
                    <h2 className="text-white mb-0.5" style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.3px" }}>박민수</h2>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2" style={{ background: "linear-gradient(135deg, rgba(255,184,0,0.15), rgba(255,201,51,0.08))", border: "1px solid rgba(255,184,0,0.2)" }}>
                      <Sparkles size={11} color="#FFB800" />
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFB800" }}>농촌 탐험가 Lv.12</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>가입일: 2024.06.15</p>
                  </div>
                </div>
              </div>

              {/* EXP Progress */}
              <div className="px-6 pb-4">
                <div className="rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>다음 레벨까지</span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#4CAF50" }}>82%</span>
                  </div>
                  <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: "linear-gradient(90deg, #2D5016, #4CAF50)" }}
                      initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                    <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)", animation: "shimmer 2.5s infinite" }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>2,450 EXP</span>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>3,000 EXP</span>
                  </div>
                </div>
              </div>

              {/* Stat Chips */}
              <div className="px-6 pb-5">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: "📍", value: 15, label: "방문", color: "#4CAF50" },
                    { icon: "🎯", value: 28, label: "체험", color: "#4A90E2" },
                    { icon: "🎫", value: 34, label: "스탬프", color: "#FF6B35" },
                    { icon: "💰", value: 12500, label: "포인트", color: "#FFB800" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="rounded-xl p-2.5 text-center"
                      style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}18` }}
                    >
                      <span style={{ fontSize: "16px" }}>{stat.icon}</span>
                      <p className="text-white mt-0.5" style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.3px" }}>
                        <CountUp target={stat.value} />
                      </p>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Points Card */}
              <div className="mx-5 mb-5 rounded-2xl p-4 relative overflow-hidden" style={{
                background: "linear-gradient(135deg, rgba(255,184,0,0.12), rgba(255,201,51,0.06))",
                border: "1px solid rgba(255,184,0,0.2)",
              }}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,184,0,0.1), transparent 70%)", transform: "translate(30%,-30%)" }} />
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,184,0,0.7)" }}>보유 포인트</p>
                    <p className="text-white" style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px" }}>
                      <CountUp target={12500} /><span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>P</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,184,0,0.15)" }}>
                    <Gift size={18} color="#FFB800" />
                  </div>
                </div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>= ₩12,500 할인 사용 가능</p>
              </div>

              {/* Recent title badges */}
              <div className="px-5 pb-6">
                <p className="mb-2" style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.35)" }}>획득 칭호</p>
                <div className="flex flex-wrap gap-1.5">
                  {["🌾 농촌 탐험가", "🗺️ 여행가", "👣 첫 발걸음", "🌾 첫 수확"].map((title, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full" style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ═══ RIGHT PANEL — Content Area ═══ */}
          <motion.div className="flex-1 min-w-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            {/* Tab Navigation */}
            <div className="rounded-2xl p-1.5 flex gap-1 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {tabs.map((t) => {
                const isActive = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className="relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all"
                    style={{ fontSize: "13px", fontWeight: isActive ? 700 : 500, color: isActive ? "white" : "rgba(255,255,255,0.45)" }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                        layoutId="passportTab"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {t.icon}
                      <span className="hidden sm:inline">{t.label}</span>
                      {t.count !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-full" style={{
                          fontSize: "10px", fontWeight: 700,
                          background: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                          color: isActive ? "white" : "rgba(255,255,255,0.3)",
                        }}>{t.count}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {/* ════ PASSPORT TAB — Stamp Collection ════ */}
              {tab === "passport" && (
                <motion.div key="passport" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                  {/* Filters */}
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    {["all", "체험마을", "치유마을", "전통마을"].map(f => (
                      <button
                        key={f}
                        onClick={() => setStampFilter(f)}
                        className="px-3.5 py-1.5 rounded-full transition-all"
                        style={{
                          fontSize: "12px", fontWeight: stampFilter === f ? 700 : 500,
                          color: stampFilter === f ? "white" : "rgba(255,255,255,0.45)",
                          background: stampFilter === f ? "rgba(45,80,22,0.4)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${stampFilter === f ? "rgba(45,80,22,0.5)" : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        {f === "all" ? "전체" : f}
                      </button>
                    ))}
                    <span className="ml-auto" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                      {filteredStamps.length}개 수집
                    </span>
                  </div>

                  {/* Stamp Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredStamps.map((stamp, i) => (
                      <motion.div
                        key={stamp.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06, type: "spring", stiffness: 300 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedStamp(stamp)}
                      >
                        <div
                          className="rounded-[20px] p-1 transition-all group-hover:-translate-y-1.5"
                          style={{
                            background: "linear-gradient(145deg, rgba(255,184,0,0.25), rgba(255,184,0,0.05))",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                          }}
                        >
                          <div className="rounded-[16px] overflow-hidden" style={{
                            background: "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                            backdropFilter: "blur(10px)",
                          }}>
                            {/* Stamp image */}
                            <div className="relative h-[100px] overflow-hidden">
                              <ImageWithFallback src={stamp.img} alt={stamp.village} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6))" }} />
                              {/* Season tag */}
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
                                <span style={{ fontSize: "10px", fontWeight: 600, color: seasonColors[stamp.season] }}>{stamp.season}</span>
                              </div>
                              {/* Stamp icon overlay */}
                              <div className="absolute bottom-2 left-2" style={{ transform: `rotate(${stamp.rotation}deg)` }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,184,0,0.2)", backdropFilter: "blur(10px)", border: "2px solid rgba(255,184,0,0.4)" }}>
                                  <span style={{ fontSize: "20px" }}>{stamp.icon}</span>
                                </div>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                              <p className="text-white truncate" style={{ fontSize: "13px", fontWeight: 700 }}>{stamp.village}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar size={10} style={{ color: "rgba(255,255,255,0.35)" }} />
                                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>{stamp.date}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", fontWeight: 600, color: "#4CAF50", background: "rgba(76,175,80,0.1)" }}>
                                  +{stamp.pointsEarned}P
                                </span>
                                <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Locked stamps */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={`locked-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: filteredStamps.length * 0.06 + i * 0.04 }}
                      >
                        <div className="rounded-[20px] p-1" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="rounded-[16px] h-[190px] flex flex-col items-center justify-center" style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "2px dashed rgba(255,255,255,0.06)",
                          }}>
                            <span style={{ fontSize: "32px", opacity: 0.15 }}>🔒</span>
                            <p className="mt-2" style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>미발견 마을</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ════ VISITS TAB ════ */}
              {tab === "visits" && (
                <motion.div key="visits" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                  {/* Year summary */}
                  <div className="rounded-2xl p-5 mb-6 relative overflow-hidden" style={{
                    background: "linear-gradient(135deg, rgba(45,80,22,0.2), rgba(74,112,35,0.1))",
                    border: "1px solid rgba(45,80,22,0.25)",
                    backdropFilter: "blur(10px)",
                  }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(45,80,22,0.15), transparent 70%)", transform: "translate(30%,-30%)" }} />
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>2026년 방문 기록</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 4, label: "방문 마을", suffix: "곳", color: "#4CAF50" },
                        { value: 12, label: "체험 횟수", suffix: "회", color: "#4A90E2" },
                        { value: 3, label: "숙박 일수", suffix: "박", color: "#FF6B35" },
                      ].map((s, i) => (
                        <div key={i} className="text-center">
                          <p className="text-white" style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px" }}>
                            <CountUp target={s.value} duration={800} /><span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>{s.suffix}</span>
                          </p>
                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[23px] top-0 bottom-0 w-px hidden sm:block" style={{ background: "linear-gradient(180deg, rgba(45,80,22,0.4), rgba(45,80,22,0.1))" }} />

                    <div className="space-y-4">
                      {stampCollection.map((visit, i) => (
                        <motion.div
                          key={visit.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="relative flex gap-4 group"
                        >
                          {/* Timeline dot */}
                          <div className="hidden sm:flex shrink-0 w-[46px] items-start pt-5 justify-center relative z-10">
                            <div className="w-3 h-3 rounded-full" style={{ background: seasonColors[visit.season], boxShadow: `0 0 12px ${seasonColors[visit.season]}40` }} />
                          </div>

                          {/* Card */}
                          <div className="flex-1 rounded-[20px] overflow-hidden group-hover:-translate-y-0.5 transition-transform" style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            backdropFilter: "blur(10px)",
                          }}>
                            <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-[160px] h-[120px] sm:h-auto relative overflow-hidden shrink-0">
                                <ImageWithFallback src={visit.img} alt={visit.village} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 60%, rgba(0,0,0,0.4))" }} />
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span style={{ fontSize: "18px" }}>{visit.icon}</span>
                                      <h4 className="text-white" style={{ fontSize: "16px", fontWeight: 700 }}>{visit.village}</h4>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 600, color: seasonColors[visit.season], background: `${seasonColors[visit.season]}15` }}>
                                        {visit.season}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 600, color: "#4A90E2", background: "rgba(74,144,226,0.1)" }}>
                                        {visit.category}
                                      </span>
                                    </div>
                                  </div>
                                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{visit.date}</span>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {visit.experiences.map((exp, j) => (
                                    <span key={j} className="px-2.5 py-1 rounded-lg" style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.05)" }}>
                                      {exp}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                  <span className="flex items-center gap-1" style={{ fontSize: "11px", fontWeight: 600, color: "#FFB800" }}>
                                    <Stamp size={11} /> 스탬프 +1
                                  </span>
                                  <span className="flex items-center gap-1" style={{ fontSize: "11px", fontWeight: 600, color: "#4CAF50" }}>
                                    <TrendingUp size={11} /> +{visit.pointsEarned}P
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ════ ACHIEVEMENTS TAB ════ */}
              {tab === "achievements" && (
                <motion.div key="achievements" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                  {/* Stats bar */}
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.15)" }}>
                      <Star size={14} color="#4CAF50" />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#4CAF50" }}>{achievements.filter(a => a.done).length}/{achievements.filter(a => a.grade !== "hidden").length}</span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>달성</span>
                    </div>
                    <div className="flex gap-1.5 ml-auto">
                      {["all", "done", "progress"].map(f => (
                        <button key={f} onClick={() => setAchieveFilter(f)} className="px-3 py-1.5 rounded-full transition-all" style={{
                          fontSize: "11px", fontWeight: achieveFilter === f ? 700 : 500,
                          color: achieveFilter === f ? "white" : "rgba(255,255,255,0.4)",
                          background: achieveFilter === f ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${achieveFilter === f ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
                        }}>
                          {f === "all" ? "전체" : f === "done" ? "완료" : "진행중"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredAchievements.map((ach, i) => {
                      const gc = gradeConfig[ach.grade];
                      const progressNum = ach.progress ? parseInt(ach.progress) / parseInt(ach.progress.split("/")[1]) * 100 : 0;
                      return (
                        <motion.div
                          key={ach.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-[18px] p-4 transition-all hover:-translate-y-0.5"
                          style={{
                            background: gc.bg,
                            border: `1px solid ${gc.border}`,
                            boxShadow: ach.done ? gc.glow : "none",
                            opacity: ach.grade === "hidden" ? 0.5 : 1,
                          }}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{
                              background: `${gc.color}12`,
                              border: `1.5px solid ${gc.color}30`,
                            }}>
                              <span style={{ fontSize: "24px" }}>{ach.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="text-white truncate" style={{ fontSize: "14px", fontWeight: 700 }}>{ach.name}</h4>
                                <span className="shrink-0 px-2 py-0.5 rounded-full" style={{ fontSize: "9px", fontWeight: 700, color: gc.color, background: `${gc.color}15`, border: `1px solid ${gc.color}25`, letterSpacing: "0.5px" }}>
                                  {gc.label}
                                </span>
                              </div>
                              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{ach.desc}</p>

                              {/* Progress bar for incomplete */}
                              {!ach.done && ach.progress && ach.grade !== "hidden" && (
                                <div className="mt-2.5">
                                  <div className="flex justify-between mb-1">
                                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{ach.progress}</span>
                                    <span style={{ fontSize: "10px", color: gc.color }}>{Math.round(progressNum)}%</span>
                                  </div>
                                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <motion.div
                                      className="h-full rounded-full"
                                      style={{ background: `linear-gradient(90deg, ${gc.color}80, ${gc.color})` }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progressNum}%` }}
                                      transition={{ duration: 0.8, delay: i * 0.08 }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Completed state */}
                              {ach.done && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="px-2.5 py-1 rounded-full" style={{ fontSize: "10px", fontWeight: 700, color: "#4CAF50", background: "rgba(76,175,80,0.12)", border: "1px solid rgba(76,175,80,0.2)" }}>
                                    ✓ 완료
                                  </span>
                                  {ach.dateEarned && (
                                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{ach.dateEarned}</span>
                                  )}
                                </div>
                              )}

                              {/* Reward */}
                              <div className="mt-2 flex items-center gap-1">
                                <Gift size={10} style={{ color: "rgba(255,255,255,0.25)" }} />
                                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{ach.reward}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ════ POINTS TAB ════ */}
              {tab === "points" && (
                <motion.div key="points" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                  {/* Balance hero card */}
                  <div className="rounded-[24px] p-6 mb-6 relative overflow-hidden" style={{
                    background: "linear-gradient(135deg, #B8860B, #DAA520, #FFB800)",
                    boxShadow: "0 16px 48px rgba(255,184,0,0.25)",
                  }}>
                    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)" }} />
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)", transform: "translate(30%,-30%)" }} />
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,0,0,0.1), transparent 70%)", transform: "translate(-20%,20%)" }} />

                    <div className="relative z-10">
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(0,0,0,0.4)" }}>보유 포인트</p>
                      <p style={{ fontSize: "44px", fontWeight: 900, color: "#1A1A1A", letterSpacing: "-2px" }}>
                        <CountUp target={12500} />P
                      </p>
                      <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.4)" }}>= ₩12,500 할인 가능</p>

                      <div className="flex gap-3 mt-4">
                        <div className="px-4 py-2 rounded-xl" style={{ background: "rgba(0,0,0,0.1)" }}>
                          <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)" }}>총 적립</p>
                          <p style={{ fontSize: "16px", fontWeight: 800, color: "#1A1A1A" }}>+<CountUp target={totalEarned} />P</p>
                        </div>
                        <div className="px-4 py-2 rounded-xl" style={{ background: "rgba(0,0,0,0.1)" }}>
                          <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)" }}>총 사용</p>
                          <p style={{ fontSize: "16px", fontWeight: 800, color: "#1A1A1A" }}>-<CountUp target={totalUsed} />P</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usage options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    {[
                      { icon: "🏠", title: "숙박 할인", desc: "100P = ₩100", max: "최대 30%", color: "#4CAF50" },
                      { icon: "🎯", title: "체험 할인", desc: "100P = ₩100", max: "최대 20%", color: "#4A90E2" },
                      { icon: "🛒", title: "특산품 할인", desc: "100P = ₩100", max: "최대 50%", color: "#FF6B35" },
                    ].map((use, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="rounded-[18px] p-4 hover:-translate-y-0.5 transition-transform cursor-pointer group"
                        style={{
                          background: `${use.color}08`,
                          border: `1px solid ${use.color}18`,
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span style={{ fontSize: "28px" }}>{use.icon}</span>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: "white" }} />
                        </div>
                        <h4 className="text-white" style={{ fontSize: "15px", fontWeight: 700 }}>{use.title}</h4>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{use.desc}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 700, color: use.color, background: `${use.color}15` }}>
                          {use.max}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Transaction history */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} style={{ color: "rgba(255,255,255,0.35)" }} />
                      <h3 className="text-white" style={{ fontSize: "15px", fontWeight: 700 }}>적립/사용 내역</h3>
                    </div>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{pointHistory.length}건</span>
                  </div>

                  <div className="rounded-[18px] overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    {pointHistory.map((tx, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
                        style={{ borderBottom: i < pointHistory.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
                            background: tx.type === "earn" ? "rgba(76,175,80,0.1)" : "rgba(255,107,53,0.1)",
                          }}>
                            {tx.type === "earn" ?
                              <ArrowUpRight size={14} color="#4CAF50" /> :
                              <ArrowDownRight size={14} color="#FF6B35" />
                            }
                          </div>
                          <div>
                            <p className="text-white" style={{ fontSize: "13px", fontWeight: 600 }}>{tx.desc}</p>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{tx.date}</p>
                          </div>
                        </div>
                        <span style={{
                          fontSize: "14px", fontWeight: 700,
                          color: tx.type === "earn" ? "#4CAF50" : "#FF6B35",
                        }}>
                          {tx.type === "earn" ? "+" : ""}{tx.points.toLocaleString()}P
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ═══ STAMP DETAIL MODAL ═══ */}
      <AnimatePresence>
        {selectedStamp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
            onClick={() => setSelectedStamp(null)}
          >
            <motion.div
              className="w-full max-w-[480px] rounded-[28px] overflow-hidden"
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                background: "linear-gradient(160deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image header */}
              <div className="relative h-[220px] overflow-hidden">
                <ImageWithFallback src={selectedStamp.img} alt={selectedStamp.village} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)" }} />

                <button
                  onClick={() => setSelectedStamp(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
                  style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}
                >
                  <X size={18} />
                </button>

                {/* Stamp overlay */}
                <div className="absolute bottom-4 left-5 flex items-end gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
                    background: "rgba(255,184,0,0.2)", backdropFilter: "blur(12px)",
                    border: "2px solid rgba(255,184,0,0.4)",
                    transform: `rotate(${selectedStamp.rotation}deg)`,
                  }}>
                    <span style={{ fontSize: "28px" }}>{selectedStamp.icon}</span>
                  </div>
                  <div className="pb-0.5">
                    <h3 className="text-white" style={{ fontSize: "22px", fontWeight: 800, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{selectedStamp.village}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 600, color: seasonColors[selectedStamp.season], background: `${seasonColors[selectedStamp.season]}25` }}>
                        {selectedStamp.season}
                      </span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{selectedStamp.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Category */}
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{selectedStamp.category}</span>
                </div>

                {/* Experiences */}
                <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="mb-2.5" style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>체험 활동</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStamp.experiences.map((exp, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.8)", background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.15)" }}>
                        <span style={{ color: "#4CAF50" }}>✓</span> {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rewards */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl p-3.5 text-center" style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.15)" }}>
                    <Stamp size={18} className="mx-auto mb-1" color="#FFB800" />
                    <p className="text-white" style={{ fontSize: "14px", fontWeight: 700 }}>스탬프 획득</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>컬렉션에 추가됨</p>
                  </div>
                  <div className="rounded-xl p-3.5 text-center" style={{ background: "rgba(76,175,80,0.06)", border: "1px solid rgba(76,175,80,0.15)" }}>
                    <TrendingUp size={18} className="mx-auto mb-1" color="#4CAF50" />
                    <p className="text-white" style={{ fontSize: "14px", fontWeight: 700 }}>+{selectedStamp.pointsEarned}P</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>포인트 적립</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStamp(null)}
                  className="w-full py-3.5 rounded-2xl text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #2D5016, #4A7023)", fontSize: "14px", fontWeight: 700 }}
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
