"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CTASectionProps {
  id?: string;
}

export const CTASection: FC<CTASectionProps> = ({ id }) => (
  <section
    id={id}
    className="text-center py-20 rounded-lg shadow-lg bg-cover bg-center"
    style={{ backgroundImage: "url('/assets/images/decoration/main-page-block-bg.svg')" }}
  >
    <motion.h2
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-4xl font-bold mb-4 text-white"
    >
      Ready to Master Every Topic?
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mb-8 text-gray-100"
    >
      Start creating and taking quizzes with QuizEasy today—no signup required.
    </motion.p>
    <Button size="lg" asChild>
      <Link href="/home">Get Started for Free</Link>
    </Button>
  </section>
);
