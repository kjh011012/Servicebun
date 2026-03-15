import { useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const kidsMissions = [
  { icon: "🎁", name: "숨겨진 보물 찾기", difficulty: 2, time: "15~20분", reward: "스탬프 + 100P" },
  { icon: "🐰", name: "동물 친구 찾기", difficulty: 1, time: "10~15분", reward: "스탬프 + 50P" },
  { icon: "🦋", name: "나비 잡기 게임", difficulty: 3, time: "5분", reward: "스탬프 + 150P" },
  { icon: "🌼", name: "들꽃 도감 완성", difficulty: 2, time: "20~30분", reward: "스탬프 + 80P" },
];

const adultMissions = [
  { icon: "🌿", name: "약초 & 산나물 도감", difficulty: 3, time: "40분", reward: "스탬프 + 180P" },
  { icon: "🏛️", name: "마을 역사 탐방", difficulty: 2, time: "30분", reward: "스탬프 + 150P" },
  { icon: "🌄", name: "전망 포인트 정복", difficulty: 3, time: "60분", reward: "스탬프 + 200P" },
  { icon: "📖", name: "마을 이야기 수집", difficulty: 3, time: "45분", reward: "스탬프 + 250P" },
];

export function MetaverseSection() {
  const [activeTab, setActiveTab] = useState<"kids" | "adults">("kids");
  const currentMissions = activeTab === "kids" ? kidsMissions : adultMissions;

  return (
    <section className="bg-white py-20 lg:py-[120px]">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-5 py-2 rounded-[20px] mb-5"
            style={{ background: "rgba(255,107,53,0.15)", fontSize: "14px", fontWeight: 700, color: "#FF6B35" }}
          >
            📱 방문 중 체험
          </span>

          <h2
            className="mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#1A1A1A" }}
          >
            AR로 마을 곳곳을 탐험하세요
          </h2>
          <p
            className="max-w-[600px] mx-auto"
            style={{ fontSize: "18px", color: "#666", lineHeight: 1.6 }}
          >
            아이도 어른도 즐거운 AR 체험 미션!
            <br />
            스마트폰으로 보물찾기, 자연 해설, 포토 챌린지를 즐기세요
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left - AR Demo Image */}
          <div className="lg:w-1/2">
            <div className="relative rounded-[24px] overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1499794639208-09ad880378c6?w=800&h=600&fit=crop"
                alt="AR 체험"
                className="w-full"
                style={{ aspectRatio: "4/3", objectFit: "cover" }}
              />

              {/* AR overlay elements */}
              <div className="absolute inset-0">
                {/* Treasure */}
                <div className="absolute top-[30%] left-[25%] animate-bounce">
                  <div className="w-14 h-14 rounded-full bg-[#FFB800]/80 flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(255,184,0,0.5)" }}>
                    <span style={{ fontSize: "24px" }}>🎁</span>
                  </div>
                </div>

                {/* Animal */}
                <div className="absolute top-[55%] right-[20%]" style={{ animation: "floatAR 3s ease-in-out infinite" }}>
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <span style={{ fontSize: "20px" }}>🐰</span>
                  </div>
                </div>

                {/* Flower */}
                <div className="absolute bottom-[25%] left-[60%]" style={{ animation: "floatAR 2.5s ease-in-out 0.5s infinite" }}>
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <span style={{ fontSize: "18px" }}>🌸</span>
                  </div>
                </div>

                {/* Direction indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2" style={{ fontSize: "13px" }}>
                  📍 보물까지 12m 앞
                </div>

                {/* Progress */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-xl" style={{ fontSize: "14px", fontWeight: 700 }}>
                  🎁 3/5
                </div>
              </div>
            </div>
          </div>

          {/* Right - Mission Preview */}
          <div className="lg:w-1/2">
            {/* Tab switch */}
            <div className="flex bg-[#F5F7FA] rounded-xl p-1 mb-6">
              {[
                { key: "kids" as const, label: "👶 아이 미션", count: kidsMissions.length },
                { key: "adults" as const, label: "👨 어른 미션", count: adultMissions.length },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex-1 py-3 rounded-lg transition-all ${
                    activeTab === t.key ? "bg-white text-[#FF6B35] shadow" : "text-[#666]"
                  }`}
                  style={{ fontSize: "15px", fontWeight: activeTab === t.key ? 700 : 500 }}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            {/* Mission cards */}
            <div className="flex flex-col gap-3 mb-8">
              {currentMissions.map((mission, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[16px] p-4 flex items-center gap-4 border border-[#E5E5E5] hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5A)", fontSize: "24px" }}
                  >
                    {mission.icon}
                  </div>
                  <div className="flex-1">
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A" }}>{mission.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        {"⭐".repeat(mission.difficulty)}{"☆".repeat(3 - mission.difficulty)}
                      </span>
                      <span style={{ fontSize: "12px", color: "#999" }}>⏱️ {mission.time}</span>
                      <span style={{ fontSize: "12px", color: "#FFB800", fontWeight: 600 }}>🎫 {mission.reward}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/ar-experience"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[28px] text-white transition-all hover:-translate-y-0.5"
              style={{ fontSize: "16px", fontWeight: 700, background: "linear-gradient(135deg, #FF6B35, #FF8F5A)", boxShadow: "0 8px 24px rgba(255,107,53,0.3)" }}
            >
              📱 전체 미션 보기
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatAR { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </section>
  );
}
