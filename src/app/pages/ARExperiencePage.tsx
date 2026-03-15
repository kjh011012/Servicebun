import { useState, useEffect, useRef, useCallback } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowLeft, MapPin, Clock, Gift, Compass, Scan, Smartphone, Sparkles, Camera, Zap, X } from "lucide-react";

type MissionTab = "kids" | "family" | "adults";
type ARStage = "launcher" | "scanning" | "placement" | "summon" | "explore" | "complete";

interface Mission {
  id: number;
  icon: string;
  name: string;
  desc: string;
  difficulty: number;
  time: string;
  reward: string;
  points: number;
  status: "ready" | "progress" | "done";
  total: number;
  found: number;
  arItems: string[];
  hint: string;
  sceneBg: string;
}

const SCENE_BG = [
  "https://images.unsplash.com/photo-1758565204934-5ab1fcdb0ac2?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1761453353783-ca638737cf99?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1760477374186-3088e371e6a6?w=800&h=1200&fit=crop",
];

const missions: Record<MissionTab, Mission[]> = {
  kids: [
    { id: 1, icon: "🎁", name: "숨겨진 보물 찾기", desc: "마을 곳곳에 숨겨진 보물 5개 찾기", difficulty: 2, time: "15~20분", reward: "스탬프 + 100P", points: 100, status: "ready", total: 5, found: 0, arItems: ["🎁", "💎", "🪙", "👑", "🏆"], hint: "한옥 처마 아래를 찾아보세요", sceneBg: SCENE_BG[0] },
    { id: 2, icon: "🐰", name: "동물 친구 찾기", desc: "닭, 토끼, 염소 등 동물 5종 찾기", difficulty: 1, time: "10~15분", reward: "스탬프 + 50P", points: 50, status: "ready", total: 5, found: 0, arItems: ["🐔", "🐰", "🐐", "🐶", "🐱"], hint: "농장 울타리 근처를 살펴보세요", sceneBg: SCENE_BG[1] },
    { id: 3, icon: "🌼", name: "들꽃 도감 완성", desc: "마을 들꽃 8종 수집하기", difficulty: 2, time: "20~30분", reward: "스탬프 + 80P", points: 80, status: "ready", total: 8, found: 0, arItems: ["🌸", "🌻", "🌺", "🌷", "🌹", "💐", "🌼", "🏵️"], hint: "산책로 옆 꽃밭을 둘러보세요", sceneBg: SCENE_BG[2] },
    { id: 4, icon: "🦋", name: "나비 잡기 게임", desc: "AR 나비 10마리 잡기 (제한 5분)", difficulty: 3, time: "5분", reward: "스탬프 + 150P", points: 150, status: "ready", total: 10, found: 0, arItems: ["🦋", "🦋", "🦋", "🦋", "🦋"], hint: "꽃 주변에서 나비가 자주 보여요", sceneBg: SCENE_BG[0] },
    { id: 5, icon: "🌾", name: "작물 성장 관찰", desc: "논밭 작물 AR 스캔으로 성장 학습", difficulty: 1, time: "10분", reward: "스탬프 + 60P", points: 60, status: "done", total: 3, found: 3, arItems: ["🌱", "🌾", "🍚"], hint: "논 근처에서 스캔하세요", sceneBg: SCENE_BG[1] },
    { id: 6, icon: "🏰", name: "마을 역사 퀴즈", desc: "AR 역사 표지판 찾고 퀴즈 5문제", difficulty: 2, time: "15분", reward: "스탬프 + 100P", points: 100, status: "ready", total: 5, found: 0, arItems: ["📜", "🏛️", "⛩️", "🗿", "🪨"], hint: "마을 입구 비석 앞으로 가보세요", sceneBg: SCENE_BG[2] },
    { id: 7, icon: "📸", name: "포토 챌린지", desc: "지정된 5곳에서 AR 프레임 사진", difficulty: 1, time: "15~20분", reward: "스탬프 + 50P", points: 50, status: "progress", total: 5, found: 2, arItems: ["📸", "🖼️", "🎨", "🌈", "✨"], hint: "전망대에 포토존이 있어요", sceneBg: SCENE_BG[0] },
    { id: 8, icon: "🎨", name: "마을 색깔 찾기", desc: "색깔별 사물 각 3개씩 찾기", difficulty: 2, time: "15분", reward: "스탬프 + 80P", points: 80, status: "ready", total: 9, found: 0, arItems: ["🔴", "🟡", "🔵", "🟢", "🟠", "🟣", "⚪", "🟤", "⚫"], hint: "빨간색은 딸기밭에서 찾아보세요", sceneBg: SCENE_BG[1] },
  ],
  family: [
    { id: 9, icon: "📷", name: "가족 포토 랠리", desc: "가족 함께 5곳 포토존 완주", difficulty: 1, time: "30분", reward: "스탬프 + 120P", points: 120, status: "ready", total: 5, found: 0, arItems: ["📷", "🤳", "🖼️", "🎞️", "📸"], hint: "마을 중앙 광장에서 시작하세요", sceneBg: SCENE_BG[2] },
    { id: 10, icon: "🍳", name: "요리 재료 찾기", desc: "전통 요리 재료 AR로 수집", difficulty: 2, time: "20분", reward: "스탬프 + 100P", points: 100, status: "ready", total: 6, found: 0, arItems: ["🧅", "🥕", "🌶️", "🧄", "🥬", "🍚"], hint: "텃밭 근처에서 찾아보세요", sceneBg: SCENE_BG[0] },
    { id: 11, icon: "🗺️", name: "마을 오리엔티어링", desc: "지도 따라 체크포인트 완주", difficulty: 2, time: "40분", reward: "스탬프 + 200P", points: 200, status: "ready", total: 8, found: 0, arItems: ["📍", "🚩", "⛳", "🏁", "📌", "🗺️", "🧭", "🎯"], hint: "마을 지도를 확인하세요", sceneBg: SCENE_BG[1] },
  ],
  adults: [
    { id: 12, icon: "🌾", name: "농업 기술 배우기", desc: "AR로 농기구 사용법 3종 학습", difficulty: 2, time: "20분", reward: "스탬프 + 120P", points: 120, status: "ready", total: 3, found: 0, arItems: ["🪓", "🫕", "🧺"], hint: "농기구 보관소 앞에서 스캔하세요", sceneBg: SCENE_BG[2] },
    { id: 13, icon: "🌿", name: "약초 & 산나물 도감", desc: "산책로 약초 8종 발견", difficulty: 3, time: "40분", reward: "스탬프 + 180P", points: 180, status: "ready", total: 8, found: 0, arItems: ["🌿", "🍃", "🌱", "🍀", "🪴", "🌾", "🌿", "🍂"], hint: "산책로 입구에서 출발하세요", sceneBg: SCENE_BG[0] },
    { id: 14, icon: "🏛️", name: "마을 역사 탐방", desc: "역사 유적 5곳 AR 옛날 모습 비교", difficulty: 2, time: "30분", reward: "스탬프 + 150P", points: 150, status: "ready", total: 5, found: 0, arItems: ["🏛️", "📜", "🗿", "⛩️", "🏯"], hint: "마을 비석에서 시작하세요", sceneBg: SCENE_BG[1] },
    { id: 15, icon: "🌄", name: "전망 포인트 정복", desc: "전망대 3곳 등반 + AR 파노라마", difficulty: 3, time: "60분", reward: "스탬프 + 200P", points: 200, status: "ready", total: 3, found: 0, arItems: ["🏔️", "🌄", "🌅"], hint: "언덕 위 전망대로 올라가세요", sceneBg: SCENE_BG[2] },
    { id: 16, icon: "🍚", name: "전통 농법 체험", desc: "AR로 전통 모내기/탈곡 시뮬레이션", difficulty: 2, time: "20분", reward: "스탬프 + 150P", points: 150, status: "ready", total: 4, found: 0, arItems: ["🌾", "🫘", "🌽", "🍠"], hint: "논 앞에서 AR을 켜세요", sceneBg: SCENE_BG[0] },
    { id: 17, icon: "📖", name: "마을 이야기 수집", desc: "주민 5명 인터뷰 AR 기록", difficulty: 3, time: "45분", reward: "스탬프 + 250P", points: 250, status: "ready", total: 5, found: 0, arItems: ["👴", "👵", "🧑‍🌾", "👨‍🍳", "🧑‍🏫"], hint: "마을 주민에게 말을 걸어보세요", sceneBg: SCENE_BG[1] },
  ],
};

const tabLabels: Record<MissionTab, { icon: string; label: string }> = {
  kids: { icon: "👶", label: "아이 미션" },
  family: { icon: "👨‍👩‍👧‍👦", label: "가족 미션" },
  adults: { icon: "👨", label: "어른 미션" },
};

// 3D AR object positions on the ground plane (x%, z-depth 0~1, scale)
const arObjectPositions = [
  { x: 20, z: 0.3, scale: 1.2 },
  { x: 65, z: 0.5, scale: 1.0 },
  { x: 40, z: 0.7, scale: 0.8 },
  { x: 80, z: 0.4, scale: 1.1 },
  { x: 10, z: 0.6, scale: 0.9 },
];

export function ARExperiencePage() {
  const [tab, setTab] = useState<MissionTab>("kids");
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [arStage, setArStage] = useState<ARStage>("launcher");
  const [foundItems, setFoundItems] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [missionTime, setMissionTime] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [discoveredItem, setDiscoveredItem] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [collectAnim, setCollectAnim] = useState<number | null>(null);
  const [gyroX, setGyroX] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── Real Camera (getUserMedia) ──
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
        setCameraError(false);
      }
    } catch {
      console.warn("카메라 접근 불가 — 정적 배경으로 대체");
      setCameraError(true);
      setCameraReady(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  // Start/stop camera based on AR stage
  useEffect(() => {
    if (activeMission && arStage !== "launcher" && arStage !== "complete") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeMission, arStage, startCamera, stopCamera]);

  // ── Real Gyroscope + Mouse fallback ──
  useEffect(() => {
    let hasGyro = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        hasGyro = true;
        setGyroX(e.gamma * 0.15);
        setGyroY((e.beta - 45) * 0.1);
      }
    };

    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any).requestPermission().then((state: string) => {
        if (state === "granted") window.addEventListener("deviceorientation", handleOrientation);
      }).catch(() => {});
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    const handleMouse = (e: MouseEvent) => {
      if (hasGyro) return;
      if (!sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setGyroX(((e.clientX - cx) / rect.width) * 8);
      setGyroY(((e.clientY - cy) / rect.height) * 5);
    };
    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useEffect(() => {
    if (arStage === "explore") {
      timerRef.current = setInterval(() => setMissionTime((t) => t + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [arStage]);

  useEffect(() => {
    if (arStage === "scanning") {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1.5;
        setScanProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => setArStage("placement"), 600);
        }
      }, 40);
      return () => clearInterval(interval);
    }
    setScanProgress(0);
  }, [arStage]);

  useEffect(() => {
    if (arStage === "summon") {
      setTimeout(() => setArStage("explore"), 2800);
    }
  }, [arStage]);

  const startMission = (mission: Mission) => {
    setActiveMission(mission);
    setFoundItems(0);
    setHintsLeft(3);
    setMissionTime(0);
    setArStage("launcher");
    setDiscoveredItem(null);
    setCollectAnim(null);
  };

  const findItem = (posIndex: number) => {
    if (!activeMission || collectAnim !== null) return;
    const newFound = foundItems + 1;
    const item = activeMission.arItems[Math.min(newFound - 1, activeMission.arItems.length - 1)];
    setCollectAnim(posIndex);
    setDiscoveredItem(item);
    
    setTimeout(() => {
      setFoundItems(newFound);
      setShowNotification(true);
      setCollectAnim(null);
      setTimeout(() => {
        setShowNotification(false);
        setDiscoveredItem(null);
      }, 2000);
      if (newFound >= activeMission.total) {
        setTimeout(() => setArStage("complete"), 2200);
      }
    }, 600);
  };

  const exitAR = () => {
    setActiveMission(null);
    setArStage("launcher");
    stopCamera();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentMissions = missions[tab];
  const completedCount = currentMissions.filter((m) => m.status === "done").length;
  const totalPoints = currentMissions.filter((m) => m.status === "done").reduce((sum, m) => sum + m.points, 0);

  // ── Phone Frame ──
  const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-center py-6">
      <div
        className="w-full max-w-[390px] rounded-[44px] overflow-hidden relative"
        style={{
          border: "8px solid #1A1A1A",
          boxShadow: "0 20px 80px rgba(0,0,0,0.45), 0 0 0 2px #333 inset",
          height: "calc(100vh - 200px)",
          maxHeight: "780px",
          minHeight: "600px",
          background: "#000",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-[120px] h-[28px] bg-[#1A1A1A] rounded-b-2xl flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#333]" />
          <div className="w-[40px] h-[4px] rounded-full bg-[#333]" />
        </div>
        <div ref={sceneRef} className="w-full h-full overflow-hidden flex flex-col relative">
          {children}
        </div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[120px] h-[4px] rounded-full bg-white/30 z-50" />
      </div>
    </div>
  );

  // ── 3D Camera scene background (실제 카메라 or 정적 폴백) ──
  const CameraScene = ({ bg, children }: { bg: string; children: React.ReactNode }) => (
    <div className="absolute inset-0 overflow-hidden">
      {/* 실제 카메라 피드 (getUserMedia — 후면 카메라) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          display: cameraReady ? "block" : "none",
          transform: `translate(${gyroX * -0.5}px, ${gyroY * -0.5}px) scale(1.02)`,
          transition: "transform 0.06s ease-out",
        }}
      />
      {/* Fallback: 정적 이미지 (데스크톱 / 카메라 거부) */}
      {!cameraReady && (
        <ImageWithFallback
          src={bg}
          alt="AR Camera Fallback"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: `translate(${gyroX * -2}px, ${gyroY * -2}px) scale(1.15)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
      {/* 카메라 상태 배지 */}
      {cameraError && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-black/70 backdrop-blur px-3 py-1.5 rounded-full">
          <span style={{ fontSize: "11px", color: "#FFB800" }}>⚠️ 카메라 미연결 — 데모 모드</span>
        </div>
      )}
      {/* Camera overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-4 w-8 h-8 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
        <div className="absolute top-12 right-4 w-8 h-8 border-t-2 border-r-2 border-white/40 rounded-tr-lg" />
        <div className="absolute bottom-32 left-4 w-8 h-8 border-b-2 border-l-2 border-white/40 rounded-bl-lg" />
        <div className="absolute bottom-32 right-4 w-8 h-8 border-b-2 border-r-2 border-white/40 rounded-br-lg" />
        {/* LIVE / DEMO indicator */}
        <div className="absolute top-14 right-5 flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${cameraReady ? "bg-red-500" : "bg-yellow-500"} animate-pulse`} />
          <span className="text-white/70" style={{ fontSize: "10px", fontWeight: 600 }}>{cameraReady ? "LIVE" : "DEMO"}</span>
        </div>
      </div>
      {/* 3D scene container */}
      {children}
    </div>
  );

  // ── AR 3D Ground Plane ──
  const GroundPlane3D = ({ visible }: { visible: boolean }) => (
    <div
      className="absolute bottom-[25%] left-0 right-0 overflow-hidden"
      style={{
        height: "60%",
        perspective: "600px",
        perspectiveOrigin: "50% 30%",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div
        className="w-[200%] h-full -ml-[50%]"
        style={{
          transform: `rotateX(65deg) translateZ(0) rotateZ(${gyroX * 0.5}deg)`,
          transformStyle: "preserve-3d",
          backgroundImage: `
            linear-gradient(rgba(255,107,53,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transition: "transform 0.1s ease-out",
        }}
      />
    </div>
  );

  // ── AR STAGES ──
  if (activeMission) {
    // LAUNCHER
    if (arStage === "launcher") {
      return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0A0F1E] to-[#1A2340]">
          <PhoneFrame>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              {[1, 2, 3].map((r) => (
                <div key={r} className="absolute rounded-full border border-[#FF6B35]/15" style={{ width: `${r * 130}px`, height: `${r * 130}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: `launcherPulse ${2.5 + r * 0.4}s ease-in-out infinite` }} />
              ))}
              <div className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5A)", boxShadow: "0 0 60px rgba(255,107,53,0.4), 0 10px 30px rgba(255,107,53,0.3)" }}>
                <span style={{ fontSize: "56px" }}>{activeMission.icon}</span>
              </div>
              <h2 className="text-white mb-2 relative z-10" style={{ fontSize: "24px", fontWeight: 700 }}>{activeMission.name}</h2>
              <p className="text-white/50 mb-8 relative z-10" style={{ fontSize: "14px", lineHeight: 1.5 }}>{activeMission.desc}</p>
              <div className="flex gap-3 mb-8 relative z-10 w-full">
                {[
                  { label: "난이도", value: "⭐".repeat(activeMission.difficulty) },
                  { label: "소요시간", value: activeMission.time },
                  { label: "보상", value: `${activeMission.points}P` },
                ].map((info, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex-1">
                    <p className="text-white/40" style={{ fontSize: "10px" }}>{info.label}</p>
                    <p className="text-white mt-0.5" style={{ fontSize: "12px", fontWeight: 600 }}>{info.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setArStage("scanning")} className="relative z-10 w-full py-4 rounded-2xl text-white mb-3 flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5A)", fontSize: "18px", fontWeight: 700, boxShadow: "0 8px 30px rgba(255,107,53,0.4)" }}>
                <Camera size={22} /> AR 카메라 시작
              </button>
              <p className="relative z-10 text-white/25 mb-2" style={{ fontSize: "11px", lineHeight: 1.4 }}>
                카메라 권한을 허용하면 실제 카메라 화면이 표시됩니다.<br/>
                미허용 시 데모 모드로 체험할 수 있습니다.
              </p>
              <button onClick={exitAR} className="relative z-10 text-white/30 py-2" style={{ fontSize: "14px" }}>돌아가기</button>
            </div>
          </PhoneFrame>
        </div>
      );
    }

    // SCANNING - 바닥면 인식
    if (arStage === "scanning") {
      return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0A0F1E] to-[#1A2340]">
          <PhoneFrame>
            <div className="flex-1 relative overflow-hidden">
              <CameraScene bg={activeMission.sceneBg}>
                {/* Scanning crosshair */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="relative" style={{ width: "220px", height: "220px" }}>
                    {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos, i) => (
                      <div key={i} className={`absolute ${pos}`}>
                        <div className="w-12 h-12">
                          <div className="absolute top-0 left-0 w-full h-[3px] rounded-full" style={{ background: "linear-gradient(90deg, #FF6B35, transparent)" }} />
                          <div className="absolute top-0 left-0 w-[3px] h-full rounded-full" style={{ background: "linear-gradient(180deg, #FF6B35, transparent)" }} />
                        </div>
                      </div>
                    ))}
                    {/* Horizontal scan line */}
                    <div className="absolute left-0 right-0 h-[2px]" style={{ top: `${scanProgress}%`, background: "linear-gradient(90deg, transparent, #FF6B35, transparent)", boxShadow: "0 0 15px 3px rgba(255,107,53,0.4)", transition: "top 0.04s linear" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scan size={28} color="#FF6B35" style={{ animation: "scanRotate 3s linear infinite" }} />
                    </div>
                  </div>
                </div>

                {/* Ground plane detection */}
                <GroundPlane3D visible={scanProgress > 40} />

                {/* Detected surface markers */}
                {scanProgress > 60 && (
                  <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 z-10" style={{ animation: "fadeIn 0.5s ease" }}>
                    <div className="w-24 h-24 border-2 border-dashed border-[#4CAF50]/60 rounded-lg" style={{ transform: "perspective(400px) rotateX(50deg)", animation: "surfaceDetect 1.5s ease-in-out infinite" }} />
                  </div>
                )}
              </CameraScene>

              {/* Top bar */}
              <div className="absolute top-8 left-0 right-0 px-4 z-30 flex items-center justify-between">
                <button onClick={exitAR} className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"><X size={16} color="white" /></button>
                <div className="bg-black/50 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Scan size={13} color="#FF6B35" className="animate-pulse" />
                  <span className="text-white" style={{ fontSize: "12px", fontWeight: 600 }}>바닥면 스캔 중...</span>
                </div>
                <div className="w-9" />
              </div>

              {/* Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg p-5 rounded-t-3xl z-30">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone size={18} color="#FF6B35" />
                  <p className="text-white flex-1" style={{ fontSize: "14px", fontWeight: 600 }}>스마트폰을 천천히 움직여주세요</p>
                  <span className="text-[#FF6B35]" style={{ fontSize: "15px", fontWeight: 700 }}>{Math.round(scanProgress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${scanProgress}%`, background: "linear-gradient(90deg, #FF6B35, #FFB800)" }} />
                </div>
                <p className="text-white/30 mt-2 text-center" style={{ fontSize: "11px" }}>
                  {scanProgress < 40 ? "평평한 바닥면을 찾고 있습니다..." : scanProgress < 80 ? "바닥면을 인식하고 있습니다..." : "바닥면 인식 거의 완료!"}
                </p>
              </div>
            </div>
          </PhoneFrame>
        </div>
      );
    }

    // PLACEMENT - 3D 배치
    if (arStage === "placement") {
      return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0A0F1E] to-[#1A2340]">
          <PhoneFrame>
            <div className="flex-1 relative overflow-hidden">
              <CameraScene bg={activeMission.sceneBg}>
                <GroundPlane3D visible />

                {/* 3D placement indicator on ground */}
                <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 z-10" style={{ perspective: "500px" }}>
                  <div style={{ transform: "rotateX(55deg)", transformStyle: "preserve-3d" }}>
                    {/* Shadow/glow on ground */}
                    <div className="w-36 h-36 rounded-full mx-auto" style={{ background: "radial-gradient(circle, rgba(255,107,53,0.3) 0%, rgba(255,107,53,0.1) 40%, transparent 70%)", animation: "placementPulse 2s ease-in-out infinite" }} />
                  </div>
                  {/* Floating 3D icon above placement */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2" style={{ animation: "float3D 2s ease-in-out infinite" }}>
                    <div className="relative">
                      <span style={{ fontSize: "52px", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))" }}>{activeMission.icon}</span>
                      {/* AR tracking dots */}
                      {[0, 1, 2, 3].map((d) => (
                        <div key={d} className="absolute w-1.5 h-1.5 rounded-full bg-[#4CAF50]" style={{ top: `${[10, 90, 50, 50][d]}%`, left: `${[50, 50, 10, 90][d]}%`, animation: `trackDot 1.5s ${d * 0.2}s ease-in-out infinite` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </CameraScene>

              {/* Top */}
              <div className="absolute top-8 left-0 right-0 px-4 z-30 flex items-center justify-between">
                <button onClick={exitAR} className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"><X size={16} color="white" /></button>
                <div className="bg-[#4CAF50]/80 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Sparkles size={13} color="white" />
                  <span className="text-white" style={{ fontSize: "12px", fontWeight: 600 }}>바닥면 인식 완료!</span>
                </div>
                <div className="w-9" />
              </div>

              {/* Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg p-5 rounded-t-3xl z-30">
                <p className="text-white text-center mb-3" style={{ fontSize: "15px", fontWeight: 600 }}>👆 화면을 탭하여 AR 체험을 배치하세요</p>
                <button onClick={() => setArStage("summon")} className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #FF6B35, #FFB800)", fontSize: "16px", fontWeight: 700, boxShadow: "0 8px 24px rgba(255,107,53,0.4)" }}>
                  <Zap size={20} /> 여기에 배치하기
                </button>
              </div>
            </div>
          </PhoneFrame>
        </div>
      );
    }

    // SUMMON - 3D 소환 이펙트
    if (arStage === "summon") {
      return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0A0F1E] to-[#1A2340]">
          <PhoneFrame>
            <div className="flex-1 relative overflow-hidden">
              <CameraScene bg={activeMission.sceneBg}>
                <GroundPlane3D visible />

                {/* 3D summon effect */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  {/* Expanding 3D rings on ground plane */}
                  <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2" style={{ perspective: "500px" }}>
                    {[1, 2, 3, 4].map((r) => (
                      <div key={r} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FFB800]" style={{ width: `${r * 50}px`, height: `${r * 50}px`, transform: `translate(-50%,-50%) rotateX(60deg)`, animation: `summonRing3D 2s ${r * 0.15}s ease-out infinite` }} />
                    ))}
                  </div>

                  {/* Rising 3D object */}
                  <div style={{ animation: "summonRise 2.5s ease-out forwards" }}>
                    <span style={{ fontSize: "80px", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))", display: "block" }}>{activeMission.icon}</span>
                  </div>

                  {/* Light beam */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20" style={{ height: "60%", background: "linear-gradient(180deg, transparent, rgba(255,184,0,0.15), rgba(255,184,0,0.05))", animation: "beamPulse 1.5s ease-in-out infinite" }} />

                  {/* Particle sparks */}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="absolute rounded-full" style={{ width: `${2 + Math.random() * 3}px`, height: `${2 + Math.random() * 3}px`, background: ["#FFB800", "#FF6B35", "#FFF"][i % 3], top: "50%", left: "50%", animation: `particle3D ${1.5 + Math.random()}s ${i * 0.1}s ease-out infinite`, transform: `rotate(${i * 22.5}deg)` }} />
                  ))}
                </div>
              </CameraScene>

              {/* Text overlay */}
              <div className="absolute bottom-16 left-0 right-0 text-center z-30">
                <p className="text-[#FFB800]" style={{ fontSize: "20px", fontWeight: 700, textShadow: "0 2px 12px rgba(255,184,0,0.5)" }}>✨ AR 소환 중...</p>
              </div>
            </div>
          </PhoneFrame>
        </div>
      );
    }

    // EXPLORE - 3D AR 탐험 (핵심!)
    if (arStage === "explore") {
      const visibleItems = arObjectPositions.slice(0, Math.min(3, activeMission.total - foundItems));
      return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0A0F1E] to-[#1A2340]">
          <PhoneFrame>
            <div className="flex-1 relative overflow-hidden">
              <CameraScene bg={activeMission.sceneBg}>
                <GroundPlane3D visible />

                {/* ─── 3D AR Objects on ground plane ─── */}
                <div className="absolute inset-0 z-10" style={{ perspective: "800px", perspectiveOrigin: `${50 + gyroX}% 40%` }}>
                  {visibleItems.map((pos, i) => {
                    const itemIdx = Math.min(foundItems + i, activeMission.arItems.length - 1);
                    const emoji = activeMission.arItems[itemIdx];
                    const isCollecting = collectAnim === i;
                    // Depth-based sizing: closer = larger, farther = smaller
                    const depthScale = 0.5 + (1 - pos.z) * 0.8;
                    const yPos = 35 + pos.z * 35; // higher z = lower on screen (farther)
                    const brightness = 1 - pos.z * 0.2;

                    return (
                      <button
                        key={`${foundItems}-${i}`}
                        onClick={() => findItem(i)}
                        className="absolute transition-transform active:scale-90"
                        style={{
                          left: `${pos.x}%`,
                          top: `${yPos}%`,
                          transform: `translate(-50%, -50%) scale(${depthScale * pos.scale}) ${isCollecting ? "scale(0) translateY(-100px)" : ""}`,
                          transition: isCollecting ? "transform 0.5s ease-in" : "none",
                          zIndex: Math.round((1 - pos.z) * 10),
                          filter: `brightness(${brightness})`,
                        }}
                      >
                        {/* 3D Object container */}
                        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                          {/* Ground shadow */}
                          <div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
                            style={{
                              width: "50px",
                              height: "12px",
                              background: "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)",
                              transform: "rotateX(80deg) translateZ(-5px)",
                            }}
                          />
                          {/* AR object with glass container */}
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                            style={{
                              background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.1)",
                              border: "2px solid rgba(255,107,53,0.6)",
                              animation: `arBob ${2.5 + i * 0.3}s ease-in-out infinite`,
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <span style={{ fontSize: "32px" }}>{emoji}</span>
                            {/* AR tracking indicator */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#4CAF50] border border-white" style={{ boxShadow: "0 0 6px rgba(76,175,80,0.6)" }} />
                          </div>
                          {/* Distance label */}
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 px-2 py-0.5 rounded-full" style={{ fontSize: "9px", color: "rgba(255,255,255,0.8)" }}>
                            {Math.round(3 + pos.z * 12)}m
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Direction arrow when no items very close */}
                <div className="absolute bottom-[42%] left-1/2 -translate-x-1/2 z-5 opacity-40">
                  <Compass size={28} color="#FFB800" style={{ animation: "compassSpin 4s linear infinite" }} />
                </div>
              </CameraScene>

              {/* ─── Top HUD ─── */}
              <div className="absolute top-8 left-0 right-0 px-3 z-30 flex items-center justify-between">
                <button onClick={exitAR} className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"><ArrowLeft size={14} color="white" /></button>

                <div className="bg-black/60 backdrop-blur-lg px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span style={{ fontSize: "13px" }}>{activeMission.icon}</span>
                  <span className="text-white" style={{ fontSize: "12px", fontWeight: 700 }}>{foundItems}/{activeMission.total}</span>
                  <div className="w-px h-3 bg-white/20" />
                  <span className="text-[#FFB800]" style={{ fontSize: "12px", fontWeight: 600 }}>{formatTime(missionTime)}</span>
                </div>

                {/* Mini radar */}
                <div className="w-[50px] h-[50px] rounded-full bg-black/50 backdrop-blur overflow-hidden relative" style={{ border: "1.5px solid rgba(255,255,255,0.15)" }}>
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#4A90E2] -translate-x-1/2 -translate-y-1/2 z-10" />
                    {/* Radar sweep */}
                    <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2" style={{ background: "conic-gradient(from 0deg, transparent 0deg, rgba(74,144,226,0.3) 30deg, transparent 60deg)", animation: "radarSweep 3s linear infinite" }} />
                    {/* Object dots */}
                    {visibleItems.map((pos, i) => (
                      <div key={i} className="absolute w-1 h-1 rounded-full bg-[#FF6B35]" style={{ left: `${20 + pos.x * 0.6}%`, top: `${20 + pos.z * 60}%`, animation: "blinkDot 1.5s ease-in-out infinite" }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress dots */}
              <div className="absolute top-[70px] left-1/2 -translate-x-1/2 z-20 flex gap-1">
                {Array.from({ length: Math.min(activeMission.total, 10) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < foundItems ? "#4CAF50" : "rgba(255,255,255,0.25)", boxShadow: i < foundItems ? "0 0 4px rgba(76,175,80,0.5)" : "none" }} />
                ))}
              </div>

              {/* Found notification */}
              {showNotification && discoveredItem && (
                <div className="absolute top-[85px] left-1/2 -translate-x-1/2 z-40 bg-[#4CAF50] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2.5" style={{ animation: "notifSlide 0.4s ease", boxShadow: "0 8px 24px rgba(76,175,80,0.4)" }}>
                  <span style={{ fontSize: "24px" }}>{discoveredItem}</span>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700 }}>발견!</p>
                    <p style={{ fontSize: "10px", opacity: 0.8 }}>{foundItems}/{activeMission.total} 수집</p>
                  </div>
                </div>
              )}

              {/* ─── Bottom panel ─── */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl rounded-t-[24px] p-4 z-30">
                {showHint && (
                  <div className="bg-[#FFB800]/10 border border-[#FFB800]/25 rounded-xl p-2.5 mb-3 flex items-center gap-2">
                    <span style={{ fontSize: "16px" }}>💡</span>
                    <p className="text-[#FFB800] flex-1" style={{ fontSize: "12px" }}>{activeMission.hint}</p>
                    <button onClick={() => setShowHint(false)}><X size={12} color="#FFB800" /></button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { if (hintsLeft > 0) { setHintsLeft((h) => h - 1); setShowHint(true); setTimeout(() => setShowHint(false), 5000); } }}
                    className="px-3 py-3 rounded-xl bg-[#FFB800]/10 text-[#FFB800]" style={{ fontSize: "12px", fontWeight: 600 }}
                  >💡 {hintsLeft}</button>
                  <button onClick={() => findItem(0)} className="flex-1 py-3 rounded-xl text-white flex items-center justify-center gap-1.5" style={{ background: "linear-gradient(135deg, #4CAF50, #66BB6A)", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 16px rgba(76,175,80,0.3)" }}>
                    👆 발견했어요!
                  </button>
                  <button onClick={exitAR} className="px-3 py-3 rounded-xl bg-white/5 text-white/40" style={{ fontSize: "12px" }}>나가기</button>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      );
    }

    // COMPLETE
    if (arStage === "complete") {
      return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0A0F1E] to-[#1A2340]">
          <PhoneFrame>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="absolute rounded-sm" style={{ width: `${3 + Math.random() * 4}px`, height: `${3 + Math.random() * 4}px`, background: ["#FF6B35", "#FFB800", "#4A90E2", "#4CAF50", "#9B59B6"][i % 5], top: "-5%", left: `${Math.random() * 100}%`, animation: `confetti ${2 + Math.random() * 2}s ${Math.random() * 0.5}s ease-out forwards` }} />
              ))}
              <div className="relative z-10">
                <div style={{ fontSize: "72px", animation: "bounceIn 0.6s ease" }}>🎉</div>
                <h2 className="text-white mt-4 mb-1" style={{ fontSize: "26px", fontWeight: 700 }}>미션 완료!</h2>
                <p className="text-white/60 mb-1" style={{ fontSize: "16px" }}>{activeMission.name}</p>
                <p className="text-white/30 mb-6" style={{ fontSize: "13px" }}>⏱️ {formatTime(missionTime)}</p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 w-full max-w-[300px]">
                  <p className="text-white/50 mb-3" style={{ fontSize: "12px", fontWeight: 600 }}>획득한 보상</p>
                  <div className="flex justify-center gap-5">
                    {[{ e: "🎫", l: "스탬프 +1" }, { e: "💰", l: `+${activeMission.points}P` }, { e: "🏆", l: "배지 획득" }].map((r, i) => (
                      <div key={i} className="flex flex-col items-center gap-1" style={{ animation: `fadeIn ${0.5 + i * 0.2}s ease` }}>
                        <span style={{ fontSize: "30px" }}>{r.e}</span>
                        <span className="text-white/60" style={{ fontSize: "10px" }}>{r.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 w-full max-w-[300px]">
                  <a href="/passport" className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2D5016] to-[#4A7023] text-white text-center" style={{ fontSize: "15px", fontWeight: 700 }}>🎫 디지털 여권 확인</a>
                  <button onClick={exitAR} className="w-full py-3.5 rounded-2xl border border-white/15 text-white" style={{ fontSize: "15px", fontWeight: 600 }}>다른 미션 도전</button>
                  <button className="text-white/30 py-2" style={{ fontSize: "13px" }}>공유하기</button>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      );
    }
  }

  // ── MISSION LIST ──
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#FF6B35] via-[#FF8F5A] to-[#FFB88C] px-6 py-10 lg:py-14 text-center">
        <div className="max-w-[1200px] mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white mb-4" style={{ fontSize: "13px", fontWeight: 600 }}>📱 스마트폰 기반 AR 체험</span>
          <h1 className="text-white mb-3" style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700 }}>AR로 마을 곳곳을 탐험하세요</h1>
          <p className="text-white/80 mb-8 max-w-[500px] mx-auto" style={{ fontSize: "16px", lineHeight: 1.6 }}>
            스마트폰 카메라로 바닥면을 인식하고,<br className="hidden sm:block" />3D AR 오브젝트를 찾아 미션을 완료하세요!
          </p>
          <div className="inline-flex gap-6 bg-white/10 backdrop-blur rounded-2xl px-8 py-4">
            <div className="text-center">
              <p className="text-white" style={{ fontSize: "28px", fontWeight: 900 }}>{completedCount}</p>
              <p className="text-white/60" style={{ fontSize: "12px" }}>완료 미션</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-white" style={{ fontSize: "28px", fontWeight: 900 }}>{totalPoints}P</p>
              <p className="text-white/60" style={{ fontSize: "12px" }}>획득 포인트</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-white" style={{ fontSize: "28px", fontWeight: 900 }}>{completedCount}</p>
              <p className="text-white/60" style={{ fontSize: "12px" }}>스탬프</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="sticky top-[80px] z-30 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[800px] mx-auto flex">
          {(Object.keys(tabLabels) as MissionTab[]).map((key) => (
            <button key={key} onClick={() => setTab(key)} className={`flex-1 py-4 text-center transition-colors relative ${tab === key ? "text-[#FF6B35]" : "text-[#666]"}`} style={{ fontSize: "15px", fontWeight: tab === key ? 700 : 500 }}>
              {tabLabels[key].icon} {tabLabels[key].label}
              {tab === key && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#FF6B35] rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Missions */}
      <div className="max-w-[800px] mx-auto px-4 py-6 bg-[#F5F7FA] min-h-[400px]">
        <div className="flex flex-col gap-3">
          {currentMissions.map((mission) => (
            <div key={mission.id} className="bg-white rounded-[16px] p-4 flex items-center gap-4 transition-all hover:shadow-md cursor-pointer" style={{ opacity: mission.status === "done" ? 0.6 : 1, border: mission.status === "progress" ? "2px solid #FF6B35" : "1px solid #E5E5E5" }} onClick={() => mission.status !== "done" && startMission(mission)}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: mission.status === "done" ? "#F5F7FA" : "linear-gradient(135deg, #FF6B35, #FFB88C)", fontSize: "26px", boxShadow: mission.status === "done" ? "none" : "0 4px 12px rgba(255,107,53,0.2)" }}>
                {mission.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>{mission.name}</h4>
                <p className="mt-0.5" style={{ fontSize: "13px", color: "#666" }}>{mission.desc}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span style={{ fontSize: "11px", color: "#999" }}>{"⭐".repeat(mission.difficulty)}{"☆".repeat(3 - mission.difficulty)}</span>
                  <span style={{ fontSize: "11px", color: "#999" }}><Clock size={10} className="inline mr-0.5" />{mission.time}</span>
                  <span style={{ fontSize: "11px", color: "#FFB800", fontWeight: 600 }}><Gift size={10} className="inline mr-0.5" />{mission.reward}</span>
                </div>
                {mission.status === "progress" && (
                  <div className="mt-2 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden w-32">
                    <div className="h-full bg-[#FF6B35] rounded-full" style={{ width: `${(mission.found / mission.total) * 100}%` }} />
                  </div>
                )}
              </div>
              <div className="shrink-0">
                {mission.status === "done" ? (
                  <span className="px-3.5 py-2 rounded-full bg-[#F0FDF4] text-[#10B981]" style={{ fontSize: "13px", fontWeight: 600 }}>완료 ✓</span>
                ) : (
                  <span className="px-3.5 py-2 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
                    <Camera size={14} /> {mission.status === "progress" ? "이어하기" : "AR 시작"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes launcherPulse { 0%,100% { opacity:0.15; transform:translate(-50%,-50%) scale(1); } 50% { opacity:0.3; transform:translate(-50%,-50%) scale(1.05); } }
        @keyframes scanRotate { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes surfaceDetect { 0%,100% { opacity:0.4; transform:perspective(400px) rotateX(50deg) scale(1); } 50% { opacity:0.7; transform:perspective(400px) rotateX(50deg) scale(1.05); } }
        @keyframes float3D { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
        @keyframes trackDot { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes placementPulse { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:0.7; transform:scale(1.1); } }
        @keyframes summonRing3D { 0% { transform:translate(-50%,-50%) rotateX(60deg) scale(0); opacity:1; } 100% { transform:translate(-50%,-50%) rotateX(60deg) scale(3); opacity:0; } }
        @keyframes summonRise { 0% { transform:translateY(60px) scale(0); opacity:0; } 40% { transform:translateY(-10px) scale(1.2); opacity:1; } 70% { transform:translateY(5px) scale(0.95); } 100% { transform:translateY(0) scale(1); opacity:1; } }
        @keyframes beamPulse { 0%,100% { opacity:0.3; } 50% { opacity:0.7; } }
        @keyframes particle3D { 0% { transform:rotate(var(--r,0deg)) translateY(0); opacity:1; } 100% { transform:rotate(var(--r,0deg)) translateY(-120px) translateX(40px); opacity:0; } }
        @keyframes arBob { 0%,100% { transform:translateY(0) rotateY(0deg); } 25% { transform:translateY(-4px) rotateY(3deg); } 75% { transform:translateY(-2px) rotateY(-3deg); } }
        @keyframes compassSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes radarSweep { from { transform:translate(-50%,-50%) rotate(0deg); } to { transform:translate(-50%,-50%) rotate(360deg); } }
        @keyframes blinkDot { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes notifSlide { from { opacity:0; transform:translate(-50%,-10px); } to { opacity:1; transform:translate(-50%,0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes bounceIn { 0% { transform:scale(0); } 60% { transform:scale(1.2); } 100% { transform:scale(1); } }
        @keyframes confetti { 0% { transform:translateY(0) rotate(0deg); opacity:1; } 100% { transform:translateY(600px) rotate(720deg); opacity:0; } }
      `}</style>
    </div>
  );
}
