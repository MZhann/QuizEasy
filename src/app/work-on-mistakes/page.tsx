"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  startMistakeQuizSession,
  submitMistakeAnswer,
  completeMistakeQuizSession,
  getAllMistakeQuestions,
  getAllMistakeSessions,
} from "@/api/mistake-quiz";
import {
  MistakeQuizQuestion,
  SubmitMistakeAnswerResponse,
} from "@/types/mistakeQuizTypes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnsweredState {
  [questionId: string]: {
    selected: string[];
    result: SubmitMistakeAnswerResponse;
  };
}

export default function MistakeQuizPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MistakeQuizQuestion[]>([]);
  const [allCount, setAllCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [answered, setAnswered] = useState<AnsweredState>({});
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getAllMistakeQuestions();
        setAllCount(data.length);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCount();
  }, []);

  const handleStart = async () => {
    try {
      const { session_id, questions } = await startMistakeQuizSession();
      setSessionId(session_id);
      setQuestions(questions);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      // adjust this phrase to match your backend's "already active" message
      if (
        msg.includes("active mistake quiz session") ||
        msg.includes("активную сессию")
      ) {
        try {
          // finish any in-progress session
          const sessions = await getAllMistakeSessions();
          const active = sessions.find((s) => s.status === "in_progress");
          if (active) {
            await completeMistakeQuizSession(active._id);
          }
          // retry
          const { session_id, questions } = await startMistakeQuizSession();
          setSessionId(session_id);
          setQuestions(questions);
          return;
        } catch (cleanupError) {
          console.error("Ошибка завершения предыдущей сессии:", cleanupError);
        }
      }
      console.error("handleStart error:", err);
      alert("Не удалось начать практику. Попробуйте позже.");
    }
  };

  // const handleStart = async () => {
  //   try {
  //     // Try starting a new session
  //     const data = await startMistakeQuizSession();
  //     setSessionId(data.session_id);
  //     setQuestions(data.questions);
  //   } catch (err) {
  //     // If there's already an active session, clean it up and retry
  //     const msg = err instanceof Error ? err.message : "";
  //     if (msg.includes("active mistake quiz session")) {
  //       try {
  //         // Fetch all sessions and find the active one
  //         const sessions: AllMistakeSessionsResponse[] =
  //           await getAllMistakeSessions();
  //         const active = sessions.find((s) => s.status === "in_progress");
  //         if (active) {
  //           await completeMistakeQuizSession(active._id);
  //         }
  //         // Retry starting
  //         const retry = await startMistakeQuizSession();
  //         setSessionId(retry.session_id);
  //         setQuestions(retry.questions);
  //         return;
  //       } catch (cleanupError) {
  //         console.error("Failed to clear previous session:", cleanupError);
  //       }
  //     }
  //     console.error("handleStart error:", err);
  //     alert("Failed to start practice session.");
  //   }
  // };
  // const handleStart = async () => {
  //   try {
  //     const data = await startMistakeQuizSession();
  //     setSessionId(data.session_id);
  //     setQuestions(data.questions);
  //   } catch(error) {
  //     // if(error.deta)
  //     alert("Failed to start session.");
  //   }
  // };

  const handleOptionChange = (label: string, isMulti: boolean) => {
    if (isMulti) {
      setSelectedOptions((prev) =>
        prev.includes(label)
          ? prev.filter((l) => l !== label)
          : [...prev, label]
      );
    } else {
      setSelectedOptions([label]);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId) return;
    const q = questions[currentIndex];
    try {
      const result = await submitMistakeAnswer(sessionId, {
        question_id: q.question_id,
        selected_options: selectedOptions,
      });
      setAnswered((prev) => ({
        ...prev,
        [q.question_id]: { selected: selectedOptions, result },
      }));
      setIsFlipped(true);
    } catch {
      alert("Failed to submit answer.");
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedOptions([]);
    setCurrentIndex((i) => i + 1);
  };

  const handleFinish = async () => {
    if (!sessionId) return;
    await completeMistakeQuizSession(sessionId);
    router.push(`/mistake-results/${sessionId}`);
  };

  // Intro screen
  if (!sessionId) {
    return (
      <div className="flex flex-col items-center mt-10 px-6 md:px-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Welcome to Your Working on Mistakes
        </motion.h1>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Image
            src="/assets/images/decoration/mistake-bank.jpg"
            className="rounded-lg shadow-lg border-4 border-yellow-400"
            alt="Mistake work"
            width={300}
            height={200}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-gray-700 flex items-center gap-5"
        >
          <Image
            src={"/assets/images/decoration/mini-man.png"}
            width={100}
            height={100}
            alt="mini man"
          />
          <p className="text-lg text-start leading-5 text-gray-500 mt-2 italic">
            &quot;Your personal smart mistake bank collects all the questions
            <br />
            you answered incorrectly. Practice them here
            <br /> until you’ve mastered every concept.&quot;
          </p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-sm text-gray-500"
        >
          Total questions available: {allCount}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button size="lg" onClick={handleStart}>
            Start Practicing
          </Button>
        </motion.div>
      </div>
    );
  }

  // Quiz screen
  const current = questions[currentIndex];
  const isMulti = current.options.length > 4;
  const hasAnswered = Boolean(answered[current.question_id]);

  return (
    <div className="flex flex-col items-center mt-10 px-6 md:px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-semibold">Mistake Quiz</h2>
        <p className="text-gray-500">
          Question {currentIndex + 1} of {questions.length} • Total in bank:{" "}
          {allCount}
        </p>
      </motion.div>

      {/* Question cards */}
      <motion.div
        key={current.question_id}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8 }}
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          className={cn(
            "bg-yellow-100 rounded-xl p-6 shadow-lg relative border-4 border-yellow-400",
            "h-[450px] md:min-h-[250px]"
          )}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 flex flex-col p-6"
          >
            <p className="font-medium mb-4">{current.question_text}</p>
            <div className="flex flex-col gap-3 flex-1">
              {current.options.map((opt) => (
                <label key={opt.label} className="flex items-center gap-2">
                  <input
                    type={isMulti ? "checkbox" : "radio"}
                    name={`opt-${current.question_id}`}
                    checked={selectedOptions.includes(opt.label)}
                    onChange={() => handleOptionChange(opt.label, isMulti)}
                    disabled={hasAnswered}
                  />
                  <span>{opt.option_text}</span>
                </label>
              ))}
            </div>
            {!hasAnswered && (
              <Button onClick={handleSubmit} className="mt-4 self-end">
                Submit
              </Button>
            )}
          </div>
          {/* Back
          <div
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <p className="text-xl font-semibold mb-2">
              {answered[current.question_id].result.correct
                ? "✅ Correct!"
                : "❌ Incorrect"}
            </p>
            <p className="mb-4">
              Correct:{" "}
              {answered[current.question_id].result.correct_options.join(", ")}
            </p>
            <Button onClick={handleNext}>Next</Button>
          </div> */}
          {/* Back */}
          <div
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
            className="absolute inset-0 flex flex-col p-10 items-center justify-center text-center"
          >
            {/* use optional chaining in case answered[...] is undefined */}
            <p className="text-xl font-semibold mb-2">
              {answered[current.question_id]?.result.correct
                ? "✅ Correct!"
                : "❌ Incorrect"}
            </p>
            <p className="mb-4">
              Correct:{" "}
              {answered[current.question_id]?.result.correct_options.join(
                ", "
              ) ?? "—"}
            </p>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Finish */}
      {Object.keys(answered).length === questions.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Button size="lg" onClick={handleFinish}>
            Complete Quiz
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   startMistakeQuizSession,
//   submitMistakeAnswer,
//   completeMistakeQuizSession,
//   getAllMistakeQuestions,
// } from "@/api/mistake-quiz";
// import { MistakeQuizQuestion, SubmitMistakeAnswerResponse } from "@/types/mistakeQuizTypes";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface AnsweredState {
//   [questionId: string]: {
//     selected: string[];
//     result: SubmitMistakeAnswerResponse;
//   };
// }

// export default function MistakeQuizPage() {
//   const router = useRouter();
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const [questions, setQuestions] = useState<MistakeQuizQuestion[]>([]);
//   const [allMistakeQuestionsCount, setAllMistakeQuestionsCount] = useState<number>(0);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
//   const [answered, setAnswered] = useState<AnsweredState>({});
//   const [isFlipped, setIsFlipped] = useState(false);

//   const currentQuestion = questions[currentIndex];
//   const isMulti = currentQuestion?.options.length > 4;
//   const isAnswered = !!answered[currentQuestion?.question_id];

//   useEffect(() => {
//     const fetchMistakeCount = async () => {
//       try {
//         const data = await getAllMistakeQuestions();
//         setAllMistakeQuestionsCount(data.length);
//       } catch (e) {
//         console.error("Ошибка при получении количества вопросов из mistake bank", e);
//         console.error("Ошибка при получении списка вопросов из mistake bank");
//       }
//     };
//     fetchMistakeCount();
//   }, []);

//   const handleStart = async () => {
//     try {
//       const data = await startMistakeQuizSession();
//       setSessionId(data.session_id);
//       setQuestions(data.questions);
//     } catch (e) {
//       console.error("Ошибка при старте квиза по ошибкам", e);
//       alert("Ошибка при старте квиза по ошибкам");
//     }
//   };

//   const handleOptionChange = (label: string) => {
//     if (isMulti) {
//       setSelectedOptions((prev) =>
//         prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
//       );
//     } else {
//       setSelectedOptions([label]);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!sessionId || !currentQuestion) return;
//     try {
//       const result = await submitMistakeAnswer(sessionId, {
//         question_id: currentQuestion.question_id,
//         selected_options: selectedOptions,
//       });
//       setAnswered((prev) => ({
//         ...prev,
//         [currentQuestion.question_id]: {
//           selected: selectedOptions,
//           result,
//         },
//       }));
//       setIsFlipped(true);
//     } catch (e) {
//       console.error("Ошибка при отправке ответа", e);
//       alert("Ошибка при отправке ответа");
//     }
//   };

//   const handleNext = () => {
//     setIsFlipped(false);
//     setSelectedOptions([]);
//     setCurrentIndex((prev) => prev + 1);
//   };

//   const handleFinish = async () => {
//     if (!sessionId) return;
//     await completeMistakeQuizSession(sessionId);
//     router.push(/mistake-results/${sessionId});
//   };

//   if (!sessionId) {
//     return (
//       <div className="text-center mt-20">
//         <h1 className="text-2xl font-bold">Mistake Bank</h1>
//         <p className="text-muted-foreground">powered with AI</p>
//         <p className="mt-4">Количество вопросов: {allMistakeQuestionsCount}</p>
//         <Button onClick={handleStart} className="mt-6">Start</Button>
//       </div>
//     );
//   }

//   const answerData = answered[currentQuestion.question_id];

//   return (
//     <div className="flex flex-col items-center mt-10">
//       <h2 className="text-xl font-semibold">Mistake Quiz</h2>
//       <p className="text-muted-foreground">
//         Answered: {Object.keys(answered).length} / {questions.length}
//       </p>

//       <div className="mt-10 flex gap-4">
//         {[-1, 0, 1].map((offset) => {
//           const index = currentIndex + offset;
//           const q = questions[index];
//           if (!q) return null;

//           const isCenter = offset === 0;
//           const isBack = isCenter && isFlipped;

//           return (
//             <div
//               key={q.question_id}
//               className={cn(
//                 'w-72 min-h-72 rounded-xl bg-yellow-100 p-4 shadow-lg transition-transform duration-500 border-4 border-yellow-400',
//                 offset === -1 && 'scale-90 translate-x-[0%] blur-sm',
//                 offset === 0 && 'scale-100 z-10',
//                 offset === 1 && 'scale-90 translate-x-[0%] blur-sm',
//                 isBack && 'rotate-y-180',
//                 'relative'
//               )}
//             >
//               {!isBack ? (
//                 <div>
//                   <p className="font-medium text-center mb-4">{q.question_text}</p>
//                   <div className="flex flex-col gap-2">
//                     {q.options.map((opt) => (
//                       <label key={opt.label} className="flex items-center gap-2">
//                         <input
//                           type={isMulti ? "checkbox" : "radio"}
//                           name={q-${q.question_id}}
//                           checked={selectedOptions.includes(opt.label)}
//                           onChange={() => handleOptionChange(opt.label)}
//                           disabled={isAnswered}
//                         />
//                         <span>{opt.option_text}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {!isAnswered && (
//                     <Button onClick={handleSubmit} className="mt-4 w-full">Submit</Button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-center">
//                   <p className="text-lg mb-2 font-medium">
//                     {answerData?.result.correct ? '✅ Correct!' : '❌ Incorrect'}
//                   </p>
//                   <p>Correct Answer: {answerData?.result.correct_options.join(', ')}</p>
//                   <Button onClick={handleNext} className="mt-4">Next</Button>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {Object.keys(answered).length === questions.length && (
//         <Button onClick={handleFinish} className="mt-10 px-10">
//           Complete
//         </Button>
//       )}
//     </div>
//   );
// }
