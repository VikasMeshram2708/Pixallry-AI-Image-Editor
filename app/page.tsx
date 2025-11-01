import Footer from "@/components/footer";
import { Editor } from "@/components/home/editor";
import Features from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import Pricing from "@/components/home/pricing";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Pricing />
      <Editor />
      <Footer />
    </div>
  );
}
