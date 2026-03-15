import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowLeft, Phone, Camera, Mic, Send, Play } from "lucide-react";

const guides = [
  {
    name: "박순자 촌장님",
    village: "📍 홍천 행복마을",
    specialty: "🌾 전통 농업 · 🍲 향토 음식",
    img: "https://images.unsplash.com/photo-1612691997195-c11c53dc6aa0?w=400&h=400&fit=crop",
    online: true,
  },
  {
    name: "김철수 사무장님",
    village: "📍 양평 달빛마을",
    specialty: "🪵 목공예 · 🏠 한옥",
    img: "https://images.unsplash.com/photo-1687722875312-f4baa87ba5f9?w=400&h=400&fit=crop",
    online: true,
  },
  {
    name: "이영희 체험 담당",
    village: "📍 가평 치유마을",
    specialty: "🌿 한방 · 💆 치유",
    img: "https://images.unsplash.com/photo-1770783808749-aa5b6bccc370?w=400&h=400&fit=crop",
    online: false,
  },
  {
    name: "정동수 어촌계장",
    village: "📍 강릉 해맞이마을",
    specialty: "🐟 어업 · 🦐 해산물",
    img: "https://images.unsplash.com/photo-1758622014699-2bfb8e5a2ce6?w=400&h=400&fit=crop",
    online: true,
  },
];

const chatMessages = [
  {
    type: "ai",
    text: "안녕하세요! 반갑습니다 😊\n홍천 행복마을 박��자입니다",
    time: "오전 10:23",
  },
  {
    type: "user",
    text: "안녕하세요! 딸기 체험 하고 싶은데 언제 가면 좋을까요?",
    time: "오전 10:24",
  },
  {
    type: "ai",
    text: "우리 마을 딸기는 3월부터 5월까지가 제일 맛있어요 🍓",
    time: "오전 10:24",
    hasAudio: true,
  },
  {
    type: "card",
    title: "딸기 따기 체험",
    info: "소요 30분 · 15,000원/인",
    img: "https://images.unsplash.com/photo-1558819355-c62618ed7ec7?w=300&h=160&fit=crop",
  },
  { type: "user", text: "근처에 숙소도 있나요?", time: "오전 10:25" },
  {
    type: "ai",
    text: "네! 마을 한옥 숙소가 3곳 있어요.\nAR로 미리 둘러보실래요? 📱",
    time: "오전 10:25",
    buttons: ["AR 체험하기", "숙소 보기"],
  },
];

export function AIGuideSection() {
  const [hoveredGuide, setHoveredGuide] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 lg:py-[120px]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left - AI Guide Cards */}
          <div className="lg:w-[60%]">
            <h2
              className="mb-3"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.2,
              }}
            >
              AI 마을 큐레이터와 상담하세요
            </h2>
            <p
              className="mb-10"
              style={{ fontSize: "18px", color: "#666", lineHeight: 1.6 }}
            >
              실제 마을 촌장님의 경험을 AI로 학습시켜 만든 큐레이터입니다
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {guides.map((guide, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] border-2 overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    borderColor:
                      hoveredGuide === idx ? "#4A90E2" : "#E5E5E5",
                    transform:
                      hoveredGuide === idx
                        ? "translateY(-4px)"
                        : "translateY(0)",
                    boxShadow:
                      hoveredGuide === idx
                        ? "0 8px 24px rgba(74,144,226,0.15)"
                        : "none",
                  }}
                  onMouseEnter={() => setHoveredGuide(idx)}
                  onMouseLeave={() => setHoveredGuide(null)}
                >
                  <div className="relative h-[200px] bg-gradient-to-b from-[#F0F9FF] to-[#E0F2FE]">
                    <ImageWithFallback
                      src={guide.img}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-3 right-3 rounded-xl px-3 py-1 text-white flex items-center gap-1"
                      style={{
                        fontSize: "12px",
                        background: guide.online
                          ? "rgba(76,175,80,0.9)"
                          : "rgba(158,158,158,0.9)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: guide.online ? "#fff" : "#ccc",
                        }}
                      />
                      {guide.online ? "대화 가능" : "오프라인"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#1A1A1A",
                      }}
                    >
                      {guide.name}
                    </h4>
                    <p
                      className="mt-2"
                      style={{ fontSize: "14px", color: "#666" }}
                    >
                      {guide.village}
                    </p>
                    <p
                      className="mt-1"
                      style={{ fontSize: "13px", color: "#999" }}
                    >
                      {guide.specialty}
                    </p>
                    <button
                      className="w-full mt-4 py-2.5 rounded-[20px] border-2 border-[#4A90E2] text-[#4A90E2] transition-all hover:bg-[#4A90E2] hover:text-white"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      대화 시작하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Chat Simulation Mockup */}
          <div className="lg:w-[40%] flex justify-center">
            <div
              className="w-full max-w-[380px] rounded-[40px] overflow-hidden"
              style={{
                border: "8px solid #1A1A1A",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              {/* Phone Header */}
              <div className="bg-[#4A90E2] px-4 py-4 flex items-center gap-3">
                <ArrowLeft size={20} color="white" />
                <div className="w-[40px] h-[40px] rounded-full bg-white/20 overflow-hidden">
                  <ImageWithFallback
                    src={guides[0].img}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className="text-white flex-1"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  박순자 할머니
                </span>
                <Phone size={20} color="white" />
              </div>

              {/* Chat Area */}
              <div
                className="bg-[#F5F7FA] p-4 flex flex-col gap-3 overflow-y-auto"
                style={{ height: "480px" }}
              >
                {chatMessages.map((msg, idx) => {
                  if (msg.type === "ai") {
                    return (
                      <div key={idx} className="flex flex-col items-start">
                        <div
                          className="bg-white p-3.5 max-w-[280px] whitespace-pre-line"
                          style={{
                            borderRadius: "4px 18px 18px 18px",
                            fontSize: "14px",
                            color: "#1A1A1A",
                            lineHeight: 1.6,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          }}
                        >
                          {msg.text}
                          {msg.hasAudio && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                              <div className="w-8 h-8 rounded-full bg-[#4A90E2] flex items-center justify-center">
                                <Play size={14} color="white" fill="white" />
                              </div>
                              <div className="flex gap-0.5">
                                {[3, 5, 8, 4, 7, 6, 3, 5, 7, 4, 6, 3].map(
                                  (h, i) => (
                                    <div
                                      key={i}
                                      className="w-0.5 bg-[#4A90E2] rounded-full"
                                      style={{ height: `${h * 2}px` }}
                                    />
                                  )
                                )}
                              </div>
                              <span
                                style={{ fontSize: "11px", color: "#999" }}
                              >
                                0:08
                              </span>
                            </div>
                          )}
                          {msg.buttons && (
                            <div className="flex gap-2 mt-3">
                              {msg.buttons.map((btn, i) => (
                                <button
                                  key={i}
                                  className={`px-3 py-1.5 rounded-full ${
                                    i === 0
                                      ? "bg-[#4A90E2] text-white"
                                      : "border border-[#E5E5E5] text-[#333]"
                                  }`}
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {btn}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {msg.time && (
                          <span
                            className="mt-1 ml-1"
                            style={{ fontSize: "11px", color: "#999" }}
                          >
                            {msg.time}
                          </span>
                        )}
                      </div>
                    );
                  }
                  if (msg.type === "user") {
                    return (
                      <div key={idx} className="flex flex-col items-end">
                        <div
                          className="bg-[#4A90E2] text-white p-3.5 max-w-[280px]"
                          style={{
                            borderRadius: "18px 4px 18px 18px",
                            fontSize: "14px",
                            lineHeight: 1.6,
                          }}
                        >
                          {msg.text}
                        </div>
                        <span
                          className="mt-1 mr-1"
                          style={{ fontSize: "11px", color: "#999" }}
                        >
                          {msg.time}
                        </span>
                      </div>
                    );
                  }
                  if (msg.type === "card") {
                    return (
                      <div key={idx} className="flex justify-start">
                        <div
                          className="bg-white rounded-2xl overflow-hidden max-w-[280px]"
                          style={{
                            border: "1px solid #E5E5E5",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          }}
                        >
                          <ImageWithFallback
                            src={msg.img!}
                            alt={msg.title!}
                            className="w-full h-[120px] object-cover"
                          />
                          <div className="p-3">
                            <h5
                              style={{
                                fontSize: "15px",
                                fontWeight: 700,
                                color: "#1A1A1A",
                              }}
                            >
                              {msg.title}
                            </h5>
                            <p
                              className="mt-1"
                              style={{ fontSize: "13px", color: "#666" }}
                            >
                              {msg.info}
                            </p>
                            <button
                              className="mt-2 text-[#4A90E2]"
                              style={{
                                fontSize: "13px",
                                fontWeight: 500,
                              }}
                            >
                              자세히 보기 →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Input */}
              <div className="bg-white px-3 py-3 flex items-center gap-2 border-t border-gray-100">
                <button className="p-2 rounded-full hover:bg-[#F5F7FA]">
                  <Camera size={18} color="#666" />
                </button>
                <div
                  className="flex-1 bg-[#F5F7FA] rounded-full px-4 py-2 text-[#999]"
                  style={{ fontSize: "14px" }}
                >
                  메시지를 입력하세요...
                </div>
                <button className="p-2 rounded-full hover:bg-[#F5F7FA]">
                  <Mic size={18} color="#666" />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#4A90E2] flex items-center justify-center">
                  <Send size={16} color="white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}