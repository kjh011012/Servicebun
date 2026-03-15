import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { X } from "lucide-react";

type TabType = "passport" | "visits" | "achievements" | "points";

const stampCollection = [
  { id: 1, village: "홍천 행복마을", icon: "🍓", category: "체험마을", date: "2026.03.01", experiences: ["딸기 따기", "도자기 만들기"], pointsEarned: 350, img: "https://images.unsplash.com/photo-1593301333770-29d3df13178f?w=400&h=300&fit=crop" },
  { id: 2, village: "양평 달빛마을", icon: "🌙", category: "치유마을", date: "2026.02.15", experiences: ["힐링 산책", "명상 체험"], pointsEarned: 280, img: "https://images.unsplash.com/photo-1577328284865-56f2943d785d?w=400&h=300&fit=crop" },
  { id: 3, village: "가평 자연마을", icon: "🌿", category: "치유마을", date: "2026.01.20", experiences: ["산림욕", "약초 체험"], pointsEarned: 200, img: "https://images.unsplash.com/photo-1577328284865-56f2943d785d?w=400&h=300&fit=crop" },
  { id: 4, village: "강릉 바다마을", icon: "🐟", category: "체험마을", date: "2025.12.10", experiences: ["어업 체험", "해산물 요리"], pointsEarned: 320, img: "https://images.unsplash.com/photo-1608335715837-1994a535d5c3?w=400&h=300&fit=crop" },
  { id: 5, village: "안동 하회마을", icon: "🏯", category: "전통마을", date: "2025.09.15", experiences: ["한옥 체험", "탈 만들기"], pointsEarned: 400, img: "https://images.unsplash.com/photo-1650476524542-c5cc53306700?w=400&h=300&fit=crop" },
  { id: 6, village: "제주 감귤마을", icon: "🍊", category: "체험마을", date: "2025.11.05", experiences: ["감귤 따기"], pointsEarned: 180, img: "https://images.unsplash.com/photo-1700062958217-74353a136ed8?w=400&h=300&fit=crop" },
  { id: 7, village: "하동 녹차마을", icon: "🍵", category: "체험마을", date: "2025.10.20", experiences: ["녹차 따기", "제다 체험"], pointsEarned: 250, img: "https://images.unsplash.com/photo-1577328284865-56f2943d785d?w=400&h=300&fit=crop" },
];

const achievements = [
  { id: 1, icon: "👣", name: "첫 발걸음", desc: "첫 마을 방문", grade: "common", done: true, reward: "+500 EXP, +1,000P" },
  { id: 2, icon: "🗺️", name: "여행가", desc: "5개 마을 방문", grade: "rare", done: true, reward: "+1,500 EXP" },
  { id: 3, icon: "🌍", name: "대탐험가", desc: "20개 마을 방문", grade: "epic", done: false, progress: "7/20", reward: "+5,000 EXP" },
  { id: 4, icon: "🌸", name: "사계절 여행", desc: "4계절 모두 방문", grade: "legendary", done: false, progress: "3/4", reward: "칭호: 사계절 여행가" },
  { id: 5, icon: "🌾", name: "첫 수확", desc: "첫 농업 체험", grade: "common", done: true, reward: "+300 EXP" },
  { id: 6, icon: "🎨", name: "공예 마스터", desc: "공예 체험 10회", grade: "epic", done: false, progress: "4/10", reward: "칭호: 공예 달인" },
  { id: 7, icon: "🍳", name: "요리왕", desc: "요리 체험 5회", grade: "rare", done: false, progress: "2/5", reward: "+2,000 EXP" },
  { id: 8, icon: "🌅", name: "새벽 탐험", desc: "일출 시간 방문", grade: "legendary", done: false, progress: "0/1", reward: "희귀 배지" },
  { id: 9, icon: "❓", name: "???", desc: "숨겨진 업적", grade: "hidden", done: false, reward: "???" },
];

const pointHistory = [
  { date: "2026.03.14", desc: "홍천 행복마을 딸기 체험", points: 150, type: "earn" },
  { date: "2026.03.12", desc: "AR 보물찾기 미션 완료", points: 100, type: "earn" },
  { date: "2026.03.10", desc: "양평 숙박비 할인 사용", points: -500, type: "use" },
  { date: "2026.03.01", desc: "홍천 행복마을 방문", points: 350, type: "earn" },
  { date: "2026.02.15", desc: "양평 달빛마을 방문", points: 280, type: "earn" },
  { date: "2026.02.10", desc: "특산품 구매 할인", points: -200, type: "use" },
];

const gradeColors: Record<string, { color: string; bg: string }> = {
  common: { color: "#9E9E9E", bg: "rgba(158,158,158,0.1)" },
  rare: { color: "#4A90E2", bg: "rgba(74,144,226,0.1)" },
  epic: { color: "#9B59B6", bg: "rgba(155,89,182,0.1)" },
  legendary: { color: "#FFB800", bg: "rgba(255,184,0,0.1)" },
  hidden: { color: "#666", bg: "rgba(102,102,102,0.1)" },
};

export function PassportPage() {
  const [tab, setTab] = useState<TabType>("passport");
  const [selectedStamp, setSelectedStamp] = useState<typeof stampCollection[0] | null>(null);

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: "passport", label: "여권", icon: "🏠" },
    { key: "visits", label: "방문 기록", icon: "🗺️" },
    { key: "achievements", label: "업적", icon: "🏆" },
    { key: "points", label: "포인트", icon: "💰" },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 lg:p-10" style={{ background: "linear-gradient(180deg, #1A2E0A, #2D5016)" }}>
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Profile */}
        <div className="lg:w-[380px] rounded-3xl p-6 lg:p-8 shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex flex-col items-center mb-6">
            <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #FFB800, #FFC933)", boxShadow: "0 8px 24px rgba(255,184,0,0.4)", padding: "4px" }}>
              <div className="w-full h-full rounded-full bg-[#1E293B] flex items-center justify-center">
                <span style={{ fontSize: "40px" }}>👤</span>
              </div>
            </div>
            <h2 className="text-white mb-1" style={{ fontSize: "26px", fontWeight: 700 }}>박민수</h2>
            <p className="mb-3" style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>KR-2024-001234</p>
            <div className="px-4 py-1.5 rounded-2xl" style={{ background: "linear-gradient(135deg, #FFB800, #FFC933)", fontSize: "13px", fontWeight: 700, color: "#1A1A1A" }}>
              🌾 농촌 탐험가 Lv.12
            </div>
          </div>

          {/* EXP Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>경험치</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>2,450 / 3,000 EXP</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full" style={{ width: "82%", background: "linear-gradient(90deg, #2D5016, #4A7023)" }} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: "📍", value: "15", label: "방문 마을" },
              { icon: "🎯", value: "28", label: "완료 체험" },
              { icon: "🎫", value: "34", label: "수집 스탬프" },
              { icon: "💰", value: "12,500", label: "보유 포인트" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <span style={{ fontSize: "20px" }}>{stat.icon}</span>
                <p className="text-white mt-1" style={{ fontSize: "22px", fontWeight: 700 }}>{stat.value}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Point balance */}
          <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, rgba(255,184,0,0.15), rgba(255,201,51,0.1))", border: "1px solid rgba(255,184,0,0.3)" }}>
            <p style={{ fontSize: "12px", color: "#FFB800", fontWeight: 600 }}>보유 포인트</p>
            <p className="text-white mt-1" style={{ fontSize: "32px", fontWeight: 900 }}>
              12,500<span style={{ fontSize: "16px" }}>P</span>
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>= 12,500원 할인 가능</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1">
          {/* Tab Nav */}
          <div className="rounded-2xl p-1 flex gap-1 mb-6" style={{ background: "rgba(255,255,255,0.05)" }}>
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-3 rounded-xl transition-colors ${tab === t.key ? "bg-white/10 text-white" : "text-white/60 hover:text-white/80"}`} style={{ fontSize: "14px", fontWeight: tab === t.key ? 700 : 400 }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* PASSPORT TAB */}
          {tab === "passport" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {stampCollection.map((stamp) => (
                <div
                  key={stamp.id}
                  className="rounded-[20px] p-4 cursor-pointer hover:-translate-y-1 transition-all text-center"
                  style={{ background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,184,0,0.3)" }}
                  onClick={() => setSelectedStamp(stamp)}
                >
                  <span style={{ fontSize: "48px" }}>{stamp.icon}</span>
                  <p className="text-white mt-2" style={{ fontSize: "14px", fontWeight: 700 }}>{stamp.village}</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{stamp.date}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full" style={{ fontSize: "10px", color: "#FFB800", background: "rgba(255,184,0,0.15)" }}>
                    {stamp.category}
                  </span>
                </div>
              ))}
              {/* Locked stamps */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`locked-${i}`} className="rounded-[20px] p-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize: "48px", opacity: 0.2 }}>🔒</span>
                  <p className="text-white/30 mt-2" style={{ fontSize: "14px" }}>???</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>미방문</p>
                </div>
              ))}
            </div>
          )}

          {/* VISITS TAB */}
          {tab === "visits" && (
            <div className="space-y-4">
              <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(45,80,22,0.3), rgba(74,112,35,0.2))", border: "1px solid rgba(45,80,22,0.4)" }}>
                <p className="text-white/60" style={{ fontSize: "13px" }}>2026년 방문 기록</p>
                <div className="flex gap-8 mt-2">
                  <div><span className="text-white" style={{ fontSize: "28px", fontWeight: 900 }}>4</span><span className="text-white/50 ml-1" style={{ fontSize: "14px" }}>곳</span></div>
                  <div><span className="text-white" style={{ fontSize: "28px", fontWeight: 900 }}>12</span><span className="text-white/50 ml-1" style={{ fontSize: "14px" }}>체험</span></div>
                  <div><span className="text-white" style={{ fontSize: "28px", fontWeight: 900 }}>3</span><span className="text-white/50 ml-1" style={{ fontSize: "14px" }}>박</span></div>
                </div>
              </div>

              {stampCollection.map((visit) => (
                <div key={visit.id} className="flex gap-4 rounded-[16px] p-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <div className="w-[100px] h-[80px] rounded-xl overflow-hidden shrink-0">
                    <ImageWithFallback src={visit.img} alt={visit.village} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white" style={{ fontSize: "16px", fontWeight: 700 }}>{visit.village}</h4>
                      <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", color: "#4A90E2", background: "rgba(74,144,226,0.15)" }}>{visit.category}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>📅 {visit.date}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>체험: {visit.experiences.join(", ")}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span style={{ fontSize: "12px", color: "#FFB800" }}>🎫 스탬프 +1</span>
                      <span style={{ fontSize: "12px", color: "#4CAF50" }}>💰 +{visit.pointsEarned}P</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {tab === "achievements" && (
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex items-center gap-4 p-4 rounded-[16px]" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${ach.done ? gradeColors[ach.grade].color + "40" : "rgba(255,255,255,0.08)"}`, opacity: ach.grade === "hidden" ? 0.5 : 1 }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: gradeColors[ach.grade].bg, border: `2px solid ${gradeColors[ach.grade].color}40` }}>
                    <span style={{ fontSize: "28px" }}>{ach.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white" style={{ fontSize: "15px", fontWeight: 700 }}>{ach.name}</h4>
                      <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 600, color: gradeColors[ach.grade].color, background: gradeColors[ach.grade].bg }}>
                        {ach.grade === "hidden" ? "???" : ach.grade.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{ach.desc}</p>
                    {!ach.done && ach.progress && (
                      <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden w-32">
                        <div className="h-full rounded-full" style={{ width: `${parseInt(ach.progress) / parseInt(ach.progress.split("/")[1]) * 100}%`, background: gradeColors[ach.grade].color }} />
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {ach.done ? (
                      <span className="px-3 py-1.5 rounded-full bg-[#4CAF50]/20 text-[#4CAF50]" style={{ fontSize: "12px", fontWeight: 600 }}>완료 ✓</span>
                    ) : ach.progress ? (
                      <span className="text-white/40" style={{ fontSize: "12px" }}>{ach.progress}</span>
                    ) : null}
                    <p className="mt-1" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{ach.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* POINTS TAB */}
          {tab === "points" && (
            <div>
              {/* Points balance card */}
              <div className="rounded-2xl p-6 mb-6" style={{ background: "linear-gradient(135deg, #FFB800, #FFC933)" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(0,0,0,0.5)" }}>보유 포인트</p>
                <p style={{ fontSize: "48px", fontWeight: 900, color: "#1A1A1A" }}>12,500P</p>
                <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.5)" }}>= 12,500원 할인 가능</p>
              </div>

              {/* Point usage cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: "🏠", title: "숙박 할인", desc: "100P = 100원 할인", max: "최대 30% 할인" },
                  { icon: "🎯", title: "체험 할인", desc: "100P = 100원 할인", max: "최대 20% 할인" },
                  { icon: "🛒", title: "특산품 할인", desc: "100P = 100원 할인", max: "최대 50% 할인" },
                ].map((use, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <span style={{ fontSize: "28px" }}>{use.icon}</span>
                    <h4 className="text-white mt-2" style={{ fontSize: "15px", fontWeight: 700 }}>{use.title}</h4>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{use.desc}</p>
                    <p style={{ fontSize: "11px", color: "#FFB800" }}>{use.max}</p>
                  </div>
                ))}
              </div>

              {/* Transaction history */}
              <h3 className="text-white mb-3" style={{ fontSize: "16px", fontWeight: 700 }}>적립/사용 내역</h3>
              <div className="space-y-2">
                {pointHistory.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div>
                      <p className="text-white" style={{ fontSize: "14px", fontWeight: 600 }}>{tx.desc}</p>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{tx.date}</p>
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: tx.type === "earn" ? "#4CAF50" : "#FF6B35" }}>
                      {tx.type === "earn" ? "+" : ""}{tx.points}P
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stamp Detail Modal */}
      {selectedStamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.9)" }}>
          <div className="w-full max-w-[500px] rounded-[24px] overflow-hidden" style={{ background: "rgba(30,41,59,0.95)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <div className="relative h-[200px]">
              <ImageWithFallback src={selectedStamp.img} alt={selectedStamp.village} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedStamp(null)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <span style={{ fontSize: "64px" }}>{selectedStamp.icon}</span>
                <h3 className="text-white mt-2" style={{ fontSize: "24px", fontWeight: 700 }}>{selectedStamp.village}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>📅 {selectedStamp.date} · {selectedStamp.category}</p>
              </div>
              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-white/60 mb-2" style={{ fontSize: "13px", fontWeight: 600 }}>체험 활동</p>
                {selectedStamp.experiences.map((exp, i) => (
                  <p key={i} className="text-white" style={{ fontSize: "14px" }}>✅ {exp}</p>
                ))}
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "rgba(255,184,0,0.1)" }}>
                  <span style={{ fontSize: "20px" }}>🎫</span>
                  <p className="text-white mt-1" style={{ fontSize: "14px", fontWeight: 600 }}>스탬프 획득</p>
                </div>
                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "rgba(76,175,80,0.1)" }}>
                  <span style={{ fontSize: "20px" }}>💰</span>
                  <p className="text-white mt-1" style={{ fontSize: "14px", fontWeight: 600 }}>+{selectedStamp.pointsEarned}P</p>
                </div>
              </div>
              <button onClick={() => setSelectedStamp(null)} className="w-full py-3 rounded-2xl bg-[#2D5016] text-white" style={{ fontSize: "15px", fontWeight: 700 }}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
