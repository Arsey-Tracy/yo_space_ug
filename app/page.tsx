import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <FeaturesSection />
                <HowItWorksSection />
                <PricingSection />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}