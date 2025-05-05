"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HowItWorksSectionProps {
  id?: string;
}

const steps = [
  {
    title: "1. Create a Quiz",
    description: "Set up questions, options and correct answers in seconds.",
  },
  {
    title: "2. Take the Quiz",
    description: "Attempt your quiz online and get instant feedback.",
  },
  {
    title: "3. Review Mistakes",
    description:
      "See all wrong answers in your mistake bank for focused study.",
  },
];

export const HowItWorksSection: FC<HowItWorksSectionProps> = ({ id }) => (
  <section id={id} className="flex flex-col lg:flex-row items-center gap-12 mt-24 px-4 lg:px-0 w-full">
    {/* Left: Steps List */}
    <div className="flex-1">
      <h2 className="text-3xl font-semibold text-center lg:text-left mb-12">
        Why Us?
      </h2>
      <div className="space-y-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="flex items-start gap-6"
          >
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
              {idx + 1}
            </div>
            <div>
              <h4 className="text-2xl font-medium mb-2">{step.title}</h4>
              <p className="text-gray-700">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Right: Illustration */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex justify-center w-full lg:justify-end"
    >
      <Image
        src="/assets/images/decoration/explaining.jpg"
        alt="How It Works illustration"
        width={500}
        height={400}
        className="rounded-lg shadow-lg max-w-full h-auto"
      />
    </motion.div>
  </section>
);
