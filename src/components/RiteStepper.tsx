"use client";

import { motion } from "motion/react";
import { Check } from "@phosphor-icons/react";

interface Props {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function RiteStepper({ steps, currentStep, onStepClick }: Props) {
  return (
    <nav aria-label="Rite progress" className="flex items-center gap-2 md:gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.button
              onClick={() => onStepClick?.(i)}
              aria-label={`${step}${i < currentStep ? " (completed)" : i === currentStep ? " (current)" : ""}`}
              aria-current={i === currentStep ? "step" : undefined}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-[family-name:var(--font-mono)] font-medium transition-all ${
                i < currentStep
                  ? "bg-gold-500 text-void-900"
                  : i === currentStep
                    ? "bg-aether-500 text-void-900 glow-aether"
                    : "bg-surface-600 text-text-low border border-line/50"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {i < currentStep ? (
                <Check size={12} weight="bold" />
              ) : (
                i + 1
              )}
            </motion.button>
            <span
              className={`mt-2 text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase hidden md:block ${
                i <= currentStep ? "text-text-hi" : "text-text-low"
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-[1px] w-8 md:w-12 mx-1 mt-0 md:-mt-6 ${
                i < currentStep ? "bg-gold-500" : "bg-line/50"
              }`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </nav>
  );
}
