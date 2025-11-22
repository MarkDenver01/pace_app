import type { FC, MouseEvent, CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PaceLogo from "../../assets/pace/f_logo.png";
import HeroStudent from "../../assets/pace/hero_student.png";

import IconUserData from "../../assets/pace/icon_user_data.png";
import IconAnalytics from "../../assets/pace/icon_analytics.png";
import IconLinks from "../../assets/pace/icon_links.png";
import IconEvaluation from "../../assets/pace/icon_evaluation.png";
import HeroBg from "../../assets/app-bg.jpg";

const PaceLandingPage: FC = () => {
  const navigate = useNavigate();

  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [bgParallax, setBgParallax] = useState({ x: 0, y: 0 });

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

  return (
    <div className="min-h-screen w-full bg-black font-poppins text-gray-900">
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: `url(${HeroBg})`,
          backgroundSize: "110%",
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
        {/* NAVBAR WITHOUT LOGO */}
        <header className="relative z-20 mx-auto flex w-full max-w-6xl justify-end px-4 py-4 md:px-6 text-sm font-semibold">
          <nav className="hidden md:flex gap-8">
            <button onClick={() => scrollToSection("home")} className="nav-link">Home</button>
            <button onClick={() => scrollToSection("features")} className="nav-link">Platform Features</button>
            <button onClick={() => scrollToSection("about")} className="nav-link">About Pace</button>
            <button onClick={() => scrollToSection("mission")} className="nav-link">Our Mission</button>
          </nav>
        </header>

        {/* HERO CONTENT */}
        <div
          className="relative z-20 mx-auto flex w-full max-w-6xl flex-col md:flex-row items-center justify-between px-4 pb-16 pt-6 md:pt-10"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => setParallax({ x: 0, y: 0 })}
        >
          {/* LEFT HERO CONTENT (Centered logo + title) */}
          <div className="max-w-lg text-left md:pr-10" data-animate="fade-right">
            
            {/* BIG CENTER LOGO ABOVE TITLE */}
            <div className="flex justify-start mb-4">
              <img
                src={PaceLogo}
                alt="PACE Logo"
                className="h-24 w-auto md:h-28 drop-shadow-xl"
              />
            </div>

            {/* Removed subtitle completely */}

            <h1 className="text-[32px] md:text-[40px] font-extrabold leading-tight drop-shadow-lg">
              Smart Management for  
              <br />
              a Smarter Future
            </h1>

            <p className="mt-3 text-[12px] md:text-sm leading-relaxed opacity-95">
              Empower your institution with efficient, data-driven tools designed to simplify 
              administration, enhance decision-making, and build a future where management and 
              innovation work hand in hand.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-4 rounded-full bg-[#D62828] px-8 py-2.5 text-[12px] font-semibold shadow-lg hover:bg-[#B71F1F] transition"
            >
              Get Started
            </button>
          </div>

          {/* RIGHT ILLUSTRATION */}
          <div className="mt-10 md:mt-0 hero-image-wrapper" data-animate="fade-left">
            <img
              src={HeroStudent}
              alt="Student"
              className="hero-image"
              style={heroImageStyle}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="bg-gradient-to-b from-[#F9A63A] via-[#F07A1C] to-[#D6451C] px-4 py-14 md:px-6 md:py-16"
      >
        <div className="mx-auto max-w-5xl text-center text-white" data-animate="fade-up">
          <h2 className="text-2xl font-extrabold md:text-3xl">Platform Features</h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: IconUserData,
              title: "User & Data Management",
              desc: "Monitor student participation and visualize metrics.",
            },
            {
              icon: IconAnalytics,
              title: "Result Analytics",
              desc: "Generate reports highlighting outcomes and trends.",
            },
            {
              icon: IconLinks,
              title: "Institution Links",
              desc: "Provide quick access to partner schools.",
            },
            {
              icon: IconEvaluation,
              title: "Evaluation Tools",
              desc: "Create assessments based on your programs.",
            },
          ].map((card, i) => (
            <div
              key={card.title}
              className="feature-card"
              data-animate="fade-up"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="feature-icon-wrapper">
                <img src={card.icon} alt={card.title} className="feature-icon" />
              </div>
              <h3 className="mt-3 font-bold text-sm md:text-base">{card.title}</h3>
              <p className="mt-2 text-[11px] md:text-xs text-gray-700 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-white px-4 py-14 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl" data-animate="fade-up">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-gray-900">
            About Pace
          </h2>
          <p className="mt-4 text-[12px] md:text-sm text-gray-700 leading-relaxed text-justify">
            PACE (Personal Academic & Career Evaluation) helps students discover their ideal
            academic paths and careers while giving institutions tools for guidance and tracking 
            progress.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="bg-gradient-to-b from-[#FFE08A] via-[#FFC65A] to-[#F9A63A] px-4 py-14 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl text-center" data-animate="fade-up">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-[12px] md:text-sm leading-relaxed text-gray-800">
            Our mission is to empower every learner and institution with meaningful, 
            data-driven academic and career insights.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#D6451C] py-6 text-center text-white text-xs md:text-sm">
        <p className="font-semibold">PACE - Your Choice, Your Future</p>
        <p className="mt-1 opacity-90">© 2025 PACE System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PaceLandingPage;
