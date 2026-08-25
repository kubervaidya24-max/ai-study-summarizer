"use client";

import * as React from "react";
import { QuizQuestion } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCw,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface QuizEngineProps {
  questions: QuizQuestion[];
  onFinish?: (score: number, total: number) => void;
}

export function QuizEngine({ questions, onFinish }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isQuizComplete, setIsQuizComplete] = React.useState(false);

  // Reset if questions prop changes
  React.useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
  }, [questions]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return; // Prevent changing after submitting
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsQuizComplete(true);
      if (onFinish) onFinish(score, totalQuestions);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  if (!currentQuestion || totalQuestions === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No quiz questions available.
      </div>
    );
  }

  // Final Results Screen
  if (isQuizComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    let grade: { label: string; variant: "success" | "warning" | "destructive"; message: string } = {
      label: "Needs Review",
      variant: "destructive",
      message: "Review the flashcards and try again!",
    };
    if (percentage >= 80) {
      grade = {
        label: "Mastery Level!",
        variant: "success",
        message: "Outstanding! You have mastered this material.",
      };
    } else if (percentage >= 60) {
      grade = {
        label: "Good Understanding",
        variant: "warning",
        message: "Good job! A quick review of concepts will get you to 100%.",
      };
    }

    return (
      <Card className="max-w-xl mx-auto border-blue-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 md:p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>
          <p className="text-sm text-slate-300">{grade.message}</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-4xl font-extrabold text-white font-mono">
            {score} <span className="text-xl text-slate-400 font-normal">/ {totalQuestions}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Badge variant={grade.variant} className="text-xs px-3 py-1">
              {percentage}% Score • {grade.label}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={handleRestart} variant="glow" className="w-full sm:w-auto gap-2">
            <RotateCw className="w-4 h-4" />
            Retake Quiz
          </Button>
        </div>
      </Card>
    );
  }

  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="font-mono text-xs">
            Question {currentIndex + 1} of {totalQuestions}
          </Badge>
          {currentQuestion.topic && (
            <Badge variant="secondary" className="text-xs">
              {currentQuestion.topic}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span>Score:</span>
          <span className="text-blue-400 font-bold">{score}</span>
        </div>
      </div>

      <Progress value={progressPercent} className="h-1.5" />

      {/* Question Card */}
      <Card className="border-slate-800 bg-slate-900/80 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            Multiple Choice Question
          </div>
          <CardTitle className="text-lg md:text-xl text-white font-medium leading-relaxed mt-2">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQuestion.correctIndex;

            let optionStyle = "border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60";

            if (isAnswered) {
              if (isCorrectOption) {
                optionStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-medium shadow-md shadow-emerald-500/10";
              } else if (isSelected && !isCorrectOption) {
                optionStyle = "border-red-500 bg-red-500/15 text-red-300 font-medium";
              } else {
                optionStyle = "border-slate-800 bg-slate-900/30 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between gap-3 text-sm cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-mono font-bold text-slate-300 border border-slate-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed mt-0.5">{option}</span>
                </div>

                {isAnswered && (
                  <div className="shrink-0 mt-0.5">
                    {isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in zoom-in-50" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-red-400 animate-in zoom-in-50" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}

          {/* Explanation Box revealed after answering */}
          {isAnswered && (
            <div className="mt-5 p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-1.5 animate-in fade-in-50 duration-300">
              <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Explanation & Rationale
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400 font-mono">
            {isAnswered ? "Answer submitted" : "Select an option to verify"}
          </span>

          {isAnswered && (
            <Button
              onClick={handleNext}
              variant={isLastQuestion ? "glow" : "default"}
              size="sm"
              className="gap-1.5"
            >
              {isLastQuestion ? "View Final Results" : "Next Question"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
