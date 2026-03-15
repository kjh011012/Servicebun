import { useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const vrItems = [
  { title: "마을 입구 전경", img: "https://images.unsplash.com/photo-1700062958217-74353a136ed8?w=600&h=400&fit=crop" },
  { title: "청송재 한옥 거실", img: "https://images.unsplash.com/photo-1722755329817-e72cc3777ae6?w=600&h=400&fit=crop" },
  { title: "딸기 하우스 내부", img: "https://images.unsplash.com/photo-1593301333770-29d3df13178f?w=600&h=400&fit=crop" },
  { title: "전통 식당 내부", img: "https://images.unsplash.com/photo-1766752632455-8465aab4f4be?w=600&h=400&fit=crop" },
];

export function ARSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      className="py-20 lg:py-[120px]"
      style={{ background: "linear-gradient(180deg, #F5F0FF, #EDE5FF, #E8DEFF)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left - Text */}
          <div className="lg:w-[40%]">
            <span
              className="inline-block px-5 py-2 rounded-[20px] mb-5"
              style={{ background: "rgba(155,89,182,0.15)", fontSize: "14px", fontWeight: 700, color: "#9B59B6" }}
            >
              🌐 방문 전 미리보기
            </span>

            <h2
              className="mb-5"
              style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3 }}
            >
              360° VR로
              <br />
              마을을 미리 체험하세요
            </h2>

            <p className="mb-8" style={{ fontSize: "18px", color: "#333", lineHeight: 1.7 }}>
              숙소 내부부터 체험장, 식당까지
              <br />
              방문 전에 꼼꼼하게 확인할 수 있어요
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-4 mb-8">
              {[
                { icon: "🏠", title: "숙소 VR 투어", desc: "방, 거실, 마당까지 360° 둘러보기" },
                { icon: "🍓", title: "체험장 미리보기", desc: "딸기밭, 도자기 공방 내부 확인" },
                { icon: "🗺️", title: "마을 지도", desc: "전체 시설 위치와 거리 파악" },
                { icon: "📸", title: "포토스팟", desc: "인생샷 명소 미리 발견" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#9B59B6]/10 flex items-center justify-center shrink-0" style={{ fontSize: "20px" }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A" }}>{item.title}</p>
                    <p style={{ fontSize: "14px", color: "#666" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/vr-preview"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[28px] text-white transition-all hover:-translate-y-0.5"
              style={{ fontSize: "16px", fontWeight: 700, background: "linear-gradient(135deg, #9B59B6, #B97FC9)", boxShadow: "0 8px 24px rgba(155,89,182,0.3)" }}
            >
              🌐 VR 투어 시작하기
            </Link>
          </div>

          {/* Right - VR Preview Grid */}
          <div className="lg:w-[60%]">
            <div className="grid grid-cols-2 gap-4">
              {vrItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-[20px] overflow-hidden cursor-pointer group"
                  style={{
                    aspectRatio: "4/3",
                    boxShadow: hovered === idx ? "0 12px 32px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.1)",
                    transform: hovered === idx ? "translateY(-4px)" : "translateY(0)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <ImageWithFallback
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* 360° indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#9B59B6" }}>360°</span>
                    </div>
                  </div>

                  {/* Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white" style={{ fontSize: "12px", fontWeight: 600, background: "rgba(155,89,182,0.9)" }}>
                    360° VR
                  </span>

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white" style={{ fontSize: "14px", fontWeight: 600 }}>{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
