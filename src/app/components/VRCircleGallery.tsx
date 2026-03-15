import React, { useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

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

interface VRCircleGalleryProps {
  villages: Village[];
  currentIdx: number;
  onSelect: (idx: number) => void;
  onViewVR: (village: Village) => void;
}

export function VRCircleGallery({ villages, currentIdx, onSelect, onViewVR }: VRCircleGalleryProps) {
  const total = villages.length;

  const prev = useCallback(() => {
    onSelect(currentIdx - 1 < 0 ? total - 1 : currentIdx - 1);
  }, [currentIdx, onSelect, total]);

  const next = useCallback(() => {
    onSelect((currentIdx + 1) % total);
  }, [currentIdx, onSelect, total]);

  // Calculate relative index (-2..0..+2) with wrapping
  const getRelativeIndex = (index: number) => {
    let diff = index - currentIdx;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const getCardStyle = (diff: number) => {
    const absDiff = Math.abs(diff);
    if (absDiff > 2) return { opacity: 0, pointerEvents: "none" as const };

    const sign = diff > 0 ? 1 : diff < 0 ? -1 : 0;

    if (diff === 0) {
      return {
        x: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        brightness: 1,
        pointerEvents: "auto" as const,
      };
    }

    return {
      x: sign * (52 + (absDiff - 1) * 20),
      z: -100 * absDiff,
      rotateY: sign * -35,
      scale: 0.85 - (absDiff - 1) * 0.1,
      opacity: absDiff === 1 ? 0.9 : 0.5,
      brightness: 0.55 - (absDiff - 1) * 0.15,
      pointerEvents: (absDiff <= 1 ? "auto" : "none") as "auto" | "none",
    };
  };

  const village = villages[currentIdx];

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1200px" }}>
      <div
        className="relative"
        style={{
          width: "clamp(360px, 80vw, 1100px)",
          aspectRatio: "16/9",
        }}
      >
        {/* Cards */}
        {villages.map((v, i) => {
          const diff = getRelativeIndex(i);
          const absDiff = Math.abs(diff);
          if (absDiff > 2) return null;

          const style = getCardStyle(diff);
          const isCurrent = diff === 0;

          return (
            <motion.div
              key={v.id}
              className="absolute inset-0 cursor-pointer"
              style={{
                zIndex: 10 - absDiff,
                pointerEvents: style.pointerEvents,
                transformStyle: "preserve-3d",
              }}
              animate={{
                x: `${(style.x || 0)}%`,
                rotateY: style.rotateY || 0,
                scale: style.scale || 1,
                opacity: style.opacity ?? 1,
              }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => {
                if (!isCurrent) onSelect(i);
              }}
            >
              <div
                className="w-full h-full rounded-2xl overflow-hidden relative"
                style={{
                  boxShadow: isCurrent
                    ? "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)"
                    : "0 15px 40px rgba(0,0,0,0.4)",
                }}
              >
                {/* Image */}
                <img
                  src={v.img}
                  alt={v.name}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                  style={{
                    filter: isCurrent ? "none" : `brightness(${style.brightness || 0.5})`,
                    imageRendering: "auto",
                  }}
                />

                {/* Prev/Next buttons on side images */}
                {diff === -1 && (
                  <div className="absolute inset-0 flex items-center justify-end pr-4 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); prev(); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    >
                      <ChevronLeft size={16} color="white" />
                      <span style={{ fontSize: "13px", color: "white", fontWeight: 600 }}>이전</span>
                    </button>
                  </div>
                )}
                {diff === 1 && (
                  <div className="absolute inset-0 flex items-center justify-start pl-4 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); next(); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "white", fontWeight: 600 }}>다음</span>
                      <ChevronRight size={16} color="white" />
                    </button>
                  </div>
                )}

                {/* Info overlay on center card */}
                {isCurrent && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={v.id}
                      className="absolute bottom-0 left-0 right-0 z-20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                    >
                      {/* Gradient fade */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                        }}
                      />
                      <div className="relative px-6 md:px-10 pb-6 md:pb-8 pt-16 flex flex-col items-center text-center">
                        <h3
                          className="text-white mb-2"
                          style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 800, letterSpacing: "-0.3px" }}
                        >
                          {String(currentIdx + 1).padStart(2, "0")}. {v.name}
                        </h3>
                        <p
                          className="text-white/70 mb-4 max-w-[480px]"
                          style={{ fontSize: "clamp(12px, 1.5vw, 15px)", lineHeight: 1.6 }}
                        >
                          {v.desc}
                        </p>
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); onViewVR(v); }}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white"
                          style={{
                            background: "linear-gradient(135deg, #2D5016, #4A7023)",
                            fontSize: "14px",
                            fontWeight: 700,
                            boxShadow: "0 4px 16px rgba(45,80,22,0.4)",
                          }}
                          whileHover={{ scale: 1.05, boxShadow: "0 6px 24px rgba(45,80,22,0.5)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          VR 감상하기
                          <ArrowRight size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
