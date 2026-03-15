import { useState, useEffect } from "react";
import { Link } from "react-router";

const stamps = [
  { village: "홍천", icon: "🍓", acquired: true, date: "2026.03.01" },
  { village: "양평", icon: "🏠", acquired: true, date: "2026.02.15" },
  { village: "가평", icon: "🌿", acquired: true, date: "2026.01.20" },
  { village: "강릉", icon: "🐟", acquired: true, date: "2025.12.10" },
  { village: "전주", icon: "🎨", acquired: false },
  { village: "제주", icon: "🍊", acquired: true, date: "2025.11.05" },
  { village: "보성", icon: "🍵", acquired: false },
  { village: "담양", icon: "🎋", acquired: false },
  { village: "하동", icon: "🌾", acquired: true, date: "2025.10.20" },
  { village: "영월", icon: "⛰️", acquired: false },
  { village: "순천", icon: "🌲", acquired: false },
  { village: "안동", icon: "🏯", acquired: true, date: "2025.09.15" },
];

function AnimatedValue({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const inc = target / 125;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

export function NFTPassportSection() {
  return (
    <section
      className="relative py-20 lg:py-[140px] overflow-hidden"
      style={{ background: "linear-gradient(180deg, #1A2E0A, #2D5016, #1A3A0C)" }}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left - Passport Mockup */}
          <div className="lg:w-1/2 flex justify-center">
            <div
              className="w-full max-w-[520px] rounded-3xl overflow-hidden transition-transform hover:scale-[1.02] duration-500"
              style={{
                background: "linear-gradient(135deg, #2D5016, #1a3a0c)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                border: "2px solid rgba(255,215,0,0.3)",
              }}
            >
              {/* Cover */}
              <div className="p-8 text-center border-b border-white/10 relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.05) 50%, transparent 70%)", animation: "shimmer 3s linear infinite" }} />
                <div className="relative z-10">
                  <div className="text-[#FFD700] mb-2" style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "4px" }}>대한민국</div>
                  <h3 className="text-[#FFD700] mb-3" style={{ fontSize: "24px", fontWeight: 700 }}>농촌 디지털 여권</h3>
                  <div className="inline-block px-4 py-1.5 rounded-full border border-[#FFD700]/30" style={{ fontSize: "12px", color: "#FFD700", letterSpacing: "2px" }}>RURAL PASSPORT</div>
                </div>
              </div>

              {/* Inner pages */}
              <div className="flex flex-col md:flex-row">
                {/* Profile */}
                <div className="flex-1 p-6 border-r border-white/10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFB800] to-[#FFC933] flex items-center justify-center mb-3 mx-auto">
                    <span style={{ fontSize: "28px" }}>👤</span>
                  </div>
                  <div className="text-center mb-4">
                    <p className="text-white" style={{ fontSize: "18px", fontWeight: 700 }}>박민수</p>
                    <p className="text-white/60 mt-1" style={{ fontSize: "12px", fontFamily: "monospace" }}>KR-2024-001234</p>
                    <div className="inline-block mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFB800] to-[#FFC933] text-[#1A1A1A]" style={{ fontSize: "11px", fontWeight: 700 }}>
                      🌾 농촌 탐험가 Lv.12
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "방문 마을", value: 15, suffix: "곳" },
                      { label: "완료 체험", value: 28, suffix: "회" },
                      { label: "획득 스탬프", value: 34, suffix: "개" },
                      { label: "보유 포인트", value: 12500, suffix: "P" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-2.5 text-center">
                        <p className="text-white" style={{ fontSize: "18px", fontWeight: 700 }}>
                          <AnimatedValue target={stat.value} />{stat.suffix}
                        </p>
                        <p className="text-white/50" style={{ fontSize: "11px" }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stamps */}
                <div className="flex-1 p-6">
                  <p className="text-white/60 mb-3 text-center" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px" }}>수집한 스탬프</p>
                  <div className="grid grid-cols-3 gap-2">
                    {stamps.slice(0, 9).map((stamp, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl flex flex-col items-center justify-center relative transition-transform hover:scale-110"
                        style={{
                          background: stamp.acquired ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                          border: stamp.acquired ? "2px solid rgba(255,184,0,0.5)" : "2px solid rgba(255,255,255,0.1)",
                          cursor: "pointer",
                        }}
                      >
                        {stamp.acquired ? (
                          <>
                            <span style={{ fontSize: "24px" }}>{stamp.icon}</span>
                            <span className="text-white/60 mt-0.5" style={{ fontSize: "9px" }}>{stamp.village}</span>
                          </>
                        ) : (
                          <span style={{ fontSize: "18px", opacity: 0.3 }}>🔒</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Text */}
          <div className="lg:w-1/2">
            <span
              className="inline-block px-5 py-2 rounded-[20px] mb-5"
              style={{ background: "rgba(255,184,0,0.15)", fontSize: "14px", fontWeight: 700, color: "#FFB800" }}
            >
              🎫 방문 후 기록
            </span>

            <h2 className="text-white mb-5" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.3 }}>
              체험을 기록하고
              <br />
              포인트로 돌려받으세요
            </h2>

            <p className="mb-8" style={{ fontSize: "17px", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
              마을을 방문하고 체험할 때마다
              <br />
              스탬프가 쌓이고 포인트가 적립됩니다
              <br />
              다음 여행에서 할인받고, 특산품도 구매하세요
            </p>

            {/* Feature highlights */}
            <div className="flex flex-col gap-5 mb-10">
              {[
                { icon: "🎫", title: "자동 스탬프 발급", desc: "체험 완료 시 마을별 고유 스탬프 자동 발급", color: "#FFB800" },
                { icon: "💰", title: "포인트 적립", desc: "체험비의 10% 자동 적립 (100P = 100원)", color: "#4CAF50" },
                { icon: "🏆", title: "업적 & 배지", desc: "특별 조건 달성 시 희귀 배지 획득", color: "#4A90E2" },
                { icon: "🛒", title: "포인트 사용", desc: "숙박·체험·특산품 할인에 사용 가능", color: "#FF6B35" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                    <span style={{ fontSize: "24px" }}>{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-white" style={{ fontSize: "17px", fontWeight: 700 }}>{item.title}</h4>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/passport"
                className="bg-gradient-to-r from-[#FFB800] to-[#FFC933] text-[#1A1A1A] px-8 py-4 rounded-[28px] transition-all hover:-translate-y-0.5"
                style={{ fontSize: "16px", fontWeight: 700, boxShadow: "0 8px 24px rgba(255,184,0,0.3)" }}
              >
                내 여권 확인하기
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-[28px] hover:bg-white/10 transition-colors" style={{ fontSize: "16px", fontWeight: 700 }}>
                포인트 사용처 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
