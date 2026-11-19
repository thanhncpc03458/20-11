import React, { useEffect, useMemo, useRef, useState } from "react";
import { greeting } from "./data/greeting";

const chapterIds = ["inspiration", "kindness", "gratitude"];

function FloatingPetals({ count = 18 }) {
  return (
    <div className="petal-field" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <i
          className="petal"
          key={index}
          style={{
            "--x": `${(index * 37) % 106}%`,
            "--delay": `${(index * 0.63) % 8}s`,
            "--duration": `${8 + ((index * 3) % 7)}s`,
            "--size": `${7 + ((index * 5) % 8)}px`
          }}
        />
      ))}
    </div>
  );
}

function Sparkles({ count = 22 }) {
  return (
    <div className="sparkle-field" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <i key={index} style={{ "--sx": `${(index * 43) % 100}%`, "--sy": `${(index * 67) % 100}%`, "--sd": `${(index % 5) * 0.7}s` }} />
      ))}
    </div>
  );
}

function Flower({ size = "large" }) {
  return (
    <div className={`flower ${size}`} aria-hidden="true">
      <span className="flower-petal p1" /><span className="flower-petal p2" /><span className="flower-petal p3" />
      <span className="flower-petal p4" /><span className="flower-petal p5" /><span className="flower-center" />
    </div>
  );
}

function Bouquet({ visible }) {
  return (
    <div className={`bouquet ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <div className="bouquet-glow" />
      <div className="stems"><span /><span /><span /><span /><span /></div>
      <div className="bouquet-flowers"><Flower /><Flower size="small" /><Flower size="small" /><Flower size="tiny" /></div>
      <div className="bouquet-wrap" />
    </div>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const [bookPage, setBookPage] = useState(0);
  const [music, setMusic] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const audioRef = useRef(null);
  const visited = useRef(new Set());

  const sections = useMemo(() => ["home", ...chapterIds, "letter", "gift", "secret", "final"], []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          visited.current.add(entry.target.id);
          setProgress(Math.min(100, Math.round((visited.current.size / sections.length) * 100)));
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections.length]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) setProgress((value) => Math.max(value, Math.round((window.scrollY / max) * 100)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => audioRef.current?.close(), []);

  const playNote = () => {
    if (!audioRef.current) audioRef.current = new AudioContext();
    const context = audioRef.current;
    const now = context.currentTime;
    [261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.045, now + index * 0.16 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.16 + 1.8);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + index * 0.16);
      oscillator.stop(now + index * 0.16 + 1.9);
    });
  };

  const toggleMusic = () => {
    setMusic((active) => {
      const next = !active;
      if (next) playNote();
      return next;
    });
  };

  const addHeart = (event) => {
    const id = Date.now();
    const rect = event.currentTarget.getBoundingClientRect();
    setHearts((items) => [...items, { id, x: rect.left + rect.width / 2, y: rect.top + window.scrollY }]);
    window.setTimeout(() => setHearts((items) => items.filter((item) => item.id !== id)), 1500);
  };

  const openLetter = () => {
    setLetterOpen(true);
    setTimeout(() => document.getElementById("letter")?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  const finishJourney = () => {
    setCelebrate(true);
    document.getElementById("final")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <div className="progress-track" aria-label={`Đã khám phá ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      <div className="utility-bar">
        <span className="monogram">20<span>·</span>11</span>
        <button className={`music-button ${music ? "playing" : ""}`} onClick={toggleMusic} aria-pressed={music}>
          <span className="sound-bars"><i /><i /><i /></span>{music ? " Đang phát nhạc" : " Bật nhạc piano"}
        </button>
      </div>
      {hearts.map((heart) => <span className="click-heart" key={heart.id} style={{ left: heart.x, top: heart.y }}>♥</span>)}

      <section id="home" className={`hero ${opened ? "opened" : ""}`}>
        <div className="window-light" /><div className="window-frame" />
        <div className="desk"><div className="book book-back" /><div className="book book-front" /><span className="pen" /><span className="vase">✿</span><div className="envelope-mini" /></div>
        <FloatingPetals /><Sparkles />
        <div className="hero-copy">
          <p className="eyebrow">MỘT MÓN QUÀ RIÊNG · 20 THÁNG 11</p>
          <h1>Có những người khiến<br /><em>thế giới đẹp hơn một chút...</em></h1>
          <p className="hero-sub">...chỉ bằng cách xuất hiện trong đời.</p>
          <div className="hero-divider" />
          <p className="vietnamese">{greeting.occasionNote}</p>
          <button className="primary-button" onClick={() => { setOpened(true); playNote(); setTimeout(() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }), 850); }}>
            <span className="envelope-icon" aria-hidden="true">
              <svg viewBox="0 0 42 30" role="presentation">
                <rect x="1.5" y="2" width="39" height="26" rx="2" />
                <path d="M2.5 4 21 18 39.5 4" />
                <path d="m2.5 27 13-11M39.5 27l-13-11" />
              </svg>
            </span>
            <span>MỞ BỨC THƯ</span><b aria-hidden="true">↗</b>
          </button>
        </div>
        <div className="hero-note">Một bức thư<br />lời khó nói thành câu</div>
      </section>

      <section id="experience" className="experience-section">
        <div className="garden-backdrop"><div className="sun-disc" /><div className="arch-window"><i /><i /><i /></div></div>
        <FloatingPetals count={10} /><Sparkles count={16} />
        <div className="section-intro reveal">
          <p className="eyebrow">KHU VƯỜN CỦA LÒNG BIẾT ƠN</p>
          <h2>Chúc mừng<br /><em>ngày của em</em></h2>
          <div className="date-mark">20 <span>·</span> 11</div>
          <p>Ngày dành để nói lời cảm ơn đến những người đặc biệt.</p>
        </div>
        <div className="garden-still-life reveal">
          <div className="open-book"><span>Mỗi bài học để lại<br /><i>một chút ánh sáng.</i></span></div>
          <div className="garden-bouquet"><Flower size="small" /><Flower size="tiny" /><Flower size="tiny" /></div>
        </div>
      </section>

      <section className="memories section-shell">
        <div className="section-heading reveal"><span className="chapter-label">NHỮNG ĐIỀU ĐÁNG TRÂN TRỌNG</span><h2>Ba điều ở lại<br /><em>trong lòng.</em></h2></div>
        <div className="chapter-list">
          {greeting.chapters.map((chapter, index) => (
            <article id={chapterIds[index]} className="chapter reveal" key={chapter.number}>
              <span className="chapter-number">{chapter.number}</span><div><p className="eyebrow">{chapter.title}</p><p className="chapter-body">{chapter.body}</p></div><span className="chapter-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="letter" className="letter-section section-shell reveal">
        <div className="section-heading centered"><span className="chapter-label">BỨC THƯ ĐẶC BIỆT</span><h2>Một bức thư<br /><em>chỉ dành cho {greeting.recipient}.</em></h2></div>
        <button className={`letter-card ${letterOpen ? "letter-is-open" : ""}`} onClick={openLetter} aria-expanded={letterOpen}>
          <div className="letter-flap" /><div className="wax-seal">20<br /><small>·</small><br />11</div>
          <div className="letter-paper">
            <p className="handwriting">{greeting.salutation}</p>
            <p>{greeting.intro}</p>
            {greeting.letter.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="handwriting">{greeting.signature}</p><p className="signed">{greeting.signedBy}</p>
          </div>
          {!letterOpen && <span className="letter-cta">CHẠM ĐỂ MỞ · CHẠM ĐỂ MỞ · CHẠM ĐỂ MỞ</span>}
        </button>
        <p className="microcopy">{letterOpen ? "Một lời cảm ơn, đôi khi cần một khoảng lặng để được lắng nghe." : "Chạm vào phong thư để đọc những điều chưa kịp nói."}</p>
      </section>

      <section id="gift" className="gift-section section-shell">
        <div className="gift-copy reveal"><span className="chapter-label">MÓN QUÀ HOA</span><h2>Một chút<br /><em>niềm vui.</em></h2><p>{greeting.flowerMessage}</p><button className="outline-button" onClick={() => { setGiftOpen(true); playNote(); }}>TẶNG CÔ MỘT BÓ HOA <span>✦</span></button></div>
        <div className="gift-stage"><Bouquet visible={giftOpen} /><div className="gift-ribbon">TẶNG EM</div>{giftOpen && <div className="gift-sparkles">✦　·　✧　·　✦</div>}</div>
      </section>

      <section id="secret" className="secret-section section-shell reveal">
        <span className="chapter-label">MỘT ĐIỀU MUỐN NÓI</span><h2>Có một điều<br /><em>muốn nói.</em></h2>
        <button className={`secret-book ${secretOpen ? "book-open" : ""}`} onClick={() => setSecretOpen(true)} aria-expanded={secretOpen}>
          <span className="book-cover"><b>✦</b><small>MỘT ĐIỀU<br />MUỐN NÓI</small></span><span className="book-pages">{secretOpen ? <><p>{greeting.secret[0]}</p><strong>{greeting.secret[1]}</strong></> : "MỞ CUỐN SÁCH"}</span>
        </button>
      </section>

      <section className="interactions section-shell">
        <div className="interaction-card reveal"><span className="chapter-label">MỘT CỬ CHỈ NHỎ</span><h3>Nhấn để thả<br /><em>một bông hoa.</em></h3><button className="flower-button" onClick={addHeart} aria-label="Thả một bông hoa">✿</button><p>Một chút dịu dàng cho ngày hôm nay.</p></div>
        <div className="interaction-card reveal"><span className="chapter-label">MỘT TRANG ĐỂ GIỮ LẠI</span><h3>Những dòng chữ<br /><em>ở lại.</em></h3><div className={`mini-book page-${bookPage}`}><div><p>“Một người tốt<br />gieo hạt giống<br />cho cả tương lai.”</p></div><div><p>Cảm ơn em<br />vì từng<br />tia sáng nhỏ.</p></div></div><button className="page-button" onClick={() => setBookPage((page) => page === 0 ? 1 : 0)}>LẬT TRANG ↗</button></div>
      </section>

      <section id="final" className={`final-section ${celebrate ? "celebrating" : ""}`}>
        <FloatingPetals count={22} /><Sparkles count={28} /><Bouquet visible />
        <div className="final-copy"><p className="final-line">Có những người trao đi bài học.</p><p className="final-line delay-one">Có những người để lại ký ức đẹp.</p><p className="final-line delay-two">Và có những người trở thành một phần đặc biệt của hành trình.</p><div className="final-divider" /><h2>Cảm ơn em<br /><em>vì đã là chính em.</em></h2><p className="final-date">CHÚC MỪNG NGÀY NHÀ GIÁO VIỆT NAM · 20/11</p><p className="final-wish">{greeting.wish}</p></div>
        <button className="finish-button" onClick={finishJourney}>{celebrate ? "♡ VỚI TẤT CẢ LÒNG BIẾT ƠN ♡" : "HOÀN THÀNH HÀNH TRÌNH ✦"}</button>
      </section>
    </main>
  );
}

export default App;
