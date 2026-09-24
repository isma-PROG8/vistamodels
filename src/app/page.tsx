import { Header } from "@/components/studio/header";
import { Hero } from "@/components/studio/hero";
import { HowItWorks } from "@/components/studio/how-it-works";
import { ModelsShowcase } from "@/components/studio/models-showcase";
import { Studio } from "@/components/studio/studio";
import { Footer } from "@/components/studio/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <ModelsShowcase />
        <Studio />
      </main>
      <Footer />
    </div>
  );
}
