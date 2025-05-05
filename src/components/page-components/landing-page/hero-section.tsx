"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroSectionProps {
  id?: string;
}

export const HeroSection: FC<HeroSectionProps> = ({ id }) => (
  <section
    id={id}
    className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12 px-4 lg:px-0"
  >
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex-1 max-w-xl text-center lg:text-left"
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Make Quiz Creation Effortless with QuizEasy
      </h1>
      <p className="text-lg mb-8">
        Generate quizzes, take them and track your improvement automatically.
        Build your personalized mistake bank and master every topic.
      </p>
      <Button size="lg" asChild>
        <Link href="/home">Try it Now</Link>
      </Button>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center -mt-10"
    >
      <Image
        src="/assets/images/decoration/main.png"
        alt="QuizEasy platform overview"
        width={500}
        height={350}
        className="rounded-3xl shadow-lg mx-auto max-w-full h-auto"
        priority
      />
    </motion.div>
  </section>
);
