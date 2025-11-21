import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PaceLogo from "../../assets/pace/f_logo.png";
import HeroStudent from "../../assets/pace/hero_student.png";

import IconUserData from "../../assets/pace/icon_user_data.png";
import IconAnalytics from "../../assets/pace/icon_analytics.png";
import IconLinks from "../../assets/pace/icon_links.png";
import IconEvaluation from "../../assets/pace/icon_evaluation.png";

const PaceLandingPage: FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // === Scroll reveal animation ===
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
      { threshold: 0.2 }
    );

    animated.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const featureCards = [
    {
      icon: IconUserData,
      title: "User & Data Management",
      desc: "Monitor student participation, manage user accounts, and visualize metrics in one dashboard."
    },
    {
      icon: IconAnalytics,
      title: "Result Analytics & Reports",
      desc: "Generate visual summaries and reports that highlight student outcomes, courses, and trends."
    },
    {
      icon: IconLinks,
      title: "Institution Portal Links",
      desc: "Provide quick access to partner schools and institutions for admissions and inquiries."
    },
    {
      icon: IconEvaluation,
      title: "Customizable Evaluation Tools",
      desc: "Create assessments based on your programs and track insights with flexible tools."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-white font-poppins text-gray-900">
      {/* ================= HERO + NAV ================= */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br 
        from-[#FDB254] via-[#F2711C] to-[#B92E09] text-white"
      >
        {/* Background shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-32 -top-24 h-64 w-64 rotate-[-18deg]
          bg-gradient-to-br from-[#F9A63A] to-[#D6451C] opacity-70"
          />

          <div
            className="absolute -right-40 top-10 h-96 w-96 rotate-[-28deg]
          bg-gradient-to-tr from-[#F07A1C] to-[#B92E09] opacity-85"
          />

          <div
            className="absolute -bottom-32 left-1/2 h-72 w-72
          -translate-x-1/2 rounded-full bg-[#FFD56A]/40 blur-2xl"
          />
        </div>

        {/* NAVBAR */}
        <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <img src={PaceLogo} alt="PACE Logo" className="h-12 md:h-14" />

          <nav className="hidden gap-8 text-xs font-semibold tracking-wide md:flex">
            <button onClick={() => scrollToSection("home")} className="nav-link">
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="nav-link"
            >
              Platform Features
            </button>
            <button onClick={() => scrollToSection("about")} className="nav-link">
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
              className="ml-3 rounded-full border border-white/80 px-4 py-1.5 text-xs font-semibold hover:bg-white hover:text-[#B92E09] transition"
            >
              Admin Login
            </button>
          </nav>
        </header>

        {/* HERO CONTENT */}
        <div className="relative z-20 mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-20 pt-8 md:flex-row md:items-center md:justify-between md:px-6 md:pb-24">
          {/* Hero Text */}
          <div className="max-w-xl space-y-6" data-animate="fade-right">
            <div className="flex items-center gap-3">
              <img src={PaceLogo} className="h-14" />
              <p className="text-xs md:text-sm">
                Personalized Academic and Career Exploration
              </p>
            </div>

            <h1 className="text-[34px] font-extrabold leading-tight drop-shadow-md md:text-[42px] lg:text-[46px]">
              Smart Management for
              <br />
              a Smarter Future
            </h1>

            <p className="text-xs leading-relaxed opacity-95 md:text-sm">
              Empower your institution with efficient, data-driven tools that
              simplify administration, enhance decision-making, and build a
              future where management and innovation work hand in hand.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-[#D62828] px-8 py-2.5 text-xs font-semibold transition hover:bg-[#B71F1F] shadow-[0_8px_18px_rgba(0,0,0,0.35)] hover:-translate-y-[2px]"
            >
              Get Started
            </button>
          </div>

          {/* Hero Image */}
          <div className="hero-image-wrapper" data-animate="fade-left">
            <img src={HeroStudent} alt="Student" className="hero-image" />
          </div>
        </div>
      </section>

      {/* ================= PLATFORM FEATURES ================= */}
      <section
        id="features"
        className="bg-gradient-to-b 
      from-[#F9A63A] via-[#F07A1C] to-[#D6451C] px-4 py-16 md:px-6"
      >
        <div
          className="mx-auto max-w-6xl text-center text-white"
          data-animate="fade-up"
        >
          <h2 className="text-3xl font-extrabold">Platform Features</h2>
          <p className="mt-2 text-sm opacity-90">
            Tools designed to make academic & career guidance easier, faster,
            and meaningful.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card, i) => (
            <div
              key={i}
              className="feature-card"
              data-animate="fade-up"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img src={card.icon} className="h-16 mx-auto mb-4" />
              <h3 className="font-semibold text-base">{card.title}</h3>
              <p className="mt-2 text-xs text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="px-4 py-16 md:px-6 bg-white">
        <div className="mx-auto max-w-4xl text-center" data-animate="fade-up">
          <h2 className="text-3xl font-extrabold text-gray-900">About Pace</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-700 text-justify">
            PACE is an innovative platform that helps learners discover academic
            paths and careers while giving institutions powerful analytics,
            evaluation tools, and management features to guide and support
            students through their educational journey.
          </p>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section
        id="mission"
        className="px-4 py-16 md:px-6 bg-gradient-to-b 
      from-[#FFE08A] via-[#FFC65A] to-[#F9A63A]"
      >
        <div className="mx-auto max-w-4xl text-center" data-animate="fade-up">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Our Mission
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-800">
            Our mission is to empower learners to discover their path while
            giving institutions the tools to provide meaningful, data-driven
            guidance through technology, analytics, and innovation.
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#D6451C] py-6 text-center text-white text-sm">
        <p className="font-semibold">PACE - Your Choice, Your Future</p>
        <p className="mt-1 text-xs opacity-90">
          © 2025 PACE System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PaceLandingPage;
