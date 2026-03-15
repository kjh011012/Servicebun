import { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Phone,
  Smartphone,
  MoreVertical,
  Camera,
  Mic,
  Send,
  Play,
  Star,
  MessageCircle,
  Clock,
} from "lucide-react";

type Message = {
  id: number;
  type: "ai" | "user" | "system" | "card" | "nft";
  text?: string;
  time?: string;
  hasAudio?: boolean;
  buttons?: string[];
  cardData?: { title: string; info: string; img: string };
  quickReplies?: string[];
};

const initialMessages: Message[] = [
  {
    id: 0,
    type: "system",
    text: "박순자 촌장님이 상담을 시작합니다",
  },
  {
    id: 1,
    type: "ai",
    text: "안녕하세요! 홍천 행복마을 박순자입니다 😊\n\n우리 마을 방문을 생각하고 계시는군요!\n언제, 누구와 오실 계획이세요?",
    time: "오전 10:23",
    quickReplies: ["이번 주말", "다음 달", "가족과 함께", "친구들과", "혼자", "아직 미정"],
  },
  {
    id: 2,
    type: "user",
    text: "안녕하세요! 딸기 체험 하고 싶은데 언제 가면 좋을까요?",
    time: "오전 10:24",
  },
  {
    id: 3,
    type: "ai",
    text: "우리 마을 딸기는 3월부터 5월까지가 제일 맛있어요 🍓\n특히 4월 초가 당도가 가장 높답니다~",
    time: "오전 10:24",
    hasAudio: true,
  },
  {
    id: 4,
    type: "card",
    cardData: {
      title: "딸기 따기 체험",
      info: "소요 30분 · 15,000원/인",
      img: "https://images.unsplash.com/photo-1558819355-c62618ed7ec7?w=400&h=200&fit=crop",
    },
  },
  {
    id: 5,
    type: "user",
    text: "근처에 숙소도 있나요?",
    time: "오전 10:25",
  },
  {
    id: 6,
    type: "ai",
    text: "네! 마을 한옥 숙소가 3곳 있어요.\nAR로 미리 둘러보실래요? 📱",
    time: "오전 10:25",
    buttons: ["AR 체험하기", "숙소 보기"],
  },
  {
    id: 7,
    type: "nft",
    text: "🎉 축하합니다!\n'홍천 행복마을 첫 상담' 스탬프 + 100P를 획득했어요!",
  },
];

export function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: messages.length,
      type: "user",
      text: input,
      time: "오전 10:30",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: messages.length + 1,
        type: "ai",
        text: "네, 알겠습니다! 더 궁금한 게 있으시면 편하게 물어보세요 😊",
        time: "오전 10:31",
        quickReplies: ["다른 체험 추천", "교통편 알려줘", "주변 관광지"],
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Left Panel - AI Guide Profile */}
      <div className="hidden lg:flex flex-col w-[360px] bg-white border-r border-[#E5E5E5] overflow-y-auto">
        {/* Character View */}
        <div
          className="h-[350px] relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #F0F9FF, #E0F2FE)",
          }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1612691997195-c11c53dc6aa0?w=400&h=400&fit=crop"
            alt="박순자 할머니"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-20" />
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <h3 style={{ fontSize: "26px", fontWeight: 700, color: "#1A1A1A" }}>
              박순자 할머니
            </h3>
          </div>
          <div className="flex items-center gap-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
            <span style={{ fontSize: "13px", color: "#4CAF50" }}>대화 가능</span>
          </div>

          <div className="flex flex-col gap-2.5 mb-6">
            {[
              "나이: 78세",
              "담당 마을: 홍천 행복마을",
              "경력: 50년 농사",
            ].map((info, i) => (
              <p key={i} style={{ fontSize: "14px", color: "#666" }}>
                {info}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["전통 농업", "향토 음식", "한방 치유"].map((tag) => (
              <span
                key={tag}
                className="bg-[#F5F7FA] text-[#666] px-3 py-1.5 rounded-[14px]"
                style={{ fontSize: "13px" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t border-[#E5E5E5] pt-5 mb-5">
            <div className="flex flex-col gap-3">
              {[
                { icon: <MessageCircle size={16} />, text: "총 대화 수: 1,243회" },
                { icon: <Star size={16} />, text: "평균 만족도: ⭐ 4.9" },
                { icon: <Clock size={16} />, text: "응답 속도: 즉시" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                  style={{ fontSize: "13px", color: "#999" }}
                >
                  {stat.icon}
                  {stat.text}
                </div>
              ))}
            </div>
          </div>

          {/* Voice toggle */}
          <div className="flex items-center justify-between bg-[#F5F7FA] rounded-2xl p-4">
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                음성 대화
              </p>
              <p style={{ fontSize: "12px", color: "#999" }}>
                할머니 목소리로 답변합니다
              </p>
            </div>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="w-12 h-7 rounded-full transition-colors relative"
              style={{
                background: voiceEnabled ? "#4CAF50" : "#ccc",
              }}
            >
              <div
                className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform"
                style={{
                  transform: voiceEnabled
                    ? "translateX(22px)"
                    : "translateX(2px)",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col bg-[#F5F7FA]">
        {/* Chat Header */}
        <div className="h-[72px] bg-white border-b border-[#E5E5E5] flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1612691997195-c11c53dc6aa0?w=100&h=100&fit=crop"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p style={{ fontSize: "17px", fontWeight: 700, color: "#1A1A1A" }}>
                박순자 할머니
              </p>
              <p className="flex items-center gap-1" style={{ fontSize: "12px", color: "#4CAF50" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                온라인
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors">
              <Phone size={18} color="#666" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors">
              <Smartphone size={18} color="#666" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors">
              <MoreVertical size={18} color="#666" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col gap-4">
          {messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id} className="text-center">
                  <span
                    className="bg-black/5 px-4 py-1.5 rounded-2xl"
                    style={{ fontSize: "13px", color: "#666" }}
                  >
                    {msg.text}
                  </span>
                </div>
              );
            }
            if (msg.type === "ai") {
              return (
                <div key={msg.id} className="flex flex-col items-start max-w-[480px]">
                  <div
                    className="bg-white p-4 whitespace-pre-line"
                    style={{
                      borderRadius: "6px 20px 20px 20px",
                      fontSize: "15px",
                      color: "#1A1A1A",
                      lineHeight: 1.6,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    {msg.text}
                    {msg.hasAudio && (
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                        <button className="w-9 h-9 rounded-full bg-[#4A90E2] flex items-center justify-center shrink-0">
                          <Play size={14} color="white" fill="white" />
                        </button>
                        <div className="flex items-end gap-0.5 flex-1">
                          {[3, 5, 8, 4, 7, 6, 3, 5, 7, 4, 6, 3, 5, 8, 4].map(
                            (h, i) => (
                              <div
                                key={i}
                                className="w-1 bg-[#4A90E2]/40 rounded-full"
                                style={{ height: `${h * 2.5}px` }}
                              />
                            )
                          )}
                        </div>
                        <span style={{ fontSize: "12px", color: "#999" }}>
                          0:08
                        </span>
                        <button
                          className="text-[#4A90E2] shrink-0"
                          style={{ fontSize: "12px" }}
                        >
                          1.0x
                        </button>
                      </div>
                    )}
                    {msg.buttons && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.buttons.map((btn, i) => (
                          <button
                            key={i}
                            className={`px-4 py-2 rounded-full transition-colors ${
                              i === 0
                                ? "bg-gradient-to-r from-[#4A90E2] to-[#6BA5E7] text-white"
                                : "border border-[#E5E5E5] text-[#333] hover:border-[#4A90E2] hover:text-[#4A90E2]"
                            }`}
                            style={{ fontSize: "13px", fontWeight: 500 }}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.time && (
                    <span className="mt-1.5 ml-1" style={{ fontSize: "12px", color: "#999" }}>
                      {msg.time}
                    </span>
                  )}
                  {msg.quickReplies && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {msg.quickReplies.map((qr, i) => (
                        <button
                          key={i}
                          className="bg-white border-[1.5px] border-[#E5E5E5] text-[#333] px-4 py-2 rounded-full hover:border-[#4A90E2] hover:text-[#4A90E2] transition-colors"
                          style={{ fontSize: "14px" }}
                          onClick={() => {
                            setInput(qr);
                          }}
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            if (msg.type === "user") {
              return (
                <div key={msg.id} className="flex flex-col items-end self-end max-w-[480px]">
                  <div
                    className="bg-[#4A90E2] text-white p-4"
                    style={{
                      borderRadius: "20px 6px 20px 20px",
                      fontSize: "15px",
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1.5 mr-1" style={{ fontSize: "12px", color: "#999" }}>
                    {msg.time}
                  </span>
                </div>
              );
            }
            if (msg.type === "card" && msg.cardData) {
              return (
                <div key={msg.id} className="max-w-[400px]">
                  <div
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{
                      border: "1px solid #E5E5E5",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    <ImageWithFallback
                      src={msg.cardData.img}
                      alt={msg.cardData.title}
                      className="w-full h-[160px] object-cover"
                    />
                    <div className="p-4">
                      <h4 style={{ fontSize: "17px", fontWeight: 700, color: "#1A1A1A" }}>
                        {msg.cardData.title}
                      </h4>
                      <p className="mt-1" style={{ fontSize: "14px", color: "#666" }}>
                        {msg.cardData.info}
                      </p>
                      <button
                        className="mt-3 text-[#4A90E2]"
                        style={{ fontSize: "14px", fontWeight: 500 }}
                      >
                        자세히 보기 →
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            if (msg.type === "nft") {
              return (
                <div key={msg.id} className="max-w-[400px]">
                  <div
                    className="rounded-2xl p-5 text-center"
                    style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      boxShadow: "0 8px 24px rgba(255,193,7,0.3)",
                    }}
                  >
                    <p
                      className="whitespace-pre-line"
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#1A1A1A",
                        lineHeight: 1.6,
                      }}
                    >
                      {msg.text}
                    </p>
                    <button
                      className="mt-3 bg-[#1A1A1A] text-white px-5 py-2 rounded-full"
                      style={{ fontSize: "13px", fontWeight: 600 }}
                    >
                      내 여권에서 보기
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="bg-white px-4 py-3 rounded-2xl flex items-center gap-1.5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#999] animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <span style={{ fontSize: "13px", color: "#999" }}>
                박순자 할머니가 입력 중입니다...
              </span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="h-[88px] bg-white border-t border-[#E5E5E5] px-4 lg:px-8 flex items-center gap-3 shrink-0">
          <button className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors shrink-0">
            <Camera size={18} color="#666" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors shrink-0">
            <Mic size={18} color="#666" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="할머니께 메시지를 보내보세요..."
            className="flex-1 h-[56px] bg-[#F5F7FA] rounded-[28px] px-5 border-none outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4A90E2]"
            style={{ fontSize: "15px", color: "#333" }}
          />

          <button
            onClick={handleSend}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              input.trim()
                ? "bg-[#4A90E2] hover:bg-[#3a7bc8]"
                : "bg-[#E5E5E5]"
            }`}
          >
            <Send size={20} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}