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
  // 2. 情感帳戶/施恩圖報
  {
    category: "施恩圖報",
    keywords: ['當初', '機會', '錄用', '感激', '心存感激', '知恩圖報', '給機會', '報答'],
    translation: "我把你被錄用這件正常的商業行為，包裝成天大的恩情。我希望你帶著贖罪的心情工作，不敢要求合理的待遇。",
    puaLevel: 85,
    advice: "錄用你是因為你有價值，不是因為他在做慈善。",
    verdict: "PUA 指數：85% (保持專業互惠)"
  },
  // 3. 團體勒索
  {
    category: "團體勒索",
    keywords: ['團隊', '付出', '不想嗎', '多付出', '計較', '自私', '大家', '合群', '互相幫忙', '太計較', '為團隊', '看那個誰誰誰'],
    translation: "我用『團隊』這頂大帽子扣在你頭上。只要你不願意無償犧牲，就會被貼上『自私』的標籤。這是群體暴力的變形。",
    puaLevel: 88,
    advice: "真正的團隊精神是互相尊重界線，而不是集體壓榨。",
    verdict: "PUA 指數：88% (堅定立場)"
  },
  // 4. 恐懼管理/替代威脅
  {
    category: "替代威脅",
    keywords: ['不喜歡', '外面', '排隊', '位子', '不好找', '沒人要', '取代', '以後沒機會', '等著做', '不做', '很多人', '除了我'],
    translation: "你是可以隨時被拋棄的消耗品。我透過貶低你的獨特性，製造『隨時會失業』的恐懼，讓你不敢反抗。",
    puaLevel: 95,
    advice: "他在虛張聲勢。如果真的那麼多人排隊，他早就換人了。",
    verdict: "PUA 指數：95% (戳破謊言)"
  },
  // 5. 傲慢失職
  {
    category: "傲慢失職",
    keywords: ['我很忙', '小事', '煩我', '我要你幹嘛', '不需要知道為什麼', '拿這種', '那我要你', '結果', '過程'],
    translation: "我不想做管理，只想當皇帝。遇到困難別來煩我，但功勞記得算我的。我用『忙碌』來掩飾我的管理無能。",
    puaLevel: 75,
    advice: "這類老闆缺乏解決問題的能力。遇到小事請自行決定並記錄過程。",
    verdict: "PUA 指數：75% (自保為上)"
  },
  // 6. 感情勒索/背叛指控
  {
    category: "背叛指控",
    keywords: ['對你這麼好', '離開', '背叛', '走', '良心', '跳槽', '對不起我', '心寒', '怎麼可以', '不敢把大任交給你'],
    translation: "我無法接受你是一個獨立個體。你的離職對我來說不是商業選擇，而是『背叛』。我想用罪惡感把你綁在身邊。",
    puaLevel: 90,
    advice: "離職是商業行為，不是感情劈腿。好聚好散是理想，不行則冷處理。",
    verdict: "PUA 指數：90% (保持專業)"
  },
  // 7. 假性貧窮/共體時艱
  {
    category: "賣慘剝削",
    keywords: ['共體時艱', '困難', '一起撐過', '景氣不好', '沒錢', '預算', '省一點', '相挺', '幫公司', '創業期', '轉型期'],
    translation: "公司沒錢（或我想買新車），所以你的福利先砍。但我很辛苦，所以你不能抱怨，還要跟我一起受苦。",
    puaLevel: 80,
    advice: "老闆的創業風險不該由員工無償承擔。常態性賣慘建議快逃。",
    verdict: "PUA 指數：80% (聽聽就好)"
  },
  // 8. 夢想詐騙
  {
    category: "畫大餅",
    keywords: ['未來', '願景', '上市', '股票', '事業', '熱情', '談錢', '眼光放長遠', '格局', '夢想', '一起拼', '特助', '主管位置'],
    translation: "現在沒錢給你，但我可以用『夢想』來勒索你。談錢太俗氣了，雖然我開公司就是為了賺錢。",
    puaLevel: 92,
    advice: "工作就是為了錢，有錢才有熱情。承諾若沒寫在合約上，一律當作廢紙。",
    verdict: "PUA 指數：92% (錢給到位再說)"
  },
  // 9. 混亂管理
  {
    category: "朝令夕改",
    keywords: ['不怕修改', '需求會變', '不需要寫文件', '邏輯', '彈性', '隨機應變', '不用太僵化', '改一下'],
    translation: "我不知道自己要什麼，所以我沒辦法給明確規格。我不寫文件是因為懶，這樣出包了才能賴在你頭上。",
    puaLevel: 70,
    advice: "保留所有修改紀錄與對話截圖。不要讓他的『善變』成為你的『疏失』。",
    verdict: "PUA 指數：70% (保護自己)"
  },
  // 10. 比較羞辱
  {
    category: "比較羞辱",
    keywords: ['別的團隊', '別人', '跟不上', '努力程度', '溝通能力', '沒有價值', '為什麼別人', '多學學', '差太多', '其他人太笨', '只有你'],
    translation: "我通過比較來製造焦慮。攻擊你的性格和能力，讓你覺得一切都是你的錯，進而接受不合理的待遇。",
    puaLevel: 95,
    advice: "這是職場霸凌的開端。客觀評估績效，不要接受模糊的人身攻擊。",
    verdict: "PUA 指數：95% (拒絕接收負能量)"
  },
  // 11. 貶低價值
  {
    category: "貶低價值",
    keywords: ['學習', '年輕人', '外面找不到', '不是來領薪水', '學經驗', '繳學費', '眼高手低', '身在福中', '什麼都不是', '草莓族'],
    translation: "我要斬斷你的退路。把你應得的薪水說成是『學費』，讓你覺得被剝削還是一種恩賜。",
    puaLevel: 99,
    advice: "經驗有價，但不該用薪水來換。去市場面試，驗證自己的真實身價。",
    verdict: "PUA 指數：99% (相信自己)"
  },
  // 12. 奴性測試
  {
    category: "奴性測試",
    keywords: ['忠誠度', '隨傳隨到', '放在心上', '當自己家', '責任感', '多做一點', '下班後', '回訊息', '手機是裝飾品'],
    translation: "我要的不是夥伴，而是僕人。『忠誠度』翻譯過來就是『長時間無償加班且不抱怨』。",
    puaLevel: 85,
    advice: "忠誠是雙向的。如果公司對你的薪資不忠誠，你也不需要對加班忠誠。",
    verdict: "PUA 指數：85% (看錢辦事)"
  },
  // 13. 假開明/雙重標準
  {
    category: "雙重標準",
    keywords: ['對事不對人', '不是在罵你', '有話直說', '開放', '不要往心裡去', '玻璃心', '開玩笑', '太敏感'],
    translation: "我先打個預防針，這樣我等下羞辱你時，你如果不高興，就是你『太玻璃心』，不是我沒禮貌。",
    puaLevel: 78,
    advice: "過濾情緒字眼，只聽事實。若涉及人身攻擊，請錄音自保。",
    verdict: "PUA 指數：78% (過濾情緒)"
  },
  // 14. 隱形工時
  {
    category: "隱形工時",
    keywords: ['責任制', '做完再走', '很快', '幾分鐘', '幫個忙', '順便', '下班前', '小忙', '紅包', '兩千'],
    translation: "事情做不完是你能力差，做完了是我領導有方。這幾分鐘的小事，其實是幾小時的免費工時。",
    puaLevel: 82,
    advice: "具體詢問內容與期限，善用『手上有急件』來擋。",
    verdict: "PUA 指數：82% (涉及權益)"
  },
  // 15. 社會性抹殺
  {
    category: "社會抹殺",
    keywords: ['其他人怎麼看', '大家覺得', '風評', '以後怎麼混', '業界很小', '名聲', '毀掉', '誰還會相信你'],
    translation: "我利用你對『名聲』的恐懼來控制你。其實業界很大，大家也都知道這間公司的名聲如何。",
    puaLevel: 92,
    advice: "他在利用從眾心理恐嚇你。專業表現才是硬通貨。",
    verdict: "PUA 指數：92% (專注實力)"
  },
  // 16. 假民主
  {
    category: "假民主",
    keywords: ['大家討論', '我很開明', '聽聽意見', '你們決定', '共識'],
    translation: "我假裝讓大家參與決策，其實我心裡早有定見。如果你們的決定跟我不同，我們就『討論』到跟我一樣為止。",
    puaLevel: 65,
    advice: "在會議中觀察風向，不要太早當出頭鳥，因為結局通常已經寫好了。",
    verdict: "PUA 指數：65% (演戲配合)"
  },
  // 17. 資訊封鎖
  {
    category: "資訊封鎖",
    keywords: ['不需要知道', '機密', '上面的事', '這不是你該管的', '聽命行事', '照做'],
    translation: "把你像蘑菇一樣養在黑暗裡，只餵你吃肥料（雜事）。我不讓你了解全貌，這樣你就永遠無法取代我，也無法成長。",
    puaLevel: 75,
    advice: "主動尋求跨部門資訊，或在執行時多問『為什麼』來拼湊全貌。",
    verdict: "PUA 指數：75% (主動探索)"
  },
  // 18. 微觀管理
  {
    category: "微觀管理",
    keywords: ['字體', '格式', '標點符號', '這裡歪了', '盯著', '細節', '重做'],
    translation: "我對大方向沒想法，只好在枝微末節上找你麻煩，來刷我的存在感與控制欲。",
    puaLevel: 60,
    advice: "建立檢查清單（Checklist）讓他勾選，減少他臨時起意的挑剔。",
    verdict: "PUA 指數：60% (耐心應對)"
  },
  // 19. 卸責轉嫁
  {
    category: "卸責轉嫁",
    keywords: ['我以為你知道', '你要自己問', '主動', '沒提醒我', '你的疏失'],
    translation: "只要出包，絕對不是我指令不清，而是你不夠『主動』。我擁有最終解釋權，用來把鍋甩到你頭上。",
    puaLevel: 85,
    advice: "所有指令務必留下文字紀錄（Email/Line），保護自己免於背鍋。",
    verdict: "PUA 指數：85% (證據為王)"
  },
  // 20. 假性放權
  {
    category: "假性放權",
    keywords: ['全權負責', '交給你', '你看著辦', '我相信你'],
    translation: "這件事我不沾手，成功了是我識人有方，失敗了是你全權負責。這不是授權，這是找替死鬼。",
    puaLevel: 80,
    advice: "釐清權責範圍與資源，確認『全權』是否包含『決策權』與『預算權』。",
    verdict: "PUA 指數：80% (謹慎接球)"
  },
  // 21. 曖昧養套殺
  {
    category: "曖昧養套殺",
    keywords: ['最懂我', '只信任你', '單獨聊聊', '自己人', '特別的', '默契', '老婆', '老公', '沒話說', '放鬆', '公事'],
    translation: "我營造『你是特別的』錯覺，讓你為了這份虛假的親密感而甘願免費加班。這是職場版的『養、套、殺』，目的是壓榨勞力。",
    puaLevel: 98,
    advice: "保持專業距離。當他說『只信任你』時，翻譯過來就是『只有你最好騙/最好凹』。",
    verdict: "PUA 指數：98% (拒絕暈船)"
  },
  // 22. 公器私用
  {
    category: "公器私用",
    keywords: ['私人', '帳單', '家務', '洗車', '接小孩', '買東西', '沒男友', '早點回去'],
    translation: "我把員工當成家僕。我認為付了薪水就買斷了你的人生，包括你的下班時間和尊嚴。",
    puaLevel: 95,
    advice: "這不屬於工作範圍。委婉但堅定地拒絕：『不好意思，我下班後已有安排。』",
    verdict: "PUA 指數：95% (劃清界線)"
  },
  // 23. 職場性騷擾 (Workplace Harassment)
  {
    category: "職場性騷擾",
    keywords: ['勾引誰', '身材', '有料', '包太緊', '陪睡', '雙人房', '大驚小怪', '追你', '滋潤', '談戀愛', '約會', '炒飯', '想揉', '自拍', '穿露一點'],
    translation: "這不是開玩笑，這是性騷擾。我試圖用權力不對等來合理化對你身體或隱私的侵犯，並測試你的底線。",
    puaLevel: 100,
    advice: "這是違法行為！請立刻蒐證（錄音、截圖），不要隱忍，尋求法律或人資協助。",
    verdict: "PUA 指數：100% (立刻蒐證)"
  },
  // 24. 性別刻板/歧視
  {
    category: "性別歧視",
    keywords: ['女生', '化妝', '花瓶', '倒酒', '夾菜', '賢慧', '粗活', '男生', '基本功', '人緣'],
    translation: "我活在舊時代，認為女性在職場上就該負責『賞心悅目』或『服侍他人』，完全無視你的專業能力。",
    puaLevel: 90,
    advice: "你的價值在於專業，不在於外貌或性別功能。不需要為了滿足他的刻板印象而改變。",
    verdict: "PUA 指數：90% (專注專業)"
  },
  // 25. 孤立洗腦
  {
    category: "孤立洗腦",
    keywords: ['外面沒人要', '誰敢用你', '去哪裡', '做不久', '只有我', '心性', '磨練', '平台', '什麼都不是'],
    translation: "我透過貶低你，讓你覺得自己一無是處，離開這裡就活不下去。這是典型的虐待關係手法，讓你不敢逃跑。",
    puaLevel: 99,
    advice: "這是最惡毒的 PUA。外面的世界很大，你的能力絕對有人欣賞。快逃！",
    verdict: "PUA 指數：99% (建立自信)"
  },
  
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

// 擴充經典語錄列表 (包含新類別)
const CLASSIC_QUOTES = [
  "其實在這麼多員工裡，我覺得妳是最懂我的",
  "這週末有空嗎？想找個安靜的地方聊公事",
  "看不出來妳身材這麼有料，平常包太緊了",
  "醫生說我需要定期排毒，妳願意幫老闆嗎？",
  "如果我年輕個十歲，我一定會追妳",
  "除了我，妳覺得外面還有誰敢用妳？",
  "妳穿這麼緊，害我下面現在腫得好痛",
  "我就進去一下，不會射的",
  "這裡只有我們兩個人，不想看老闆真實的一面嗎？",
  "不要跟我談勞基法，我們談的是夢想",
  "反正只是蹭一下，又不進去，妳怕什麼？",
  "既然還沒下班，順便幫我接一下小孩",
  "只要妳願意幫我把這裡弄出來，你要什麼都給妳",
  "我看妳也沒男友，早點回去幹嘛？",
  "女生還是要化妝才有人緣",
  "這點小事都做不到，怎麼敢把大任交給妳",
  "妳手這麼小，大概握不住我的吧？",
  "我是把妳當女兒看，才會這樣跟妳說話",
  "妳要敢說出去，看業界誰還會相信妳",
  "未來的特助位置我一直幫妳留著",
  "今天穿這麼漂亮，晚上要不要跟我約會啊",
  "當初給你機會錄用你，你要心存感激",
  "我對你這麼好，你怎麼可以離開",
  "大家共體時艱，今年沒有年終",
  "公司未來要上市，大家都是股東",
  "年輕人眼光要放遠，不要計較錢",
  "能者多勞，多做一點是給你機會",
  "我不是在罵你，我是對事不對人",
  "自拍一張給我留念啊",
  "把公司當成自己的家",
  "這只是西方禮儀的擁抱，妳想太多了",
  "妳現在幫我省下的錢，以後還不是大家分",
  "只有妳能跟上我的腳步，其他人太笨了",
  "摸一下肩膀是大驚小怪，我是長輩鼓勵晚輩",
  "這次出差為了省預算，訂一間雙人房就好",
  "這種粗活讓男生做，妳負責美就好"
];

// 預設的回覆
const FALLBACK_RESPONSES = [
  {
    category: "話術試探",
    translation: "這句話聽起來冠冕堂皇，但翻譯機偵測到高濃度的『話術』成分。老闆可能正在試探你的底線，或是想用最少的成本換取你最大的產出。",
    puaLevel: 45,
    advice: "保持禮貌但堅定的界線。微笑點頭，然後繼續照規矩辦事。",
    verdict: "PUA 指數：45% (保持警覺)"
  },
  {
    category: "模糊焦點",
    translation: "典型的職場填補用語，用來說服你接受某個不太合理的狀況（變動、加班、批評），但又不想給你實質補償。",
    puaLevel: 65,
    advice: "不要被表面的好聽話迷惑，看他實際做了什麼（給錢、給人、給資源）。",
    verdict: "PUA 指數：65% (聽聽就好)"
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // 根據等級決定卡片光暈顏色 (更柔和的高級感)
  const getGlowColor = (level) => {
    // 100分危險等級：改為深紅黑色實底 (bg-[#2a0a0a])，移除過多透明度，確保文字清晰
    if (level === 100) return "shadow-[0_0_60px_rgba(220,38,38,0.4)] border-red-600 bg-[#2a0a0a] animate-pulse-slow"; 
    if (level < 60) return "shadow-[0_0_50px_rgba(16,185,129,0.2)] border-emerald-500/40 bg-gradient-to-br from-[#0a1f18] to-[#050810]";
    if (level < 85) return "shadow-[0_0_50px_rgba(245,158,11,0.2)] border-amber-500/40 bg-gradient-to-br from-[#1f160a] to-[#050810]";
    return "shadow-[0_0_60px_rgba(225,29,72,0.25)] border-rose-500/40 bg-gradient-to-br from-[#1f0a0f] to-[#050810]";
  };
  
  const getTextColor = (level) => {
    if (level === 100) return "text-red-500";
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
          <span className="text-[11px] tracking-[0.3em] text-indigo-200 uppercase font-light">Soul Reader 16.5</span>
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
                     <span className="text-xl md:text-2xl text-indigo-300/80 tracking-[0.2em] uppercase font-serif flex items-center gap-2 font-bold"> 
                        <Sparkles className="w-6 h-6" /> 老闆說的 murmur..
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
                      // 加大按鈕尺寸與文字大小
                      className={`group relative w-full md:w-auto px-16 py-6 rounded-full font-serif tracking-[0.2em] text-lg md:text-xl font-bold transition-all duration-700 overflow-hidden
                        ${!inputText.trim() || isAnalyzing 
                          ? 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed' 
                          : 'text-indigo-100 border border-indigo-400/30 hover:border-indigo-300/60 shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] bg-[#1a1f35]'}`}
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                      <span className="relative flex items-center justify-center gap-3">
                         {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" /> : <Eye className="w-5 h-5 text-indigo-300" />}
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
                   <span className={`text-lg font-serif tracking-[0.2em] uppercase drop-shadow-md font-bold ${result.puaLevel === 100 ? 'text-red-500 animate-pulse' : 'text-slate-300'}`}>
                     {result.category}
                   </span>
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
                   {/* 100分危險等級：增加背景不透明度 (bg-red-950)，確保文字可讀 */}
                   <div className={`relative backdrop-blur-md p-6 rounded-lg border shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group ${result.puaLevel === 100 ? 'bg-red-950 border-red-500/50' : 'bg-[#1a1f30]/40 border-white/5'}`}>
                        {/* Decorative corners */}
                        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>
                        <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>
                        <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>
                        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>

                        <Quote className={`w-4 h-4 absolute top-3 left-3 transform -scale-x-100 ${result.puaLevel === 100 ? 'text-red-200' : 'text-indigo-400/50'}`} />
                        <p className={`text-lg md:text-xl leading-8 font-serif drop-shadow-md tracking-wide italic ${result.puaLevel === 100 ? 'text-white font-medium' : 'text-slate-200'}`}>
                            {result.translation}
                        </p>
                        <Quote className={`w-4 h-4 absolute bottom-3 right-3 ${result.puaLevel === 100 ? 'text-red-200' : 'text-indigo-400/50'}`} />
                   </div>
                </div>

                {/* Advice Section */}
                <div className="space-y-6 mb-8">
                   {/* 100分危險等級：增加背景不透明度 (bg-red-900/90)，確保文字可讀 */}
                   <div className={`p-5 rounded-xl border shadow-inner backdrop-blur-sm relative overflow-hidden group ${result.puaLevel === 100 ? 'bg-red-900/90 border-red-500/50' : 'bg-[#151a2a]/60 border-white/5'}`}>
                      <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${result.puaLevel === 100 ? 'bg-red-500' : 'bg-indigo-500/30 group-hover:bg-indigo-500/50'}`}></div>
                      <h4 className={`font-serif mb-2 text-lg tracking-[0.2em] uppercase flex items-center gap-2 font-bold ${result.puaLevel === 100 ? 'text-red-300' : 'text-indigo-300/90'}`}> 
                        {result.puaLevel === 100 ? <Siren className="w-5 h-5 animate-pulse" /> : <ShieldAlert className="w-5 h-5" />}
                        教戰手則
                      </h4>
                      {/* 調整內文大小: text-sm md:text-base (原為 text-xs md:text-sm) */}
                      <p className={`text-sm md:text-base leading-relaxed font-light tracking-wide ${result.puaLevel === 100 ? 'text-white' : 'text-slate-400'}`}>
                        {result.advice}
                      </p>
                   </div>
                   
                   {/* Verdict */}
                   <div className="text-center mt-6">
                      <span className={`text-sm md:text-base font-bold tracking-widest border-b pb-2 shadow-sm drop-shadow-md ${result.puaLevel === 100 ? 'text-red-400 border-red-500/30' : 'text-indigo-200 border-indigo-500/30'}`} title="判決結果">
                         {result.verdict}
                      </span>
                   </div>
                </div>

                {/* Return Button (Moved to Bottom) - Enlarged */}
                <div className="mt-auto flex justify-center pt-6">
                   <button 
                     onClick={() => setShowCard(false)} 
                     className="group flex items-center gap-3 px-12 py-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
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

      {/* Scrollable Classic Voices Section - Grid Layout Update */}
      {!showCard && !isAnalyzing && (
        <div className="w-full max-w-4xl animate-fade-in delay-200 mb-12 relative z-20">
            <div className="flex items-center gap-4 px-8 opacity-30 mb-6 justify-center">
               <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-500"></div>
               <span className="text-xl md:text-2xl text-slate-300 uppercase tracking-[0.3em] font-serif whitespace-nowrap font-bold">經典老闆台詞</span>
               <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-500"></div>
            </div>
            
            <div className="relative group flex items-center justify-center">
                {/* Left Navigation Arrow (Desktop Only) */}
                <button 
                  onClick={scrollLeft}
                  className="hidden md:flex absolute left-0 z-30 p-3 rounded-full bg-[#0a0e17]/80 border border-slate-700 text-indigo-300 hover:text-white hover:bg-indigo-600/50 hover:border-indigo-400 transition-all duration-300 -translate-x-12"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Horizontal Scroll Grid Container */}
                <div 
                    ref={scrollContainerRef}
                    className="grid grid-rows-2 grid-flow-col gap-4 px-8 pb-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide mask-linear"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {CLASSIC_QUOTES.map((text, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setInputText(text)}
                            // 調整文字大小：手機版 text-sm，電腦版 text-lg
                            // 調整寬度：手機版 w-[260px]，電腦版 w-[350px]
                            className="w-[260px] md:w-[350px] snap-center p-6 bg-[#0a0e17]/60 hover:bg-[#131929] border border-slate-800/60 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-200 text-sm md:text-lg text-left rounded-xl transition-all duration-300 font-medium tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.08)] backdrop-blur-sm flex items-center justify-between group/card"
                        >
                            <span className="leading-relaxed opacity-80 group-hover/card:opacity-100 transition-opacity truncate pr-2">
                                "{text}"
                            </span>
                            <ArrowRight className="w-5 h-5 flex-shrink-0 text-indigo-400 opacity-0 group-hover/card:opacity-100 transition-opacity transform -translate-x-2 group-hover/card:translate-x-0 duration-300"/>
                        </button>
                    ))}
                </div>

                {/* Right Navigation Arrow (Desktop Only) */}
                <button 
                  onClick={scrollRight}
                  className="hidden md:flex absolute right-0 z-30 p-3 rounded-full bg-[#0a0e17]/80 border border-slate-700 text-indigo-300 hover:text-white hover:bg-indigo-600/50 hover:border-indigo-400 transition-all duration-300 translate-x-12"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Scroll Hints (Optional Visual Cues) */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050810] to-transparent pointer-events-none md:hidden"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050810] to-transparent pointer-events-none md:hidden"></div>
            </div>
            
            <p className="text-center text-xs text-slate-500 mt-3 tracking-widest opacity-60 md:hidden">← 左右滑動查看更多 →</p>
        </div>
      )}

      <footer className="mt-auto pt-8 pb-8 text-slate-500 text-[10px] md:text-xs text-center font-light tracking-[0.1em] uppercase opacity-90 relative z-10 hover:opacity-100 transition-opacity duration-500 flex flex-col gap-3">
          <p className="tracking-[0.4em]">Insight & Truth • Ver 16.5</p>
          <p className="text-[10px] md:text-xs font-medium opacity-80">
              製作者：
              <a 
                  href="https://chia-tinyhand.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-300 transition-all ml-1"
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
}import React, { useState, useEffect, useRef } from 'react';
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
  // 2. 情感帳戶/施恩圖報
  {
    category: "施恩圖報",
    keywords: ['當初', '機會', '錄用', '感激', '心存感激', '知恩圖報', '給機會', '報答'],
    translation: "我把你被錄用這件正常的商業行為，包裝成天大的恩情。我希望你帶著贖罪的心情工作，不敢要求合理的待遇。",
    puaLevel: 85,
    advice: "錄用你是因為你有價值，不是因為他在做慈善。",
    verdict: "PUA 指數：85% (保持專業互惠)"
  },
  // 3. 團體勒索
  {
    category: "團體勒索",
    keywords: ['團隊', '付出', '不想嗎', '多付出', '計較', '自私', '大家', '合群', '互相幫忙', '太計較', '為團隊', '看那個誰誰誰'],
    translation: "我用『團隊』這頂大帽子扣在你頭上。只要你不願意無償犧牲，就會被貼上『自私』的標籤。這是群體暴力的變形。",
    puaLevel: 88,
    advice: "真正的團隊精神是互相尊重界線，而不是集體壓榨。",
    verdict: "PUA 指數：88% (堅定立場)"
  },
  // 4. 恐懼管理/替代威脅
  {
    category: "替代威脅",
    keywords: ['不喜歡', '外面', '排隊', '位子', '不好找', '沒人要', '取代', '以後沒機會', '等著做', '不做', '很多人', '除了我'],
    translation: "你是可以隨時被拋棄的消耗品。我透過貶低你的獨特性，製造『隨時會失業』的恐懼，讓你不敢反抗。",
    puaLevel: 95,
    advice: "他在虛張聲勢。如果真的那麼多人排隊，他早就換人了。",
    verdict: "PUA 指數：95% (戳破謊言)"
  },
  // 5. 傲慢失職
  {
    category: "傲慢失職",
    keywords: ['我很忙', '小事', '煩我', '我要你幹嘛', '不需要知道為什麼', '拿這種', '那我要你', '結果', '過程'],
    translation: "我不想做管理，只想當皇帝。遇到困難別來煩我，但功勞記得算我的。我用『忙碌』來掩飾我的管理無能。",
    puaLevel: 75,
    advice: "這類老闆缺乏解決問題的能力。遇到小事請自行決定並記錄過程。",
    verdict: "PUA 指數：75% (自保為上)"
  },
  // 6. 感情勒索/背叛指控
  {
    category: "背叛指控",
    keywords: ['對你這麼好', '離開', '背叛', '走', '良心', '跳槽', '對不起我', '心寒', '怎麼可以', '不敢把大任交給你'],
    translation: "我無法接受你是一個獨立個體。你的離職對我來說不是商業選擇，而是『背叛』。我想用罪惡感把你綁在身邊。",
    puaLevel: 90,
    advice: "離職是商業行為，不是感情劈腿。好聚好散是理想，不行則冷處理。",
    verdict: "PUA 指數：90% (保持專業)"
  },
  // 7. 假性貧窮/共體時艱
  {
    category: "賣慘剝削",
    keywords: ['共體時艱', '困難', '一起撐過', '景氣不好', '沒錢', '預算', '省一點', '相挺', '幫公司', '創業期', '轉型期'],
    translation: "公司沒錢（或我想買新車），所以你的福利先砍。但我很辛苦，所以你不能抱怨，還要跟我一起受苦。",
    puaLevel: 80,
    advice: "老闆的創業風險不該由員工無償承擔。常態性賣慘建議快逃。",
    verdict: "PUA 指數：80% (聽聽就好)"
  },
  // 8. 夢想詐騙
  {
    category: "畫大餅",
    keywords: ['未來', '願景', '上市', '股票', '事業', '熱情', '談錢', '眼光放長遠', '格局', '夢想', '一起拼', '特助', '主管位置'],
    translation: "現在沒錢給你，但我可以用『夢想』來勒索你。談錢太俗氣了，雖然我開公司就是為了賺錢。",
    puaLevel: 92,
    advice: "工作就是為了錢，有錢才有熱情。承諾若沒寫在合約上，一律當作廢紙。",
    verdict: "PUA 指數：92% (錢給到位再說)"
  },
  // 9. 混亂管理
  {
    category: "朝令夕改",
    keywords: ['不怕修改', '需求會變', '不需要寫文件', '邏輯', '彈性', '隨機應變', '不用太僵化', '改一下'],
    translation: "我不知道自己要什麼，所以我沒辦法給明確規格。我不寫文件是因為懶，這樣出包了才能賴在你頭上。",
    puaLevel: 70,
    advice: "保留所有修改紀錄與對話截圖。不要讓他的『善變』成為你的『疏失』。",
    verdict: "PUA 指數：70% (保護自己)"
  },
  // 10. 比較羞辱
  {
    category: "比較羞辱",
    keywords: ['別的團隊', '別人', '跟不上', '努力程度', '溝通能力', '沒有價值', '為什麼別人', '多學學', '差太多', '其他人太笨', '只有你'],
    translation: "我通過比較來製造焦慮。攻擊你的性格和能力，讓你覺得一切都是你的錯，進而接受不合理的待遇。",
    puaLevel: 95,
    advice: "這是職場霸凌的開端。客觀評估績效，不要接受模糊的人身攻擊。",
    verdict: "PUA 指數：95% (拒絕接收負能量)"
  },
  // 11. 貶低價值
  {
    category: "貶低價值",
    keywords: ['學習', '年輕人', '外面找不到', '不是來領薪水', '學經驗', '繳學費', '眼高手低', '身在福中', '什麼都不是', '草莓族'],
    translation: "我要斬斷你的退路。把你應得的薪水說成是『學費』，讓你覺得被剝削還是一種恩賜。",
    puaLevel: 99,
    advice: "經驗有價，但不該用薪水來換。去市場面試，驗證自己的真實身價。",
    verdict: "PUA 指數：99% (相信自己)"
  },
  // 12. 奴性測試
  {
    category: "奴性測試",
    keywords: ['忠誠度', '隨傳隨到', '放在心上', '當自己家', '責任感', '多做一點', '下班後', '回訊息', '手機是裝飾品'],
    translation: "我要的不是夥伴，而是僕人。『忠誠度』翻譯過來就是『長時間無償加班且不抱怨』。",
    puaLevel: 85,
    advice: "忠誠是雙向的。如果公司對你的薪資不忠誠，你也不需要對加班忠誠。",
    verdict: "PUA 指數：85% (看錢辦事)"
  },
  // 13. 假開明/雙重標準
  {
    category: "雙重標準",
    keywords: ['對事不對人', '不是在罵你', '有話直說', '開放', '不要往心裡去', '玻璃心', '開玩笑', '太敏感'],
    translation: "我先打個預防針，這樣我等下羞辱你時，你如果不高興，就是你『太玻璃心』，不是我沒禮貌。",
    puaLevel: 78,
    advice: "過濾情緒字眼，只聽事實。若涉及人身攻擊，請錄音自保。",
    verdict: "PUA 指數：78% (過濾情緒)"
  },
  // 14. 隱形工時
  {
    category: "隱形工時",
    keywords: ['責任制', '做完再走', '很快', '幾分鐘', '幫個忙', '順便', '下班前', '小忙', '紅包', '兩千'],
    translation: "事情做不完是你能力差，做完了是我領導有方。這幾分鐘的小事，其實是幾小時的免費工時。",
    puaLevel: 82,
    advice: "具體詢問內容與期限，善用『手上有急件』來擋。",
    verdict: "PUA 指數：82% (涉及權益)"
  },
  // 15. 社會性抹殺
  {
    category: "社會抹殺",
    keywords: ['其他人怎麼看', '大家覺得', '風評', '以後怎麼混', '業界很小', '名聲', '毀掉', '誰還會相信你'],
    translation: "我利用你對『名聲』的恐懼來控制你。其實業界很大，大家也都知道這間公司的名聲如何。",
    puaLevel: 92,
    advice: "他在利用從眾心理恐嚇你。專業表現才是硬通貨。",
    verdict: "PUA 指數：92% (專注實力)"
  },
  // 16. 假民主
  {
    category: "假民主",
    keywords: ['大家討論', '我很開明', '聽聽意見', '你們決定', '共識'],
    translation: "我假裝讓大家參與決策，其實我心裡早有定見。如果你們的決定跟我不同，我們就『討論』到跟我一樣為止。",
    puaLevel: 65,
    advice: "在會議中觀察風向，不要太早當出頭鳥，因為結局通常已經寫好了。",
    verdict: "PUA 指數：65% (演戲配合)"
  },
  // 17. 資訊封鎖
  {
    category: "資訊封鎖",
    keywords: ['不需要知道', '機密', '上面的事', '這不是你該管的', '聽命行事', '照做'],
    translation: "把你像蘑菇一樣養在黑暗裡，只餵你吃肥料（雜事）。我不讓你了解全貌，這樣你就永遠無法取代我，也無法成長。",
    puaLevel: 75,
    advice: "主動尋求跨部門資訊，或在執行時多問『為什麼』來拼湊全貌。",
    verdict: "PUA 指數：75% (主動探索)"
  },
  // 18. 微觀管理
  {
    category: "微觀管理",
    keywords: ['字體', '格式', '標點符號', '這裡歪了', '盯著', '細節', '重做'],
    translation: "我對大方向沒想法，只好在枝微末節上找你麻煩，來刷我的存在感與控制欲。",
    puaLevel: 60,
    advice: "建立檢查清單（Checklist）讓他勾選，減少他臨時起意的挑剔。",
    verdict: "PUA 指數：60% (耐心應對)"
  },
  // 19. 卸責轉嫁
  {
    category: "卸責轉嫁",
    keywords: ['我以為你知道', '你要自己問', '主動', '沒提醒我', '你的疏失'],
    translation: "只要出包，絕對不是我指令不清，而是你不夠『主動』。我擁有最終解釋權，用來把鍋甩到你頭上。",
    puaLevel: 85,
    advice: "所有指令務必留下文字紀錄（Email/Line），保護自己免於背鍋。",
    verdict: "PUA 指數：85% (證據為王)"
  },
  // 20. 假性放權
  {
    category: "假性放權",
    keywords: ['全權負責', '交給你', '你看著辦', '我相信你'],
    translation: "這件事我不沾手，成功了是我識人有方，失敗了是你全權負責。這不是授權，這是找替死鬼。",
    puaLevel: 80,
    advice: "釐清權責範圍與資源，確認『全權』是否包含『決策權』與『預算權』。",
    verdict: "PUA 指數：80% (謹慎接球)"
  },
  // 21. 曖昧養套殺
  {
    category: "曖昧養套殺",
    keywords: ['最懂我', '只信任你', '單獨聊聊', '自己人', '特別的', '默契', '老婆', '老公', '沒話說', '放鬆', '公事'],
    translation: "我營造『你是特別的』錯覺，讓你為了這份虛假的親密感而甘願免費加班。這是職場版的『養、套、殺』，目的是壓榨勞力。",
    puaLevel: 98,
    advice: "保持專業距離。當他說『只信任你』時，翻譯過來就是『只有你最好騙/最好凹』。",
    verdict: "PUA 指數：98% (拒絕暈船)"
  },
  // 22. 公器私用
  {
    category: "公器私用",
    keywords: ['私人', '帳單', '家務', '洗車', '接小孩', '買東西', '沒男友', '早點回去'],
    translation: "我把員工當成家僕。我認為付了薪水就買斷了你的人生，包括你的下班時間和尊嚴。",
    puaLevel: 95,
    advice: "這不屬於工作範圍。委婉但堅定地拒絕：『不好意思，我下班後已有安排。』",
    verdict: "PUA 指數：95% (劃清界線)"
  },
  // 23. 職場性騷擾 (Workplace Harassment)
  {
    category: "職場性騷擾",
    keywords: ['勾引誰', '身材', '有料', '包太緊', '陪睡', '雙人房', '大驚小怪', '追你', '滋潤', '談戀愛', '約會', '炒飯', '想揉', '自拍', '穿露一點'],
    translation: "這不是開玩笑，這是性騷擾。我試圖用權力不對等來合理化對你身體或隱私的侵犯，並測試你的底線。",
    puaLevel: 100,
    advice: "這是違法行為！請立刻蒐證（錄音、截圖），不要隱忍，尋求法律或人資協助。",
    verdict: "PUA 指數：100% (立刻蒐證)"
  },
  // 24. 性別刻板/歧視
  {
    category: "性別歧視",
    keywords: ['女生', '化妝', '花瓶', '倒酒', '夾菜', '賢慧', '粗活', '男生', '基本功', '人緣'],
    translation: "我活在舊時代，認為女性在職場上就該負責『賞心悅目』或『服侍他人』，完全無視你的專業能力。",
    puaLevel: 90,
    advice: "你的價值在於專業，不在於外貌或性別功能。不需要為了滿足他的刻板印象而改變。",
    verdict: "PUA 指數：90% (專注專業)"
  },
  // 25. 孤立洗腦
  {
    category: "孤立洗腦",
    keywords: ['外面沒人要', '誰敢用你', '去哪裡', '做不久', '只有我', '心性', '磨練', '平台', '什麼都不是'],
    translation: "我透過貶低你，讓你覺得自己一無是處，離開這裡就活不下去。這是典型的虐待關係手法，讓你不敢逃跑。",
    puaLevel: 99,
    advice: "這是最惡毒的 PUA。外面的世界很大，你的能力絕對有人欣賞。快逃！",
    verdict: "PUA 指數：99% (建立自信)"
  },
  
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

// 擴充經典語錄列表 (包含新類別)
const CLASSIC_QUOTES = [
  "其實在這麼多員工裡，我覺得妳是最懂我的",
  "這週末有空嗎？想找個安靜的地方聊公事",
  "看不出來妳身材這麼有料，平常包太緊了",
  "醫生說我需要定期排毒，妳願意幫老闆嗎？",
  "如果我年輕個十歲，我一定會追妳",
  "除了我，妳覺得外面還有誰敢用妳？",
  "妳穿這麼緊，害我下面現在腫得好痛",
  "我就進去一下，不會射的",
  "這裡只有我們兩個人，不想看老闆真實的一面嗎？",
  "不要跟我談勞基法，我們談的是夢想",
  "反正只是蹭一下，又不進去，妳怕什麼？",
  "既然還沒下班，順便幫我接一下小孩",
  "只要妳願意幫我把這裡弄出來，你要什麼都給妳",
  "我看妳也沒男友，早點回去幹嘛？",
  "女生還是要化妝才有人緣",
  "這點小事都做不到，怎麼敢把大任交給妳",
  "妳手這麼小，大概握不住我的吧？",
  "我是把妳當女兒看，才會這樣跟妳說話",
  "妳要敢說出去，看業界誰還會相信妳",
  "未來的特助位置我一直幫妳留著",
  "今天穿這麼漂亮，晚上要不要跟我約會啊",
  "當初給你機會錄用你，你要心存感激",
  "我對你這麼好，你怎麼可以離開",
  "大家共體時艱，今年沒有年終",
  "公司未來要上市，大家都是股東",
  "年輕人眼光要放遠，不要計較錢",
  "能者多勞，多做一點是給你機會",
  "我不是在罵你，我是對事不對人",
  "自拍一張給我留念啊",
  "把公司當成自己的家",
  "這只是西方禮儀的擁抱，妳想太多了",
  "妳現在幫我省下的錢，以後還不是大家分",
  "只有妳能跟上我的腳步，其他人太笨了",
  "摸一下肩膀是大驚小怪，我是長輩鼓勵晚輩",
  "這次出差為了省預算，訂一間雙人房就好",
  "這種粗活讓男生做，妳負責美就好"
];

// 預設的回覆
const FALLBACK_RESPONSES = [
  {
    category: "話術試探",
    translation: "這句話聽起來冠冕堂皇，但翻譯機偵測到高濃度的『話術』成分。老闆可能正在試探你的底線，或是想用最少的成本換取你最大的產出。",
    puaLevel: 45,
    advice: "保持禮貌但堅定的界線。微笑點頭，然後繼續照規矩辦事。",
    verdict: "PUA 指數：45% (保持警覺)"
  },
  {
    category: "模糊焦點",
    translation: "典型的職場填補用語，用來說服你接受某個不太合理的狀況（變動、加班、批評），但又不想給你實質補償。",
    puaLevel: 65,
    advice: "不要被表面的好聽話迷惑，看他實際做了什麼（給錢、給人、給資源）。",
    verdict: "PUA 指數：65% (聽聽就好)"
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // 根據等級決定卡片光暈顏色 (更柔和的高級感)
  const getGlowColor = (level) => {
    // 100分危險等級：改為深紅黑色實底 (bg-[#2a0a0a])，移除過多透明度，確保文字清晰
    if (level === 100) return "shadow-[0_0_60px_rgba(220,38,38,0.4)] border-red-600 bg-[#2a0a0a] animate-pulse-slow"; 
    if (level < 60) return "shadow-[0_0_50px_rgba(16,185,129,0.2)] border-emerald-500/40 bg-gradient-to-br from-[#0a1f18] to-[#050810]";
    if (level < 85) return "shadow-[0_0_50px_rgba(245,158,11,0.2)] border-amber-500/40 bg-gradient-to-br from-[#1f160a] to-[#050810]";
    return "shadow-[0_0_60px_rgba(225,29,72,0.25)] border-rose-500/40 bg-gradient-to-br from-[#1f0a0f] to-[#050810]";
  };
  
  const getTextColor = (level) => {
    if (level === 100) return "text-red-500";
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
          <span className="text-[11px] tracking-[0.3em] text-indigo-200 uppercase font-light">Soul Reader 16.5</span>
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
                     <span className="text-xl md:text-2xl text-indigo-300/80 tracking-[0.2em] uppercase font-serif flex items-center gap-2 font-bold"> 
                        <Sparkles className="w-6 h-6" /> 老闆說的 murmur..
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
                      // 加大按鈕尺寸與文字大小
                      className={`group relative w-full md:w-auto px-16 py-6 rounded-full font-serif tracking-[0.2em] text-lg md:text-xl font-bold transition-all duration-700 overflow-hidden
                        ${!inputText.trim() || isAnalyzing 
                          ? 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed' 
                          : 'text-indigo-100 border border-indigo-400/30 hover:border-indigo-300/60 shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] bg-[#1a1f35]'}`}
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                      <span className="relative flex items-center justify-center gap-3">
                         {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" /> : <Eye className="w-5 h-5 text-indigo-300" />}
                         {isAnalyzing ? "星象解讀中..." : "揭示真相 REVEAL"}
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
                   <span className={`text-lg font-serif tracking-[0.2em] uppercase drop-shadow-md font-bold ${result.puaLevel === 100 ? 'text-red-500 animate-pulse' : 'text-slate-300'}`}>
                     {result.category}
                   </span>
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
                   {/* 100分危險等級：增加背景不透明度 (bg-red-950/90)，確保文字可讀 */}
                   <div className={`relative backdrop-blur-md p-6 rounded-lg border shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group ${result.puaLevel === 100 ? 'bg-red-950/90 border-red-500/30' : 'bg-[#1a1f30]/40 border-white/5'}`}>
                        {/* Decorative corners */}
                        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>
                        <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>
                        <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>
                        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${result.puaLevel === 100 ? 'border-red-500/50' : 'border-indigo-400/30'}`}></div>

                        <Quote className={`w-4 h-4 absolute top-3 left-3 transform -scale-x-100 ${result.puaLevel === 100 ? 'text-red-200' : 'text-indigo-400/50'}`} />
                        <p className={`text-lg md:text-xl leading-8 font-serif drop-shadow-md tracking-wide italic ${result.puaLevel === 100 ? 'text-white font-medium' : 'text-slate-200'}`}>
                            {result.translation}
                        </p>
                        <Quote className={`w-4 h-4 absolute bottom-3 right-3 ${result.puaLevel === 100 ? 'text-red-200' : 'text-indigo-400/50'}`} />
                   </div>
                </div>

                {/* Advice Section */}
                <div className="space-y-6 mb-8">
                   <div className={`p-5 rounded-xl border shadow-inner backdrop-blur-sm relative overflow-hidden group ${result.puaLevel === 100 ? 'bg-red-900/40 border-red-500/40' : 'bg-[#151a2a]/60 border-white/5'}`}>
                      <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${result.puaLevel === 100 ? 'bg-red-500' : 'bg-indigo-500/30 group-hover:bg-indigo-500/50'}`}></div>
                      <h4 className={`font-serif mb-2 text-lg tracking-[0.2em] uppercase flex items-center gap-2 font-bold ${result.puaLevel === 100 ? 'text-red-300' : 'text-indigo-300/90'}`}> 
                        {result.puaLevel === 100 ? <Siren className="w-5 h-5 animate-pulse" /> : <ShieldAlert className="w-5 h-5" />}
                        教戰手則
                      </h4>
                      <p className={`text-lg md:text-xl leading-8 font-light tracking-wide ${result.puaLevel === 100 ? 'text-white' : 'text-slate-400'}`}>
                        {result.advice}
                      </p>
                   </div>
                   
                   {/* Verdict */}
                   <div className="text-center mt-6">
                      <span className={`text-sm md:text-base font-bold tracking-widest border-b pb-2 shadow-sm drop-shadow-md ${result.puaLevel === 100 ? 'text-red-400 border-red-500/30' : 'text-indigo-200 border-indigo-500/30'}`} title="判決結果">
                         {result.verdict}
                      </span>
                   </div>
                </div>

                {/* Return Button (Moved to Bottom) - Enlarged */}
                <div className="mt-auto flex justify-center pt-6">
                   <button 
                     onClick={() => setShowCard(false)} 
                     className="group flex items-center gap-3 px-12 py-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
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

      {/* Scrollable Classic Voices Section - Grid Layout Update */}
      {!showCard && !isAnalyzing && (
        <div className="w-full max-w-4xl animate-fade-in delay-200 mb-12 relative z-20">
            <div className="flex items-center gap-4 px-8 opacity-30 mb-6 justify-center">
               <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-500"></div>
               <span className="text-xl md:text-2xl text-slate-300 uppercase tracking-[0.3em] font-serif whitespace-nowrap font-bold">經典老闆台詞</span>
               <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-500"></div>
            </div>
            
            <div className="relative group flex items-center justify-center">
                {/* Left Navigation Arrow (Desktop Only) */}
                <button 
                  onClick={scrollLeft}
                  className="hidden md:flex absolute left-0 z-30 p-3 rounded-full bg-[#0a0e17]/80 border border-slate-700 text-indigo-300 hover:text-white hover:bg-indigo-600/50 hover:border-indigo-400 transition-all duration-300 -translate-x-12"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Horizontal Scroll Grid Container */}
                <div 
                    ref={scrollContainerRef}
                    className="grid grid-rows-2 grid-flow-col gap-4 px-8 pb-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide mask-linear"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {CLASSIC_QUOTES.map((text, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setInputText(text)}
                            // 調整文字大小：手機版 text-sm，電腦版 text-lg
                            // 調整寬度：手機版 w-[260px]，電腦版 w-[350px]
                            className="w-[260px] md:w-[350px] snap-center p-6 bg-[#0a0e17]/60 hover:bg-[#131929] border border-slate-800/60 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-200 text-sm md:text-lg text-left rounded-xl transition-all duration-300 font-medium tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.08)] backdrop-blur-sm flex items-center justify-between group/card"
                        >
                            <span className="leading-relaxed opacity-80 group-hover/card:opacity-100 transition-opacity truncate pr-2">
                                "{text}"
                            </span>
                            <ArrowRight className="w-5 h-5 flex-shrink-0 text-indigo-400 opacity-0 group-hover/card:opacity-100 transition-opacity transform -translate-x-2 group-hover/card:translate-x-0 duration-300"/>
                        </button>
                    ))}
                </div>

                {/* Right Navigation Arrow (Desktop Only) */}
                <button 
                  onClick={scrollRight}
                  className="hidden md:flex absolute right-0 z-30 p-3 rounded-full bg-[#0a0e17]/80 border border-slate-700 text-indigo-300 hover:text-white hover:bg-indigo-600/50 hover:border-indigo-400 transition-all duration-300 translate-x-12"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Scroll Hints (Optional Visual Cues) */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050810] to-transparent pointer-events-none md:hidden"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050810] to-transparent pointer-events-none md:hidden"></div>
            </div>
            
            <p className="text-center text-xs text-slate-500 mt-3 tracking-widest opacity-60 md:hidden">← 左右滑動查看更多 →</p>
        </div>
      )}

      <footer className="mt-auto pt-8 pb-8 text-slate-500 text-[10px] md:text-sm text-center font-light tracking-[0.1em] uppercase opacity-90 relative z-10 hover:opacity-100 transition-opacity duration-500 flex flex-col gap-3">
          <p className="tracking-[0.4em]">Insight & Truth • Ver 16.5</p>
          <p className="text-sm md:text-xl font-medium">
              製作者：
              <a 
                  href="https://chia-tinyhand.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-300 transition-all ml-1"
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
