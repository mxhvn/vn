/**
 * Seedance — FULL app.js (Tap Hint UI + Auto-Next + Analytics + Fingerprint light)
 * ✅ GUARANTEE FP:
 * - Có stableStringify() встро sẵn (không phụ thuộc lib)
 * - Sau khi user consent (Like), buildFingerprintLight() và:
 *    (1) gửi ngay event "consent_ok" kèm fp_light + fp_light_hash
 *    (2) lưu fp_light_hash vào localStorage để dùng lại cho các quick events / session summary
 *    (3) (tuỳ chọn) cố gắng build lại fp_light nền sau consent đã có, nhưng không block UI
 *
 * Lưu ý:
 * - "FP light" KHÔNG bao gồm canvas/webgl/audio/fonts. Chỉ UA/UA-CH + screen/viewport + prefs + net + deviceMemory/cores.
 * - Nếu browser không hỗ trợ UA-CH high entropy hoặc Network Info => tự null (không lỗi).
 *
 * CORS note:
 * - summary sendBeacon dùng text/plain để hạn chế preflight
 */

const WORKER_BASE = "https://seedance.testmail12071997.workers.dev";
const SESSION_ENDPOINT = `${WORKER_BASE}/api/session`;

/* KEEP YOUR VIDEO URLS */
const RAW_LIST = [
  "https://r4---sn-8pxuuxa-nbozr.googlevideo.com/videoplayback?expire=1774114819&ei=o4O-aZqlCPSIzPsPg5_RqQI&ip=80.187.122.184&id=o-AAFvEnM36JsULBeib9RYg6s5mKDfrY0VQDd4gn4yI9cX&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&rms=au%2Cau&pcm2=yes&bui=AVNa5-zjG3mwfDAVkMlUvMA1jhZTxeX7n_sdAGPtSUWQl3XuHnggw4IXdwnLAIQJwzSv2ensGyTVPfTI&spc=6dlaFEL9-Twva1RJlG5GFBntmq_IW-PfalDsI4H6MunFrZ7d98Ju&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&gir=yes&clen=350222705&ratebypass=yes&dur=3957.539&lmt=1773280741680320&fexp=51565115%2C51565682%2C51791334&c=ANDROID_VR&txp=4538534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cpcm2%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AHEqNM4wRQIgDRlNfW31S5G5kjwHPdHjuym06hzQ2MceFxxdAvNPIuoCIQCAqzu8JmDMGIp0SkKS5inXt_N5EiK9-GQIf-0F4Mh5PA%3D%3D&pot=Mt4ENdPrI2V0HJ417d1OTz1sxOzr4SaWigkLogYP_P_rCRCg1USsCNBmEob3lcTuQb4nIVgfT5lS482UVUXkI2coLAdXijV5SsS4niMsUUdmjL2vRc3ew35oP0QWPEUzxyR4EZtCpZmzNnz_rRP7F5faWrrTFtsyv7nG7sbdZMmUWLnwZPAPVsc-EWaxHCz9qKX2F1oYOVgjSOeXcyMg3CUT5B5BOTQvTA3uWPiuU3azBQHucdcdKn4_jLAc63DApz_N5uXGu6C3scokG85dXm9hOnO3sw2ot-zpHKKBZiBmMYiXqjMJQ7mC1UNtno50eVQZLbdkzIUZeMA9WCtMkA9nU72j0p1aaGaCwAPmrDmHb3mjz9qSP4akt4RNBZcRn_2XrWvB7N7FprJB3jN8zmEn1L6Vj-1aN614LERrYDsNyGTXbc6SailGOpxCDvRpEplfnzwtdpKlj9MDdtNpcWl4WoWLe_rwi42TaHR6lccsNaaumWmJydA3BFs31cKfTcdXl5rhtuwsoBeYUHdPihCS-5Jni3SumpHTuf14CZGBs9onqvjVP8LEw7ZPbGP31YBwAk6UeYJjyMxgdJBc1NL87HERQ0jOQycEaOnlaviE8owSjMDpG2wVR41bG93bAtweA0TU7XgJmCjxgS-SWHC86Op2BDFU7ZCMbZ7pTv8jLjAgQUGvuJ84Ei87shZQIrFbm_ZOw_FeDe0Pc-1QPv5C9gH2HG8-7-4ojZQlkgvoelwxoNv2gN_ZqPC7vAmMvj_oNJ0Uxc1jgvIOfPPu_UIkDLEeyzKS1seC40m_MI0f&cms_redirect=yes&cps=538&met=1774094060,&mh=eG&mip=2402:800:631d:4a9:1d17:719a:b745:9f5c&mm=31&mn=sn-8pxuuxa-nbozr&ms=au&mt=1774093557&mv=m&mvi=4&pcm2cms=yes&pl=48&lsparams=cps,met,mh,mip,mm,mn,ms,mv,mvi,pcm2cms,pl,rms&lsig=APaTxxMwRQIgWzuTX4lpsKMZVnPczLgK633F8XtFoxLRpAgUoKMAsH8CIQDGSiw3AgwoBfnRI31o-fkASLgCBYu4Vw54MF56VGyrKw%3D%3D",
 ];

const TITLE_BANK = [
  "Khoan vuốt… coi cái này thử đi 😳",
  "Ủa sao tự nhiên coi mà cười hoài vậy 😂",
  "Góc này mà không coi là thiếu sót đó nha",
  "Nhìn nhẹ vậy thôi chứ cuốn dữ lắm 😮‍💨",
  "3 giây đầu chưa đủ đâu… coi tiếp đi 😭",
  "Không biết mọi người sao chứ mình dính rồi đó",
  "Cảnh này coi xong là muốn coi lại liền",
  "Ủa alo? Sao clip này coi hoài không chán",
  "Tự nhiên thấy dễ thương ngang 😳",
  "Coi chơi thôi mà ai ngờ coi tới cuối",
  "Vibe này mà coi buổi tối là hết nước chấm",
  "Ủa sao coi mà quên mất thời gian luôn vậy",
  "Đoạn này mà bỏ là tiếc lắm nha",
  "Coi tới cuối mới thấy cái hay của nó 😮‍💨",
  "Nhẹ nhàng vậy mà dính ghê",
  "Ủa sao tự nhiên thấy tim rung rung vậy trời",
  "Coi mà quên luôn mình đang lướt TikTok",
  "Không hiểu sao coi mà thấy chill ghê",
  "Cảnh này bật full màn hình coi mới đã",
  "Ai coi tới đây chắc cũng giống mình thôi 😭",
  "Thoạt nhìn bình thường mà coi kỹ lại cuốn lắm",
  "Coi lần đầu chưa đủ đâu…",
  "Ủa sao coi mà thấy dễ chịu ghê",
  "Góc này mà quay là auto dính",
  "Coi mà tự nhiên muốn lưu lại liền",
  "Không phải khoe chứ clip này coi hơi bị ổn",
  "Coi tới cuối đi rồi quay lại nói chuyện tiếp 😳",
  "Ủa sao coi mà thấy thương ngang vậy trời",
  "Nhìn vậy thôi chứ coi cuốn lắm nha",
  "Ai đang mệt coi cái này thử đi",
  "Cảnh này mà coi ban đêm là hợp vibe lắm",
  "Ủa sao coi mà thấy muốn coi tiếp nữa",
  "Không hiểu sao clip này coi hoài không ngán",
  "Coi tới đoạn sau mới thấy cái hay",
  "Vibe nhẹ nhẹ mà coi đã ghê",
  "Ủa sao coi mà tự nhiên cười vậy nè",
  "Coi mà quên luôn đang định làm gì",
  "Đoạn này mà bỏ là hơi uổng đó",
  "Coi tới cuối thử coi 😳",
  "Không biết sao chứ mình coi lại lần nữa rồi",
  "Cảnh này coi trên màn hình lớn là hết bài",
  "Ủa sao coi mà thấy yên yên vậy trời",
  "Nhìn đơn giản mà coi cuốn ghê",
  "Coi mà tự nhiên thấy dễ chịu ngang",
  "Đoạn sau mới là đoạn hay nè",
  "Coi thử đi rồi hiểu cảm giác này",
  "Ủa sao coi mà thấy thích nhẹ vậy ta",
  "Coi mà quên luôn thời gian trôi",
  "Cảnh này coi lại vẫn thấy ổn",
  "Không biết mọi người sao chứ mình thấy cuốn",
  "Coi mà tự nhiên muốn share cho bạn bè",
  "Góc này mà quay là hợp TikTok lắm",
  "Coi mà thấy vibe dịu ghê",
  "Ủa sao coi mà thấy vui vui vậy",
  "Coi tới cuối đi đừng bỏ giữa chừng",
  "Không hiểu sao coi mà thấy nhẹ lòng",
  "Cảnh này coi hoài vẫn thấy ổn",
  "Coi mà tự nhiên muốn coi thêm nữa",
  "Ủa sao clip này coi mà không tua nổi",
  "Coi mà quên luôn đang lướt mạng",
  "Nhìn vậy thôi chứ coi là dính đó",
  "Coi thử đi biết đâu hợp vibe bạn",
  "Ủa sao coi mà thấy chill dữ vậy",
  "Coi mà tự nhiên thấy dễ thương ghê",
  "Đoạn này coi lại vẫn thấy hay",
  "Coi mà quên luôn mình vô app làm gì",
  "Không biết sao chứ mình thấy clip này ổn",
  "Coi tới cuối thử nha 😳",
  "Cảnh này coi buổi tối là hợp lắm",
  "Coi mà tự nhiên thấy muốn coi thêm",
  "Nhìn đơn giản mà coi là cuốn",
  "Ủa sao coi mà thấy thích ngang vậy",
  "Coi mà quên luôn thời gian",
  "Đoạn này coi lại lần nữa cũng được",
  "Coi thử đi rồi quay lại đây nói chuyện tiếp 😭"
];

/* ===========================
   Helpers
   =========================== */
function normalizeToUrl(item) { return (item || "").toString().trim(); }

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function now() { return Date.now(); }

/** ✅ stableStringify: sort key để hash fingerprint ổn định */
function stableStringify(value) {
  const seen = new WeakSet();

  function stringify(val) {
    if (val === null) return "null";

    const t = typeof val;
    if (t === "number" || t === "boolean" || t === "string") return JSON.stringify(val);

    if (val instanceof Date) return JSON.stringify(val.toISOString());

    if (Array.isArray(val)) {
      // giữ nguyên thứ tự array
      return "[" + val.map(v => {
        const s = stringify(v);
        return s === undefined ? "null" : s;
      }).join(",") + "]";
    }

    if (t === "object") {
      if (seen.has(val)) return '"[Circular]"';
      seen.add(val);

      const keys = Object.keys(val)
        .filter(k => val[k] !== undefined)
        .sort();

      const props = keys.map(k => JSON.stringify(k) + ":" + stringify(val[k]));
      return "{" + props.join(",") + "}";
    }

    // function/symbol/undefined
    return undefined;
  }

  return stringify(value);
}

function muteIcon(muted) {
  return muted
    ? `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5L6 9H3v6h3l5 4V5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M23 9l-6 6M17 9l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5L6 9H3v6h3l5 4V5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M15 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
}

/* ===========================
   Video ID based on _nc_gid
   =========================== */
function getQueryParam(url, key) {
  try {
    const u = new URL(url);
    return u.searchParams.get(key) || "";
  } catch {
    const m = String(url).match(new RegExp(`[?&]${key}=([^&]+)`));
    return m ? decodeURIComponent(m[1]) : "";
  }
}

function stableVideoIdFromUrl(url) {
  const gid = getQueryParam(url, "_nc_gid");
  if (gid) return `vid_${gid}`;

  const oe = getQueryParam(url, "oe");
  if (oe) return `vid_oe_${oe}`;

  const ohc = getQueryParam(url, "_nc_ohc");
  if (ohc) return `vid_ohc_${ohc}`;

  const s = String(url);
  return `vid_${s.slice(-12).replace(/[^a-zA-Z0-9_]/g, "") || "unknown"}`;
}

/* ===========================
   Fingerprint (LIGHT) — after consent only
   ✅ GUARANTEE: stableStringify đã có, sha256 ok, lưu hash vào localStorage
   =========================== */
async function getUAHighEntropy() {
  try {
    const uaData = navigator.userAgentData;
    if (!uaData || !uaData.getHighEntropyValues) return null;

    const v = await uaData.getHighEntropyValues([
      "platform", "platformVersion", "architecture", "model",
      "bitness", "wow64", "fullVersionList"
    ]);

    return {
      mobile: !!uaData.mobile,
      brands: (uaData.brands || []).slice(0, 5),
      platform: uaData.platform || "",
      high: v || {}
    };
  } catch {
    return null;
  }
}

function getNetworkInfo() {
  try {
    const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return null;
    return {
      effectiveType: c.effectiveType || "",
      downlink: typeof c.downlink === "number" ? c.downlink : null,
      rtt: typeof c.rtt === "number" ? c.rtt : null,
      saveData: !!c.saveData
    };
  } catch {
    return null;
  }
}

function getPrefs() {
  try {
    return {
      colorScheme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      contrastMore: matchMedia("(prefers-contrast: more)").matches
    };
  } catch {
    return null;
  }
}

function getViewport() {
  try {
    return {
      inner: `${window.innerWidth}x${window.innerHeight}`,
      outer: `${window.outerWidth}x${window.outerHeight}`,
      dpr: window.devicePixelRatio || 1
    };
  } catch {
    return null;
  }
}

function getOrientation() {
  try {
    const o = screen.orientation;
    return {
      type: o?.type || "",
      angle: typeof o?.angle === "number" ? o.angle : null
    };
  } catch {
    return null;
  }
}

async function sha256Base64Url(input) {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return b64;
}

async function buildFingerprintLight() {
  const uaCh = await getUAHighEntropy();

  const fp = {
    ua: (navigator.userAgent || "").slice(0, 220),
    languages: (navigator.languages || [navigator.language || ""]).slice(0, 6),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    tzOffsetMin: new Date().getTimezoneOffset(),

    platform: navigator.platform || "",
    vendor: navigator.vendor || "",

    deviceMemory: navigator.deviceMemory || null,
    hardwareConcurrency: navigator.hardwareConcurrency || null,

    screen: `${screen.width}x${screen.height}`,
    availScreen: `${screen.availWidth}x${screen.availHeight}`,
    colorDepth: screen.colorDepth || null,

    viewport: getViewport(),
    orientation: getOrientation(),
    prefs: getPrefs(),
    net: getNetworkInfo(),

    uaCh // may be null
  };

  const hash = await sha256Base64Url(stableStringify(fp));
  return { fp_light: fp, fp_light_hash: hash };
}

/** Consent + FP cache */
const CONSENT_KEY = "vid_analytics_ok";
const FP_HASH_KEY = "vid_fp_light_hash";
const FP_RAW_KEY  = "vid_fp_light_raw"; // optional cache (string) để debug; có thể xoá nếu không muốn
function hasConsent() { return localStorage.getItem(CONSENT_KEY) === "1"; }
function getFpHashCached() { return localStorage.getItem(FP_HASH_KEY) || ""; }
function setFpCache(fpPack) {
  if (!fpPack || !fpPack.fp_light_hash) return;
  localStorage.setItem(FP_HASH_KEY, fpPack.fp_light_hash);
  // optional: lưu raw để debug (cân nhắc privacy)
  try { localStorage.setItem(FP_RAW_KEY, stableStringify(fpPack.fp_light)); } catch {}
}

/* ===========================
   DOM
   =========================== */
const feedEl = document.getElementById("feed");
const captionEl = document.getElementById("caption");
const toastEl = document.getElementById("toast");
const btnMute = document.getElementById("btnMute");
const btnGift = document.getElementById("btnGift");

if (btnGift) btnGift.addEventListener("click", () => (window.location.href = "https://mxhvn.github.io/vn/donations.html"));

function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 900);
}

/* ===========================
   Session analytics state
   =========================== */
function getUID() {
  const key = "vid_uid";
  let v = localStorage.getItem(key);
  if (!v) {
    v = (crypto?.randomUUID?.() || `u_${Math.random().toString(16).slice(2)}_${Date.now()}`);
    localStorage.setItem(key, v);
  }
  return v;
}
function getOrCreateSessionId() {
  const key = "vid_session_id";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = (crypto?.randomUUID?.() || `s_${Math.random().toString(16).slice(2)}_${Date.now()}`);
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

const UID = getUID();
const SESSION_ID = getOrCreateSessionId();

const session = {
  sid: SESSION_ID,
  uid: UID,
  startedAt: now(),
  endedAt: null,
  durationMs: 0,

  videosSeen: 0,
  videoIdsSeen: [],
  activeVideoId: null,
  watchMsByVideo: {},
  lastTickAt: now(),

  muted: true,
  ref: document.referrer || "",
  url: location.href,
  lang: navigator.language || "",
  tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
  ua: (navigator.userAgent || "").slice(0, 220),

  metaById: {},

  // ✅ fp state
  fp_light_hash: getFpHashCached() || ""
};

function markVideoSeen(feedId) {
  if (!feedId) return;
  if (!session.videoIdsSeen.includes(feedId)) {
    session.videoIdsSeen.push(feedId);
    session.videosSeen = session.videoIdsSeen.length;
  }
}

function tickWatchTime() {
  const t = now();
  const dt = Math.max(0, t - session.lastTickAt);
  session.lastTickAt = t;

  if (document.visibilityState !== "visible") return;
  const vid = session.activeVideoId;
  if (!vid) return;

  session.watchMsByVideo[vid] = (session.watchMsByVideo[vid] || 0) + dt;
}
setInterval(tickWatchTime, 1000);

/* ===========================
   Quick event sender
   ✅ Always attach fp_light_hash if available after consent
   =========================== */
function sendQuickEvent(eventName, extra = null) {
  const payload = {
    sid: SESSION_ID,
    uid: UID,
    event: eventName,
    ts: Date.now(),
    url: location.href,
    ref: document.referrer || "",
    lang: navigator.language || "",
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    ua: (navigator.userAgent || "").slice(0, 220),
    fp_light_hash: session.fp_light_hash || getFpHashCached() || "",
    ...(extra && typeof extra === "object" ? extra : {})
  };

  try {
    fetch(SESSION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  } catch {}
}

/* ===========================
   Consent Like
   ✅ Guarantee: consent_ok luôn kèm FP (nếu build được)
   =========================== */
async function ensureFpAfterConsent() {
  // Chỉ chạy nếu đã consent mà chưa có fp hash cache
  if (!hasConsent()) return null;
  const cached = getFpHashCached();
  if (cached) {
    session.fp_light_hash = cached;
    return { fp_light_hash: cached };
  }

  // Build và cache
  try {
    const fpPack = await buildFingerprintLight();
    setFpCache(fpPack);
    session.fp_light_hash = fpPack.fp_light_hash || "";
    return fpPack;
  } catch {
    return null;
  }
}

function ensureConsent() {
  if (hasConsent()) {
    // ✅ Nếu đã consent từ trước: cố gắng build fp nền (không ảnh hưởng UI)
    ensureFpAfterConsent().catch(() => {});
    return true;
  }

  const bar = document.createElement("div");
  bar.style.cssText = `
    position:fixed;
    left:50%;
    bottom:16px;
    transform:translateX(-50%);
    z-index:9999;
  `;

  bar.innerHTML = `
    <button id="vidOk" style="
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:6px;
      height:40px;
      padding:0 14px;
      border:2px solid #000;
      border-radius:999px;
      font-weight:900;
      font-size:14px;
      background:#fff;
      color:#000;
      cursor:pointer;
      box-sizing:border-box;
    ">
      <span>Like</span>
      <span style="font-size:16px;line-height:1">👍</span>
    </button>
  `;

  document.body.appendChild(bar);

  bar.querySelector("#vidOk").addEventListener("click", async () => {
    localStorage.setItem(CONSENT_KEY, "1");

    // ✅ Build FP ngay sau click (user gesture), gửi kèm consent_ok
    let fpPack = null;
    try {
      fpPack = await buildFingerprintLight();
      setFpCache(fpPack);
      session.fp_light_hash = fpPack.fp_light_hash || "";
    } catch {
      fpPack = null;
    }

    // Gửi event consent_ok (kèm fp nếu có)
    sendQuickEvent("consent_ok", fpPack || {});

    bar.remove();
  });

  return false;
}
ensureConsent();

/* ===========================
   Build FEED (id = _nc_gid)
   =========================== */
let FEED = [];

function buildFeedFromRawList() {
  const urls = RAW_LIST.map(normalizeToUrl).filter(Boolean);

  const items = urls.map((url) => {
    const id = stableVideoIdFromUrl(url);
    const nc_gid = getQueryParam(url, "_nc_gid");
    return { id, url, title: pickRandom(TITLE_BANK), nc_gid };
  });

  shuffleInPlace(items);
  return items;
}

/* ===========================
   Tap Hint UI (matches app.css)
   =========================== */
let observer = null;
let globalMuted = true;
let lastTapAt = 0;
let hintTimer = null;

function showControls() {
  if (btnMute) btnMute.classList.remove("is-hidden");
  if (btnGift) btnGift.classList.remove("is-hidden");
  if (captionEl) captionEl.classList.remove("is-hidden");
}
function hideControls() {
  if (btnMute) btnMute.classList.add("is-hidden");
  if (btnGift) btnGift.classList.add("is-hidden");
  if (captionEl) captionEl.classList.add("is-hidden");
}
function showControlsBrief(ms = 1600) {
  showControls();
  if (hintTimer) clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    const v = getActiveVideo();
    if (v && !v.paused) hideControls();
  }, ms);
}

function getActiveSlide() {
  const id = session.activeVideoId;
  if (!id) return null;
  return document.querySelector(`.slide[data-id="${CSS.escape(id)}"]`);
}
function getActiveVideo() {
  const slide = getActiveSlide();
  return slide ? slide.querySelector("video") : null;
}

function setMuteAll(muted) {
  globalMuted = muted;
  session.muted = muted;
  document.querySelectorAll(".slide video").forEach(v => (v.muted = muted));
  if (btnMute) btnMute.innerHTML = muteIcon(muted);
  toast(muted ? "Muted" : "Unmuted");
}

if (btnMute) {
  btnMute.addEventListener("click", (e) => {
    e.stopPropagation();
    setMuteAll(!globalMuted);
    hideControls();
  });
}
if (btnGift) {
  btnGift.addEventListener("click", (e) => e.stopPropagation());
}

/* ===========================
   Auto-next
   =========================== */
function goNextFromSlide(slideEl) {
  const next = slideEl?.nextElementSibling;
  if (next && next.classList.contains("slide")) {
    next.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ===========================
   Render
   =========================== */
function attachVideoSignals(video, slideEl) {
  video.addEventListener("pause", () => showControls());
  video.addEventListener("play", () => hideControls());
  video.addEventListener("ended", () => {
    if (session.activeVideoId !== slideEl?.dataset?.id) return;
    goNextFromSlide(slideEl);
  });
}

function render() {
  if (!feedEl) return;
  feedEl.innerHTML = "";

  FEED.forEach(item => {
    const s = document.createElement("section");
    s.className = "slide";
    s.dataset.id = item.id;
    s.dataset.title = item.title;
    s.dataset.url = item.url;

    s.innerHTML = `<video playsinline muted preload="metadata" src="${item.url}"></video>`;

    session.metaById[item.id] = {
      url: item.url,
      title: item.title,
      nc_gid: item.nc_gid || ""
    };

    const v = s.querySelector("video");
    if (v) attachVideoSignals(v, s);

    s.addEventListener("click", () => {
      const video = s.querySelector("video");
      if (!video) return;

      if (video.paused) {
        video.play().catch(() => {});
        hideControls();
        return;
      }

      const t = now();
      const dt = t - lastTapAt;
      lastTapAt = t;

      if (dt < 320) video.pause();
      else showControlsBrief(1600);
    });

    feedEl.appendChild(s);
  });

  const first = document.querySelector(".slide");
  if (first?.dataset?.id) {
    session.activeVideoId = first.dataset.id;
    markVideoSeen(first.dataset.id);
    if (captionEl) captionEl.textContent = first.dataset.title || "";
  }

  setupObserver();
}

function setupObserver() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
      const slide = entry.target;
      const video = slide.querySelector("video");
      if (!video) return;

      if (entry.isIntersecting) {
        document.querySelectorAll(".slide video").forEach(v => { if (v !== video) v.pause(); });

        const id = slide.dataset.id || null;
        if (id && id !== session.activeVideoId) {
          session.activeVideoId = id;
          markVideoSeen(id);
        }

        if (captionEl) captionEl.textContent = slide.dataset.title || "";

        try {
          video.muted = globalMuted;
          await video.play();
          hideControls();
        } catch {
          showControls();
        }
      } else {
        video.pause();
      }
    });
  }, { root: feedEl, threshold: 0.66 });

  document.querySelectorAll(".slide").forEach(s => observer.observe(s));
}

/* ===========================
   Send session summary (after consent only)
   ✅ Always include fp_light_hash if available
   =========================== */
function buildSessionPayload() {
  const endedAt = now();
  session.endedAt = endedAt;
  session.durationMs = Math.max(0, endedAt - session.startedAt);

  const top = Object.entries(session.watchMsByVideo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([feedId, ms]) => {
      const meta = session.metaById?.[feedId] || {};
      return {
        feedId,
        ms,
        nc_gid: meta.nc_gid || "",
        url: meta.url || "",
        title: meta.title || ""
      };
    });

  return {
    sid: session.sid,
    uid: session.uid,
    fp_light_hash: session.fp_light_hash || getFpHashCached() || "",

    startedAt: session.startedAt,
    endedAt: session.endedAt,
    durationMs: session.durationMs,

    videosSeen: session.videosSeen,
    videoIdsSeen: session.videoIdsSeen.slice(0, 50),
    topWatch: top,

    muted: !!session.muted,
    ref: session.ref,
    url: session.url,
    lang: session.lang,
    tz: session.tz,
    screen: session.screen,
    ua: session.ua
  };
}

let sent = false;
function sendSession() {
  if (sent) return;
  sent = true;

  if (!hasConsent()) return;

  const body = JSON.stringify(buildSessionPayload());

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
    navigator.sendBeacon(SESSION_ENDPOINT, blob);
    return;
  }

  fetch(SESSION_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}

window.addEventListener("pagehide", sendSession);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") sendSession();
});

/* ===========================
   Init
   =========================== */
(() => {
  FEED = buildFeedFromRawList();
  render();
  setMuteAll(true);
  hideControls();

  // ✅ Nếu user đã consent từ trước, đảm bảo có fp hash sớm nhất có thể
  ensureFpAfterConsent().catch(() => {});
})();
