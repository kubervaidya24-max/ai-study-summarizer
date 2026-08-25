"use client";

import * as React from "react";
import { Flashcard, FlashcardDifficulty } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

interface FlashcardViewerProps {
  initialCards: Flashcard[];
}

export function FlashcardViewer({ initialCards }: FlashcardViewerProps) {
  const [cards, setCards] = React.useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [ratedCards, setRatedCards] = React.useState<Record<string, "EASY" | "MEDIUM" | "HARD">>({});

  // Reset or update cards if initialCards change
  React.useEffect(() => {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setRatedCards({});
  }, [initialCards]);

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  const handleNext = React.useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalCards]);

  const handlePrev = React.useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleFlip = React.useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setRatedCards({});
  };

  const handleRate = (rating: "EASY" | "MEDIUM" | "HARD") => {
    if (!currentCard) return;
    setRatedCards((prev) => ({ ...prev, [currentCard.id]: rating }));
    if (currentIndex < totalCards - 1) {
      handleNext();
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleNext, handlePrev]);

  if (!currentCard || totalCards === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No flashcards available.
      </div>
    );
  }

  const getDifficultyBadge = (difficulty: FlashcardDifficulty) => {
    switch (difficulty) {
      case "EASY":
        return <Badge variant="success">Easy</Badge>;
      case "MEDIUM":
        return <Badge variant="warning">Medium</Badge>;
      case "HARD":
        return <Badge variant="destructive">Hard</Badge>;
    }
  };

  const progressPercent = ((currentIndex + 1) / totalCards) * 100;
  const isLastCard = currentIndex === totalCards - 1;
  const currentCardRating = ratedCards[currentCard.id];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Controls & Counter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="font-mono text-xs">
            Card {currentIndex + 1} of {totalCards}
          </Badge>
          {currentCard.topic && (
            <Badge variant="secondary" className="text-xs">
              {currentCard.topic}
            </Badge>
          )}
          {currentCardRating && (
            <Badge variant={currentCardRating === "EASY" ? "success" : currentCardRating === "MEDIUM" ? "warning" : "destructive"} className="text-[10px]">
              Rated: {currentCardRating}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShuffle}
            title="Shuffle cards"
            className="text-xs gap-1.5 text-slate-400 hover:text-white"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Shuffle
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRestart}
            title="Restart deck"
            className="text-xs gap-1.5 text-slate-400 hover:text-white"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Restart
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercent} className="h-1.5" />

      {/* 3D Flip Card Container */}
      <div
        className="perspective-1000 w-full min-h-[320px] md:min-h-[360px] cursor-pointer select-none"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full min-h-[320px] md:min-h-[360px] rounded-3xl transition-transform duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of Card (Question) */}
          <div className="absolute inset-0 backface-hidden w-full h-full rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-6 md:p-8 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                Question
              </div>
              {getDifficultyBadge(currentCard.difficulty)}
            </div>

            <div className="my-auto py-4 text-center">
              <p className="text-lg md:text-xl font-medium text-white leading-relaxed">
                {currentCard.question}
              </p>
            </div>

            <div className="text-center pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-center gap-2">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Space</kbd> to reveal answer</span>
            </div>
          </div>

          {/* Back of Card (Answer) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-blue-950/40 p-6 md:p-8 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" />
                Answer & Explanation
              </div>
              <Badge variant="success">Revealed</Badge>
            </div>

            <div className="my-auto py-4 text-center">
              <p className="text-base md:text-lg text-slate-200 leading-relaxed font-normal">
                {currentCard.answer}
              </p>
              {currentCard.sourceSnippet && (
                <p className="mt-3 text-xs text-slate-400 italic">
                  Ref: {currentCard.sourceSnippet}
                </p>
              )}
            </div>

            {/* Active Recall Self-Rating Controls */}
            <div
              className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                How well did you know this?
              </span>
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  className="text-xs h-7 px-2.5 rounded-lg"
                  onClick={() => handleRate("HARD")}
                >
                  Hard
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs h-7 px-2.5 rounded-lg border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                  onClick={() => handleRate("MEDIUM")}
                >
                  Medium
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  className="text-xs h-7 px-2.5 rounded-lg"
                  onClick={() => handleRate("EASY")}
                >
                  Easy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="text-xs text-slate-400 font-mono hidden md:block">
          Use Left/Right arrows to navigate
        </div>

        <Button
          variant={isLastCard ? "success" : "default"}
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
          className="gap-1.5"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
