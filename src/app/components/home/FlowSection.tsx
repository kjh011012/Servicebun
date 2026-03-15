import { useState } from "react";
import { Link } from "react-router";

const steps = [
  {
    num: "01",
    icon: "🤖",
    title: "AI 마을 큐레이터",
    desc: "실제 마을 촌장님이\n당신만의 여행을 설계합니다",
    tags: ["계절별 추천", "가족 맞춤", "일정 설계"],
    gradient: "from-[#4A90E2] to-[#6BA5E7]",
    color: "#4A90E2",
    tagBg: "#F0F9FF",
    path: "/ai-chat",
    phase: "방문 전",
  },
  {
    num: "02",
    icon: "🌐",
    title: "마을 미리보기",
    desc: "숙소 내부부터 체험장까지\n360°로 미리 확인하세요",
    tags: ["숙소 투어", "체험장", "마을 지도"],
    gradient: "from-[#9B59B6] to-[#B97FC9]",
    color: "#9B59B6",
    tagBg: "#F5F0FF",
    path: "/vr-preview",
    phase: "방문 전",
  },
  {
    num: "03",
    icon: "🏘️",
    title: "마을 방문",
    desc: "AI가 추천한 마을로\n실제 방문을 시작합니다",
    tags: ["체크인", "환영 선물", "안내"],
    gradient: "from-[#2D5016] to-[#4A7023]",
    color: "#2D5016",
    tagBg: "#F0FFF4",
    phase: "방문 중",
  },
  {
    num: "04",
    icon: "📱",
    title: "AR 체험/미션",
    desc: "아이는 보��찾기,\n어른은 농촌 해설 체험",
    tags: ["미션 게임", "보물찾기", "자연 해설"],
    gradient: "from-[#FF6B35] to-[#FF8F5A]",
    color: "#FF6B35",
    tagBg: "#FFF5F0",
    path: "/ar-experience",
    phase: "방문 중",
  },
  {
    num: "05",
    icon: "🎫",
    title: "여권 스탬프",
    desc: "모든 체험이 기록되고\n스탬프가 쌓입니다",
    tags: ["체험 기록", "레벨업", "배지"],
    gradient: "from-[#10B981] to-[#34D399]",
    color: "#10B981",
    tagBg: "#F0FDF4",
    path: "/passport",
    phase: "방문 후",
  },
  {
    num: "06",
    icon: "💰",
    title: "포인트 적립",
    desc: "체험마다 포인트 적립\n다음 여행에 사용하세요",
    tags: ["할인 혜택", "특산품", "재방문 보상"],
    gradient: "from-[#FFB800] to-[#FFC933]",
    color: "#FFB800",
    tagBg: "#FFFBEB",
    path: "/passport",
    phase: "지속",
  },
];

export function FlowSection() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 lg:py-[120px]">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2
          className="text-center mb-4"
          style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#1A1A1A" }}
        >
          6단계로 완성되는 농촌 여행
        </h2>
        <p className="text-center mb-12 max-w-[500px] mx-auto" style={{ fontSize: "18px", color: "#666", lineHeight: 1.6 }}>
          상담부터 체험, 기록, 보상까지
          <br />
          하나로 연결됩니다
        </p>

        {/* Phase labels */}
        <div className="flex justify-center gap-4 mb-8">
          {["방문 전", "방문 중", "방문 후", "지속"].map((phase, i) => (
            <span
              key={i}
              className="px-4 py-1.5 rounded-full"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: ["#4A90E2", "#2D5016", "#10B981", "#FFB800"][i],
                background: ["#F0F9FF", "#F0FFF4", "#F0FDF4", "#FFFBEB"][i],
              }}
            >
              {phase}
            </span>
          ))}
        </div>

        {/* 6-step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div
                className="bg-white rounded-[24px] overflow-hidden transition-all duration-300 h-full flex flex-col"
                style={{
                  border: hoveredStep === idx ? `2px solid ${step.color}` : "2px solid #E5E5E5",
                  boxShadow: hoveredStep === idx ? `0 12px 32px ${step.color}22` : "0 2px 8px rgba(0,0,0,0.06)",
                  transform: hoveredStep === idx ? "translateY(-8px)" : "translateY(0)",
                }}
              >
                {/* Step number badge */}
                <div
                  className="absolute top-4 left-4 w-14 h-14 rounded-full flex items-center justify-center z-10 text-white"
                  style={{
                    fontSize: "22px",
                    fontWeight: 900,
                    background: step.color,
                    boxShadow: `0 4px 12px ${step.color}55`,
                  }}
                >
                  {step.num}
                </div>

                {/* Phase tag */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className="px-2.5 py-1 rounded-full text-white"
                    style={{ fontSize: "11px", fontWeight: 600, background: `${step.color}CC` }}
                  >
                    {step.phase}
                  </span>
                </div>

                {/* Icon area */}
                <div className={`h-[180px] bg-gradient-to-br ${step.gradient} flex items-center justify-center`}>
                  <span
                    style={{
                      fontSize: "64px",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                      animation: hoveredStep === idx ? "bounceIcon 1s ease-in-out infinite" : "none",
                    }}
                  >
                    {step.icon}
                  </span>
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="mb-2" style={{ fontSize: "22px", fontWeight: 700, color: "#1A1A1A" }}>
                    {step.title}
                  </h4>
                  <p className="whitespace-pre-line mb-4 flex-1" style={{ fontSize: "15px", color: "#666", lineHeight: 1.6 }}>
                    {step.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {step.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl"
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          color: step.color,
                          background: step.tagBg,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {step.path && (
                    <Link
                      to={step.path}
                      className="block w-full text-center py-3 rounded-[20px] border-2 transition-all hover:text-white"
                      style={{
                        borderColor: step.color,
                        color: step.color,
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = step.color;
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = step.color;
                      }}
                    >
                      체험하기
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/ai-chat"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-[32px] text-white transition-all hover:-translate-y-1"
            style={{
              fontSize: "18px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #2D5016, #4A7023)",
              boxShadow: "0 8px 24px rgba(45,80,22,0.3)",
            }}
          >
            🤖 여정 시작하기
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes bounceIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
