import { ImageWithFallback } from "../figma/ImageWithFallback";

const categories = [
  {
    label: "체험마을",
    color: "#FF6B35",
    title: "직접 만들고 수확하는 즐거움",
    desc: "농산물 수확부터 전통 공예까지",
    img: "https://images.unsplash.com/photo-1558819355-c62618ed7ec7?w=600&h=500&fit=crop",
    count: "12",
    experiences: "48종",
    nfts: "156개",
    tags: ["AI 대화", "AR 체험", "메타버스", "NFT"],
    techIcons: ["🤖", "📱", "🌍", "🎫"],
  },
  {
    label: "치유마을",
    color: "#4CAF50",
    title: "자연 속 힐링 여행",
    desc: "산림 치유와 명상 프로그램",
    img: "https://images.unsplash.com/photo-1770783808749-aa5b6bccc370?w=600&h=500&fit=crop",
    count: "8",
    experiences: "32종",
    nfts: "98개",
    tags: ["AI 대화", "AR 체험", "NFT"],
    techIcons: ["🤖", "📱", "🎫"],
  },
  {
    label: "교육농장",
    color: "#4A90E2",
    title: "아이들과 함께 배우는 농촌",
    desc: "체험 학습과 자연 교육",
    img: "https://images.unsplash.com/photo-1758622014699-2bfb8e5a2ce6?w=600&h=500&fit=crop",
    count: "15",
    experiences: "52종",
    nfts: "200개",
    tags: ["AI 대화", "AR 체험", "메타버스", "NFT"],
    techIcons: ["🤖", "📱", "🌍", "🎫"],
  },
  {
    label: "전통마을",
    color: "#9B59B6",
    title: "한국 전통문화 체험",
    desc: "한옥, 한복, 전통음식 만들기",
    img: "https://images.unsplash.com/photo-1710388766264-07a47a416e93?w=600&h=500&fit=crop",
    count: "10",
    experiences: "40종",
    nfts: "180개",
    tags: ["AI 대화", "메타버스", "NFT"],
    techIcons: ["🤖", "🌍", "🎫"],
  },
];

export function VillageCategorySection() {
  return (
    <section className="bg-white py-20 lg:py-[120px]">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2
          className="text-center mb-12"
          style={{
            fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 700,
            color: "#1A1A1A",
          }}
        >
          4가지 기술로 만나는 농촌 마을
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E5E5] rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group"
            >
              {/* Thumbnail */}
              <div className="relative h-[240px] overflow-hidden">
                <ImageWithFallback
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge */}
                <span
                  className="absolute top-4 left-4 bg-black/75 text-white px-3 py-1 rounded-xl"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  {cat.count}개 마을
                </span>
                {/* Tech icons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {cat.techIcons.map((icon, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center"
                      style={{
                        fontSize: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: cat.color,
                  }}
                >
                  {cat.label}
                </span>
                <h4
                  className="mt-1 mb-2"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                  }}
                >
                  {cat.title}
                </h4>
                <p
                  className="mb-3"
                  style={{ fontSize: "14px", color: "#666" }}
                >
                  {cat.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-[#F5F7FA] text-[#666] px-2.5 py-1 rounded-xl"
                      style={{ fontSize: "11px" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div
                  className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E5E5]"
                  style={{ fontSize: "12px", color: "#999" }}
                >
                  <span>마을 {cat.count}곳</span>
                  <span>체험 {cat.experiences}</span>
                  <span>NFT {cat.nfts}</span>
                </div>

                <button
                  className="w-full py-3 rounded-3xl border-2 border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white transition-all"
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  AI 가이드와 대화하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}