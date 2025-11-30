import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, RefreshCw, ShieldAlert, Quote, ArrowRight, X, Stars, Moon, Eye, RotateCcw } from 'lucide-react';

// --- 擴充後的 20 種老闆語錄情境資料庫 ---
const DATABASE = [
  // 1. 造神運動 (God Complex)
  {
    category: "造神運動",
    keywords: ['沒有我', '沒有現在的你', '恩人', '造就', '成全', '提拔', '想當初'],
    translation: "我試圖讓你相信，你的成就完全來自於我的恩賜，而不是你的努力。這是為了剝奪你的自信，讓你成為我的附屬品。",
    puaLevel: 98, 
    advice: "你的能力屬於你自己。工作是契約交換，不是神蹟施捨。",
    verdict: "無視指數：5% (需建立強大心理界線)"
  },
  // 2. 情感帳戶/施恩圖報 (Emotional Debt)
  {
    category: "施恩圖報",
    keywords: ['當初', '機會', '錄用', '感激', '心存感激', '知恩圖報', '給機會', '報答'],
    translation: "我把你被錄用這件正常的商業行為，包裝成天大的恩情。我希望你帶著贖罪的心情工作，不敢要求合理的待遇。",
    puaLevel: 85,
    puaType: "情感債務型",
    advice: "錄用你是因為你有價值，不是因為他在做慈善。",
    verdict: "無視指數：10% (保持專業互惠)"
  },
  // 3. 團體勒索 (Collectivism Blackmail)
  {
    category: "團體勒索",
    keywords: ['團隊', '付出', '不想嗎', '多付出', '計較', '自私', '大家', '合群', '互相幫忙', '太計較', '為團隊'],
    translation: "我用『團隊』這頂大帽子扣在你頭上。只要你不願意無償犧牲，就會被貼上『自私』的標籤。這是群體暴力的變形。",
    puaLevel: 88,
    advice: "真正的團隊精神是互相尊重界線，而不是集體壓榨。",
    verdict: "無視指數：30% (堅定立場)"
  },
  // 4. 恐懼管理/替代威脅 (Replacement Threat)
  {
    category: "替代威脅",
    keywords: ['不喜歡', '外面', '排隊', '位子', '不好找', '沒人要', '取代', '以後沒機會', '等著做', '不做', '很多人'],
    translation: "你是可以隨時被拋棄的消耗品。我透過貶低你的獨特性，製造『隨時會失業』的恐懼，讓你不敢反抗。",
    puaLevel: 95,
    advice: "他在虛張聲勢。如果真的那麼多人排隊，他早就換人了。",
    verdict: "無視指數：95% (戳破謊言)"
  },
  // 5. 傲慢失職 (Arrogant Negligence)
  {
    category: "傲慢失職",
    keywords: ['我很忙', '小事', '煩我', '我要你幹嘛', '不需要知道為什麼', '拿這種', '那我要你', '結果', '過程'],
    translation: "我不想做管理，只想當皇帝。遇到困難別來煩我，但功勞記得算我的。我用『忙碌』來掩飾我的管理無能。",
    puaLevel: 75,
    advice: "這類老闆缺乏解決問題的能力。遇到小事請自行決定並記錄過程。",
    verdict: "無視指數：60% (自保為上)"
  },
  // 6. 感情勒索/背叛指控 (Betrayal Accusation)
  {
    category: "背叛指控",
    keywords: ['對你這麼好', '離開', '背叛', '走', '良心', '跳槽', '對不起我', '把你當', '心寒', '怎麼可以'],
    translation: "我無法接受你是一個獨立個體。你的離職對我來說不是商業選擇，而是『背叛』。我想用罪惡感把你綁在身邊。",
    puaLevel: 90,
    advice: "離職是商業行為，不是感情劈腿。好聚好散是理想，不行則冷處理。",
    verdict: "無視指數：80% (保持專業)"
  },
  // 7. 假性貧窮/共體時艱 (Fake Poverty)
  {
    category: "賣慘剝削",
    keywords: ['共體時艱', '困難', '一起撐過', '景氣不好', '沒錢', '預算', '省一點', '相挺', '幫公司'],
    translation: "公司沒錢（或我想買新車），所以你的福利先砍。但我很辛苦，所以你不能抱怨，還要跟我一起受苦。",
    puaLevel: 80,
    advice: "老闆的創業風險不該由員工無償承擔。常態性賣慘建議快逃。",
    verdict: "無視指數：20% (聽聽就好)"
  },
  // 8. 夢想詐騙 (Dream Scam)
  {
    category: "畫大餅",
    keywords: ['未來', '願景', '上市', '股票', '事業', '熱情', '談錢', '眼光放長遠', '格局', '夢想', '一起拼'],
    translation: "現在沒錢給你，但我可以用『夢想』來勒索你。談錢太俗氣了，雖然我開公司就是為了賺錢。",
    puaLevel: 92,
    advice: "工作就是為了錢，有錢才有熱情。承諾若沒寫在合約上，一律當作廢紙。",
    verdict: "無視指數：85% (錢給到位再說)"
  },
  // 9. 混亂管理 (Chaos Management)
  {
    category: "朝令夕改",
    keywords: ['不怕修改', '需求會變', '不需要寫文件', '邏輯', '彈性', '隨機應變', '不用太僵化', '改一下'],
    translation: "我不知道自己要什麼，所以我沒辦法給明確規格。我不寫文件是因為懶，這樣出包了才能賴在你頭上。",
    puaLevel: 70,
    advice: "保留所有修改紀錄與對話截圖。不要讓他的『善變』成為你的『疏失』。",
    verdict: "無視指數：40% (保護自己)"
  },
  // 10. 比較羞辱 (Shaming Comparison)
  {
    category: "比較羞辱",
    keywords: ['別的團隊', '別人', '跟不上', '努力程度', '溝通能力', '沒有價值', '為什麼別人', '多學學', '差太多'],
    translation: "我通過比較來製造焦慮。攻擊你的性格和能力，讓你覺得一切都是你的錯，進而接受不合理的待遇。",
    puaLevel: 95,
    advice: "這是職場霸凌的開端。客觀評估績效，不要接受模糊的人身攻擊。",
    verdict: "無視指數：90% (拒絕接收負能量)"
  },
  // 11. 貶低價值 (Devaluation)
  {
    category: "貶低價值",
    keywords: ['學習', '年輕人', '外面找不到', '不是來領薪水', '學經驗', '繳學費', '眼高手低', '身在福中'],
    translation: "我要斬斷你的退路。把你應得的薪水說成是『學費』，讓你覺得被剝削還是一種恩賜。",
    puaLevel: 88,
    advice: "經驗有價，但不該用薪水來換。去市場面試，驗證自己的真實身價。",
    verdict: "無視指數：80% (相信自己)"
  },
  // 12. 奴性測試 (Subservience Test)
  {
    category: "奴性測試",
    keywords: ['忠誠度', '隨傳隨到', '放在心上', '當自己家', '責任感', '多做一點', '下班後', '回訊息'],
    translation: "我要的不是夥伴，而是僕人。『忠誠度』翻譯過來就是『長時間無償加班且不抱怨』。",
    puaLevel: 85,
    advice: "忠誠是雙向的。如果公司對你的薪資不忠誠，你也不需要對加班忠誠。",
    verdict: "無視指數：70% (看錢辦事)"
  },
  // 13. 假開明/雙重標準 (Fake Openness)
  {
    category: "雙重標準",
    keywords: ['對事不對人', '不是在罵你', '有話直說', '開放', '不要往心裡去', '玻璃心', '開玩笑'],
    translation: "我先打個預防針，這樣我等下羞辱你時，你如果不高興，就是你『太玻璃心』，不是我沒禮貌。",
    puaLevel: 78,
    advice: "過濾情緒字眼，只聽事實。若涉及人身攻擊，請錄音自保。",
    verdict: "無視指數：60% (過濾情緒)"
  },
  // 14. 隱形工時 (Invisible Labor)
  {
    category: "隱形工時",
    keywords: ['責任制', '做完再走', '很快', '幾分鐘', '幫個忙', '順便', '下班前', '小忙'],
    translation: "事情做不完是你能力差，做完了是我領導有方。這幾分鐘的小事，其實是幾小時的免費工時。",
    puaLevel: 82,
    advice: "具體詢問內容與期限，善用『手上有急件』來擋。",
    verdict: "無視指數：20% (涉及權益)"
  },
  // 15. 社會性抹殺 (Social Gaslighting)
  {
    category: "社會抹殺",
    keywords: ['其他人怎麼看', '大家覺得', '風評', '以後怎麼混', '業界很小', '名聲', '毀掉'],
    translation: "我利用你對『名聲』的恐懼來控制你。其實業界很大，大家也都知道這間公司的名聲如何。",
    puaLevel: 92,
    advice: "他在利用從眾心理恐嚇你。專業表現才是硬通貨。",
    verdict: "無視指數：90% (專注實力)"
  },
  // 16. 假民主 (Fake Democracy) - NEW
  {
    category: "假民主",
    keywords: ['大家討論', '我很開明', '聽聽意見', '你們決定', '共識'],
    translation: "我假裝讓大家參與決策，其實我心裡早有定見。如果你們的決定跟我不同，我們就『討論』到跟我一樣為止。",
    puaLevel: 65,
    advice: "在會議中觀察風向，不要太早當出頭鳥，因為結局通常已經寫好了。",
    verdict: "無視指數：50% (演戲配合)"
  },
  // 17. 資訊封鎖 (Mushroom Management) - NEW
  {
    category: "資訊封鎖",
    keywords: ['不需要知道', '機密', '上面的事', '這不是你該管的', '聽命行事', '照做'],
    translation: "把你像蘑菇一樣養在黑暗裡，只餵你吃肥料（雜事）。我不讓你了解全貌，這樣你就永遠無法取代我，也無法成長。",
    puaLevel: 75,
    advice: "主動尋求跨部門資訊，或在執行時多問『為什麼』來拼湊全貌。",
    verdict: "無視指數：40% (主動探索)"
  },
  // 18. 吹毛求疵 (Micromanagement) - NEW
  {
    category: "微觀管理",
    keywords: ['字體', '格式', '標點符號', '這裡歪了', '盯著', '細節', '重做'],
    translation: "我對大方向沒想法，只好在枝微末節上找你麻煩，來刷我的存在感與控制欲。",
    puaLevel: 60,
    advice: "建立檢查清單（Checklist）讓他勾選，減少他臨時起意的挑剔。",
    verdict: "無視指數：30% (耐心應對)"
  },
  // 19. 卸責轉嫁 (Blame Shifting) - NEW
  {
    category: "卸責轉嫁",
    keywords: ['我以為你知道', '你要自己問', '主動', '沒提醒我', '你的疏失'],
    translation: "只要出包，絕對不是我指令不清，而是你不夠『主動』。我擁有最終解釋權，用來把鍋甩到你頭上。",
    puaLevel: 85,
    advice: "所有指令務必留下文字紀錄（Email/Line），保護自己免於背鍋。",
    verdict: "無視指數：20% (證據為王)"
  },
  // 20. 假性放權 (Fake Empowerment) - NEW
  {
    category: "假性放權",
    keywords: ['全權負責', '交給你', '你看著辦', '我相信你'],
    translation: "這件事我不沾手，成功了是我識人有方，失敗了是你全權負責。這不是授權，這是找替死鬼。",
    puaLevel: 80,
    advice: "釐清權責範圍與資源，確認『全權』是否包含『決策權』與『預算權』。",
    verdict: "無視指數：40% (謹慎接球)"
  }
];

// 擴充經典語錄列表
const CLASSIC_QUOTES = [
  "當初給你機會錄用你，你要心存感激",
  "沒有我就沒有現在的你",
  "你難道不想為團隊多付出一些嗎",
  "我這麼忙，你還拿這種小事來煩我",
  "我對你這麼好，你怎麼可以離開",
  "如果你不喜歡，外面有很多人等著做",
  "公司沒錢，大家共體時艱",
  "年輕人眼光要放遠，不要計較錢",
  "能者多勞，多做一點是給你機會",
  "不要計較眼前的得失，要看未來",
  "我不是在罵你，我是對事不對人",
  "把公司當成自己的家",
  "現在年輕人抗壓性真的很低",
  "這只是幾分鐘的事，幫忙一下",
  "我們在做的是一份事業，不是工作",
  "你要有責任感，事情做完再走",
  "我看好你的潛力，才給你這些磨練",
  "外面工作沒那麼好找，要惜福",
  "別的團隊都可以，為什麼你們不行",
  "不要怕修改，需求變更是正常的",
  "不需要寫文件，大家要有默契",
  "我這是為你好，以後你就知道了",
  "你這樣做，我很難跟上面交代",
  "公司沒有你也能運轉下去",
  "我把你們當未來的接班人培養",
  "吃苦當吃補，年輕多學一點",
  "你要自己想辦法，我要的是結果",
  "不要跟我談錢，談錢傷感情",
  "這裡學到的經驗，外面花錢買不到",
  "大家共體時艱，今年沒有年終",
  "你現在不做，以後就沒機會了",
  "我是器重你，才叫你做這麼多",
  "這點犧牲都不願意，怎麼成大器",
  "你的努力程度還不夠",
  "為什麼其他人沒問題，就你有問題",
  "我們是一個大家庭",
  "不要太計較上下班時間",
  "只要努力，位子是留給準備好的人",
  "公司未來要上市，大家都是股東",
  "你只需執行，不需要知道為什麼"
];

// 預設的回覆
const FALLBACK_RESPONSES = [
  {
    category: "話術試探",
    translation: "這句話聽起來冠冕堂皇，但翻譯機偵測到高濃度的『話術』成分。老闆可能正在試探你的底線，或是想用最少的成本換取你最大的產出。",
    puaLevel: 45,
    advice: "保持禮貌但堅定的界線。微笑點頭，然後繼續照規矩辦事。",
    verdict: "無視指數：50%"
  },
  {
    category: "模糊焦點",
    translation: "典型的職場填補用語，用來說服你接受某個不太合理的狀況（變動、加班、批評），但又不想給你實質補償。",
    puaLevel: 65,
    advice: "不要被表面的好聽話迷惑，看他實際做了什麼（給錢、給人、給資源）。",
    verdict: "無視指數：70%"
  }
];

export default function BossTranslatorApp() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const scrollContainerRef = useRef(null);

  const analyzeText = () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setShowCard(false);
    setResult(null);

    // 模擬塔羅牌洗牌/解讀時間
    setTimeout(() => {
      const text = inputText.toLowerCase();
      let bestMatch = null;
      let maxHits = 0;

      DATABASE.forEach(item => {
        const hits = item.keywords.filter(k => text.includes(k)).length;
        if (hits > 0 && hits > maxHits) {
          maxHits = hits;
          bestMatch = item;
        } else if (hits > 0 && hits === maxHits && !bestMatch) {
          bestMatch = item; // 優先取第一個匹配
        }
      });

      if (!bestMatch) {
        bestMatch = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      }

      setResult(bestMatch);
      setIsAnalyzing(false);
      setShowCard(true); // 觸發翻牌動畫
    }, 1500);
  };

  const clearInput = () => {
    setInputText("");
    setResult(null);
    setShowCard(false);
  };

  // 根據等級決定卡片光暈顏色 (更柔和的高級感)
  const getGlowColor = (level) => {
    if (level < 60) return "shadow-[0_0_50px_rgba(16,185,129,0.2)] border-emerald-500/40 bg-gradient-to-br from-[#0a1f18] to-[#050810]";
    if (level < 85) return "shadow-[0_0_50px_rgba(245,158,11,0.2)] border-amber-500/40 bg-gradient-to-br from-[#1f160a] to-[#050810]";
    return "shadow-[0_0_60px_rgba(225,29,72,0.25)] border-rose-500/40 bg-gradient-to-br from-[#1f0a0f] to-[#050810]";
  };
  
  const getTextColor = (level) => {
    if (level < 60) return "text-emerald-300";
    if (level < 85) return "text-amber-200";
    return "text-rose-300";
  };

  return (
    <div className="min-h-screen bg-[#050810] font-sans text-slate-300 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* Mystical Background Layers - 星空氛圍 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-950/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-violet-950/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow delay-1000"></div>
        <div className="absolute top-[20%] right-[20%] w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_10px_white] animate-twinkle"></div>
        <div className="absolute top-[60%] left-[10%] w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_8px_white] animate-twinkle delay-500"></div>
        <div className="absolute top-[30%] left-[50%] w-[3px] h-[3px] bg-indigo-200 rounded-full shadow-[0_0_12px_white] animate-twinkle delay-200"></div>
      </div>

      {/* Header - 標題區 */}
      <header className="mb-12 text-center max-w-2xl w-full animate-fade-in relative z-10">
        <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-slate-900/40 border border-slate-700/50 backdrop-blur-md shadow-lg transition-transform hover:scale-105 duration-500 cursor-default">
          <Stars className="w-3 h-3 text-indigo-300" />
          <span className="text-[11px] tracking-[0.3em] text-indigo-200 uppercase font-light">Soul Reader 9.6</span>
          <Moon className="w-3 h-3 text-indigo-300" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-slate-100 mb-5 tracking-wide drop-shadow-2xl">
          老闆的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 italic">翻譯蒟蒻</span>
        </h1>
        <p className="text-slate-500 text-sm font-light tracking-wider max-w-md mx-auto leading-relaxed">
          在星空下，翻開那張名為「真相」的牌。<br/>
          看穿他的話術，找回內心的平靜。
        </p>
      </header>

      {/* Main Content Area - 卡片區 */}
      <main className="w-full max-w-lg relative z-20 perspective-1000 min-h-[420px] mb-8">
        
        {/* Input Card (Face Down / Waiting State) */}
        {!showCard && (
          <div className={`relative transition-all duration-700 ease-in-out transform ${isAnalyzing ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
             {/* 邊框光暈 */}
             <div className="absolute -inset-[1px] bg-gradient-to-b from-indigo-500/30 via-purple-500/10 to-transparent rounded-2xl blur-sm opacity-50"></div>
             
             <div className="relative bg-[#0f1422]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden group">
                
                {/* 裝飾紋理 */}
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                
                <div className="p-8 relative">
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-[10px] text-indigo-300/60 tracking-[0.2em] uppercase font-serif flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> 老闆說的 murmur..
                     </span>
                     {inputText && <button onClick={clearInput} className="p-1 rounded-full hover:bg-white/10 transition"><X className="w-4 h-4 text-slate-500 hover:text-slate-300"/></button>}
                  </div>

                  <textarea
                    className="w-full bg-transparent p-2 text-xl md:text-2xl text-slate-100 placeholder:text-slate-700 outline-none resize-none min-h-[140px] font-serif tracking-wide leading-relaxed text-center selection:bg-indigo-500/40"
                    placeholder="在此輸入老闆的那句話..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if(e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          analyzeText();
                      }
                    }}
                  ></textarea>

                  <div className="flex justify-center mt-8">
                     <button
                      onClick={analyzeText}
                      disabled={!inputText.trim() || isAnalyzing}
                      className={`group relative px-10 py-3 rounded-full font-serif tracking-[0.15em] text-xs transition-all duration-700 overflow-hidden
                        ${!inputText.trim() || isAnalyzing 
                          ? 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed' 
                          : 'text-indigo-100 border border-indigo-400/30 hover:border-indigo-300/60 shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] bg-[#1a1f35]'}`}
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                      <span className="relative flex items-center gap-3">
                         {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" /> : <Eye className="w-4 h-4 text-indigo-300" />}
                         {isAnalyzing ? "星象解讀中..." : "揭示真相"}
                      </span>
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}

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
                   <span className="text-lg font-serif tracking-[0.2em] uppercase text-slate-300 drop-shadow-md font-bold">{result.category}</span>
                </div>
              </div>

              <div className="p-8 md:p-12 relative flex flex-col h-full">
                
                {/* Original Murmur Display */}
                <div className="mb-6 text-center relative z-10 px-2 opacity-60">
                    <p className="text-xs font-serif tracking-widest text-slate-400 leading-relaxed border-b border-white/10 pb-4 mx-auto max-w-[80%]">
                       〝 {inputText} 〞
                    </p>
                </div>

                {/* Result Content */}
                <div className="flex flex-col items-center mb-8">
                   {/* PUA 指數 - 已修改標籤 */}
                   <span className="text-slate-500 text-[9px] tracking-[0.4em] uppercase mb-3 opacity-70">PUA 指數</span>
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
                   <div className="relative bg-[#1a1f30]/40 backdrop-blur-md p-6 rounded-lg border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group">
                        {/* Decorative corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-indigo-400/30"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-indigo-400/30"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-indigo-400/30"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-indigo-400/30"></div>

                        <Quote className="w-4 h-4 text-indigo-400/50 absolute top-3 left-3 transform -scale-x-100" />
                        <p className="text-lg md:text-xl leading-8 font-serif text-slate-200 drop-shadow-md tracking-wide italic">
                            {result.translation}
                        </p>
                        <Quote className="w-4 h-4 text-indigo-400/50 absolute bottom-3 right-3" />
                   </div>
                </div>

                {/* Advice Section */}
                <div className="space-y-6 mb-8">
                   <div className="bg-[#151a2a]/60 p-5 rounded-xl border border-white/5 shadow-inner backdrop-blur-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/30 group-hover:bg-indigo-500/50 transition-colors"></div>
                      <h4 className="text-indigo-300/90 font-serif mb-2 text-[10px] tracking-[0.2em] uppercase flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3" />
                        教戰手則
                      </h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-6 font-light tracking-wide">
                        {result.advice}
                      </p>
                   </div>
                   
                   {/* Verdict - 已放大並強化鼓勵效果 */}
                   <div className="text-center mt-6">
                      <span className="text-sm md:text-base font-bold text-indigo-200 tracking-widest border-b border-indigo-500/30 pb-2 shadow-sm drop-shadow-md" title="判決結果">
                         {result.verdict}
                      </span>
                   </div>
                </div>

                {/* Return Button (Moved to Bottom) */}
                <div className="mt-auto flex justify-center pt-2">
                   <button 
                     onClick={() => setShowCard(false)} 
                     className="group flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
                   >
                     <RotateCcw className="w-3 h-3 text-indigo-300 group-hover:-rotate-180 transition-transform duration-700" />
                     <span className="text-[10px] tracking-[0.2em] text-indigo-200 uppercase font-light">返回</span>
                   </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* Scrollable Classic Voices Section - Grid Layout Update */}
      {!showCard && !isAnalyzing && (
        <div className="w-full max-w-4xl animate-fade-in delay-200 mb-12 relative z-20">
            <div className="flex items-center gap-4 px-8 opacity-30 mb-6 justify-center">
               <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-500"></div>
               <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-serif whitespace-nowrap">經典老闆台詞</span>
               <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-500"></div>
            </div>
            
            <div className="relative group">
                {/* Horizontal Scroll Grid Container */}
                <div 
                    ref={scrollContainerRef}
                    className="grid grid-rows-2 grid-flow-col gap-3 px-8 pb-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide mask-linear"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {CLASSIC_QUOTES.map((text, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setInputText(text)}
                            className="w-[280px] snap-center p-4 bg-[#0a0e17]/60 hover:bg-[#131929] border border-slate-800/60 hover:border-indigo-500/30 text-slate-500 hover:text-indigo-200 text-xs text-left rounded-xl transition-all duration-300 font-light tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.08)] backdrop-blur-sm flex items-center justify-between group/card"
                        >
                            <span className="leading-relaxed opacity-80 group-hover/card:opacity-100 transition-opacity truncate pr-2">
                                "{text}"
                            </span>
                            <ArrowRight className="w-3 h-3 flex-shrink-0 text-indigo-400 opacity-0 group-hover/card:opacity-100 transition-opacity transform -translate-x-2 group-hover/card:translate-x-0 duration-300"/>
                        </button>
                    ))}
                </div>
                
                {/* Scroll Hints (Optional Visual Cues) */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050810] to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050810] to-transparent pointer-events-none"></div>
            </div>
            
            <p className="text-center text-[9px] text-slate-600 mt-2 tracking-widest opacity-40">← 左右滑動查看更多 →</p>
        </div>
      )}

      <footer className="mt-auto pt-6 pb-6 text-slate-700 text-[10px] text-center font-light tracking-[0.1em] uppercase opacity-60 relative z-10 hover:opacity-100 transition-opacity duration-500 flex flex-col gap-2">
          <p className="tracking-[0.4em]">Insight & Truth • Ver 9.6</p>
          <p>
              製作者：
              <a 
                  href="https://chia-tinyhand.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400/80 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-300 transition-all ml-1"
              >
                  小手佳佳 ＠Chia_tinyhand
              </a>
          </p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes card-flip {
          0% { opacity: 0; transform: perspective(1000px) rotateY(90deg) translateY(20px); }
          100% { opacity: 1; transform: perspective(1000px) rotateY(0deg) translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-card-flip {
          animation: card-flip 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          transform-style: preserve-3d;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        .animate-twinkle {
          animation: twinkle 4s infinite ease-in-out;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}
