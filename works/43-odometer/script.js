// ── 試著改這幾個數字 ──
const DURATION = 1.2;  // 每一位數字捲動的秒數
const STAGGER = 0.06;  // 從個位數往左，每一位晚多少秒開始（越左邊越晚停，像機械計數器）

const odo = document.querySelector('.odo');
const odoText = document.getElementById('odoText');
const deltaEl = document.getElementById('delta');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const format = v => '$' + v.toLocaleString('en-US');

// 每一位數字的直條放三組 0–9（共 30 格），平常停在中間那組：
// 往上加時往下一組捲、往下減時往上一組捲，方向永遠和數字變化一致；捲完再無聲跳回中間那組
const CELLS = 30;
const at = index => ({ yPercent: -index * (100 / CELLS) });
let columns = []; // 每一位：{ strip, digit }（逗號、$ 是 null）

function build(text) {
  odo.innerHTML = '';
  columns = [...text].map(ch => {
    if (!/\d/.test(ch)) {
      const sym = document.createElement('span');
      sym.className = 'sym';
      sym.textContent = ch;
      odo.append(sym);
      return null;
    }
    const col = document.createElement('span');
    col.className = 'col';
    const strip = document.createElement('span');
    strip.className = 'strip';
    for (let i = 0; i < CELLS; i++) {
      const cell = document.createElement('span');
      cell.textContent = i % 10;
      strip.append(cell);
    }
    col.append(strip);
    odo.append(col);
    gsap.set(strip, at(10)); // 新的一位從 0 開始
    return { strip, digit: 0 };
  });
}

let value = null;
function setValue(next, { instant = false } = {}) {
  const text = format(next);
  const quick = reduce || instant; // 第一次顯示不用捲：直接停在正確的數字
  const goingUp = value === null || next >= value;
  // 位數變了（例如 99,999 → 100,000）就重建一次，新的位數從 0 捲上來
  if (!columns.length || columns.length !== text.length) build(text);

  const digits = columns.map((c, i) => c && { ...c, i, to: Number(text[i]) }).filter(Boolean);
  digits.forEach((c, k) => {
    if (c.to === c.digit) return;
    // 目前實際停在第幾格（連按時可能還在半路），換到中間那組的同一格：畫面一模一樣，但上下都有空間可以捲
    const cur = -gsap.getProperty(c.strip, 'yPercent') * CELLS / 100;
    const from = 10 + (((cur % 10) + 10) % 10);
    gsap.set(c.strip, at(from));
    let target = 10 + c.to;
    if (goingUp && target < from) target += 10;    // 例如 8 → 2：往上加，要捲過 9、0 到下一組的 2
    if (!goingUp && target > from) target -= 10;   // 往下減就往上一組捲
    gsap.to(c.strip, {
      ...at(target),
      duration: quick ? 0 : DURATION,
      delay: quick ? 0 : (digits.length - 1 - k) * STAGGER, // 個位數先動
      ease: 'expo.out',
      overwrite: true,
      onComplete: () => gsap.set(c.strip, at(10 + c.to)) // 跳回中間那組（看起來一模一樣，不會閃）
    });
    columns[c.i].digit = c.to;
  });

  // 和上一個數字比，顯示漲跌（假資料）
  if (value !== null) {
    const pct = ((next - value) / value) * 100;
    deltaEl.textContent = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
    deltaEl.parentElement.classList.toggle('up', pct >= 0);
    deltaEl.parentElement.classList.toggle('down', pct < 0);
    deltaEl.parentElement.querySelector('i').className = `ph-light ${pct >= 0 ? 'ph-trend-up' : 'ph-trend-down'}`;
  }
  odoText.textContent = text;
  value = next;
}

document.getElementById('random').addEventListener('click', () => setValue(gsap.utils.random(100000, 999999, 1)));
document.getElementById('plus').addEventListener('click', () => setValue(value + 1));
document.getElementById('minus').addEventListener('click', () => setValue(Math.max(0, value - 1)));

setValue(128450, { instant: true });

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
if (!reduce) {
  const demo = gsap.delayedCall(0.8, () => setValue(264917));
  // 自己動手了就不播示範，免得數字被它改掉
  ['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
}
// #endregion demo
