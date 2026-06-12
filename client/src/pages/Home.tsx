/**
 * Sugar Daddies — Caffetteria Pasticceria
 * Design: "Pâtisserie Éditoriale" — Stile Magazine di Lusso Francese
 * Typography: Cormorant Garamond (display) + DM Sans (body)
 * Palette: #c69ab5, #c3c4d6, #3f6572, #71535d, #c694ad
 * Gradient: sfumature morbide tra rosa/malva/lavanda per background e effetti
 */

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Clock, Phone, Instagram, Star, ChevronDown, Coffee, Cake } from "lucide-react";

// Asset URLs (immagini locali in /public/foto)
const HERO_IMG = "/foto/hero-croissants.webp";
const CUBOTTO_IMG = "/foto/cubotto-reale.jpg";
const CAFE_IMG = "/foto/cafe-interior.webp";
const VARIETY_IMG = "/foto/pastries-variety.webp";

// Reviews data
const reviews = [
  { name: "Carmen Fontana", text: "Ogni volta che vengo a Civitanova, una tappa da Sugar Daddies è obbligatoria. Un vero e proprio sugar dating! Un appuntamento fisso con il gusto da cui so già che uscirò felice.", rating: 5 },
  { name: "Marco Casetti", text: "È la terza volta che vengo qui da Roma. Sempre una gran conferma! Pasticceria eccezionale, qualità dei prodotti superlativa.", rating: 5 },
  { name: "DomenicoCristina", text: "A Civitanova e dintorni la migliore pasticceria in assoluto. Cornetti sfogliati e super farciti con creme davvero buonissime. Finalmente una crema al pistacchio che SA di PISTACCHIO.", rating: 5 },
  { name: "Andrea Ferrini", text: "Cornetti unici, davvero buoni. Consiglio di passare, non ve ne pentirete. Complimenti davvero!", rating: 5 },
  { name: "Pizza Lover", text: "Posto carino, personale gentile. Il croissant cubico ripieno di crema pasticcera al pistacchio è una delizia. Tutto veramente ottimo!", rating: 5 },
  { name: "Andrea Sarti", text: "Non fatevi ingannare dalle apparenze! La qualità di ogni singolo croissant è al top. Dimensioni sopra la norma e farcitura interna notevole.", rating: 5 },
  { name: "Vincenzo Putignano", text: "Trovato per puro caso. Provato il croissant ed il cubo. Bellissimo poter scegliere la farcitura al momento. Sfogliati perfetti!", rating: 5 },
  { name: "MARINA VAKARCHUK", text: "La migliore pasticceria della città. Brioches e dolci di alta qualità. Ogni volta che mangio un croissant lì, torno mentalmente a Parigi.", rating: 5 },
  { name: "Martina Sacco", text: "Produzione artigianale di pasticceria. Croissant squisiti e impasto superlativo e leggerissimo. Crema pasticcera mai mangiata così buona.", rating: 5 },
  { name: "Valentina Nigro", text: "Quello di cui voglio parlare è di quanto sono buoni i dolci che fanno. Nessun vocabolo può accostarsi alla reale bontà di questi prodotti.", rating: 5 },
  { name: "Albert T-Rex", text: "Pasticceria strepitosa, brioches e dolci da prima colazione squisiti e con ingredienti di qualità! Anche la caffetteria è il top.", rating: 5 },
  { name: "Rebecca Vanni", text: "Occhio a giudicare il libro dalla copertina, entrate! Finalmente un vero croissant studiato. Tecnica meravigliosa per una colazione perfetta!", rating: 5 },
  { name: "Laura Natalini", text: "I dolci di Sugar Daddies sono davvero golosi, ricercati, molto belli anche a livello estetico. La crema è buonissima, il cubotto è una delizia.", rating: 5 },
  { name: "Genny", text: "Ho ordinato la torta per il compleanno di mia figlia, a parte bellissima... non sono riuscita nemmeno a portarmene un po' a casa per quanto sia stata gradita.", rating: 5 },
  { name: "Matteo Gaspari", text: "Da amante del buon cibo e da appassionato di cucina e pasticceria, venerdì scorso ho deciso di entrare. Una scoperta straordinaria!", rating: 5 },
  { name: "Patrizia Tarquini", text: "Location piccola, carina, con buone possibilità di parcheggio. Ottima crema pasticcera, buoni i croissant. Titolari gentili. Ci ritornerò.", rating: 5 },
];

// Menu items
const menuItems = [
  { name: "Cubotto", desc: "La nostra specialità — sfogliato cubico farcito al momento", popular: true, icon: "cube" },
  { name: "Croissant Classico", desc: "Sfogliatura francese, farcibile con creme a scelta", popular: true, icon: "croissant" },
  { name: "Cheesecake ai Lamponi", desc: "Base croccante, crema vellutata e lamponi freschi", popular: false, icon: "cake" },
  { name: "Mousse Cioccolato Fondente", desc: "Cioccolato 70% con ganache e cacao amaro", popular: false, icon: "cake" },
  { name: "Crostata di Frutta", desc: "Frolla friabile con crema e frutta fresca di stagione", popular: false, icon: "cake" },
  { name: "Monoporzione Tiramisù", desc: "Savoiardi, mascarpone e caffè in versione monoporzione", popular: false, icon: "cake" },
  { name: "Brioche Cubica", desc: "Impasto brioche soffice a forma di cubo, farcita al momento", popular: false, icon: "cube" },
  { name: "Caffè & Cappuccino", desc: "Miscela selezionata, cappuccino ben schiumato", popular: false, icon: "coffee" },
];

// Intersection Observer hook
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

function IntroOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [gone, setGone] = useState(false);
  const gapRef = useRef<number[]>([]);

  useEffect(() => {
    // skip intro se gia vista in questa sessione
    if (sessionStorage.getItem('sd-intro-seen')) { setGone(true); return; }

    fetch('/gap-data.json').then(r => r.json()).then(d => { gapRef.current = d.gap; }).catch(() => {});

    const vid = vidRef.current;
    if (!vid) return;
    vid.playbackRate = 1.15;

    const CLIP = 0.52, WIN = 0.16;
    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const diagPx = () => { const w = innerWidth, h = innerHeight; return Math.sqrt(w * w + h * h) / 2 + 60; };

    function gapAt(p: number) {
      const g = gapRef.current;
      if (!g.length) return 0;
      const idx = clamp(p) * (g.length - 1);
      const i = Math.floor(idx), fr = idx - i;
      return (g[i] ?? 0) + ((g[i + 1] ?? g[i] ?? 0) - (g[i] ?? 0)) * fr;
    }

    let done = false;
    function frame() {
      const v = vidRef.current;
      if (!v || !v.duration || !gapRef.current.length) { if (!done) requestAnimationFrame(frame); return; }
      const root = rootRef.current, wrap = wrapRef.current;
      if (!root || !wrap) return;

      const p = clamp(v.currentTime / v.duration);
      const gap = gapAt(p);
      const cubeHalf = wrap.getBoundingClientRect().width / 2;
      let r = gap * cubeHalf;

      if (p > CLIP) {
        const t = clamp((p - CLIP) / WIN);
        const e = easeOutCubic(t);
        r = r + e * (diagPx() - r);
        root.style.opacity = (1 - e).toFixed(3);
      } else {
        root.style.opacity = '1';
      }

      if (r < 0.5) {
        root.style.webkitMaskImage = 'none';
        root.style.maskImage = 'none';
      } else {
        const g = `radial-gradient(circle at 50% 50%, transparent ${r.toFixed(1)}px, #000 ${(r + 1.5).toFixed(1)}px)`;
        root.style.webkitMaskImage = g;
        root.style.maskImage = g;
      }

      if (p >= CLIP + WIN + 0.02) { done = true; setGone(true); sessionStorage.setItem('sd-intro-seen', '1'); return; }
      if (!done) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    vid.addEventListener('ended', () => { done = true; setGone(true); sessionStorage.setItem('sd-intro-seen', '1'); });
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      <div ref={wrapRef} className="w-[96vmin] h-[96vmin] flex-none" style={{ maxWidth: '78vmin', maxHeight: '78vmin' }}>
        <video
          ref={vidRef}
          src="/foto/cubotto-final.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(180deg, #faf7f2 0%, #f8f4f6 25%, #f6f2f5 50%, #f5f0f4 75%, #faf7f2 100%)" }}>
      <IntroOverlay />
      <Nav />
      <HeroSection />
      <SpecialtySection />
      <MenuSection />
      <TeamSection />
      <ReviewsBand />
      <AtmosphereSection />
      <InfoSection />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(250, 247, 242, 0.92)" : "rgba(250, 247, 242, 0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(198, 154, 181, 0.12)" : "none",
      }}
    >
      <div className="container flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-2 group">
          <span
            className="font-[Cormorant_Garamond] text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:opacity-80"
            style={{ color: "#3f6572" }}
          >
            Sugar Daddies
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "#71535d" }}>
          {[
            { href: "#specialita", label: "Specialità" },
            { href: "#vetrina", label: "Vetrina" },
            { href: "#team", label: "Chi siamo" },
            { href: "#recensioni", label: "Recensioni" },
            { href: "#info", label: "Info" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 transition-colors duration-300 hover:text-[#3f6572]"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 hover:w-full" style={{ background: "linear-gradient(90deg, #c69ab5, #c694ad)" }} />
            </a>
          ))}
        </div>
        <a
          href="https://www.instagram.com/sugar_daddies_civitanova/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-400 hover:scale-105 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #c69ab5, #c694ad)",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(198, 154, 181, 0.3)",
          }}
          aria-label="Seguici su Instagram"
        >
          <Instagram size={16} />
          <span className="hidden sm:inline">Seguici</span>
        </a>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.8]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-0 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]" style={{ background: "radial-gradient(circle, #c69ab5, transparent)" }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]" style={{ background: "radial-gradient(circle, #c3c4d6, transparent)" }} />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left: Text */}
        <div className="pt-8 lg:pt-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="text-sm font-medium tracking-[0.2em] uppercase mb-5"
            style={{ color: "#c69ab5" }}
          >
            Caffetteria &amp; Pasticceria Artigianale
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="font-[Cormorant_Garamond] font-light leading-[0.88] mb-7"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)", color: "#3f6572", letterSpacing: "-0.02em" }}
          >
            L'arte della
            <br />
            <span className="font-semibold italic" style={{ color: "#71535d" }}>sfoglia parigina</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="text-lg leading-relaxed max-w-md mb-9"
            style={{ color: "#71535d", opacity: 0.8 }}
          >
            Croissant sfogliati, cubotti e brioches farcite al momento con creme artigianali.
            Un angolo di Parigi a Civitanova Marche.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="flex flex-wrap items-center gap-5"
          >
            <a
              href="#vetrina"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-400 hover:scale-105 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #3f6572, #71535d)",
                color: "#fff",
                boxShadow: "0 8px 30px rgba(63, 101, 114, 0.3)",
              }}
            >
              Scopri il Menu
              <ChevronDown size={16} />
            </a>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#c69ab5" color="#c69ab5" />
              ))}
              <span className="ml-2 text-sm font-medium" style={{ color: "#71535d" }}>4,8 su Google</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="relative"
        >
          <div
            className="relative rounded-[1.5rem] overflow-hidden"
            style={{ boxShadow: "0 40px 100px rgba(198, 154, 181, 0.25), 0 15px 40px rgba(113, 83, 93, 0.1)" }}
          >
            <img
              src={HERO_IMG}
              alt="Croissant e paste sfogliate artigianali di Sugar Daddies"
              className="w-full h-auto object-cover"
              width={1280}
              height={720}
              fetchPriority="high"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(63, 101, 114, 0.08) 0%, transparent 30%)" }} />
          </div>
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-6 -left-4 lg:-left-10 rounded-2xl px-6 py-4"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 15px 50px rgba(198, 154, 181, 0.25)",
              border: "1px solid rgba(198, 154, 181, 0.1)",
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "#c69ab5" }}>177 Recensioni Google</p>
            <p className="font-[Cormorant_Garamond] text-3xl font-bold mt-0.5" style={{ color: "#3f6572" }}>
              4,8 <span className="text-lg">★</span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SpecialtySection() {
  const ref = useInView();

  return (
    <section id="specialita" className="py-28 lg:py-36 relative">
      {/* Subtle decorative gradient */}
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px] -translate-y-1/2" style={{ background: "radial-gradient(circle, #c694ad, transparent)" }} />

      <div className="container">
        <div ref={ref} className="fade-in-up grid lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          {/* Image - 2 cols */}
          <div className="lg:col-span-2 relative">
            <div
              className="rounded-[1.5rem] overflow-hidden transition-transform duration-700 hover:scale-[1.02]"
              style={{ boxShadow: "0 30px 80px rgba(113, 83, 93, 0.2)" }}
            >
              <img
                src={CUBOTTO_IMG}
                alt="Cubotto — la specialità di Sugar Daddies con crema al pistacchio"
                className="w-full h-auto object-cover"
                width={544}
                height={680}
                loading="lazy"
              />
            </div>
            {/* Decorative circles */}
            <div className="absolute -z-10 -top-8 -right-8 w-40 h-40 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #c3c4d6 0%, transparent 70%)" }} />
            <div className="absolute -z-10 -bottom-6 -left-6 w-24 h-24 rounded-full opacity-25" style={{ background: "radial-gradient(circle, #c69ab5 0%, transparent 70%)" }} />
          </div>

          {/* Text - 3 cols */}
          <div className="lg:col-span-3 lg:pl-4">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#c694ad" }}>
              La Nostra Specialità
            </p>
            <h2
              className="font-[Cormorant_Garamond] font-light leading-[0.92] mb-7"
              style={{ fontSize: "clamp(2.94rem, 5vw, 5rem)", color: "#3f6572", letterSpacing: "-0.02em" }}
            >
              Il <span className="italic font-semibold" style={{ color: "#71535d" }}>Cubotto</span>
            </h2>
            <div className="space-y-5 max-w-lg">
              <p className="text-lg leading-[1.8]" style={{ color: "#71535d", opacity: 0.85 }}>
                La nostra creazione firma: uno sfogliato a forma di cubo con strati dorati e croccanti,
                farcito al momento con la crema che preferisci. Pistacchio, crema pasticcera, Nutella,
                cioccolato bianco — ogni morso è un viaggio a Parigi.
              </p>
              <p className="text-lg leading-[1.8]" style={{ color: "#71535d", opacity: 0.85 }}>
                Utilizziamo solo materie prime di altissima qualità e tecniche di sfogliatura francese
                per creare paste che sono opere d'arte tanto nel gusto quanto nell'estetica.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {["Sfogliatura Francese", "Farciti al Momento", "Materie Prime Premium"].map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2.5 rounded-full text-xs font-medium tracking-wide"
                  style={{
                    background: "linear-gradient(135deg, rgba(198, 154, 181, 0.12), rgba(195, 196, 214, 0.12))",
                    color: "#3f6572",
                    border: "1px solid rgba(198, 154, 181, 0.15)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection() {
  const headerRef = useInView();
  const gridRef = useInView(0.08);

  return (
    <section id="vetrina" className="py-28 lg:py-36 relative">
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(198, 154, 181, 0.04) 30%, rgba(195, 196, 214, 0.04) 70%, transparent 100%)" }} />

      <div className="container relative z-10">
        <div ref={headerRef} className="fade-in-up text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#c694ad" }}>
            Le Nostre Creazioni
          </p>
          <h2
            className="font-[Cormorant_Garamond] font-light"
            style={{ fontSize: "clamp(2.63rem, 5vw, 4.5rem)", color: "#3f6572", letterSpacing: "-0.02em" }}
          >
            Le Nostre <span className="italic font-semibold" style={{ color: "#71535d" }}>Creazioni</span>
          </h2>
        </div>

        <div ref={gridRef} className="stagger-children grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="group relative p-7 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(198, 154, 181, 0.1)",
                boxShadow: "0 4px 20px rgba(198, 154, 181, 0.06)",
              }}
            >
              {item.popular && (
                <span
                  className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "linear-gradient(135deg, #c69ab5, #c694ad)", color: "#fff" }}
                >
                  Top
                </span>
              )}
              <div className="w-10 h-10 rounded-full mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(198, 154, 181, 0.15), rgba(195, 196, 214, 0.15))" }}>
                {item.icon === "coffee" ? <Coffee size={18} style={{ color: "#3f6572" }} /> :
                 item.icon === "cube" ? <Cake size={18} style={{ color: "#3f6572" }} /> :
                 <Cake size={18} style={{ color: "#3f6572" }} />}
              </div>
              <h3 className="font-[Cormorant_Garamond] text-xl font-semibold mb-2" style={{ color: "#3f6572" }}>
                {item.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#71535d", opacity: 0.7 }}>
                {item.desc}
              </p>
              {/* Hover gradient overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1.5px rgba(198, 154, 181, 0.3)" }}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <p className="text-sm italic" style={{ color: "#71535d", opacity: 0.6 }}>
            Tutte le nostre paste sono farcibili al momento con la crema che preferisci
          </p>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const ref = useInView();

  return (
    <section id="team" className="py-28 lg:py-36 relative">
      <div className="container">
        <div ref={ref} className="fade-in-up">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#c694ad" }}>
              Le mani dietro la sfoglia
            </p>
            <h2
              className="font-[Cormorant_Garamond] font-light"
              style={{ fontSize: "clamp(2.31rem, 4vw, 4rem)", color: "#3f6572", letterSpacing: "-0.02em" }}
            >
              Chi <span className="italic font-semibold" style={{ color: "#71535d" }}>siamo</span>
            </h2>
          </div>

          {/* Giuseppe — foto sinistra, testo destra */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 lg:mb-28">
            <div className="max-w-[70%] mx-auto lg:mx-0">
              <div
                className="rounded-2xl overflow-hidden transition-transform duration-700 hover:scale-[1.02]"
                style={{ boxShadow: "0 20px 50px rgba(198, 154, 181, 0.15)" }}
              >
                <img
                  src="/foto/peppe.jpg"
                  alt="Giuseppe — il volto di Sugar Daddies"
                  className="w-full aspect-[3/4] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div>
              <h3 className="font-[Cormorant_Garamond] text-[1.97rem] font-semibold mb-4" style={{ color: "#3f6572" }}>Giuseppe</h3>
              <p className="text-lg leading-[1.8]" style={{ color: "#71535d", opacity: 0.85 }}>
                Il primo volto che incontrerete entrando da Sugar Daddies. Pronto a guidarvi nella scelta,
                a spiegarvi la differenza tra i nostri Sugar Cube — quelli che terminate in tempi record —
                e a prepararvi il caffè del mattino. Dietro al bancone con energia e disponibilità,
                ogni giorno dalle prime ore dell'alba.
              </p>
              <p className="text-sm mt-4 italic" style={{ color: "#c694ad" }}>
                Il bancone, l'accoglienza, il caffè.
              </p>
            </div>
          </div>

          {/* Elia — testo sinistra, foto destra */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="font-[Cormorant_Garamond] text-[1.97rem] font-semibold mb-4" style={{ color: "#3f6572" }}>Elia</h3>
              <p className="text-lg leading-[1.8]" style={{ color: "#71535d", opacity: 0.85 }}>
                Lo vedrete meno spesso al bancone, perché agisce nelle retrovie: è lui che ogni mattina
                prepara tutti i prodotti, dai croissant sfogliati alle monoporzioni e mignon.
                Orecchie sempre attente alle vostre richieste, mani sempre in movimento tra impasti e farciture.
                Il suo ingrediente segreto? Creatività, precisione e un pizzico di pazienza.
              </p>
              <p className="text-sm mt-4 italic" style={{ color: "#c694ad" }}>
                Il laboratorio, la sfoglia, la creatività.
              </p>
            </div>
            <div className="order-1 lg:order-2 max-w-[70%] mx-auto lg:mx-0 lg:ml-auto">
              <div
                className="rounded-2xl overflow-hidden transition-transform duration-700 hover:scale-[1.02]"
                style={{ boxShadow: "0 20px 50px rgba(198, 154, 181, 0.15)" }}
              >
                <img
                  src="/foto/elia.webp"
                  alt="Elia — il pasticcere di Sugar Daddies"
                  className="w-full aspect-[3/4] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsBand() {
  const headerRef = useInView();

  return (
    <section id="recensioni" className="py-20 lg:py-28 overflow-hidden relative">
      {/* Background accent */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(198, 154, 181, 0.03) 0%, rgba(195, 196, 214, 0.05) 50%, rgba(198, 154, 181, 0.03) 100%)" }} />

      <div ref={headerRef} className="fade-in-up text-center mb-14 container relative z-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#c694ad" }}>
          Cosa Dicono di Noi
        </p>
        <h2
          className="font-[Cormorant_Garamond] font-light"
          style={{ fontSize: "clamp(2.31rem, 4vw, 3.8rem)", color: "#3f6572", letterSpacing: "-0.02em" }}
        >
          Le Voci dei Nostri <span className="italic font-semibold" style={{ color: "#71535d" }}>Clienti</span>
        </h2>
        <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: "#71535d", opacity: 0.6 }}>
          Passa il cursore su una recensione per fermare lo scorrimento e leggere con calma
        </p>
      </div>

      {/* Scrolling band */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #f8f4f6, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #f8f4f6, transparent)" }} />

        <div className="overflow-hidden py-4">
          <div className="reviews-track">
            {[...reviews, ...reviews].map((review, i) => (
              <div
                key={`${review.name}-${i}`}
                className="flex-shrink-0 w-[360px] mx-3 p-7 rounded-2xl transition-all duration-400 hover:shadow-xl hover:-translate-y-1 cursor-default"
                style={{
                  background: "rgba(255, 255, 255, 0.88)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(198, 154, 181, 0.1)",
                  boxShadow: "0 4px 20px rgba(198, 154, 181, 0.06)",
                }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={13} fill="#c69ab5" color="#c69ab5" />
                  ))}
                </div>
                <p className="text-sm leading-[1.7] mb-5" style={{ color: "#71535d" }}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, #c69ab5, #c3c4d6)", color: "#fff" }}>
                    {review.name.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold" style={{ color: "#3f6572" }}>
                    {review.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AtmosphereSection() {
  const ref = useInView();

  return (
    <section className="py-28 lg:py-36 relative">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]" style={{ background: "radial-gradient(circle, #c3c4d6, transparent)" }} />

      <div className="container">
        <div ref={ref} className="fade-in-up grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#c694ad" }}>
              Il Nostro Mondo
            </p>
            <h2
              className="font-[Cormorant_Garamond] font-light leading-[0.92] mb-7"
              style={{ fontSize: "clamp(2.31rem, 4vw, 4rem)", color: "#3f6572", letterSpacing: "-0.02em" }}
            >
              Un angolo di <span className="italic font-semibold" style={{ color: "#71535d" }}>Parigi</span>
              <br />a Civitanova
            </h2>
            <p className="text-lg leading-[1.8] mb-8 max-w-md" style={{ color: "#71535d", opacity: 0.85 }}>
              Un locale intimo e accogliente dove ogni dettaglio è curato con passione.
              Vieni a scoprire la nostra selezione di paste artigianali, preparate ogni
              mattina con tecniche di sfogliatura francese.
            </p>
            <div className="space-y-4">
              {[
                "Produzione artigianale quotidiana",
                "Farciture fresche preparate al momento",
                "Ambiente LGBTQ+ friendly e inclusivo",
                "Accessibile in sedia a rotelle",
                "Wi-Fi gratuito",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, #c69ab5, #c694ad)" }} />
                  <span className="text-sm" style={{ color: "#71535d" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Single image */}
          <div className="order-1 lg:order-2">
            <div
              className="rounded-2xl overflow-hidden transition-transform duration-700 hover:scale-[1.02]"
              style={{ boxShadow: "0 20px 50px rgba(198, 154, 181, 0.2)" }}
            >
              <img
                src="/foto/angolo-parigi.webp"
                alt="L'interno di Sugar Daddies — un angolo di Parigi a Civitanova"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoSection() {
  const ref = useInView();

  return (
    <section id="info" className="py-28 lg:py-36 relative">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(63, 101, 114, 0.02) 50%, transparent 100%)" }} />

      <div className="container relative z-10">
        <div ref={ref} className="fade-in-up">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#c694ad" }}>
              Vieni a Trovarci
            </p>
            <h2
              className="font-[Cormorant_Garamond] font-light"
              style={{ fontSize: "clamp(2.31rem, 4vw, 4rem)", color: "#3f6572", letterSpacing: "-0.02em" }}
            >
              Dove <span className="italic font-semibold" style={{ color: "#71535d" }}>Siamo</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Address */}
            <InfoCard
              icon={<MapPin size={22} style={{ color: "#3f6572" }} />}
              title="Indirizzo"
              content={<>Viale Vittorio Veneto, 75/A<br />62012 Civitanova Marche (MC)</>}
              link="https://maps.app.goo.gl/idETiacGqaM68Zfd9"
              linkText="Apri in Maps"
            />

            {/* Hours */}
            <InfoCard
              icon={<Clock size={22} style={{ color: "#3f6572" }} />}
              title="Orari"
              content={<>Aperto dalle 06:30<br />Solo mattina</>}
            />

            {/* Contact */}
            <InfoCard
              icon={<Phone size={22} style={{ color: "#3f6572" }} />}
              title="Contatti"
              content={
                <>
                  <a href="tel:+393425026728" className="hover:underline underline-offset-2">342 502 6728</a>
                  <br />
                  <a href="https://www.instagram.com/sugar_daddies_civitanova/" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">@sugardaddies</a>
                </>
              }
            />
          </div>

          {/* Services tags */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center gap-3">
              {["Wi-Fi Gratuito", "Carte di Credito", "Pagamento NFC", "Asporto", "Consumazione sul Posto", "Accessibile", "LGBTQ+ Friendly"].map((service) => (
                <span
                  key={service}
                  className="px-4 py-2 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(63, 101, 114, 0.06)",
                    color: "#3f6572",
                    border: "1px solid rgba(63, 101, 114, 0.08)",
                  }}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, content, link, linkText }: { icon: React.ReactNode; title: string; content: React.ReactNode; link?: string; linkText?: string }) {
  return (
    <div
      className="text-center p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(198, 154, 181, 0.1)",
        boxShadow: "0 4px 20px rgba(198, 154, 181, 0.06)",
      }}
    >
      <div
        className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(198, 154, 181, 0.15), rgba(195, 196, 214, 0.15))" }}
      >
        {icon}
      </div>
      <h3 className="font-[Cormorant_Garamond] text-xl font-semibold mb-3" style={{ color: "#3f6572" }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "#71535d" }}>
        {content}
      </p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-xs font-medium underline underline-offset-4 transition-colors duration-300 hover:opacity-70"
          style={{ color: "#c69ab5" }}
        >
          {linkText}
        </a>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-14 border-t" style={{ borderColor: "rgba(198, 154, 181, 0.15)" }}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="font-[Cormorant_Garamond] text-2xl font-semibold" style={{ color: "#3f6572" }}>
              Sugar Daddies
            </p>
            <p className="text-xs mt-1.5 tracking-wide" style={{ color: "#71535d", opacity: 0.5 }}>
              Caffetteria &amp; Pasticceria Artigianale — Civitanova Marche
            </p>
          </div>
          <div className="flex items-center gap-5">
            {[
              { href: "https://www.instagram.com/sugar_daddies_civitanova/", icon: <Instagram size={20} />, label: "Instagram" },
              { href: "tel:+393425026728", icon: <Phone size={20} />, label: "Telefono" },
              { href: "https://maps.app.goo.gl/idETiacGqaM68Zfd9", icon: <MapPin size={20} />, label: "Google Maps" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md"
                style={{
                  background: "linear-gradient(135deg, rgba(198, 154, 181, 0.12), rgba(195, 196, 214, 0.12))",
                  color: "#c69ab5",
                }}
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="text-center mt-10 pt-6" style={{ borderTop: "1px solid rgba(198, 154, 181, 0.1)" }}>
          <p className="text-[11px] tracking-wide" style={{ color: "#71535d", opacity: 0.35 }}>
            © 2024 Sugar Daddies — Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  );
}
