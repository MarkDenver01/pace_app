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
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Simple scroll-reveal animation using IntersectionObserver
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-animate]");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // animate once only
          }
        });
      },
      { threshold: 0.18 }
    );

    elements.forEach(el => observer.observe(el));

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
        className="relative overflow-hidden bg-gradient-to-br from-[#FFD08A] via-[#FF922E] to-[#F85329] text-white"
      >
        {/* Decorative shapes / glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-24 h-64 w-64 rotate-[-18deg] bg-gradient-to-br from-[#FFB347] to-[#FF7A2F] opacity-70" />
          <div className="absolute -right-40 top-10 h-96 w-96 rotate-[-28deg] bg-gradient-to-tr from-[#FF7A2F] to-[#F5532D] opacity-85" />
          <div className="absolute -bottom-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FFE49A]/40 blur-2xl" />
        </div>

        {/* NAVBAR */}
        <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <img src={PaceLogo} alt="PACE Logo" className="h-12 w-auto md:h-14" />

          <nav className="hidden items-center gap-8 text-xs font-semibold tracking-wide md:flex">
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

            {/* Login button (small, top-right) */}
            <button
              onClick={() => navigate("/login")}
              className="ml-4 rounded-full border border-white/70 px-4 py-1.5 text-xs font-semibold shadow-sm transition hover:bg-white hover:text-[#F5532D]"
            >
              Admin Login
            </button>
          </nav>
        </header>

        {/* HERO CONTENT */}
        <div className="relative z-20 mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-4 md:flex-row md:items-center md:justify-between md:px-6 md:pb-20 md:pt-6">
          {/* Left text */}
          <div
            className="max-w-xl space-y-5 md:space-y-6"
            data-animate="fade-right"
          >
            <div className="flex items-center gap-3">
              <img src={PaceLogo} alt="PACE Logo" className="h-14 w-auto" />
              <p className="max-w-xs text-xs md:text-sm">
                Personalized Academic and Career Exploration
              </p>
            </div>

            <h1 className="text-[32px] font-extrabold leading-tight drop-shadow-lg md:text-[40px] lg:text-[44px]">
              Smart Management for
              <br />
              a Smarter Future
            </h1>

            <p className="text-xs leading-relaxed opacity-95 md:text-sm md:leading-relaxed">
              Empower your institution with efficient, data-driven tools
              designed to simplify administration, enhance decision-making, and
              build a future where management and innovation work hand in hand.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/login")}
                className="rounded-full bg-[#D62828] px-8 py-2.5 text-xs font-semibold shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition hover:-translate-y-[2px] hover:bg-[#B71F1F]"
              >
                Get Started
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-xs font-semibold underline-offset-4 hover:underline"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Right image */}
          <div
            className="hero-image-wrapper"
            data-animate="fade-left"
          >
            <img
              src={HeroStudent}
              alt="Student using tablet"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* ================= PLATFORM FEATURES ================= */}
      <section
        id="features"
        className="bg-gradient-to-b from-[#FFB347] via-[#FF9D34] to-[#FF7A2F] px-4 py-14 md:px-6 md:py-16"
      >
        <div
          className="mx-auto max-w-6xl text-center text-white"
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

        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card, index) => (
            <div
              key={card.title}
              className="feature-card"
              data-animate="fade-up"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <img
                src={card.icon}
                alt={card.title}
                className="mx-auto mb-4 h-16 w-16 object-contain"
              />
              <h3 className="text-sm font-bold md:text-base">{card.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-600 md:text-sm">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT PACE ================= */}
      <section id="about" className="bg-white px-4 py-14 md:px-6 md:py-16">
        <div
          className="mx-auto max-w-4xl"
          data-animate="fade-up"
        >
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            About Pace
          </h2>
          <p className="mt-4 text-justify text-xs leading-relaxed text-gray-700 md:mt-5 md:text-sm md:leading-relaxed">
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
        className="bg-gradient-to-b from-[#FFE8A3] via-[#FFD46B] to-[#FFB347] px-4 py-14 md:px-6 md:py-16"
      >
        <div
          className="mx-auto max-w-4xl text-center"
          data-animate="fade-up"
        >
          <h2 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
            Our Mission
          </h2>
          <p className="mt-4 text-xs leading-relaxed text-gray-800 md:mt-5 md:text-sm md:leading-relaxed">
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
      <footer className="bg-[#F5572F] py-6 text-center text-xs text-white md:text-sm">
        <p className="font-semibold">PACE - Your Choice, Your Future</p>
        <p className="mt-1 opacity-90">
          © 2025 PACE System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PaceLandingPage;
