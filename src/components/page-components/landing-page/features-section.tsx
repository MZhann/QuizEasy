"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface FeaturesSectionProps {
  id?: string;
}

const features = [
  {
    title: "Quiz Generation",
    description: "Instantly create multiple-choice, true/false and custom quizzes.",
  },
  {
    title: "Work on Mistakes",
    description:
      "Automatically collect wrong answers for targeted revision.",
  },
  {
    title: "Performance Analytics",
    description:
      "Track scores, time spent and improvement over time.",
  },
];

export const FeaturesSection: FC<FeaturesSectionProps> = ({ id }) => (
  <section id={id}>
    <h2 className="text-3xl font-semibold text-center mb-12">
      Key Features
    </h2>
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 "
    >
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          className={`bg-white shadow-lg rounded-lg p-6 hover:-mt-4 duration-400 transition-all ${
            idx === 0 ? "bg-cyan-100" : idx === features.length - 1 ? "bg-cyan-100" : "bg-yellow-100"
          }`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card>
            <CardHeader className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-medium">{feature.title}</h3>
            </CardHeader>
            <CardContent>
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </section>
);
