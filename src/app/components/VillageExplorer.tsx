import { useState, useEffect, useRef, useCallback } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ChevronLeft, ChevronRight, Play, Eye, Star, Clock, MapPin, Users, ArrowLeft,
  Home, Utensils, TreePine, Camera, Compass, Heart, X, Volume2, VolumeX, Pause, RotateCw, Maximize2, Share2, Info,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";

// ═══════════════════════════════════════
// Types & Data
// ═══════════════════════════════════════

type VillageCategory = "scenery" | "accommodation" | "experience" | "facility";

interface VillagePOI {
  id: number;
  title: string;
  desc: string;
  img: string;
  rating?: number;
  duration?: string;
}

interface Village {
  id: string;
  name: string;
  region: string;
  desc: string;
  thumbnail: string;
  videoId: string; // YouTube video ID placeholder
  rating: number;
  visitors: string;
  programs: number;
  tags: string[];
  categories: Record<VillageCategory, VillagePOI[]>;
}

const categoryMeta: { key: VillageCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "scenery", label: "마을전경", icon: <TreePine size={16} />, color: "#2D5016" },
  { key: "accommodation", label: "숙박시설", icon: <Home size={16} />, color: "#4A90E2" },
  { key: "experience", label: "체험활동", icon: <Camera size={16} />, color: "#FF6B35" },
  { key: "facility", label: "편의시설", icon: <Utensils size={16} />, color: "#9B59B6" },
];

const villages: Village[] = [
  {
    id: "goradei",
    name: "고라데이 마을",
    region: "강원 홍천",
    desc: "전통 한옥과 딸기 체험이 어우러진 아름다운 산골 마을. 사계절 다양한 농촌 체험과 힐링을 경험할 수 있습니다.",
    thumbnail: "https://images.unsplash.com/photo-1762781960741-08923e31caf4?w=800&h=500&fit=crop",
    videoId: "dQw4w9WgXcQ",
    rating: 4.9,
    visitors: "12,340",
    programs: 8,
    tags: ["인기", "추천"],
    categories: {
      scenery: [
        { id: 101, title: "마을 입구 전경", desc: "환영 표지판과 마을 입구의 아름다운 풍경", img: "https://images.unsplash.com/photo-1762781960741-08923e31caf4?w=800&h=500&fit=crop", rating: 4.9, duration: "2분" },
        { id: 102, title: "중앙광장 360°", desc: "마을 주민들이 모이는 중심 광장", img: "https://images.unsplash.com/photo-1637872937209-e1a5ccdc90cc?w=800&h=500&fit=crop", rating: 4.7, duration: "3분" },
        { id: 103, title: "전망대 파노라마", desc: "언덕 위 전망대에서 내려다본 마을 전경", img: "https://images.unsplash.com/photo-1608335715837-1994a535d5c3?w=800&h=500&fit=crop", rating: 5.0, duration: "2분" },
      ],
      accommodation: [
        { id: 104, title: "청송재 한옥", desc: "전통 한옥의 아름다운 외관과 온돌 체험", img: "https://images.unsplash.com/photo-1650476524542-c5cc53306700?w=800&h=500&fit=crop", rating: 4.8, duration: "4분" },
        { id: 105, title: "감나무 게스트하우스", desc: "편안한 원룸형 숙소와 넓은 마당", img: "https://images.unsplash.com/photo-1758983065583-9cea714214f9?w=800&h=500&fit=crop", rating: 4.6, duration: "3분" },
      ],
      experience: [
        { id: 106, title: "딸기 수확 체험", desc: "비닐하우스에서 직접 딸기를 따보는 체험", img: "https://images.unsplash.com/photo-1769282096453-102e42efe67b?w=800&h=500&fit=crop", rating: 4.9, duration: "3분" },
        { id: 107, title: "도자기 공방 체험", desc: "직접 도자기를 빚어보는 전통 공예 체험", img: "https://images.unsplash.com/photo-1763824372117-1ff339b522e9?w=800&h=500&fit=crop", rating: 4.5, duration: "2분" },
        { id: 108, title: "전통 음식 만들기", desc: "향토 음식을 직접 만들어보는 쿠킹 클래스", img: "https://images.unsplash.com/photo-1761309101977-bc309d3d8668?w=800&h=500&fit=crop", rating: 4.8, duration: "4분" },
      ],
      facility: [
        { id: 109, title: "마을 식당 내부", desc: "로컬 재료로 만든 향토 음식점", img: "https://images.unsplash.com/photo-1751768853628-d858aaf85c78?w=800&h=500&fit=crop", rating: 4.7, duration: "2분" },
      ],
    },
  },
  {
    id: "bongpyeong",
    name: "봉평 허브나라 마을",
    region: "강원 평창",
    desc: "허브 향기 가득한 고원 마을. 라벤더 밭과 메밀꽃 축제로 유명하며, 다양한 허브 체험 프로그램을 운영합니다.",
    thumbnail: "https://images.unsplash.com/photo-1769799188926-2914965e9cb2?w=800&h=500&fit=crop",
    videoId: "dQw4w9WgXcQ",
    rating: 4.7,
    visitors: "8,920",
    programs: 6,
    tags: ["허브", "힐링"],
    categories: {
      scenery: [
        { id: 201, title: "라벤더 밭 전경", desc: "보랏빛 라벤더 꽃밭이 펼쳐진 풍경", img: "https://images.unsplash.com/photo-1769799188926-2914965e9cb2?w=800&h=500&fit=crop", rating: 4.9, duration: "3분" },
        { id: 202, title: "메밀꽃 언덕", desc: "하얀 메밀꽃이 만개한 언덕길", img: "https://images.unsplash.com/photo-1769921302249-cc5704990a27?w=800&h=500&fit=crop", rating: 4.8, duration: "2분" },
      ],
      accommodation: [
        { id: 203, title: "허브 하우스", desc: "허브 향기 가득한 목조 숙소", img: "https://images.unsplash.com/photo-1758983065583-9cea714214f9?w=800&h=500&fit=crop", rating: 4.7, duration: "3분" },
      ],
      experience: [
        { id: 204, title: "허브 비누 만들기", desc: "직접 허브를 넣어 천연 비누를 만드는 체험", img: "https://images.unsplash.com/photo-1763824372117-1ff339b522e9?w=800&h=500&fit=crop", rating: 4.6, duration: "2분" },
      ],
      facility: [
        { id: 205, title: "허브 카페", desc: "허브 차와 디저트를 즐기는 마을 카페", img: "https://images.unsplash.com/photo-1751768853628-d858aaf85c78?w=800&h=500&fit=crop", rating: 4.8, duration: "2분" },
      ],
    },
  },
  {
    id: "haenyeo",
    name: "해녀의 마을",
    region: "제주 구좌",
    desc: "제주 해녀 문화를 체험할 수 있는 해안 마을. 바다 체험과 신선한 해산물, 돌담길 산책을 즐길 수 있습니다.",
    thumbnail: "https://images.unsplash.com/photo-1683776074479-c272ef0e3a56?w=800&h=500&fit=crop",
    videoId: "dQw4w9WgXcQ",
    rating: 4.8,
    visitors: "15,700",
    programs: 10,
    tags: ["바다", "문화"],
    categories: {
      scenery: [
        { id: 301, title: "해안 절경", desc: "에메랄드빛 바다와 현무암 해안선", img: "https://images.unsplash.com/photo-1683776074479-c272ef0e3a56?w=800&h=500&fit=crop", rating: 5.0, duration: "3분" },
      ],
      accommodation: [
        { id: 302, title: "돌담집 스테이", desc: "제주 전통 돌담집을 개조한 숙소", img: "https://images.unsplash.com/photo-1758983065583-9cea714214f9?w=800&h=500&fit=crop", rating: 4.9, duration: "4분" },
      ],
      experience: [
        { id: 303, title: "해녀 물질 체험", desc: "해녀와 함께하는 바다 체험 프로그램", img: "https://images.unsplash.com/photo-1683776074479-c272ef0e3a56?w=800&h=500&fit=crop", rating: 4.9, duration: "5분" },
      ],
      facility: [
        { id: 304, title: "해녀 횟집", desc: "갓 잡은 해산물을 맛보는 해녀 식당", img: "https://images.unsplash.com/photo-1751768853628-d858aaf85c78?w=800&h=500&fit=crop", rating: 4.8, duration: "2분" },
      ],
    },
  },
  {
    id: "damyang",
    name: "담양 대나무 마을",
    region: "전남 담양",
    desc: "울창한 대나무숲이 둘러싼 생태 마을. 죽녹원 산책과 대통밥 체험, 한옥 스테이를 즐길 수 있습니다.",
    thumbnail: "https://images.unsplash.com/photo-1754810940745-25668d27581e?w=800&h=500&fit=crop",
    videoId: "dQw4w9WgXcQ",
    rating: 4.6,
    visitors: "10,200",
    programs: 7,
    tags: ["생태", "죽녹원"],
    categories: {
      scenery: [
        { id: 401, title: "대나무숲 산책로", desc: "빽빽한 대나무숲 사이로 난 산책길", img: "https://images.unsplash.com/photo-1754810940745-25668d27581e?w=800&h=500&fit=crop", rating: 4.9, duration: "3분" },
      ],
      accommodation: [
        { id: 402, title: "죽림재 한옥", desc: "대나무 정원이 보이는 전통 한옥 숙소", img: "https://images.unsplash.com/photo-1650476524542-c5cc53306700?w=800&h=500&fit=crop", rating: 4.7, duration: "3분" },
      ],
      experience: [
        { id: 403, title: "대통밥 만들기", desc: "대나무통에 밥을 지어 먹는 전통 체험", img: "https://images.unsplash.com/photo-1761309101977-bc309d3d8668?w=800&h=500&fit=crop", rating: 4.8, duration: "4분" },
      ],
      facility: [
        { id: 404, title: "죽로차 찻집", desc: "대나무 이슬로 우려낸 죽로차 전문 찻집", img: "https://images.unsplash.com/photo-1751768853628-d858aaf85c78?w=800&h=500&fit=crop", rating: 4.5, duration: "2분" },
      ],
    },
  },
];

// ═══════════════════════════════════════
// Component
// ═══════════════════════════════════════

export function VillageExplorer({ onOpenViewer }: { onOpenViewer: (item: VillagePOI) => void }) {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [villageIdx, setVillageIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState<VillageCategory>("scenery");
  const [poiIdx, setPoiIdx] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragX = useMotionValue(0);

  // Auto-play village carousel
  useEffect(() => {
    if (isAutoPlay && !selectedVillage) {
      autoRef.current = setInterval(() => {
        setVillageIdx((p) => (p + 1) % villages.length);
      }, 5000);
      return () => { if (autoRef.current) clearInterval(autoRef.current); };
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [isAutoPlay, selectedVillage]);

  // Reset POI index when category changes
  useEffect(() => { setPoiIdx(0); }, [activeCategory, selectedVillage]);

  const goVillage = useCallback((idx: number) => {
    setVillageIdx(((idx % villages.length) + villages.length) % villages.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  }, []);

  const handleDragEnd = (_: any, info: any) => {
    if (selectedVillage) {
      const items = selectedVillage.categories[activeCategory];
      if (info.offset.x < -50) setPoiIdx((p) => Math.min(p + 1, items.length - 1));
      else if (info.offset.x > 50) setPoiIdx((p) => Math.max(p - 1, 0));
    } else {
      if (info.offset.x < -50) goVillage(villageIdx + 1);
      else if (info.offset.x > 50) goVillage(villageIdx - 1);
    }
  };

  const getCardStyle = (index: number) => {
    const total = villages.length;
    let diff = index - villageIdx;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    const absDiff = Math.abs(diff);
    const isCenter = diff === 0;
    return {
      x: diff * 340,
      scale: isCenter ? 1 : Math.max(0.72, 1 - absDiff * 0.14),
      rotateY: diff * -10,
      z: isCenter ? 50 : 50 - absDiff * 25,
      opacity: absDiff <= 2 ? (isCenter ? 1 : Math.max(0.25, 1 - absDiff * 0.38)) : 0,
      filter: isCenter ? "brightness(1)" : `brightness(${Math.max(0.55, 1 - absDiff * 0.22)})`,
      pointerEvents: (absDiff <= 1 ? "auto" : "none") as "auto" | "none",
    };
  };

  // ═════════════════════════════════════
  // Village Detail View
  // ═════════════════════════════════════
  if (selectedVillage) {
    const currentPOIs = selectedVillage.categories[activeCategory];
    const currentPOI = currentPOIs[poiIdx];

    return (
      <div className="relative bg-gradient-to-b from-[#0D1117] via-[#161B22] to-[#0D1117] py-8 overflow-hidden">
        {/* Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(45,80,22,0.15) 0%, transparent 70%)" }} />

        <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
          {/* Back button + Village header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => { setSelectedVillage(null); setIsVideoPlaying(false); }}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} color="white" />
            </motion.button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-white truncate" style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
                  {selectedVillage.name}
                </h2>
                {selectedVillage.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-white shrink-0" style={{ fontSize: "10px", fontWeight: 700, background: "rgba(255,107,53,0.8)" }}>{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-1 text-white/50" style={{ fontSize: "13px" }}>
                <span className="flex items-center gap-1"><MapPin size={12} />{selectedVillage.region}</span>
                <span className="flex items-center gap-1"><Star size={12} fill="#FFB800" color="#FFB800" />{selectedVillage.rating}</span>
                <span className="flex items-center gap-1"><Users size={12} />{selectedVillage.visitors}명 방문</span>
              </div>
            </div>
          </div>

          {/* ── Video Intro Section ── */}
          <motion.div
            className="relative rounded-[20px] overflow-hidden mb-8"
            style={{ aspectRatio: "16/9", maxHeight: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isVideoPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${selectedVillage.videoId}?autoplay=1&mute=1&rel=0`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={`${selectedVillage.name} 소개 영상`}
              />
            ) : (
              <>
                <ImageWithFallback
                  src={selectedVillage.thumbnail}
                  alt={selectedVillage.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                {/* Play overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.button
                    onClick={() => setIsVideoPlaying(true)}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 0 0 6px rgba(255,255,255,0.2)",
                    }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={30} fill="#2D5016" color="#2D5016" style={{ marginLeft: "3px" }} />
                  </motion.button>
                  <p className="text-white" style={{ fontSize: "16px", fontWeight: 700 }}>마을 소개 영상 보기</p>
                  <p className="text-white/50 mt-1" style={{ fontSize: "13px" }}>2분 30초 · 드론 촬영 포함</p>
                </div>
                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-end justify-between">
                  <p className="text-white/70" style={{ fontSize: "14px", lineHeight: 1.5, maxWidth: "60%" }}>
                    {selectedVillage.desc}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1.5 rounded-lg text-white flex items-center gap-1" style={{ fontSize: "12px", fontWeight: 600, background: "rgba(45,80,22,0.8)", backdropFilter: "blur(8px)" }}>
                      <Compass size={12} /> 체험 {selectedVillage.programs}종
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* ── Category Tabs ── */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {categoryMeta.map((cat) => {
              const count = selectedVillage.categories[cat.key].length;
              const isActive = activeCategory === cat.key;
              return (
                <motion.button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all shrink-0"
                  style={{
                    background: isActive ? cat.color : "rgba(255,255,255,0.06)",
                    border: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                    color: isActive ? "white" : "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cat.icon}
                  {cat.label}
                  <span className="px-1.5 py-0.5 rounded-md" style={{
                    fontSize: "10px", fontWeight: 700,
                    background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  }}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* ── POI Carousel ── */}
          {currentPOIs.length > 0 ? (
            <div className="relative">
              {/* Main POI card */}
              <motion.div
                className="cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPOI.id}
                    className="rounded-[20px] overflow-hidden"
                    style={{
                      boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
                      background: "linear-gradient(145deg, rgba(30,35,45,0.95), rgba(20,25,35,0.98))",
                    }}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {/* Image */}
                      <div className="relative h-[240px] md:h-[340px] overflow-hidden">
                        <ImageWithFallback
                          src={currentPOI.img}
                          alt={currentPOI.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#161B22]/50 hidden md:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent md:hidden" />
                        {/* Badge */}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white flex items-center gap-1" style={{
                          fontSize: "11px", fontWeight: 700,
                          background: `${categoryMeta.find(c => c.key === activeCategory)?.color || "#9B59B6"}cc`,
                          backdropFilter: "blur(8px)",
                        }}>
                          <RotateCw size={10} /> 360° VR
                        </span>
                        {currentPOI.duration && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                            <Clock size={10} color="white" />
                            <span className="text-white" style={{ fontSize: "11px" }}>{currentPOI.duration}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/40" style={{ fontSize: "12px", fontWeight: 600 }}>
                            {categoryMeta.find(c => c.key === activeCategory)?.label}
                          </span>
                          <span className="text-white/20">•</span>
                          <span className="text-white/40" style={{ fontSize: "12px" }}>{poiIdx + 1} / {currentPOIs.length}</span>
                        </div>
                        <h3 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 700 }}>{currentPOI.title}</h3>
                        {currentPOI.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={14} fill={s <= Math.floor(currentPOI.rating!) ? "#FFB800" : "transparent"} color={s <= Math.floor(currentPOI.rating!) ? "#FFB800" : "#555"} />
                            ))}
                            <span className="text-[#FFB800] ml-1" style={{ fontSize: "14px", fontWeight: 700 }}>{currentPOI.rating}</span>
                          </div>
                        )}
                        <p className="text-white/50 mb-6" style={{ fontSize: "15px", lineHeight: 1.6 }}>{currentPOI.desc}</p>
                        <motion.button
                          onClick={() => onOpenViewer(currentPOI)}
                          className="w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2"
                          style={{
                            background: `linear-gradient(135deg, ${categoryMeta.find(c => c.key === activeCategory)?.color || "#9B59B6"}, ${categoryMeta.find(c => c.key === activeCategory)?.color || "#9B59B6"}cc)`,
                            fontSize: "15px",
                            fontWeight: 700,
                            boxShadow: `0 4px 20px ${categoryMeta.find(c => c.key === activeCategory)?.color || "#9B59B6"}66`,
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Eye size={18} /> 360° VR 투어 시작
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* POI thumbnail strip */}
              {currentPOIs.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                  {currentPOIs.map((poi, i) => (
                    <motion.button
                      key={poi.id}
                      onClick={() => setPoiIdx(i)}
                      className="shrink-0 rounded-xl overflow-hidden relative group"
                      style={{
                        width: "140px",
                        height: "90px",
                        border: i === poiIdx ? `2px solid ${categoryMeta.find(c => c.key === activeCategory)?.color}` : "2px solid rgba(255,255,255,0.08)",
                        opacity: i === poiIdx ? 1 : 0.6,
                      }}
                      whileHover={{ opacity: 1, scale: 1.03 }}
                    >
                      <ImageWithFallback src={poi.img} alt={poi.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                        <span className="text-white truncate w-full" style={{ fontSize: "11px", fontWeight: 600 }}>{poi.title}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <span style={{ fontSize: "40px" }}>🏗️</span>
              <p className="text-white/40 mt-3" style={{ fontSize: "14px" }}>이 카테고리의 VR 콘텐츠를 준비 중입니다</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════
  // Village Selection Carousel
  // ═════════════════════════════════════
  return (
    <div className="relative bg-gradient-to-b from-[#0D1117] via-[#161B22] to-[#0D1117] py-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(155,89,182,0.15) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(74,144,226,0.1) 0%, transparent 70%)" }} />

      {/* Section title */}
      <div className="text-center mb-10 relative z-10">
        <p className="text-[#9B59B6] mb-2" style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>
          Virtual Village Tour
        </p>
        <h2 className="text-white" style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700 }}>
          마을을 선택하여 VR로 둘러보세요
        </h2>
        <p className="text-white/40 mt-2" style={{ fontSize: "15px" }}>
          전국 {villages.length}개 농촌 마을의 360° 가상 투어
        </p>
      </div>

      {/* 3D Carousel */}
      <div className="relative h-[500px] md:h-[540px]" style={{ perspective: "1200px" }}>
        {/* Nav arrows */}
        <button
          onClick={() => goVillage(villageIdx - 1)}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ChevronLeft size={22} color="white" />
        </button>
        <button
          onClick={() => goVillage(villageIdx + 1)}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ChevronRight size={22} color="white" />
        </button>

        {/* Cards */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x: dragX, transformStyle: "preserve-3d" }}
        >
          {villages.map((village, index) => {
            const style = getCardStyle(index);
            const isCenter = index === villageIdx;
            const totalPOIs = Object.values(village.categories).flat().length;

            return (
              <motion.div
                key={village.id}
                className="absolute"
                animate={{
                  x: style.x,
                  scale: style.scale,
                  rotateY: style.rotateY,
                  opacity: style.opacity,
                  z: style.z,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                style={{
                  transformStyle: "preserve-3d",
                  pointerEvents: style.pointerEvents,
                  zIndex: 10 - Math.abs(index - villageIdx),
                  filter: style.filter,
                }}
                onMouseEnter={() => setHoveredCard(village.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="rounded-[24px] overflow-hidden transition-shadow duration-300"
                  style={{
                    width: "clamp(290px, 40vw, 420px)",
                    boxShadow: isCenter
                      ? "0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(155,89,182,0.3), 0 0 80px rgba(155,89,182,0.15)"
                      : "0 10px 30px rgba(0,0,0,0.3)",
                    background: "linear-gradient(145deg, rgba(30,35,45,0.95), rgba(20,25,35,0.98))",
                    border: isCenter ? "1px solid rgba(155,89,182,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {/* Image */}
                  <div className="relative h-[220px] md:h-[260px] overflow-hidden">
                    <ImageWithFallback
                      src={village.thumbnail}
                      alt={village.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      style={{ transform: hoveredCard === village.id && isCenter ? "scale(1.08)" : "scale(1)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent" />

                    {/* Region badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-white flex items-center gap-1" style={{ fontSize: "11px", fontWeight: 700, background: "rgba(45,80,22,0.85)", backdropFilter: "blur(8px)" }}>
                        <MapPin size={10} /> {village.region}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      {village.tags.map((tag, ti) => (
                        <span key={ti} className="px-2 py-0.5 rounded-md text-white" style={{
                          fontSize: "10px", fontWeight: 600,
                          background: tag === "추천" || tag === "인기" ? "rgba(255,107,53,0.85)" : "rgba(255,255,255,0.15)",
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Play video hint (center only) */}
                    <AnimatePresence>
                      {isCenter && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.button
                            onClick={() => setSelectedVillage(village)}
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                              background: "rgba(255,255,255,0.95)",
                              boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 4px rgba(155,89,182,0.3)",
                            }}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Play size={24} fill="#2D5016" color="#2D5016" style={{ marginLeft: "2px" }} />
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* POI count */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                      <Eye size={10} color="white" />
                      <span className="text-white" style={{ fontSize: "11px" }}>VR {totalPOIs}개</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white flex-1" style={{ fontSize: "18px", fontWeight: 700 }}>{village.name}</h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star size={13} fill="#FFB800" color="#FFB800" />
                        <span className="text-[#FFB800]" style={{ fontSize: "13px", fontWeight: 700 }}>{village.rating}</span>
                      </div>
                    </div>
                    <p className="text-white/45 mb-3 line-clamp-2" style={{ fontSize: "13px", lineHeight: 1.5 }}>{village.desc}</p>

                    {/* Mini category icons */}
                    <div className="flex items-center gap-2 mb-4">
                      {categoryMeta.map((cat) => {
                        const count = village.categories[cat.key].length;
                        return (
                          <div key={cat.key} className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <span style={{ color: cat.color }}>{cat.icon}</span>
                            <span className="text-white/40" style={{ fontSize: "10px" }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    {isCenter ? (
                      <motion.button
                        onClick={() => setSelectedVillage(village)}
                        className="w-full py-3 rounded-xl text-white flex items-center justify-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #2D5016, #4A7023)",
                          fontSize: "14px",
                          fontWeight: 700,
                          boxShadow: "0 4px 20px rgba(45,80,22,0.4)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Compass size={16} /> 마을 탐험하기
                      </motion.button>
                    ) : (
                      <button
                        onClick={() => goVillage(index)}
                        className="w-full py-3 rounded-xl text-white/50 border border-white/10 flex items-center justify-center gap-2 hover:border-white/20 transition-colors"
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      >
                        이 마을 보기
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6 relative z-10">
        {villages.map((_, i) => (
          <button
            key={i}
            onClick={() => goVillage(i)}
            className="transition-all duration-300"
            style={{
              width: i === villageIdx ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === villageIdx
                ? "linear-gradient(90deg, #2D5016, #4A90E2)"
                : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* Mobile counter */}
      <div className="md:hidden text-center mt-4 px-6 relative z-10">
        <p className="text-white/60" style={{ fontSize: "12px" }}>{villageIdx + 1} / {villages.length}</p>
      </div>
    </div>
  );
}
