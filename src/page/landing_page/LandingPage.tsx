import type { FC, MouseEvent, CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PaceLogo from "../../assets/pace/transpa_logo.png";
import HeroStudent from "../../assets/pace/hero_student.png";

import IconUserData from "../../assets/pace/icon_user_data.png";
import IconAnalytics from "../../assets/pace/icon_analytics.png";
import IconLinks from "../../assets/pace/icon_links.png";
import IconEvaluation from "../../assets/pace/icon_evaluation.png";
import HeroBg from "../../assets/app-bg.jpg";

const PaceLandingPage: FC = () => {
  const navigate = useNavigate();
  const { universityId } = useParams(); // dynamic from deep link

  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [bgParallax, setBgParallax] = useState({ x: 0, y: 0 });

  /** --------------------------------------------------
   *  HANDLE GET STARTED
   * --------------------------------------------------*/
  const handleGetStarted = () => {
    if (universityId) {
      // store so login can use it
      localStorage.setItem("selectedUniversityId", universityId);
      navigate(`/login/university/${universityId}`);
    } else {
      navigate("/login");
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const relY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;

    setParallax({
      x: Math.max(-0.5, Math.min(0.5, relX)),
      y: Math.max(-0.4, Math.min(0.4, relY)),
    });
  };

  const heroImageStyle: CSSProperties = {
    transform: `translate3d(${parallax.x * 18}px, ${parallax.y * 12}px, 0)`,
  };

  /** --------------------------------------------------
   * SCROLL REVEAL ANIMATION
   * --------------------------------------------------*/
  useEffect(() => {
    const animated = document.querySelectorAll<HTMLElement>("[data-animate]");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    animated.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /** --------------------------------------------------
   * FEATURE CARDS
   * --------------------------------------------------*/
  const featureCards = [
    {
      icon: IconUserData,
      title: "User & Data Management",
      desc: "Monitor student participation and visualize key metrics from one intelligent dashboard.",
    },
    {
      icon: IconAnalytics,
      title: "Result Analytics",
      desc: "Generate smart summaries and reports that highlight outcomes, performance, and trends.",
    },
    {
      icon: IconLinks,
      title: "Institution Links",
      desc: "Provide quick access to partner schools and portals for admissions and inquiries.",
    },
    {
      icon: IconEvaluation,
      title: "Evaluation Tools",
      desc: "Design customized assessments and track engagement with flexible evaluation tools.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-black font-poppins text-gray-900">
      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: `url(${HeroBg})`,
          backgroundSize: "cover",
          backgroundPosition: `${50 + bgParallax.x}% ${50 + bgParallax.y}%`,
          transition: "background-position 0.1s linear",
        }}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
          const relY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
          setBgParallax({ x: relX * 10, y: relY * 10 });
        }}
        onMouseLeave={() => setBgParallax({ x: 0, y: 0 })}
      >
        {/* overlays */}
        <div className="pointer-events-none absolute inset-0 bg-black/18 backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(249,115,22,0.5),transparent_60%)] opacity-80" />

        {/* NAVBAR */}
        <header className="relative z-20 mx-auto flex w-full max-w-6xl justify-end px-4 py-4 md:px-6 text-[14px] font-semibold">
          <nav className="hidden md:flex gap-10 tracking-wide">
            <button onClick={() => scrollToSection("home")} className="nav-link">
              Home
            </button>
            <button onClick={() => scrollToSection("features")} className="nav-link">
              Platform Features
            </button>
            <button onClick={() => scrollToSection("about")} className="nav-link">
              About Pace
            </button>
            <button onClick={() => scrollToSection("mission")} className="nav-link">
              Our Mission
            </button>
          </nav>
        </header>

        {/* HERO CONTENT */}
        <div
          className="relative z-20 mx-auto flex w-full max-w-6xl flex-col-reverse md:flex-row items-center gap-10 px-4 pb-20 pt-10 md:pt-16"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => setParallax({ x: 0, y: 0 })}
        >
          {/* LEFT CONTENT */}
          <div
            className="md:flex-1 max-w-xl rounded-3xl bg-black/30 px-5 py-6 md:px-7 md:py-7 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-md border border-white/10"
            data-animate="fade-right"
          >
            <div className="flex justify-center mb-4">
              <img
                src={PaceLogo}
                alt="PACE Logo"
                className="h-[260px] md:h-[340px] lg:h-[420px] w-auto drop-shadow-2xl"
              />
            </div>

            <h1 className="text-[38px] md:text-[50px] font-extrabold leading-tight drop-shadow-2xl">
              Smart Management
              <br />
              for a Smarter Future
            </h1>

            <p className="mt-4 text-[15px] md:text-[17px] leading-relaxed text-white/90">
              Empower your institution with efficient, data-driven tools...
            </p>

            {/* START BUTTON */}
            <button
              onClick={handleGetStarted}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#F97316] px-10 py-3 text-[14px] md:text-[15px] font-semibold shadow-xl hover:bg-[#EA580C] hover:-translate-y-[2px] transition"
            >
              Get Started
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="md:flex-1 flex items-center justify-center" data-animate="fade-left">
            <div className="hero-image-wrapper relative">
              <div className="pointer-events-none absolute inset-auto bottom-0 w-[260px] h-[260px] md:w-[320px] md:h-[320px] translate-y-8 translate-x-4 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.9),transparent_60%)] opacity-70 blur-3xl" />
              <img
                src={HeroStudent}
                alt="Student"
                className="hero-image relative"
                style={heroImageStyle}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="relative px-4 py-16 md:px-6 md:py-20 bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#C2410C]"
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

        <div className="relative mx-auto max-w-5xl" data-animate="fade-up">
          <div className="rounded-3xl bg-black/20 px-6 py-8 md:px-10 md:py-10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] border border-white/15">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">
              Platform Features
            </h2>
            <p className="mt-3 text-center text-[14px] md:text-[15px] text-white/90 max-w-2xl mx-auto">
              Discover how PACE streamlines academic and career exploration...
            </p>

            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4">
              {featureCards.map((card, i) => (
                <div
                  key={card.title}
                  className="feature-card"
                  data-animate="fade-up"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="feature-icon-wrapper">
                    <img src={card.icon} alt={card.title} className="feature-icon" />
                  </div>
                  <h3 className="mt-3 font-bold text-[15px] md:text-[16px] text-gray-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[12px] md:text-[13px] text-gray-700 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="relative px-4 py-16 md:px-6 md:py-20 bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(249,115,22,0.22),transparent_55%)] opacity-80" />

        <div
          className="relative mx-auto max-w-4xl rounded-3xl bg-white/5 px-6 py-8 md:px-10 md:py-10 shadow-[0_18px_40px_rgba(0,0,0,0.55)] border border-white/10 text-white"
          data-animate="fade-up"
        >
          <h2 className="text-center text-3xl md:text-4xl font-extrabold">
            About PACE
          </h2>
          <p className="mt-4 text-[14px] md:text-[16px] leading-relaxed text-white/90 text-justify">
            PACE (Personal Academic & Career Evaluation) is an innovative platform designed to help students discover their ideal academic paths and future careers — while giving institutions the tools to evaluate, guide, and track learner progress.
            It combines career assessment, data analytics, and institutional insights to build a bridge between students’ potential and academic opportunities.
          </p>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section
        id="mission"
        className="relative px-4 py-16 md:px-6 md:py-20 bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#C2410C]"
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

        <div
          className="relative mx-auto max-w-4xl rounded-3xl bg-white/92 px-6 py-8 md:px-10 md:py-10 shadow-[0_18px_40px_rgba(0,0,0,0.55)] border border-orange-200"
          data-animate="fade-up"
        >
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900">
            Our Mission
          </h2>
          <p className="mt-4 text-[14px] md:text-[16px] leading-relaxed text-gray-800 text-justify">
            Our mission is to empower every learner to discover their path and every institution to guide them with purpose. 
            PACE aims to make academic and career exploration accessible, meaningful, and data-driven by combining technology, psychology, and education. We strive to bridge the gap between potential and opportunity, helping students make confident choices while providing schools and administrators the tools to support informed, impactful guidance for a smarter future.
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#111827] border-t border-white/5 py-6 text-center text-white text-[12px] md:text-[14px]">
        <p className="font-semibold">PACE - Your Choice, Your Future</p>
        <p className="mt-1 opacity-80">© 2025 PACE System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PaceLandingPage;
