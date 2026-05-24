import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContestDetails from "@/components/ContestDetails";
import PrizeSection from "@/components/PrizeSection";
import HowItWorks from "@/components/HowItWorks";
import AmbassadorTeaser from "@/components/AmbassadorTeaser";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ContestDetails />
        <PrizeSection />
        <HowItWorks />
        <AmbassadorTeaser />
      </main>
      <Footer />
      <WhatsAppBanner />
    </>
  );
}
