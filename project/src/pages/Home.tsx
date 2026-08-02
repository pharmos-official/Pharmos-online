import { useState } from "react";
import Header from "../components/Header";
import QuickActionBanner from "../components/QuickActionBanner";
import HeroSection from "../components/HeroSection";
import ConsultationServices from "../components/ConsultationServices";
import HomeServices from "../components/HomeServices";
import WhyChoosePharmos from "../components/WhyChoosePharmos";
import SupportSection from "../components/SupportSection";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import ConsultationCarousel from "../components/ConsultationCarousel";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full relative">
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <Header
          onMenuToggle={() => setMenuOpen((v) => !v)}
          menuOpen={menuOpen}
        />

        <main className="pt-16 pb-24">
          <QuickActionBanner />
          <HeroSection openDoctorModal={() => setShowDoctorModal(true)} />
          <ConsultationCarousel />
          <ConsultationServices
            showDoctorModal={showDoctorModal}
            setShowDoctorModal={setShowDoctorModal}
          />
          <HomeServices />
          <WhyChoosePharmos />
          <SupportSection />
        </main>

        <BottomNav active={activeTab} onSelect={setActiveTab} />
      </div>
    </div>
  );
}
