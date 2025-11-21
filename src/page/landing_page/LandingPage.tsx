import type { FC } from "react";

import PaceLogo from "../../assets/pace/f_logo.png";
import HeroStudent from "../../assets/pace/hero_student.png";

import IconUserData from "../../assets/pace/icon_user_data.png";
import IconAnalytics from "../../assets/pace/icon_analytics.png";
import IconLinks from "../../assets/pace/icon_links.png";
import IconEvaluation from "../../assets/pace/icon_evaluation.png";

const PaceLandingPage: FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-white font-poppins text-gray-900">
      {/* ------------------------ HERO + NAV ------------------------ */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-[#FFD08A] via-[#FF932E] to-[#F95329] text-white pb-16"
      >
        {/* ORANGE overlay pattern */}
        <div className="absolute inset-0 opacity-[0.22] bg-[url('/patterns/orange-pattern.png')] bg-cover bg-center pointer-events-none"></div>

        {/* NAVBAR */}
        <header className="relative z-20 mx-auto max-w-6xl flex items-center justify-between px-4 py-4 md:px-6">
          <img src={PaceLogo} alt="PACE Logo" className="h-12 w-auto" />

          <nav className="hidden md:flex gap-8 text-sm font-semibold tracking-wide">
            <button
              onClick={() => scrollToSection("home")}
              className="hover:text-yellow-100 transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-yellow-100 transition"
            >
              Platform Features
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-yellow-100 transition"
            >
              About Pace
            </button>
            <button
              onClick={() => scrollToSection("mission")}
              className="hover:text-yellow-100 transition"
            >
              Our Mission
            </button>
          </nav>
        </header>

        {/* HERO CONTENT */}
        <div className="relative z-20 mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between px-4 md:px-6 mt-4 md:mt-10">
          {/* Text */}
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-3">
              <img src={PaceLogo} alt="PACE Logo" className="h-14" />
              <p className="text-sm opacity-90">
                Personalized Academic and Career Exploration
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Smart Management for
              <br />
              a Smarter Future
            </h1>

            <p className="text-sm md:text-base opacity-95 leading-relaxed">
              Empower your institution with efficient, data-driven tools
              designed to simplify administration, enhance decision-making,
              and build a future where management and innovation work hand in
              hand.
            </p>

            <button
              onClick={() => scrollToSection("features")}
              className="bg-[#D62828] hover:bg-[#B71F1F] px-8 py-3 rounded-full text-sm font-semibold transition shadow-md"
            >
              Get Started
            </button>
          </div>

          {/* Hero Image */}
          <img
            src={HeroStudent}
            alt="Student Illustration"
            className="h-[280px] md:h-[360px] lg:h-[400px] drop-shadow-2xl mt-8 md:mt-0"
          />
        </div>
      </section>

      {/* ------------------------ FEATURES SECTION ------------------------ */}
      <section
        id="features"
        className="bg-gradient-to-b from-[#FFB347] via-[#FF9D34] to-[#FF7A2F] py-16 px-4 md:px-6"
      >
        <div className="mx-auto max-w-6xl text-center text-white mb-10">
          <h2 className="text-3xl font-extrabold">Platform Features</h2>
          <p className="mt-2 text-sm md:text-base opacity-90">
            Discover powerful tools designed to make academic and career
            guidance easier, faster, and more meaningful for every user.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD */}
          {[ 
            {
              icon: IconUserData,
              title: "User & Data Management",
              desc: "Monitor student participation, manage accounts, and view analytics in one dashboard."
            },
            {
              icon: IconAnalytics,
              title: "Result Analytics & Reports",
              desc: "Generate visual summaries and insightful reports of student outcomes."
            },
            {
              icon: IconLinks,
              title: "Institution Portal Links",
              desc: "Instant access to partner schools and institutions for admissions."
            },
            {
              icon: IconEvaluation,
              title: "Customizable Evaluation Tools",
              desc: "Create assessments based on programs and track insights efficiently."
            }
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white text-gray-800 rounded-2xl shadow-xl px-6 py-8 text-center hover:scale-[1.03] transition transform"
            >
              <img
                src={card.icon}
                alt={card.title}
                className="h-16 mx-auto mb-4"
              />
              <h3 className="font-bold text-base">{card.title}</h3>
              <p className="text-sm mt-2 opacity-80 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------ ABOUT SECTION ------------------------ */}
      <section id="about" className="py-16 px-4 md:px-6 bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            About Pace
          </h2>
          <p className="mt-5 text-sm md:text-base text-gray-700 leading-relaxed text-justify">
            PACE (Personal Academic & Career Evaluation) is an innovative
            platform designed to help students discover their ideal academic
            paths and future careers while providing institutions with the tools
            to guide and track learner development. PACE connects assessments,
            analytics, and institutional insights to bridge the gap between
            student potential and academic opportunities.
          </p>
        </div>
      </section>

      {/* ------------------------ MISSION SECTION ------------------------ */}
      <section
        id="mission"
        className="py-16 px-4 md:px-6 bg-gradient-to-b from-[#FFE8A3] via-[#FFD46B] to-[#FFB347]"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Our Mission</h2>
          <p className="mt-5 text-sm md:text-base text-gray-800 leading-relaxed">
            Our mission is to empower learners to discover their path and
            institutions to guide them with purpose. By combining analytics,
            psychology, and technology, PACE helps students make confident
            decisions while equipping schools with tools for impactful,
            data-driven guidance.
          </p>
        </div>
      </section>

      {/* ------------------------ FOOTER ------------------------ */}
      <footer className="bg-[#F5572F] py-6 text-center text-white text-sm">
        <p className="font-semibold">PACE – Your Choice, Your Future</p>
        <p className="mt-1 text-xs opacity-90">
          © 2025 PACE System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PaceLandingPage;
