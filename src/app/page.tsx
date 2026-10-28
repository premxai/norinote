import { DemoProvider } from "@/components/demo";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { MidCta } from "@/components/mid-cta";
import { Proof } from "@/components/proof";
import { DailyRounds } from "@/components/daily-rounds";
import { ContextCards } from "@/components/context-cards";
import { Channels } from "@/components/channels";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <DemoProvider>
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <MidCta />
        <Proof />
        <DailyRounds />
        <ContextCards />
        <Channels />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </DemoProvider>
  );
}
