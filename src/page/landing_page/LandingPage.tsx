import type { FC, MouseEvent, CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PaceLogo from "../../assets/pace/f_logo.png";
import HeroStudent from "../../assets/pace/hero_student.png";

import IconUserData from "../../assets/pace/icon_user_data.png";
import IconAnalytics from "../../assets/pace/icon_analytics.png";
import IconLinks from "../../assets/pace/icon_links.png";
import IconEvaluation from "../../assets/pace/icon_evaluation.png";
import HeroBg from "../../assets/pace/hero_bg.png";

const PaceLandingPage: FC = () => {
  const navigate = useNavigate();

  // parallax for hero image / glow
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // parallax for background image
  const [bgParallax, setBgParallax] = useState({ x: 0, y: 0 });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // HERO – mouse-based parallax (student illustration)
  const handleHeroMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const relY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;

    const x = Math.max(-0.5, Math.min(0.5, relX));
    const y = Math.max(-0.4, Math.min(0.4, relY));

    setParallax({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  // BACKGROUND – subtle parallax
  const handleBgMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const relY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;

    setBgParallax({
      x: relX * 10, // medium effect
      y: relY * 10,
    });
  };

  const handleBgLeave = () => {
    setBgParallax({ x: 0, y: 0 });
  };

  // Scroll reveal (once per element)
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

  const featureCards = [
    {
      icon: IconUserData,
      title: "User & Data Management",
      desc: "Monitor student participation, manage user accounts, and visualize metrics in one dashboard.",
    },
    {
      icon: IconAnalytics,
      title: "Result Analytics & Reports",
      desc: "Generate visual summaries and reports that highlight student outcomes, courses, and trends.",
    },
    {
      icon: IconLinks,
      title: "Institution Portal Links",
      desc: "Provide quick access to partner schools and institutions for admissions and inquiries.",
    },
    {
      icon: IconEvaluation,
      title: "Customizable Evaluation Tools",
      desc: "Create assessments based on your programs and track insights with flexible tools.",
    },
  ];

  // Styles for hero parallax
  const heroImageStyle: CSSProperties = {
    transform: `translate3d(${parallax.x * 18}px, ${parallax.y * 12}px, 0)`,
  };

  const heroGlowStyle: CSSProperties = {
    transform: `translate3d(calc(-50% + ${parallax.x * 14}px), ${
      parallax.y * 12
    }px, 0)`,
  };

  return (
    <div className="min-h-screen w-full bg-black font-poppins text-gray-900">
      {/* ================= HERO + NAV ================= */}
      <section
        id="home"
        className="relative overflow-hidden text-white"
        onMouseMove={handleBgMove}
        onMouseLeave={handleBgLeave}
        style={{
          backgroundImage: `url(${HeroBg})`,
          backgroundSize: "110%",
          backgroundPosition: `${50 + bgParallax.x}% ${50 + bgParallax.y}%`,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          transition: "background-position 0.1s linear",
        }}
      >
        {/* dark overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00000040] via-[#00000025] to-[#00000010]" />

        {/* orange bloom light */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,180,50,0.35),transparent_70%)]" />

        {/* extra subtle diagonal highlight */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_18%,transparent_100%)] opacity-20" />

        {/* Background shapes on top of bg image */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hero-shape hero-shape-left bg-gradient-to-br from-[#F9A63A] to-[#D6451C]" />
          <div className="hero-shape hero-shape-right bg-gradient-to-tr from-[#F07A1C] to-[#B92E09]" />
          <div className="hero-glow" style={heroGlowStyle} />
        </div>

        {/* NAVBAR */}
        <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <img src={PaceLogo} alt="PACE Logo" className="h-12 w-auto md:h-14" />

          <nav className="hidden items-center gap-7 text-[11px] font-semibold tracking-wide md:flex">
            <button
              onClick={() => scrollToSection("home")}
              className="nav-link"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="nav-link"
            >
              Platform Features
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="nav-link"
            >
              About Pace
            </button>
            <button
              onClick={() => scrollToSection("mission")}
              className="nav-link"
            >
              Our Mission
            </button>
            <button
              onClick={() => navigate("/login")}
              className="ml-3 rounded-full border border-white/80 px-4 py-1.5 text-[11px] font-semibold shadow-sm transition hover:bg-white hover:text-[#B92E09]"
            >
              Admin Login
            </button>
          </nav>
        </header>

        {/* HERO CONTENT */}
        <div
          className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 pb-16 pt-3 md:flex-row md:items-center md:justify-between md:px-6 md:pb-20"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          {/* Left text */}
          <div
            className="max-w-md space-y-4 md:space-y-5"
            data-animate="fade-right"
          >
            <div className="flex items-center gap-3">
              <img src={PaceLogo} alt="PACE Logo" className="h-14 w-auto" />
              <p className="max-w-[180px] text-[11px] md:text-xs">
                Personalized Academic and Career Exploration
              </p>
            </div>

            <h1 className="text-[30px] font-extrabold leading-tight drop-shadow-md md:text-[36px] lg:text-[38px]">
              Smart Management for
              <br />
              a Smarter Future
            </h1>

            <p className="text-[11px] leading-relaxed opacity-95 md:text-xs">
              Empower your institution with efficient, data-driven tools
              designed to simplify administration, enhance decision-making, and
              build a future where management and innovation work hand in hand.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-1 rounded-full bg-[#D62828] px-7 py-2 text-[11px] font-semibold shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition hover:-translate-y-[2px] hover:bg-[#B71F1F]"
            >
              Get Started
            </button>
          </div>

          {/* Right hero image */}
          <div className="hero-image-wrapper" data-animate="fade-left">
            <img
              src={HeroStudent}
              alt="Student"
              className="hero-image"
              style={heroImageStyle}
            />
          </div>
        </div>
      </section>

      {/* ================= PLATFORM FEATURES ================= */}
      <section
        id="features"
        className="bg-gradient-to-b from-[#F9A63A] via-[#F07A1C] to-[#D6451C] px-4 py-14 md:px-6 md:py-16"
      >
        <div
          className="mx-auto max-w-5xl text-center text-white"
          data-animate="fade-up"
        >
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Platform Features
          </h2>
          <p className="mt-2 text-xs opacity-95 md:text-sm">
            Discover powerful tools designed to make academic and career
            guidance easier, faster, and more meaningful for every user.
          </p>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card, index) => (
            <div
              key={card.title}
              className="feature-card"
              data-animate="fade-up"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="feature-icon-wrapper">
                <img
                  src={card.icon}
                  alt={card.title}
                  className="feature-icon"
                />
              </div>
              <h3 className="mt-3 text-sm font-bold md:text-base">
                {card.title}
              </h3>
              <p className="mt-2 text-[11px] leading-relaxed text-gray-600 md:text-xs">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT PACE ================= */}
      <section
        id="about"
        className="bg-white px-4 py-14 md:px-6 md:py-16"
      >
        <div className="mx-auto max-w-4xl" data-animate="fade-up">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            About Pace
          </h2>
          <p className="mt-4 text-justify text-[11px] leading-relaxed text-gray-700 md:mt-5 md:text-sm">
            PACE (Personal Academic &amp; Career Evaluation) is an innovative
            platform designed to help students discover their ideal academic
            paths and future careers—while giving institutions the tools to
            evaluate, guide, and track learner progress. It combines career
            assessment, data analytics, and institutional insights to build a
            bridge between students&apos; potential and academic opportunities.
          </p>
        </div>
      </section>

      {/* ================= OUR MISSION ================= */}
      <section
        id="mission"
        className="bg-gradient-to-b from-[#FFE08A] via-[#FFC65A] to-[#F9A63A] px-4 py-14 md:px-6 md:py-16"
      >
        <div className="mx-auto max-w-4xl text-center" data-animate="fade-up">
          <h2 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
            Our Mission
          </h2>
          <p className="mt-4 text-[11px] leading-relaxed text-gray-800 md:mt-5 md:text-sm">
            Our mission is to empower every learner to discover their path and
            every institution to guide them with purpose. PACE aims to make
            academic and career exploration accessible, meaningful, and
            data-driven by combining technology, psychology, and education. We
            strive to bridge the gap between potential and opportunity, helping
            students make confident choices while providing schools and
            administrators the tools to support informed, impactful guidance for
            a smarter future.
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#D6451C] py-6 text-center text-xs text-white md:text-sm">
        <p className="font-semibold">PACE - Your Choice, Your Future</p>
        <p className="mt-1 opacity-90">
          © 2025 PACE System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PaceLandingPage;
