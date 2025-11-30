import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, RefreshCw, ShieldAlert, Quote, ArrowRight, X, Stars, Moon, Eye, RotateCcw, Siren, ChevronLeft, ChevronRight } from 'lucide-react';

// --- 擴充至 30 種老闆語錄情境資料庫 ---
const DATABASE = [
  // ... (保留原有的 1-25 類)
  // 1. 造神運動
  {
    category: "造神運動",
    keywords: ['沒有我', '沒有現在的你', '恩人', '造就', '成全', '提拔', '想當初'],
    translation: "我試圖讓你相信，你的成就完全來自於我的恩賜，而不是你的努力。這是為了剝奪你的自信，讓你成為我的附屬品。",
    puaLevel: 98, 
    advice: "你的能力屬於你自己。工作是契約交換，不是神蹟施捨。",
    verdict: "PUA 指數：98% (需建立強大心理界線)"
  },
  // ... (其他 2-25 類省略)
  // 23. 職場性騷擾 (Workplace Harassment)
  {
    category: "職場性騷擾",
    keywords: ['勾引誰', '身材', '有料', '包太緊', '陪睡', '雙人房', '大驚小怪', '追你', '滋潤', '談戀愛', '約會', '炒飯', '想揉', '自拍', '穿露一點'],
    translation: "這不是開玩笑，這是性騷擾。我試圖用權力不對等來合理化對你身體或隱私的侵犯，並測試你的底線。",
    puaLevel: 100,
    advice: "這是違法行為！請立刻蒐證（錄音、截圖），不要隱忍，尋求法律或人資協助。",
    verdict: "PUA 指數：100% (立刻蒐證)"
  },
  // ... (其他 24-25 類省略)
  
  // --- 新增類別 (第 26-30 類) ---
  
  // 26. 噁心試探/假借健康 (New - High Risk)
  {
    category: "噁心試探",
    keywords: ['消腫', '升旗', '按摩', '那裡', '排毒', '憋壞', '攝護腺', '能量', '發洩', '弄出來', '幫老闆'],
    translation: "我利用『健康需求』或『可憐』的假象，試圖誘騙你進行肢體接觸。這不是醫療需求，這是利用權勢進行的猥褻試探。",
    puaLevel: 100,
    advice: "🔴 極度危險！請立即離開現場（藉口上廁所/身體不適）。若發生在密閉空間，開啟錄音並迅速移動到有監視器或他人的地方。",
    verdict: "PUA 指數：100% (犯罪前兆)"
  },
  // 27. 自戀性騷 (New - High Risk)
  {
    category: "自戀性騷",
    keywords: ['厲害', '比較看看', '練過', '撐很久', '軟腳蝦', '比較', '男朋友', '年輕個十歲'],
    translation: "我極度自戀，把性騷擾當成展現雄風的方式，甚至把『追求你』當成對你的恩賜。這其實是在試探你的底線，看你可以忍受多少冒犯。",
    puaLevel: 95,
    advice: "不需要回應他的問題，保持冷漠。紀錄發生的時間地點與對話內容，這屬於言語性騷擾，可向主管機關申訴。",
    verdict: "PUA 指數：95% (蒐證申訴)"
  },
  // 28. 物品化羞辱 (New - High Risk)
  {
    category: "物品化羞辱",
    keywords: ['真實的一面', '拉鍊', '卡住', '蹭一下', '伺候', '福利', '形狀', '硬的地方', '握不住', '車內', '兩個人', '請你穿露一點', '留念'],
    translation: "我把你當成洩慾或觀賞的『物品』，而非員工。這種赤裸的言語暴力通常是肢體侵犯的前奏，我在測試你的反抗程度。",
    puaLevel: 100,
    advice: "🔴 紅色警報！若在車內或辦公室獨處，請保持冷靜不要激怒對方，設法聯繫親友或製造聲響，一有機會立刻逃離。",
    verdict: "PUA 指數：100% (紅色警戒)"
  },
  // 29. 生理勒索/倒果為因 (New - High Risk)
  {
    category: "生理勒索",
    keywords: ['穿這麼緊', '害我', '腫得好痛', '站起來', '負責', '下面', '控制不住', '很難專心', '穿這麼露'],
    translation: "我把我的生理反應怪罪到你身上，這是典型的強暴犯邏輯。試圖讓你產生愧疚感或責任感，讓你覺得『是我的錯』。",
    puaLevel: 98,
    advice: "不要被洗腦！他的生理反應是他自己的問題，與你的穿著完全無關。嚴正拒絕並告知這讓你不舒服。",
    verdict: "PUA 指數：98% (拒絕愧疚感)"
  },
  // 30. 肢體威脅 (New - High Risk)
  {
    category: "肢體威脅",
    keywords: ['摸一下', '透透氣', '不放進去', '硬度', '不幫我', '褲襠', '雄風', '騙妳', '拉開', '進去一下', '不會射', '射'],
    translation: "這已經超越騷擾，是強制猥褻或性侵害的預告。我用威脅或利誘的方式，強迫你進行肢體接觸。",
    puaLevel: 100,
    advice: "🔴 這是犯罪行為！不要猶豫，立刻離開！如果被阻攔，請大聲呼救、破壞物品製造聲響，事後務必報警提告，絕不和解。",
    verdict: "PUA 指數：100% (立刻報警)"
  }
];

// ... (CLASSIC_QUOTES 和 FALLBACK_RESPONSES 保持不變)

export default function BossTranslatorApp() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const scrollContainerRef = useRef(null);

  // ... (analyzeText, clearInput, scrollLeft, scrollRight 保持不變)

  // 根據等級決定卡片光暈顏色 (更柔和的高級感)
  const getGlowColor = (level) => {
    // 100分危險等級：使用更亮的紅色漸層背景，移除閃爍動畫，確保清晰度
    if (level === 100) return "shadow-[0_0_60px_rgba(220,38,38,0.5)] border-red-500 bg-gradient-to-br from-[#3a0a0a] to-[#1a0505]"; 
    if (level < 60) return "shadow-[0_0_50px_rgba(16,185,129,0.2)] border-emerald-500/40 bg-gradient-to-br from-[#0a1f18] to-[#050810]";
    if (level < 85) return "shadow-[0_0_50px_rgba(245,158,11,0.2)] border-amber-500/40 bg-gradient-to-br from-[#1f160a] to-[#050810]";
    return "shadow-[0_0_60px_rgba(225,29,72,0.25)] border-rose-500/40 bg-gradient-to-br from-[#1f0a0f] to-[#050810]";
  };
  
  const getTextColor = (level) => {
    // 100分危險等級：使用更亮的紅色文字，確保清晰度
    if (level === 100) return "text-red-300";
    if (level < 60) return "text-emerald-300";
    if (level < 85) return "text-amber-200";
    return "text-rose-300";
  };

  return (
    <div className="min-h-screen bg-[#050810] font-sans text-slate-300 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* ... (Mystical Background Layers 保持不變) */}
      {/* ... (Header 保持不變) */}
      {/* ... (Input Card 保持不變) */}

        {/* The Result Card (Tarot Flip Effect) */}
        {showCard && result && (
          <div className="animate-card-flip">
            <div className={`relative rounded-xl overflow-hidden border transition-all duration-1000 ${getGlowColor(result.puaLevel)}`}>
              
              {/* Inner Decorative Border */}
              <div className="absolute inset-2 border border-white/5 rounded-lg pointer-events-none z-20"></div>
              
              {/* Top Label */}
              <div className="bg-[#0a0d16]/50 backdrop-blur-sm py-4 px-6 flex justify-between items-center border-b border-white/5 relative z-30">
                <div className="flex items-center gap-3">
                   <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${getTextColor(result.puaLevel)}`}></div>
                   {/* 100分危險等級：移除閃爍動畫，使用明亮的紅色文字 */}
                   <span className={`text-lg font-serif tracking-[0.2em] uppercase drop-shadow-md font-bold ${result.puaLevel === 100 ? 'text-red-300' : 'text-slate-300'}`}>
                     {result.category}
                   </span>
                </div>
              </div>

              <div className="p-8 md:p-12 relative flex flex-col h-full">
                
                {/* Original Murmur Display */}
                <div className="mb-6 text-center relative z-10 px-2 opacity-80">
                    <p className="text-xs font-serif tracking-widest text-slate-400 leading-relaxed border-b border-white/10 pb-4 mx-auto max-w-[80%]">
                       〝 {inputText} 〞
                    </p>
                </div>

                {/* Result Content */}
                <div className="flex flex-col items-center mb-8">
                   {/* PUA 指數 - 已修改標籤 */}
                   <span className="text-slate-500 text-[9px] tracking-[0.4em] uppercase mb-3 opacity-80">PUA 指數</span>
                   <div className="relative">
                     <span className={`text-5xl font-serif ${getTextColor(result.puaLevel)} drop-shadow-lg filter`}>
                       {result.puaLevel}%
                     </span>
                     {/* 背景裝飾大字 */}
                     <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-serif text-white/5 select-none -z-10 blur-sm">
                       {result.puaLevel}
                     </span>
                   </div>
                </div>

                {/* The Truth - Enhanced Texture */}
                <div className="mb-10 text-center relative z-10">
                   {/* 100分危險等級：使用更亮的背景和文字，確保清晰度 */}
                   <div className={`relative backdrop-blur-md p-6 rounded-lg border shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group ${result.puaLevel === 100 ? 'bg-red-950/50 border-red-500/50' : 'bg-[#1a1f30]/40 border-white/5'}`}>
                        {/* Decorative corners */}
                        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>
                        <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>
                        <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>
                        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>

                        <Quote className={`w-4 h-4 absolute top-3 left-3 transform -scale-x-100 ${result.puaLevel === 100 ? 'text-red-300' : 'text-indigo-400/50'}`} />
                        <p className={`text-lg md:text-xl leading-8 font-serif drop-shadow-md tracking-wide italic ${result.puaLevel === 100 ? 'text-red-100 font-medium' : 'text-slate-200'}`}>
                            {result.translation}
                        </p>
                        <Quote className={`w-4 h-4 absolute bottom-3 right-3 ${result.puaLevel === 100 ? 'text-red-300' : 'text-indigo-400/50'}`} />
                   </div>
                </div>

                {/* Advice Section */}
                <div className="space-y-6 mb-8">
                   {/* 100分危險等級：使用更亮的背景和文字，確保清晰度 */}
                   <div className={`p-5 rounded-xl border shadow-inner backdrop-blur-sm relative overflow-hidden group ${result.puaLevel === 100 ? 'bg-[#2a1a1a]/60 border-red-500/50' : 'bg-[#151a2a]/60 border-white/5'}`}>
                      <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${result.puaLevel === 100 ? 'bg-red-500' : 'bg-indigo-500/30 group-hover:bg-indigo-500/50'}`}></div>
                      <h4 className={`font-serif mb-2 text-lg tracking-[0.2em] uppercase flex items-center gap-2 font-bold ${result.puaLevel === 100 ? 'text-red-300' : 'text-indigo-300/90'}`}> 
                        {result.puaLevel === 100 ? <Siren className="w-5 h-5 animate-pulse" /> : <ShieldAlert className="w-5 h-5" />}
                        教戰手則
                      </h4>
                      <p className={`text-sm md:text-base leading-relaxed font-light tracking-wide ${result.puaLevel === 100 ? 'text-red-100' : 'text-slate-400'}`}>
                        {result.advice}
                      </p>
                   </div>
                   
                   {/* Verdict */}
                   <div className="text-center mt-6">
                      {/* 100分危險等級：使用更亮的紅色文字和邊框 */}
                      <span className={`text-sm md:text-base font-bold tracking-widest border-b pb-2 shadow-sm drop-shadow-md ${result.puaLevel === 100 ? 'text-red-300 border-red-500/50' : 'text-indigo-200 border-indigo-500/30'}`} title="判決結果">
                         {result.verdict}
                      </span>
                   </div>
                </div>

                {/* Return Button (Moved to Bottom) - Enlarged */}
                <div className="mt-auto flex justify-center pt-6">
                   <button 
                     onClick={() => setShowCard(false)} 
                     // 增加背景不透明度，使其在紅色背景上更清晰
                     className="group flex items-center gap-3 px-12 py-5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-300"
                   >
                     <RotateCcw className="w-5 h-5 text-indigo-300 group-hover:-rotate-180 transition-transform duration-700" />
                     <span className="text-lg tracking-[0.3em] text-indigo-200 uppercase font-light">返回</span>
                   </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* ... (Scrollable Classic Voices Section 保持不變) */}
      {/* ... (Footer 保持不變) */}
      {/* ... (Styles 保持不變) */}
    </div>
  );
}
