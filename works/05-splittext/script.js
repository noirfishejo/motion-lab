gsap.registerPlugin(SplitText);

// ── 試著改這個數字 ──
const STAGGER = 0.05; // 每個片段之間的間隔（秒）：行、單字、字元都用它

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 主時間軸：三段依序播放（等字體載入後才開始）
const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, paused: true });

// 小工具：把一段動畫放進主時間軸的指定時間點，並回傳這段動畫
// （onSplit 要回傳「這一段」動畫，SplitText 重新拆分時才知道要替換哪一段）
const place = (tween, at) => { tl.add(tween, at); return tween; };

// autoSplit: true → 字體載入或視窗大小改變時自動重新拆分，換行位置才會正確

// ① 行：每一行從遮罩下方升上來
SplitText.create('.headline', {
  type: 'lines',
  mask: 'lines', // 每一行外面包一層會裁切的遮罩
  autoSplit: true,
  onSplit: self => place(gsap.from(self.lines, { yPercent: 105, duration: 1.2, stagger: STAGGER * 2 }), 0)
});

// ② 單字：往上浮現並淡入
SplitText.create('.sub', {
  type: 'words',
  autoSplit: true,
  onSplit: self => place(gsap.from(self.words, { y: 16, opacity: 0, duration: 0.9, stagger: STAGGER }), 0.6)
});

// ③ 字元：一個字母一個字母亮起來
SplitText.create('.letters', {
  type: 'chars',
  autoSplit: true,
  onSplit: self => place(gsap.from(self.chars, { opacity: 0.1, duration: 0.6, stagger: STAGGER * 0.6, ease: 'power1.out' }), 1.2)
});

// 尊重「減少動態」設定：直接顯示最終畫面
if (reduce) tl.progress(1);
else document.fonts.ready.then(() => tl.play());
