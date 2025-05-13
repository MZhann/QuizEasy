"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HowItWorksSectionProps {
  id?: string;
}

interface Slide {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const slides: Slide[] = [
  {
    title: "Smart & Fast Generation",
    description: "AI-powered templates let you create quizzes in seconds.",
    imageSrc: "/assets/images/decoration/fast.png",
    imageAlt: "Smart & Fast Generation",
  },
  {
    title: "Seamless Quiz Flow",
    description: "Engage with quizzes through an intuitive, responsive interface.",
    imageSrc: "/assets/images/decoration/seamless.png",

    imageAlt: "Seamless Quiz Flow",
  },
  {
    title: "Review & Work on Mistakes",
    description: "Automatically collect and master your mistakes.",
    imageSrc: "/assets/images/decoration/review.png",

    imageAlt: "Review & Work on Mistakes",
  },
  {
    title: "Unlimited Topics",
    description: "Create quizzes on any subject—science, history, languages & more.",
    imageSrc: "/assets/images/decoration/unlimited.png",

    imageAlt: "Unlimited Topics",
  },
];

export const StepsCarouselSection: FC<HowItWorksSectionProps> = ({ id }) => {
  const [active, setActive] = useState(0);
  const prev = () => setActive((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setActive((i) => (i + 1) % slides.length);

  return (
    <section id={id} className="relative w-full mx-auto py-16 px-4">
      <h2 className="text-3xl font-semibold text-center mb-8">How It Works</h2>

      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {slides.map((slide, idx) =>
            idx === active ? (
              <motion.div
                key={idx}
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col lg:flex-row items-center gap-8"
              >
                <div className="w-full lg:w-1/2">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-4">{slide.title}</h3>
                  <p className="text-gray-700">{slide.description}</p>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === active ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
