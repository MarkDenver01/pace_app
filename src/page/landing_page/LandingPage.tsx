import type { FC } from "react";

import PaceLogo from "../../assets/pace/f_logo.png";
import HeroStudent from "../../assets/pace/hero_student.png";

import IconUserData from "../../assets/pace/icon_user_data.png";
import IconAnalytics from "../../assets/pace/icon_analytics.png";
import IconLinks from "../../assets/pace/icon_links.png";
import IconEvaluation from "../../assets/pace/icon_evaluation.png";

const PaceLandingPage: FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-black text-gray-900">
      {/* HERO + NAV */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-[#ffb347] via-[#ff9035] to-[#f5572f] text-white"
      >
        {/* subtle diagonal overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light">
          <div className="absolute -right-32 -top-32 h-72 w-72 rotate-12 rounded-[60px] bg-[#f54c2f]" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 -rotate-6 rounded-[60px] bg-[#ffb347]" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-4 md:px-6 md:pt-6 lg:pb-24">
          {/* NAVBAR */}
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={PaceLogo}
                alt="PACE Logo"
                className="h-10 w-auto md:h-12"
              />
            </div>

            <nav className="hidden gap-8 text-sm font-semibold md:flex">
              <button
                onClick={() => scrollToSection("home")}
                className="transition hover:text-yellow-200"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="transition hover:text-yellow-200"
              >
                Platform Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="transition hover:text-yellow-200"
              >
                About Pace
              </button>
              <button
                onClick={() => scrollToSection("mission")}
                className="transition hover:text-yellow-200"
              >
                Our Mission
              </button>
            </nav>
          </header>

          {/* HERO CONTENT */}
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">
            {/* Left text */}
            <div className="max-w-xl space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src={PaceLogo}
                  alt="PACE Logo"
                  className="h-12 w-auto md:h-16"
                />
                <p className="max-w-xs text-xs md:text-sm">
                  Personalized Academic and Career Exploration
                </p>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
                Smart Management for
                <br />
                a Smarter Future
              </h1>

              <p className="text-sm leading-relaxed md:text-base md:leading-relaxed">
                Empower your institution with efficient, data-driven tools
                designed to simplify administration, enhance decision-making,
                and build a future where management and innovation work hand in
                hand.
              </p>

              <button
                className="mt-4 rounded-full bg-[#d62828] px-8 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#b71f1f]"
                onClick={() => scrollToSection("features")}
              >
                Get Started
              </button>
            </div>

            {/* Right hero illustration */}
            <div className="flex justify-center md:justify-end">
              <img
                src={HeroStudent}
                alt="Student using tablet"
                className="h-64 w-auto drop-shadow-2xl md:h-80 lg:h-[22rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section
        id="features"
        className="bg-[#ffb347] bg-gradient-to-b from-[#ffb347] via-[#ff9c2f] to-[#ff7a2f] py-12 md:py-16"
      >
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="text-center text-white">
            <h2 className="text-2xl font-extrabold md:text-3xl">
              Platform Features
            </h2>
            <p className="mt-2 text-sm md:text-base">
              Discover powerful tools designed to make academic and career
              guidance easier, faster, and more meaningful for every user.
            </p>
          </div>

          {/* Feature cards */}
          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="flex flex-col items-center rounded-2xl bg-white px-5 py-7 text-center shadow-lg">
              <img
                src={IconUserData}
                alt="User & Data Management"
                className="mb-4 h-14 w-14 object-contain"
              />
              <h3 className="text-sm font-bold md:text-base">
                User &amp; Data Management
              </h3>
              <p className="mt-2 text-xs text-gray-600 md:text-sm">
                Monitor student participation, manage user accounts, and
                visualize key metrics in one intuitive dashboard.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center rounded-2xl bg-white px-5 py-7 text-center shadow-lg">
              <img
                src={IconAnalytics}
                alt="Result Analytics & Reports"
                className="mb-4 h-14 w-14 object-contain"
              />
              <h3 className="text-sm font-bold md:text-base">
                Result Analytics &amp; Reports
              </h3>
              <p className="mt-2 text-xs text-gray-600 md:text-sm">
                Generate visual summaries and reports that highlight student
                outcomes, courses, and trends.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center rounded-2xl bg-white px-5 py-7 text-center shadow-lg">
              <img
                src={IconLinks}
                alt="Institution Portal Links"
                className="mb-4 h-14 w-14 object-contain"
              />
              <h3 className="text-sm font-bold md:text-base">
                Institution Portal Links
              </h3>
              <p className="mt-2 text-xs text-gray-600 md:text-sm">
                Provide quick access to partner schools and institutions for
                admissions and inquiries.
              </p>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col items-center rounded-2xl bg-white px-5 py-7 text-center shadow-lg">
              <img
                src={IconEvaluation}
                alt="Customizable Evaluation Tools"
                className="mb-4 h-14 w-14 object-contain"
              />
              <h3 className="text-sm font-bold md:text-base">
                Customizable Evaluation Tools
              </h3>
              <p className="mt-2 text-xs text-gray-600 md:text-sm">
                Create assessments based on your programs and track insights
                easily with flexible evaluation tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT PACE */}
      <section id="about" className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            About Pace
          </h2>
          <p className="mt-4 text-justify text-sm leading-relaxed text-gray-700 md:text-base">
            PACE (Personal Academic &amp; Career Evaluation) is an innovative
            platform designed to help students discover their ideal academic
            paths and future careers — while giving institutions the tools to
            evaluate, guide, and track learner progress. It combines career
            assessment, data analytics, and institutional insights to build a
            bridge between students&apos; potential and academic opportunities.
          </p>
        </div>
      </section>

      {/* OUR MISSION */}
      <section
        id="mission"
        className="bg-gradient-to-b from-[#ffe9a3] via-[#ffd66b] to-[#ffb347] py-12 md:py-16"
      >
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
            Our Mission
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-800 md:text-base">
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

      {/* FOOTER */}
      <footer className="bg-[#f5572f] py-6 text-center text-sm text-white">
        <p className="font-semibold">PACE - Your Choice, Your Future</p>
        <p className="mt-1 text-xs opacity-90">
          © 2025 PACE System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PaceLandingPage;
