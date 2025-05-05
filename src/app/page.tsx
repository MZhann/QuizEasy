import { HeroSection } from "@/components/page-components/landing-page/hero-section";
import { FeaturesSection } from "@/components/page-components/landing-page/features-section";
import { HowItWorksSection } from "@/components/page-components/landing-page/how-it-works-section";
import { CTASection } from "@/components/page-components/landing-page/cta-section";
import { Navbar } from "@/components/page-components/landing-page/navbar";
import { Footer } from "@/components/page-components/landing-page/footer";
import { StepsCarouselSection } from "@/components/page-components/landing-page/steps-carousel-section";
import { LogosScroller, Logo } from "@/components/page-components/landing-page/scroller-logos";


const logos: Logo[] = [
  { src: "/assets/images/decoration/logo.jpg", alt: "logo", width: 120, height: 120 },
  { src: "/assets/images/decoration/sdu.svg", alt: "logo", width: 120, height: 120 },
  { src: "/assets/images/decoration/logo.jpg", alt: "logo", width: 120, height: 120 },
  { src: "/assets/images/decoration/sdu.svg", alt: "logo", width: 120, height: 120 },
  { src: "/assets/images/decoration/logo.jpg", alt: "logo", width: 120, height: 120 },
  { src: "/assets/images/decoration/sdu.svg", alt: "logo", width: 120, height: 120 },
  { src: "/assets/images/decoration/logo.jpg", alt: "logo", width: 120, height: 120 },
  { src: "/assets/images/decoration/sdu.svg", alt: "logo", width: 120, height: 120 },
  { src: "/assets/images/decoration/logo.jpg", alt: "logo", width: 120, height: 120 },
  { src: "/assets/images/decoration/sdu.svg", alt: "logo", width: 120, height: 120 },
];


export default function Page() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-32 px-6 py-16 md:px-16 lg:px-32 bg-gray-50">
        <HeroSection id="hero" />
        <LogosScroller logos={logos} duration={15} gapPx={24} />
        <FeaturesSection id="features" />
        <HowItWorksSection id="why-us" />
        <StepsCarouselSection id="how-it-works" />
        <CTASection id="cta" />
      </main>
      <Footer />
    </>
  );
}
