"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  }

  async function handleSubmit() {
    if (session?.user) {
      scrollToSection("editor");
    } else {
      await signIn("google");
    }
  }
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${
        isScrolled
          ? "glass border-b border-card-border backdrop-blur-glass"
          : "bg-transparent"
      }
      
      `}
    >
      <div className="container  mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* logo */}
          <motion.div
            className="flex items-center  cursor-pointer space-x-2"
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection("hero")}
          >
            <div className="relative">
              <Sparkles
                fill="transparent"
                className="h-8 w-8 text-primary animate-glow-pluse"
              />
              <div className="absolute inset-0 h-8 w-8 text-secondary animate-glow-pulse opacity-50" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary !bg-clip-text text-transparent">
              Pixallry AI
            </span>
          </motion.div>

          {/* navigations */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              type="button"
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>
            <button
              type="button"
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => scrollToSection("pricing")}
            >
              Pricing
            </button>
            <Button
              variant={"hero"}
              onClick={handleSubmit}
              className="font-semibold w-full"
            >
              {session?.user ? "Launch App" : "Sign In"}
            </Button>
          </div>

          {/* mobile menu */}
          <button
            type="button"
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : "0",
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            <button
              type="button"
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>
            <button
              type="button"
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => scrollToSection("pricing")}
            >
              Pricing
            </button>
            <Button
              variant={"hero"}
              onClick={handleSubmit}
              className="font-semibold w-full"
            >
              {session?.user ? "Launch App" : "Sign In"}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
