import { HeroSection } from "../components/home/HeroSection";
import { AIGuideSection } from "../components/home/AIGuideSection";
import { ARSection } from "../components/home/ARSection";
import { MetaverseSection } from "../components/home/MetaverseSection";
import { NFTPassportSection } from "../components/home/NFTPassportSection";
import { FlowSection } from "../components/home/FlowSection";
import { VillageCategorySection } from "../components/home/VillageCategorySection";

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <FlowSection />
      <AIGuideSection />
      <ARSection />
      <MetaverseSection />
      <NFTPassportSection />
      <VillageCategorySection />

      {/* Footer */}
      <footer className="bg-[#0F172A] py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#4A90E2]" style={{ fontSize: "28px", fontWeight: 700 }}>
                이웃우리
              </span>
              <p className="mt-2 max-w-[300px]" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                AI 큐레이터, VR 미리보기, AR 체험 미션으로
                <br />
                농촌 여행의 모든 여정을 연결합니다
              </p>
              <div className="flex gap-3 mt-4">
                {["📷", "🐦", "📘", "💬"].map((icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "16px" }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-12 flex-wrap">
              {[
                { title: "여정", items: ["AI 큐레이터", "VR 미리보기", "AR 체험", "디지털 여권"] },
                { title: "서비스", items: ["특산품 구매", "마을 찾기", "예약하기", "커뮤니티"] },
                { title: "지원", items: ["이용안내", "자주 묻는 질문", "문의하기"] },
                { title: "법적 고지", items: ["이용약관", "개인정보처리방침"] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="text-white mb-4" style={{ fontSize: "14px", fontWeight: 700 }}>{col.title}</h4>
                  {col.items.map((item, j) => (
                    <p key={j} className="cursor-pointer hover:text-white transition-colors mb-2" style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                      {item}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
              © 2026 이웃우리(Neighbor Our). All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {["🤖 AI 큐레이터", "🌐 VR 투어", "📱 AR 미션", "🎫 여권", "💰 포인트"].map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-full" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
