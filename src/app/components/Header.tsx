import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Bell, Wallet, User, ChevronDown, Menu, X } from "lucide-react";

export function Header() {
  const location = useLocation();
  const [walletConnected] = useState(false);
  const [villageOpen, setVillageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: "AI 큐레이터", icon: "🤖", path: "/ai-chat", color: "#4A90E2" },
    { label: "VR 미리보기", icon: "🌐", path: "/vr-preview", color: "#9B59B6" },
    { label: "AR 체험", icon: "📱", path: "/ar-experience", color: "#FF6B35" },
    { label: "내 여권", icon: "🎫", path: "/passport", badge: 3, color: "#2D5016" },
  ];

  const villages = ["체험마을", "치유마을", "교육농장", "치유농장", "전통마을"];

  return (
    <header
      className="sticky top-0 z-50 h-[80px] flex items-center px-6 lg:px-10"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Link to="/" className="flex flex-col shrink-0">
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#2D5016] to-[#4A90E2]"
          style={{ fontSize: "22px", fontWeight: 700 }}
        >
          이웃우리
        </span>
        <span style={{ fontSize: "11px", color: "#999", letterSpacing: "0.5px" }}>
          AI로 만나는 스마트 농촌
        </span>
      </Link>

      <nav className="hidden lg:flex items-center gap-[36px] mx-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 transition-all relative group py-2"
              style={{
                fontSize: "15px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? item.color : "#333",
              }}
            >
              <span className="transition-transform group-hover:scale-110" style={{ fontSize: "18px" }}>
                {item.icon}
              </span>
              {item.label}
              {item.badge && (
                <span
                  className="absolute -top-1 -right-5 bg-[#FF6B35] text-white rounded-full flex items-center justify-center"
                  style={{ fontSize: "10px", width: "20px", height: "20px", fontWeight: 700 }}
                >
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: item.color }} />
              )}
            </Link>
          );
        })}

        <div className="relative">
          <button
            onClick={() => setVillageOpen(!villageOpen)}
            className="flex items-center gap-2 text-[#333] hover:text-[#2D5016] transition-colors py-2"
            style={{ fontSize: "15px", fontWeight: 500 }}
          >
            <span style={{ fontSize: "18px" }}>🏡</span>
            마을 찾기
            <ChevronDown size={14} className={`transition-transform ${villageOpen ? "rotate-180" : ""}`} />
          </button>
          {villageOpen && (
            <div className="absolute top-full mt-2 bg-white rounded-2xl py-2 min-w-[180px] z-50" style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.06)" }}>
              {villages.map((v) => (
                <button key={v} className="w-full text-left px-4 py-2.5 hover:bg-[#F5F7FA] text-[#333] transition-colors flex items-center gap-2" style={{ fontSize: "14px" }} onClick={() => setVillageOpen(false)}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D5016]" />
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="hidden lg:flex items-center gap-3">
        <button className="relative p-2.5 hover:bg-[#F5F7FA] rounded-full transition-colors">
          <Bell size={20} color="#666" />
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#FF6B35] text-white rounded-full flex items-center justify-center" style={{ fontSize: "10px", fontWeight: 700 }}>2</span>
        </button>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFB800]/10 to-[#FFC933]/10 border border-[#FFB800]/20">
          <span style={{ fontSize: "14px" }}>💰</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#B8860B" }}>12,500P</span>
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2D5016] to-[#4A7023] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" style={{ boxShadow: "0 2px 8px rgba(45,80,22,0.3)" }}>
          <User size={16} color="white" />
        </div>
      </div>

      <button className="lg:hidden ml-auto p-2" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div className="absolute top-[80px] left-0 right-0 bg-white/95 backdrop-blur-xl lg:hidden z-50 p-5" style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}>
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-[#F5F7FA] text-[#333]" style={{ fontSize: "16px", fontWeight: location.pathname === item.path ? 700 : 400, color: location.pathname === item.path ? item.color : "#333" }} onClick={() => setMobileOpen(false)}>
              <span style={{ fontSize: "22px" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between px-4">
            <span style={{ fontSize: "14px", color: "#666" }}>보유 포인트</span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#B8860B" }}>💰 12,500P</span>
          </div>
        </div>
      )}
    </header>
  );
}
