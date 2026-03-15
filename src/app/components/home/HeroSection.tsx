import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cards = [
  {
    icon: "🤖",
    gradient: "from-[#4A90E2] to-[#6BA5E7] to-[#8FBFEA]",
    badge: "🔥 첫 번째 단계",
    badgeBg: "rgba(74,144,226,0.2)",
    badgeBorder: "rgba(74,144,226,0.4)",
    badgeColor: "#4A90E2",
    title: "AI 마을 큐레이터 상담",
    desc: "실제 마을 촌장님이\n맞춤 여행을 설계해드려요",
    tags: ["💬 계절별 맞춤 추천", "👨‍👩‍👧‍👦 가족 맞춤 설계", "📋 일정 자동 생성", "💰 예산 맞춤 제안"],
    color: "#4A90E2",
    path: "/ai-chat",
    btnText: "AI 큐레이터 상담 시작 🤖",
  },
  {
    icon: "🌐",
    gradient: "from-[#9B59B6] to-[#B97FC9] to-[#D7A3DC]",
    badge: "⭐ VR 체험",
    badgeBg: "rgba(155,89,182,0.2)",
    badgeBorder: "rgba(155,89,182,0.4)",
    badgeColor: "#9B59B6",
    title: "360° 마을 미리보기",
    desc: "숙소 내부부터 체험장까지\n방문 전에 미리 확인하세요",
    tags: ["🏠 숙소 VR 투어", "🍓 체험장 360°", "🗺️ 마을 지도", "📸 포토스팟"],
    color: "#9B59B6",
    path: "/vr-preview",
    btnText: "VR 미리보기 📱",
  },
  {
    icon: "📱",
    gradient: "from-[#FF6B35] to-[#FF8F5A] to-[#FFB88C]",
    badge: "🎮 현장 체험",
    badgeBg: "rgba(255,107,53,0.2)",
    badgeBorder: "rgba(255,107,53,0.4)",
    badgeColor: "#FF6B35",
    title: "AR 체험 미션",
    desc: "아이는 보물찾기,\n어른은 농촌 해설 체험",
    tags: ["🎁 보물찾기 미션", "🐰 동물 친구 찾기", "🌿 약초 도감", "📸 포토 챌린지"],
    color: "#FF6B35",
    path: "/ar-experience",
    btnText: "AR 미션 시작 📱",
  },
  {
    icon: "🎫",
    gradient: "from-[#2D5016] to-[#4A7023] to-[#6A9030]",
    badge: "💰 보상 시스템",
    badgeBg: "rgba(45,80,22,0.2)",
    badgeBorder: "rgba(45,80,22,0.4)",
    badgeColor: "#2D5016",
    title: "디지털 여권 & 포인트",
    desc: "체험을 스탬프로 기록하고\n포인트로 할인받으세요",
    tags: ["🎫 자동 스탬프 발급", "🏆 업적 배지 획득", "💰 포인트 적립/사용", "🎁 재방문 혜택"],
    color: "#2D5016",
    path: "/passport",
    btnText: "내 여권 보기 🎫",
  },
];

const stats = [
  { icon: "🏘️", label: "연결된 마을", value: 87, suffix: "곳", color: "#2D5016" },
  { icon: "🎯", label: "누적 체험", value: 234567, suffix: "회", color: "#FF6B35" },
  { icon: "🎫", label: "발급 스탬프", value: 456789, suffix: "개", color: "#4A90E2" },
  { icon: "💰", label: "사용 포인트", value: 1234567, suffix: "P", color: "#FFB800" },
];

const subtitleParts = [
  "AI 큐레이터 상담",
  "▶",
  "VR 미리보기",
  "▶",
  "AR 체험 미션",
  "▶",
  "포인트 적립",
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, started]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <div
      className="absolute rounded-full bg-white pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: "-10px",
        opacity: 0,
        animation: `floatDown ${8 + Math.random() * 4}s ${delay}s infinite linear`,
      }}
    />
  );
}

export function HeroSection() {
  const [activeCard, setActiveCard] = useState(0);
  const [typedIndex, setTypedIndex] = useState(0);

  const nextCard = useCallback(() => {
    setActiveCard((prev) => (prev + 1) % cards.length);
  }, []);

  const prevCard = useCallback(() => {
    setActiveCard((prev) => (prev - 1 + cards.length) % cards.length);
  }, []);

  // Auto rotate cards
  useEffect(() => {
    const timer = setInterval(nextCard, 5000);
    return () => clearInterval(timer);
  }, [nextCard]);

  // Typing animation for subtitle
  useEffect(() => {
    if (typedIndex < subtitleParts.length) {
      const timer = setTimeout(() => setTypedIndex((i) => i + 1), 600);
      return () => clearTimeout(timer);
    }
  }, [typedIndex]);

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "900px" }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f3460 50%, #1a1a2e 75%, #16213e 100%)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 20s ease infinite",
        }}
      />

      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(155,89,182,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(74,144,226,0.3) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(45,80,22,0.3) 0%, transparent 50%), radial-gradient(circle at 30% 30%, rgba(255,107,53,0.2) 0%, transparent 40%)",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Particle
          key={i}
          delay={Math.random() * 10}
          x={Math.random() * 100}
          size={2 + Math.random() * 4}
        />
      ))}

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-16 lg:py-24">
        {/* Title */}
        <div className="text-center mb-6">
          <h1
            className="text-white mb-4 relative"
            style={{
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-3px",
              lineHeight: 1.2,
              textShadow: "0 0 60px rgba(74,144,226,0.3), 0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            AI 마을 큐레이터가 설계하는
            <br />
            나만의 농촌 여행
          </h1>

          {/* Animated subtitle */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 mb-8"
            style={{ minHeight: "36px" }}
          >
            {subtitleParts.map((part, i) => (
              <span
                key={i}
                className={`transition-all duration-500 ${
                  i < typedIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{
                  fontSize: "clamp(14px, 2vw, 24px)",
                  fontWeight: 500,
                  color: part === "▶" ? "#4A90E2" : "rgba(255,255,255,0.95)",
                  animation: part === "▶" && i < typedIndex ? "pulse 2s ease-in-out infinite" : "none",
                }}
              >
                {part}
              </span>
            ))}
          </div>
        </div>

        {/* 3D Carousel Cards */}
        <div className="relative max-w-[1200px] mx-auto mb-8" style={{ perspective: "1000px" }}>
          {/* Arrow buttons */}
          <button
            onClick={prevCard}
            className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <ChevronLeft size={28} color="white" />
          </button>

          <button
            onClick={nextCard}
            className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <ChevronRight size={28} color="white" />
          </button>

          {/* Cards */}
          <div className="flex items-center justify-center gap-6 py-8 px-12 overflow-hidden">
            {cards.map((card, idx) => {
              const isActive = idx === activeCard;
              const diff = idx - activeCard;
              const absDiff = Math.abs(diff);

              if (absDiff > 1) return null;

              return (
                <div
                  key={idx}
                  className="shrink-0 transition-all duration-700 ease-out cursor-pointer"
                  style={{
                    width: isActive ? "340px" : "280px",
                    height: isActive ? "480px" : "400px",
                    opacity: isActive ? 1 : 0.6,
                    transform: `translateX(${diff * 20}px) scale(${isActive ? 1 : 0.85}) rotateY(${diff * -8}deg)`,
                    zIndex: isActive ? 10 : 5,
                    filter: isActive ? "none" : "brightness(0.7)",
                  }}
                  onClick={() => setActiveCard(idx)}
                >
                  <div
                    className="w-full h-full rounded-[32px] overflow-hidden flex flex-col"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(40px) saturate(180%)",
                      border: `2px solid ${isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}`,
                      boxShadow: isActive
                        ? `0 20px 60px ${card.color}66, inset 0 1px 0 rgba(255,255,255,0.3)`
                        : "0 8px 24px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Icon area */}
                    <div
                      className={`relative h-[180px] bg-gradient-to-br ${card.gradient} flex items-center justify-center overflow-hidden`}
                      style={{ backgroundSize: "200% 200%", animation: "gradientShift 10s ease infinite" }}
                    >
                      {/* Corner decorations */}
                      {[0, 1, 2, 3].map((corner) => (
                        <div
                          key={corner}
                          className="absolute w-6 h-6 border-white/30"
                          style={{
                            top: corner < 2 ? 12 : "auto",
                            bottom: corner >= 2 ? 12 : "auto",
                            left: corner % 2 === 0 ? 12 : "auto",
                            right: corner % 2 === 1 ? 12 : "auto",
                            borderTopWidth: corner < 2 ? 2 : 0,
                            borderBottomWidth: corner >= 2 ? 2 : 0,
                            borderLeftWidth: corner % 2 === 0 ? 2 : 0,
                            borderRightWidth: corner % 2 === 1 ? 2 : 0,
                          }}
                        />
                      ))}

                      <span
                        style={{
                          fontSize: "80px",
                          animation: "floatUpDown 3s ease-in-out infinite",
                          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
                        }}
                      >
                        {card.icon}
                      </span>
                    </div>

                    {/* Info area */}
                    <div className="flex-1 p-6 flex flex-col">
                      {/* Badge */}
                      <span
                        className="self-start px-3 py-1 rounded-[14px] mb-3"
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: card.badgeColor,
                          background: card.badgeBg,
                          border: `1px solid ${card.badgeBorder}`,
                        }}
                      >
                        {card.badge}
                      </span>

                      <h3
                        className="text-white mb-2"
                        style={{
                          fontSize: isActive ? "22px" : "18px",
                          fontWeight: 700,
                          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}
                      >
                        {card.title}
                      </h3>

                      <p
                        className="text-white/90 mb-3 whitespace-pre-line"
                        style={{ fontSize: "14px", lineHeight: 1.7 }}
                      >
                        {card.desc}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-col gap-1.5 mb-4 flex-1">
                        {card.tags.slice(0, isActive ? 4 : 2).map((tag, i) => (
                          <span key={i} className="text-white/85" style={{ fontSize: "13px" }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Link
                        to={card.path}
                        className="block w-full text-center py-3 rounded-[26px] bg-gradient-to-r from-white to-[#F5F5F5] transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          color: card.color,
                          fontSize: "15px",
                          fontWeight: 700,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      >
                        {card.btnText}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-2">
            {cards.map((card, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCard(idx)}
                className="w-3 h-3 rounded-full transition-all duration-300 hover:scale-130"
                style={{
                  background: activeCard === idx ? card.color : "rgba(255,255,255,0.3)",
                  transform: activeCard === idx ? "scale(1.3)" : "scale(1)",
                  boxShadow: activeCard === idx ? `0 0 12px ${card.color}88` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats Counter */}
        <div
          className="mx-auto rounded-[60px] flex flex-wrap items-center justify-center gap-8 lg:gap-16 py-6 px-8 lg:px-16"
          style={{
            maxWidth: "900px",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}99)`,
                  boxShadow: `0 4px 12px ${stat.color}44`,
                }}
              >
                <span style={{ fontSize: "20px" }}>{stat.icon}</span>
              </div>
              <div
                className="text-white"
                style={{
                  fontSize: "clamp(28px, 3vw, 42px)",
                  fontWeight: 900,
                  textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className="text-white/80"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatDown {
          0% { opacity: 0; transform: translateY(0); }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(100vh); }
        }
      `}</style>
    </section>
  );
}