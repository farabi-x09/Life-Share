"use client";

import { useState, useEffect, useRef } from "react";
import { UserPlus, Bell, CheckCircle, Heart } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    id: "01",
    title: "Register free",
    description: "Create your donor profile with your blood group, district, and upazila.",
    icon: UserPlus,
    imgUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "02",
    title: "Get matched",
    description: "We alert you when a nearby recipient needs your blood type urgently.",
    icon: Bell,
    imgUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "03",
    title: "Confirm donation",
    description: "Accept the request and confirm your availability with one click.",
    icon: CheckCircle,
    imgUrl: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "04",
    title: "Save a life",
    description: "Visit the hospital and donate. Your status updates automatically.",
    icon: Heart,
    imgUrl: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=600",
  },
];

function StepCard({ step, index, isVisible }) {
  const [hovered, setHovered] = useState(false);
  const Icon = step.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        cursor: "default",
        border: hovered ? "2px solid #ef4444" : "2px solid transparent",
        boxShadow: hovered
          ? "0 24px 48px rgba(239,68,68,0.18)"
          : "0 4px 20px rgba(0,0,0,0.12)",
        transform: isVisible
          ? hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)"
          : "translateY(30px)",
        opacity: isVisible ? 1 : 0,
        transition: `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.15}s, opacity 0.4s ease ${index * 0.15}s, border-color 0.25s, box-shadow 0.25s`,
      }}
    >
      {/* Full background image */}
      <Image
        src={step.imgUrl}
        alt={step.title}
        width={600}
        height={400}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          transition: "transform 0.5s ease",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          zIndex: 0,
        }}
      />

      {/* Dark gradient overlay — stronger at bottom for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.15) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%)",
          transition: "background 0.3s",
          zIndex: 1,
        }}
      />

      {/* Step number — top left watermark */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "18px",
          fontSize: "52px",
          fontWeight: 900,
          fontFamily: "monospace",
          color: hovered ? "rgba(239,68,68,0.55)" : "rgba(255,255,255,0.15)",
          lineHeight: 1,
          userSelect: "none",
          transition: "color 0.3s",
          zIndex: 2,
        }}
      >
        {step.id}
      </div>

      {/* Content at bottom */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "20px 20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Icon pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: hovered ? "#ef4444" : "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: hovered ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.25)",
            borderRadius: "999px",
            padding: "6px 14px 6px 10px",
            width: "fit-content",
            transition: "background 0.25s, border-color 0.25s",
          }}
        >
          <Icon size={16} color="#fff" strokeWidth={2} />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.02em",
            }}
          >
            Step {step.id}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          {step.title}
        </h3>

        {/* Description — slides in on hover */}
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.78)",
            margin: 0,
            lineHeight: 1.6,
            maxHeight: hovered ? "80px" : "0px",
            overflow: "hidden",
            opacity: hovered ? 1 : 0,
            transition: "max-height 0.3s ease, opacity 0.3s ease",
          }}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        background: "#fff",
        padding: "96px 0",
        borderTop: "1px solid #f3f4f6",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "56px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#dc2626",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              display: "block",
              marginBottom: "12px",
            }}
          >
            How it works
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#111827",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            Donate in 4 simple steps
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#6b7280",
              maxWidth: "420px",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Getting started takes less than 2 minutes.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {steps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} isVisible={isVisible} />
          ))}
        </div>

      </div>
    </section>
  );
}