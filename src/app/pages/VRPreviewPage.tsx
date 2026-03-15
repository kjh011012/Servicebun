import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  X, RotateCw, Maximize2, Share2, ChevronLeft, ChevronRight,
  Mouse, Play, Star, MapPin, Camera, MessageCircle, Sparkles, Award, Gift,
} from "lucide-react";
import { VRCircleGallery } from "../components/VRCircleGallery";

// ═══════════════════════════════════════
// Data
// ═══════════════════════════════════════

interface Village {
  id: string;
  name: string;
  region: string;
  desc: string;
  img: string;
  rating: number;
  reviews: number;
  tags: string[];
}

const villages: Village[] = [
  {
    id: "boryeong",
    name: "보령 청라은행마을",
    region: "충남 보령",
    desc: "노랗게 물든 은행나무가 멋지게 피어있는 마을",
    img: "https://images.unsplash.com/photo-1762781960299-c70b9332a9aa?w=1600&h=1000&fit=crop&q=90",
    rating: 4.8,
    reviews: 342,
    tags: ["은행나무", "가을", "포토"],
  },
  {
    id: "cheongyang",
    name: "청양 알프스마을",
    region: "남 ",
    desc: "겨울 얼음 축제와 짜릿한 짚라인이 있는 설원 마을",
    img: "https://images.unsplash.com/photo-1617492046339-3a7a9f6e21e2?w=1600&h=1000&fit=crop&q=90",
    rating: 4.9,
    reviews: 518,
    tags: ["겨울", "축제", "액티비티"],
  },
  {
    id: "icheon",
    name: "이천 산수유마을",
    region: "경기 이천",
    desc: "봄이면 노란 산수유꽃이 온 마을을 물들이는 힐링 여행지",
    img: "https://images.unsplash.com/photo-1766025065806-0ed92891692d?w=1600&h=1000&fit=crop&q=90",
    rating: 4.7,
    reviews: 276,
    tags: ["봄꽃", "힐링", "산책"],
  },
  {
    id: "gangneung",
    name: "강릉 복사꽃마을",
    region: "강원 강릉",
    desc: "분홍빛 복사꽃이 피어나는 동해안 감성 마을",
    img: "https://images.unsplash.com/photo-1741085614951-ebaaa6626b97?w=1600&h=1000&fit=crop&q=90",
    rating: 4.6,
    reviews: 198,
    tags: ["꽃길", "바다", "카페"],
  },
  {
    id: "yangju",
    name: "양주 안덕마을",
    region: "경기 양주",
    desc: "전통 한옥과 자연이 어우러진 수도권 근교 체험마을",
    img: "https://images.unsplash.com/photo-1771411068337-dce562770ca7?w=1600&h=1000&fit=crop&q=90",
    rating: 4.5,
    reviews: 312,
    tags: ["한옥", "체험", "가족"],
  },
  {
    id: "sancheong",
    name: "산청 남사예담촌",
    region: "경남 산청",
    desc: "담장 너머 역사가 살아 숨 쉬는 전통 한옥마을",
    img: "https://images.unsplash.com/photo-1710388766264-07a47a416e93?w=1600&h=1000&fit=crop&q=90",
    rating: 4.8,
    reviews: 401,
    tags: ["한옥", "역사", "전통"],
  },
  {
    id: "yangyang",
    name: "양양 달래촌마을",
    region: "강원 양양",
    desc: "서핑과 농촌체험을 동시에 즐길 수 있는 해변 마을",
    img: "https://images.unsplash.com/photo-1758622014699-2bfb8e5a2ce6?w=1600&h=1000&fit=crop&q=90",
    rating: 4.7,
    reviews: 356,
    tags: ["서핑", "해변", "체험"],
  },
];

const HERO_BG = "https://images.unsplash.com/photo-1762781960299-c70b9332a9aa?w=1920&h=1080&fit=crop";

// Aerial / drone images per village for VR intro & panorama
const villageAerialData: Record<string, { intro: string[]; aerial: string; introTexts: string[] }> = {
  boryeong: {
    intro: [
      "https://images.unsplash.com/photo-1733647781019-3a4d28ff86db?w=1920&h=1080&fit=crop&q=90",
      "https://images.unsplash.com/photo-1762781960299-c70b9332a9aa?w=1920&h=1080&fit=crop&q=90",
    ],
    aerial: "https://images.unsplash.com/photo-1761908105911-52a57e09a838?w=2400&h=1200&fit=crop&q=90",
    introTexts: ["충남 보령에 위치한 청라은행마을", "가을이면 노란 은행잎이 마을 전체를 물들입니다"],
  },
  cheongyang: {
    intro: [
      "https://images.unsplash.com/photo-1768141919912-d20b8f4119fe?w=1920&h=1080&fit=crop&q=90",
      "https://images.unsplash.com/photo-1617492046339-3a7a9f6e21e2?w=1920&h=1080&fit=crop&q=90",
    ],
    aerial: "https://images.unsplash.com/photo-1663053552790-b0791c1fa3be?w=2400&h=1200&fit=crop&q=90",
    introTexts: ["충남 청양의 알프스마을에 오신 것을 환영합니다", "겨울 얼음 축제와 짜릿한 짚라인이 기다립니다"],
  },
  icheon: {
    intro: [
      "https://images.unsplash.com/photo-1766025065806-0ed92891692d?w=1920&h=1080&fit=crop&q=90",
      "https://images.unsplash.com/photo-1761908105911-52a57e09a838?w=1920&h=1080&fit=crop&q=90",
    ],
    aerial: "https://images.unsplash.com/photo-1747605884870-5d93b06cc351?w=2400&h=1200&fit=crop&q=90",
    introTexts: ["경기 이천의 산수유마을입니다", "봄이면 노란 산수유꽃이 온 마을을 물들입니다"],
  },
  gangneung: {
    intro: [
      "https://images.unsplash.com/photo-1741085614951-ebaaa6626b97?w=1920&h=1080&fit=crop&q=90",
      "https://images.unsplash.com/photo-1576218411918-a7337a3768d8?w=1920&h=1080&fit=crop&q=90",
    ],
    aerial: "https://images.unsplash.com/photo-1576218411918-a7337a3768d8?w=2400&h=1200&fit=crop&q=90",
    introTexts: ["강원 강릉의 복사꽃마을을 소개합니다", "분홍빛 복사꽃과 동해안의 아름다운 풍경"],
  },
  yangju: {
    intro: [
      "https://images.unsplash.com/photo-1771411068337-dce562770ca7?w=1920&h=1080&fit=crop&q=90",
      "https://images.unsplash.com/photo-1747605884870-5d93b06cc351?w=1920&h=1080&fit=crop&q=90",
    ],
    aerial: "https://images.unsplash.com/photo-1747605884870-5d93b06cc351?w=2400&h=1200&fit=crop&q=90",
    introTexts: ["경기 양주의 안덕마을에 오신 것을 환영합니다", "전통 한옥과 자연이 어우러진 체험마을"],
  },
  sancheong: {
    intro: [
      "https://images.unsplash.com/photo-1710388766264-07a47a416e93?w=1920&h=1080&fit=crop&q=90",
      "https://images.unsplash.com/photo-1663053552790-b0791c1fa3be?w=1920&h=1080&fit=crop&q=90",
    ],
    aerial: "https://images.unsplash.com/photo-1663053552790-b0791c1fa3be?w=2400&h=1200&fit=crop&q=90",
    introTexts: ["경남 산청의 남사예담촌입니다", "담장 너머 역사가 살아 숨 쉬는 전통 한옥마을"],
  },
  yangyang: {
    intro: [
      "https://images.unsplash.com/photo-1758622014699-2bfb8e5a2ce6?w=1920&h=1080&fit=crop&q=90",
      "https://images.unsplash.com/photo-1576218411918-a7337a3768d8?w=1920&h=1080&fit=crop&q=90",
    ],
    aerial: "https://images.unsplash.com/photo-1576218411918-a7337a3768d8?w=2400&h=1200&fit=crop&q=90",
    introTexts: ["강원 양양의 달래촌마을입니다", "서핑과 농촌체험을 동시에 즐길 수 있는 해변 마을"],
  },
};

// Aerial hotspots with VR goggle icons
interface AerialHotspot {
  id: number;
  label: string;
  desc: string;
  x: number;
  y: number;
  icon: string;
}

const aerialHotspots: AerialHotspot[] = [
  { id: 1, label: "알프스대로 항공", desc: "마을 전체를 한눈에 내려다보는 항공 뷰포인트", x: 22, y: 38, icon: "🚁" },
  { id: 2, label: "선모소 솔밭나지", desc: "소나무 숲이 펼쳐진 힐링 산책로", x: 62, y: 30, icon: "🌲" },
  { id: 3, label: "마을 중심부", desc: "전통 가옥과 체험 시설이 밀집한 구역", x: 45, y: 55, icon: "🏘️" },
  { id: 4, label: "농경 체험지", desc: "계절 농작물 수확 체험이 가능한 밭", x: 75, y: 60, icon: "🌾" },
];

interface Hotspot {
  id: number;
  emoji: string;
  label: string;
  desc: string;
  x: number;
  y: number;
  img: string;
}

const hotspots: Hotspot[] = [
  { id: 1, emoji: "🍓", label: "체험장", desc: "딸기 따기, 잼 만들기 등 다양한 농촌 체험을 즐겨보세요.", x: 25, y: 40, img: "https://images.unsplash.com/photo-1758622014699-2bfb8e5a2ce6?w=400&h=300&fit=crop" },
  { id: 2, emoji: "🏡", label: "숙소", desc: "한옥과 펜션에서 편안한 하룻밤을 보내세요.", x: 60, y: 35, img: "https://images.unsplash.com/photo-1710388766264-07a47a416e93?w=400&h=300&fit=crop" },
  { id: 3, emoji: "🍲", label: "향토음식", desc: "마을 주민이 직접 만든 정성 가득한 시골 밥상.", x: 45, y: 65, img: "https://images.unsplash.com/photo-1765028295071-4d6e6d8620b7?w=400&h=300&fit=crop" },
  { id: 4, emoji: "🌳", label: "산책길", desc: "계절마다 다른 풍경의 힐링 산책로.", x: 80, y: 50, img: "https://images.unsplash.com/photo-1771411068337-dce562770ca7?w=400&h=300&fit=crop" },
  { id: 5, emoji: "📷", label: "포토존", desc: "인생샷 남기기 좋은 마을 포토스팟.", x: 15, y: 60, img: "https://images.unsplash.com/photo-1758622014699-2bfb8e5a2ce6?w=400&h=300&fit=crop" },
];

// ═══════════════════════════════════════
// Component
// ═══════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function VRPreviewPage() {
  // Page state
  const [activePage, setActivePage] = useState(0); // 0=hero, 1=grid
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeCategory, setActiveCategory] = useState("전체");

  const categories = ["전체", "체험마을", "치유마을", "교육농장", "치유농장"];

  // VR Viewer
  const [viewerItem, setViewerItem] = useState<Village | null>(null);
  const [vrPhase, setVrPhase] = useState<"intro" | "panorama">("intro");
  const [introSlide, setIntroSlide] = useState(0);
  const [introProgress, setIntroProgress] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Gamification
  const [discoveredSpots, setDiscoveredSpots] = useState<number[]>([]);
  const [showReward, setShowReward] = useState(false);

  // AI Guide
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: "ai" as const, text: "안녕하세요! 박순자 할머니입니다 🌿\n홍천 행복마을 VR 투어를 도와드릴게요. 궁금한 것을 물어보세요!" },
  ]);
  const [aiInput, setAiInput] = useState("");

  const touchStartY = useRef(0);

  // Carousel state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragMotionX = useMotionValue(0);
  const bottomTabsRef = useRef<HTMLDivElement>(null);

  const current = villages[currentIdx];

  // Auto-scroll bottom tabs to keep active tab visible
  useEffect(() => {
    if (bottomTabsRef.current) {
      const container = bottomTabsRef.current;
      const activeBtn = container.children[currentIdx] as HTMLElement | undefined;
      if (activeBtn) {
        const containerRect = container.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        const scrollLeft = container.scrollLeft + (btnRect.left - containerRect.left) - containerRect.width / 2 + btnRect.width / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [currentIdx]);

  // Auto-play carousel
  // Disabled: autoplay removed

  const goTo = useCallback((idx: number) => {
    setCurrentIdx(((idx % villages.length) + villages.length) % villages.length);
  }, []);

  const handleCarouselDragEnd = (_: any, info: any) => {
    if (info.offset.x < -60) goTo(currentIdx + 1);
    else if (info.offset.x > 60) goTo(currentIdx - 1);
  };

  // Keyboard nav for carousel
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (viewerItem || activePage !== 1) return;
      if (e.key === "ArrowLeft") goTo(currentIdx - 1);
      if (e.key === "ArrowRight") goTo(currentIdx + 1);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [currentIdx, viewerItem, goTo, activePage]);

  // 3D card positioning
  const getCardStyle = (index: number) => {
    const total = villages.length;
    let diff = index - currentIdx;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    const absDiff = Math.abs(diff);
    const sign = diff > 0 ? 1 : -1;
    return {
      x: diff === 0 ? 0 : sign * (340 + (absDiff - 1) * 260),
      z: diff === 0 ? 0 : -120 * absDiff,
      scale: diff === 0 ? 1.05 : Math.max(0.6, 0.82 - (absDiff - 1) * 0.12),
      rotateY: diff === 0 ? 0 : sign * -(25 + (absDiff - 1) * 8),
      opacity: absDiff <= 2 ? (diff === 0 ? 1 : absDiff === 1 ? 0.88 : 0.45) : 0,
      brightness: diff === 0 ? 1 : Math.max(0.4, 0.7 - (absDiff - 1) * 0.15),
      pointerEvents: (absDiff <= 1 ? "auto" : "none") as "auto" | "none",
    };
  };

  // ── Page transitions ──
  const transitionTo = useCallback((page: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActivePage(page);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  useEffect(() => {
    if (viewerItem) return;
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) return;
      if (e.deltaY > 30 && activePage === 0) transitionTo(1);
      else if (e.deltaY < -30 && activePage === 1) transitionTo(0);
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activePage, isTransitioning, viewerItem, transitionTo]);

  useEffect(() => {
    if (viewerItem) return;
    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (diff > 60 && activePage === 0) transitionTo(1);
      else if (diff < -60 && activePage === 1) transitionTo(0);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); };
  }, [activePage, isTransitioning, viewerItem, transitionTo]);

  // ── VR Viewer handlers ──
  const onMouseDown = (e: React.MouseEvent) => setDragStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
  const onMouseMove = (e: React.MouseEvent) => { if (!dragStart) return; setViewOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const onMouseUp = () => setDragStart(null);

  const handleHotspotClick = (hs: Hotspot) => {
    setActiveHotspot(activeHotspot === hs.id ? null : hs.id);
    if (!discoveredSpots.includes(hs.id)) {
      const newSpots = [...discoveredSpots, hs.id];
      setDiscoveredSpots(newSpots);
      if (newSpots.length === hotspots.length) {
        setTimeout(() => setShowReward(true), 600);
      }
    }
  };

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { role: "ai" as const, text: userMsg }]);
    setAiInput("");
    setTimeout(() => {
      const responses = [
        "이 마을은 봄에 방문하시면 딸기 체험을 할 수 있어요! 🍓",
        "숙소는 한옥 체험관이 인기가 많아요. 미리 예약하시는 걸 추천드려요!",
        "향토음식으로는 손두부와 산채비빔밥이 유명해요 🍲",
        "산책길은 약 2km 코스로, 40분 정도 소요됩니다 🌳",
      ];
      setAiMessages((prev) => [...prev, { role: "ai" as const, text: responses[Math.floor(Math.random() * responses.length)] }]);
    }, 1000);
  };

  // ══════════════════════════════════════════
  // Reward Popup
  // ══════════════════════════════════════════
  const RewardPopup = () => (
    <AnimatePresence>
      {showReward && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-[90%] max-w-[400px] text-center rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #fff, #FFF8E1)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
              padding: "48px 32px",
            }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1A1A1A", marginBottom: "8px" }}>축하합니다!</h2>
            <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.6, marginBottom: "24px" }}>
              {viewerItem?.name} VR 탐험 완료
            </p>
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "#FFB800/15" }}>
                <Gift size={18} color="#FFB800" />
                <span style={{ fontSize: "18px", fontWeight: 800, color: "#B8860B" }}>+50 포인트</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(155,89,182,0.1)" }}>
                <Award size={18} color="#9B59B6" />
                <span style={{ fontSize: "18px", fontWeight: 800, color: "#9B59B6" }}>VR 스탬프</span>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={() => setShowReward(false)}
                className="flex-1 py-3 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #2D5016, #4A7023)", fontSize: "14px", fontWeight: 700 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                내 여권 보기
              </motion.button>
              <motion.button
                onClick={() => setShowReward(false)}
                className="flex-1 py-3 rounded-xl"
                style={{ background: "#F5F5F5", fontSize: "14px", fontWeight: 600, color: "#666" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                계속 탐험
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ══════════════════════════════════════════
  // VR Full-screen Viewer
  // ══════════════════════════════════════════
  if (viewerItem) {
    const aerialData = villageAerialData[viewerItem.id] || villageAerialData.boryeong;
    const SLIDE_DURATION = 4000;
    const totalSlides = aerialData.intro.length;

    // ── INTRO PHASE ──
    if (vrPhase === "intro") {
      const IntroPhase = () => {
        const [slide, setSlide] = useState(0);
        const [progress, setProgress] = useState(0);
        const startTime = useRef(Date.now());
        const animRef = useRef<number>(0);

        useEffect(() => {
          const tick = () => {
            const elapsed = Date.now() - startTime.current;
            const slideElapsed = elapsed % SLIDE_DURATION;
            const currentSlide = Math.floor(elapsed / SLIDE_DURATION);
            if (currentSlide >= totalSlides) {
              setVrPhase("panorama");
              return;
            }
            setSlide(currentSlide);
            setProgress((slideElapsed / SLIDE_DURATION) * 100);
            animRef.current = requestAnimationFrame(tick);
          };
          animRef.current = requestAnimationFrame(tick);
          return () => cancelAnimationFrame(animRef.current);
        }, []);

        return (
          <div className="fixed inset-0 z-50 bg-black overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={slide} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
                <motion.img
                  src={aerialData.intro[slide]}
                  alt=""
                  className="w-full h-full object-cover select-none"
                  initial={{ scale: 1.1, x: slide % 2 === 0 ? "-3%" : "3%" }}
                  animate={{ scale: 1.2, x: slide % 2 === 0 ? "3%" : "-3%" }}
                  transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none" />

            {/* SKIP button */}
            <motion.button
              onClick={() => setVrPhase("panorama")}
              className="absolute top-6 right-6 z-30 flex items-center gap-2 px-5 py-2.5 rounded-lg"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              whileHover={{ background: "rgba(0,0,0,0.7)" }} whileTap={{ scale: 0.95 }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "white", letterSpacing: "1px" }}>SKIP</span>
              <ChevronRight size={16} color="white" />
              <span style={{ fontSize: "14px", color: "white" }}>|</span>
            </motion.button>

            {/* Logo top left */}
            <motion.div className="absolute top-6 left-6 z-30 flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(45,80,22,0.8)", backdropFilter: "blur(8px)" }}>
                <span style={{ fontSize: "18px" }}>🌿</span>
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 800, color: "white" }}>웰촌</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>농촌체험·휴양마을</p>
              </div>
            </motion.div>

            {/* Bottom info overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-16">
              <AnimatePresence mode="wait">
                <motion.div key={slide} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="max-w-[700px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-8 rounded-full" style={{ background: "#2D5016" }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "2px" }}>{viewerItem.region}</span>
                  </div>
                  <h1 className="text-white mb-3" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.5px" }}>{viewerItem.name}</h1>
                  <p className="text-white/70 mb-6" style={{ fontSize: "clamp(14px, 1.8vw, 18px)", lineHeight: 1.7 }}>{aerialData.introTexts[slide]}</p>
                  <div className="flex items-center gap-3">
                    {aerialData.intro.map((_, i) => (
                      <div key={i} className="h-1 rounded-full flex-1 overflow-hidden" style={{ background: "rgba(255,255,255,0.2)", maxWidth: "120px" }}>
                        <div className="h-full rounded-full" style={{ background: "white", width: i < slide ? "100%" : i === slide ? `${progress}%` : "0%", transition: "width 0.1s linear" }} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} className="absolute w-1 h-1 bg-white/30 rounded-full" style={{ left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.3 }} />
            ))}
          </div>
        );
      };

      return <IntroPhase />;
    }

    // ── PANORAMA PHASE (Aerial View) ──
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <RewardPopup />

        {/* Top bar with logo */}
        <div className="absolute top-0 left-0 right-0 h-[60px] flex items-center justify-between px-4 md:px-6 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => { setViewerItem(null); setVrPhase("intro"); setViewOffset({ x: 0, y: 0 }); setZoom(1); setActiveHotspot(null); setDiscoveredSpots([]); }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
              <X size={20} color="white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(45,80,22,0.8)" }}>
                <span style={{ fontSize: "14px" }}>🌿</span>
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 800, color: "white" }}>웰촌</p>
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>농촌체험·휴양마을</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full mr-2" style={{ background: "rgba(255,184,0,0.15)", border: "1px solid rgba(255,184,0,0.3)" }}>
              <Sparkles size={14} color="#FFB800" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#FFB800" }}>{discoveredSpots.length}/{aerialHotspots.length} 발견</span>
            </div>
            <button onClick={() => setAutoRotate(!autoRotate)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${autoRotate ? "bg-[#4A90E2]" : ""}`} style={autoRotate ? {} : { background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
              <RotateCw size={16} color="white" />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
              <Maximize2 size={16} color="white" />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
              <Share2 size={16} color="white" />
            </button>
          </div>
        </div>

        {/* Aerial panorama viewport */}
        <div className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onWheel={(e) => setZoom((z) => Math.max(0.5, Math.min(3, z - e.deltaY * 0.001)))}
          onDoubleClick={() => { setZoom(1); setViewOffset({ x: 0, y: 0 }); }}>
          <ImageWithFallback src={aerialData.aerial} alt={viewerItem.name} className="w-full h-full object-cover select-none"
            style={{ transform: `translate(${viewOffset.x * 0.3}px, ${viewOffset.y * 0.3}px) scale(${zoom})`, transition: dragStart ? "none" : "transform 0.3s ease", animation: autoRotate ? "vrPan 25s linear infinite" : "none" }} />

          {/* Floating aerial hotspots */}
          {aerialHotspots.map((hs) => {
            const isActive = activeHotspot === hs.id;
            const isDiscovered = discoveredSpots.includes(hs.id);
            return (
              <div key={hs.id} className="absolute cursor-pointer z-10" style={{ left: `${hs.x}%`, top: `${hs.y}%`, transform: "translate(-50%, -50%)" }}
                onClick={() => { setActiveHotspot(isActive ? null : hs.id); if (!discoveredSpots.includes(hs.id)) { const ns = [...discoveredSpots, hs.id]; setDiscoveredSpots(ns); if (ns.length === aerialHotspots.length) setTimeout(() => setShowReward(true), 600); } }}>
                <motion.div className="relative flex flex-col items-center" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: hs.id * 0.4 }}>
                  {/* VR goggle icon */}
                  <div className="w-16 h-12 rounded-2xl flex items-center justify-center relative"
                    style={{ background: isDiscovered ? "rgba(45,80,22,0.85)" : "rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: isDiscovered ? "2px solid rgba(45,80,22,1)" : "2px solid rgba(255,255,255,0.6)" }}>
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-4 rounded-lg" style={{ background: isDiscovered ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)" }} />
                      <div className="w-1 h-2 rounded-full" style={{ background: isDiscovered ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
                      <div className="w-5 h-4 rounded-lg" style={{ background: isDiscovered ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)" }} />
                    </div>
                    {isDiscovered && <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FFB800] rounded-full flex items-center justify-center" style={{ fontSize: "10px" }}>✓</div>}
                  </div>
                  <div className="mt-1.5 px-3 py-1 rounded-full whitespace-nowrap" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "white" }}>{hs.label}</span>
                  </div>
                  <div className="w-px h-6 bg-white/30" />
                  <div className="w-2 h-2 rounded-full bg-white/50" />
                </motion.div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div className="absolute z-30" style={{ bottom: "calc(100% + 16px)", left: "50%", transform: "translateX(-50%)", width: "280px", background: "rgba(255,255,255,0.95)", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", overflow: "hidden" }}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{ fontSize: "18px" }}>{hs.icon}</span>
                          <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#1A1A1A" }}>{hs.label}</h4>
                        </div>
                        <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "12px" }}>{hs.desc}</p>
                        <button className="w-full py-2.5 rounded-xl text-white flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #2D5016, #4A7023)", fontSize: "13px", fontWeight: 700 }}>
                          <Camera size={14} /> VR 체험하기
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Bottom center controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
              <MapPin size={14} color="white" />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>{viewerItem.name}</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>·</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>항공 뷰</span>
            </div>
          </div>
        </div>

        {/* AI Guide Floating Button */}
        <motion.button onClick={() => setAiOpen(!aiOpen)} className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4A90E2, #357ABD)", boxShadow: "0 8px 32px rgba(74,144,226,0.4)" }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <MessageCircle size={22} color="white" />
        </motion.button>

        {/* AI Chat Panel */}
        <AnimatePresence>
          {aiOpen && (
            <motion.div className="fixed bottom-24 right-6 z-40 w-[340px] max-h-[440px] flex flex-col overflow-hidden"
              style={{ background: "rgba(255,255,255,0.97)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: "1px solid rgba(0,0,0,0.06)" }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}>
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #F0F0F0" }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A90E2] to-[#357ABD] flex items-center justify-center" style={{ fontSize: "18px" }}>👩‍🌾</div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>박순자 할머니</p>
                  <p style={{ fontSize: "11px", color: "#999" }}>{viewerItem.name} AI 가이드</p>
                </div>
                <button onClick={() => setAiOpen(false)} className="ml-auto p-1 hover:bg-gray-100 rounded-full"><X size={16} color="#999" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: "280px" }}>
                {aiMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"}`}>
                    <div className="max-w-[85%] px-4 py-2.5 rounded-2xl" style={{ background: msg.role === "ai" ? "#F5F7FA" : "#4A90E2", color: msg.role === "ai" ? "#333" : "white", fontSize: "13px", lineHeight: 1.6, borderBottomLeftRadius: msg.role === "ai" ? "6px" : "16px", borderBottomRightRadius: msg.role === "ai" ? "16px" : "6px", whiteSpace: "pre-line" }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 flex-wrap">
                  {["체험 추천", "숙소 안내", "오늘의 코스"].map((q) => (
                    <button key={q} onClick={() => setAiInput(q)} className="px-3 py-1.5 rounded-full" style={{ background: "rgba(74,144,226,0.1)", fontSize: "12px", fontWeight: 600, color: "#4A90E2" }}>{q}</button>
                  ))}
                </div>
              </div>
              <div className="px-4 py-3 flex gap-2" style={{ borderTop: "1px solid #F0F0F0" }}>
                <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAiSend()} placeholder="궁금한 것을 물어보세요..." className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F7FA] outline-none" style={{ fontSize: "13px" }} />
                <motion.button onClick={handleAiSend} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#4A90E2" }} whileTap={{ scale: 0.9 }}>
                  <ChevronRight size={18} color="white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          @keyframes vrPan {
            0% { transform: scale(1.15) translateX(0); }
            25% { transform: scale(1.15) translateX(-3%); }
            50% { transform: scale(1.15) translateX(0) translateY(-2%); }
            75% { transform: scale(1.15) translateX(3%); }
            100% { transform: scale(1.15) translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // Main Page
  // ══════════════════════════════════════════
  return (
    <div className="bg-[#0D1117] h-screen overflow-hidden relative">
      {/* Page indicator dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        {[0, 1].map((p) => (
          <button
            key={p}
            onClick={() => transitionTo(p)}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{
              background: activePage === p ? "#2D5016" : "rgba(255,255,255,0.3)",
              transform: activePage === p ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── Page 0: Hero ─── */}
        {activePage === 0 && (
          <motion.section
            key="hero"
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -60 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <ImageWithFallback
              src={HERO_BG}
              alt="VR 농촌여행"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

            {/* Glassmorphism card */}
            <motion.div
              className="relative z-10 text-center px-8 md:px-16 py-12 md:py-16 max-w-[720px] w-[90%]"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "24px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(45,80,22,0.85)" }}>
                  <span style={{ fontSize: "16px" }}>🌿</span>
                </div>
                <span className="text-white/90" style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "3px" }}>
                  이웃우리
                </span>
              </div>

              <h1 className="text-white mb-4" style={{ fontSize: "clamp(32px, 5.5vw, 56px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-1px" }}>
                VR로 먼저 만나보는
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8BC34A] to-[#4CAF50]">농촌 여행</span>
              </h1>
              <p className="text-white/75 mb-8" style={{ fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 400, lineHeight: 1.7 }}>
                마을 풍경과 체험 공간을 360° VR로 미리 둘러보세요.
              </p>

              <motion.button
                onClick={() => transitionTo(1)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white mx-auto"
                style={{
                  background: "linear-gradient(135deg, #2D5016, #4A7023)",
                  fontSize: "16px",
                  fontWeight: 700,
                  boxShadow: "0 8px 32px rgba(45,80,22,0.4)",
                }}
                whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(45,80,22,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Play size={18} />
                VR 탐험 시작
              </motion.button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.button
              onClick={() => transitionTo(1)}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Mouse size={20} />
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>Scroll</span>
            </motion.button>
          </motion.section>
        )}

        {/* ─── Page 1: Village Grid ── */}
        {activePage === 1 && (
          <motion.section
            key="grid"
            className="absolute inset-0 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* BG */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332] via-[#1e2a3a] to-[#151d2a]" />

            {/* Dynamic blurred background */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <ImageWithFallback
                    src={current.img}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: "blur(50px) brightness(0.3) saturate(0.8)", transform: "scale(1.2)" }}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-[#1a2332]/60" />
            </div>

            {/* Header - 웰촌 VR농촌여행 */}
            <div className="relative z-20 flex items-center gap-3 px-6 md:px-10 pt-6 pb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(45,80,22,0.9)" }}
                >
                  <span style={{ fontSize: "14px" }}>🌿</span>
                </div>
                
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>
                VR농촌여행
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="relative z-20 flex items-center gap-2 px-6 md:px-10 pb-2 pt-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-4 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all"
                    style={{
                      background: isActive ? "rgba(45,80,22,0.9)" : "rgba(255,255,255,0.08)",
                      color: isActive ? "white" : "rgba(255,255,255,0.5)",
                      fontSize: "13px",
                      fontWeight: isActive ? 700 : 500,
                      border: isActive ? "1px solid rgba(45,80,22,1)" : "1px solid rgba(255,255,255,0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cat}
                  </motion.button>
                );
              })}
            </div>

            {/* 3D Carousel area */}
            <div className="relative flex-1 flex items-center justify-center z-10 overflow-visible">
              <VRCircleGallery
                villages={villages}
                currentIdx={currentIdx}
                onSelect={goTo}
                onViewVR={(v) => { setVrPhase("intro"); setIntroSlide(0); setViewerItem(v); }}
              />
            </div>

            {/* Bottom Navigation Tabs */}
            <div className="relative z-10 px-4 md:px-8 pb-6 pt-4">
              <div
                className="relative flex items-center mx-auto max-w-[1200px]"
              >
                {/* Left arrow */}
                <motion.button
                  onClick={() => goTo(currentIdx - 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  whileHover={{ background: "rgba(255,255,255,0.15)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={18} color="rgba(255,255,255,0.7)" />
                </motion.button>

                <div
                  className="flex items-center gap-0 overflow-x-auto flex-1 mx-3"
                  style={{ scrollbarWidth: "none" }}
                  ref={bottomTabsRef}
                >
                  {villages.map((v, i) => {
                    const isActive = i === currentIdx;
                    return (
                      <div key={v.id} className="flex items-center">
                        <motion.button
                          onClick={() => goTo(i)}
                          className="flex items-center gap-3 px-4 md:px-5 py-3 whitespace-nowrap shrink-0 rounded-xl relative"
                          whileTap={{ scale: 0.97 }}
                        >
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
                            style={{
                              fontSize: "12px",
                              fontWeight: 800,
                              background: isActive ? "#2D5016" : "rgba(255,255,255,0.12)",
                              color: "white",
                              boxShadow: isActive ? "0 2px 8px rgba(45,80,22,0.4)" : "none",
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: isActive ? 700 : 400,
                              color: isActive ? "white" : "rgba(255,255,255,0.45)",
                            }}
                          >
                            {v.name}
                          </span>
                        </motion.button>
                        {i < villages.length - 1 && (
                          <span className="hidden md:inline" style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px" }}>|</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right arrow */}
                <motion.button
                  onClick={() => goTo(currentIdx + 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  whileHover={{ background: "rgba(255,255,255,0.15)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={18} color="rgba(255,255,255,0.7)" />
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}