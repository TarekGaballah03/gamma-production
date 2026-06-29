"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll(".form-group");
      gsap.fromTo(
        inputs,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-dark"
      style={{
        padding: "clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(4rem, 8vw, 8rem)",
          }}
          className="contact-grid"
        >
          {/* Left: Text */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <span
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--color-grey-400)",
                }}
              >
                Let's Talk
              </span>
              <div className="rule" style={{ width: "40px" }} />
            </div>

            <RevealText tag="h2" className="mb-6">
              <span
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Ready to create<br />
                <span style={{ fontStyle: "italic" }}>something bold?</span>
              </span>
            </RevealText>
            
            <RevealText tag="div" delay={0.2}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                  lineHeight: 1.7,
                  color: "var(--color-grey-400)",
                  maxWidth: "400px",
                }}
              >
                Whether you have a specific project in mind or just want to explore possibilities, we'd love to hear from you.
              </p>
            </RevealText>
          </div>

          {/* Right: Form */}
          <div>
            <form ref={formRef} style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
              <div className="form-group relative">
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  required
                  className="w-full bg-transparent border-b border-white/20 pb-4 outline-none font-body text-white placeholder:text-white/40 focus:border-white transition-colors peer"
                  style={{ fontSize: "1.1rem" }}
                />
              </div>
              
              <div className="form-group relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  required
                  className="w-full bg-transparent border-b border-white/20 pb-4 outline-none font-body text-white placeholder:text-white/40 focus:border-white transition-colors peer"
                  style={{ fontSize: "1.1rem" }}
                />
              </div>

              <div className="form-group relative">
                <input
                  type="text"
                  id="subject"
                  placeholder="Subject / Service (e.g. Brand Film)"
                  className="w-full bg-transparent border-b border-white/20 pb-4 outline-none font-body text-white placeholder:text-white/40 focus:border-white transition-colors peer"
                  style={{ fontSize: "1.1rem" }}
                />
              </div>

              <div className="form-group relative">
                <textarea
                  id="message"
                  placeholder="Tell us about your project..."
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 pb-4 outline-none font-body text-white placeholder:text-white/40 focus:border-white transition-colors resize-none peer"
                  style={{ fontSize: "1.1rem" }}
                />
              </div>

              <div className="form-group">
                <Button type="button" variant="primary">
                  Send Inquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
          }
        }
      `}</style>
    </section>
  );
}
