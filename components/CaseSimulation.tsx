"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChartColumnBig,
  RotateCcw,
  SaveAll,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { EquipmentMiniCard } from "@/components/EquipmentMiniCard";
import { FeedbackBox } from "@/components/FeedbackBox";
import { FinalCaseReport } from "@/components/FinalCaseReport";
import { OptionCard } from "@/components/OptionCard";
import { StepProgress } from "@/components/StepProgress";
import { SIMULATION_STEPS, getInitialAnswerMap } from "@/lib/case-engine";
import { evaluateCaseAnswers } from "@/lib/scoring";
import { saveLastResult } from "@/lib/storage";
import { CaseAnswerMap, CaseScenario } from "@/types/case";

type CaseSimulationProps = {
  scenario: CaseScenario;
};

type StepFeedback = {
  title: string;
  message: string;
  tone: "info" | "success" | "warning";
};

export function CaseSimulation({ scenario }: CaseSimulationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<CaseAnswerMap>(getInitialAnswerMap);
  const [runSyncStatus, setRunSyncStatus] = useState<
    "idle" | "saving" | "synced" | "error"
  >("idle");
  const [runStorage, setRunStorage] = useState<"memory" | "supabase" | null>(null);
  const [traineeAlias, setTraineeAlias] = useState("Invitado");
  const hasSubmittedResultRef = useRef(false);
  const [feedback, setFeedback] = useState<StepFeedback | null>({
    title: "Instruccion",
    message:
      "Lee cada etapa antes de avanzar. En las preguntas, selecciona solo una opcion.",
    tone: "info",
  });

  const currentStep = SIMULATION_STEPS[currentStepIndex];
  const questionKey = currentStep.questionKey;

  const evaluation = useMemo(
    () => evaluateCaseAnswers(scenario, answers),
    [scenario, answers],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedAlias = window.localStorage.getItem("biomed_case_trainee_alias");
      if (savedAlias) {
        setTraineeAlias(savedAlias);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("biomed_case_trainee_alias", traineeAlias);
  }, [traineeAlias]);

  useEffect(() => {
    if (currentStep.id !== "result") {
      return;
    }

    if (hasSubmittedResultRef.current) {
      return;
    }
    hasSubmittedResultRef.current = true;

    const completedAt = new Date().toISOString();

    saveLastResult({
      caseId: scenario.id,
      caseTitle: scenario.title,
      equipment: scenario.equipment,
      completedAt,
      evaluation,
    });

    const submitRun = async () => {
      setRunSyncStatus("saving");

      try {
        const response = await fetch("/api/simulations/runs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: crypto.randomUUID(),
            caseId: scenario.id,
            caseTitle: scenario.title,
            equipment: scenario.equipment,
            traineeAlias: traineeAlias.trim() || "Invitado",
            score: evaluation.score,
            maxScore: evaluation.maxScore,
            correctCount: evaluation.correctCount,
            totalQuestions: evaluation.totalQuestions,
            verdict: evaluation.verdict,
            completedAt,
          }),
        });

        const payload = (await response.json()) as {
          ok?: boolean;
          storage?: "memory" | "supabase";
        };

        if (!response.ok || !payload.ok) {
          setRunSyncStatus("error");
          return;
        }

        setRunStorage(payload.storage ?? "memory");
        setRunSyncStatus("synced");
      } catch {
        setRunSyncStatus("error");
      }
    };

    void submitRun();
  }, [currentStep.id, evaluation, scenario, traineeAlias]);

  const canGoNext = questionKey ? Boolean(answers[questionKey]) : true;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === SIMULATION_STEPS.length - 1;

  const handleSelectOption = (optionId: string) => {
    if (!questionKey) {
      return;
    }

    const option = scenario.questionSets[questionKey].options.find(
      (item) => item.id === optionId,
    );
    const isCorrect = scenario.correctAnswers[questionKey] === optionId;

    setAnswers((prev) => ({
      ...prev,
      [questionKey]: optionId,
    }));

    if (!option) {
      setFeedback(null);
      return;
    }

    setFeedback({
      title: isCorrect ? "Respuesta correcta" : "Respuesta a revisar",
      message: option.explanation,
      tone: isCorrect ? "success" : "warning",
    });
  };

  const goPrevious = () => {
    if (isFirstStep) {
      return;
    }

    setCurrentStepIndex((prev) => prev - 1);
    setFeedback(null);
  };

  const goNext = () => {
    if (isLastStep || !canGoNext) {
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
    setFeedback(null);
  };

  const restartCase = () => {
    hasSubmittedResultRef.current = false;
    setCurrentStepIndex(0);
    setAnswers(getInitialAnswerMap());
    setRunSyncStatus("idle");
    setRunStorage(null);
    setFeedback({
      title: "Instruccion",
      message:
        "Lee cada etapa antes de avanzar. En las preguntas, selecciona solo una opcion.",
      tone: "info",
    });
  };

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-cyan-100 bg-white/95 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <ChartColumnBig className="h-4 w-4" aria-hidden="true" />
            Estado del caso
          </p>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            Puntaje:
            <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-slate-900">
              {evaluation.score}/{evaluation.maxScore}
            </span>
          </p>
        </div>
        <p className="mt-1 text-sm text-slate-700">
          Paso {currentStepIndex + 1} de {SIMULATION_STEPS.length}:{" "}
          <span className="font-medium text-slate-900">{currentStep.label}</span>
        </p>
      </section>

      <StepProgress currentStep={currentStep.id} />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white/95 p-6 shadow-sm">
          <header className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Caso interactivo
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {scenario.title}
            </h1>
          </header>

          {currentStep.id === "report" ? (
            <article className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Reporte inicial
              </h2>
              <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {scenario.initialReport}
              </p>
            </article>
          ) : null}

          {currentStep.id === "clues" ? (
            <article className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Pistas tecnicas
              </h2>
              <ul className="space-y-2">
                {scenario.clues.map((clue) => (
                  <li
                    key={clue}
                    className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
                  >
                    {clue}
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {questionKey ? (
            <article className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                {scenario.questionSets[questionKey].prompt}
              </h2>
              <div className="space-y-2">
                {scenario.questionSets[questionKey].options.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    isSelected={answers[questionKey] === option.id}
                    onSelect={handleSelectOption}
                  />
                ))}
              </div>
            </article>
          ) : null}

          {currentStep.id === "result" ? (
            <FinalCaseReport scenario={scenario} evaluation={evaluation} />
          ) : null}

          {feedback ? (
            <div className="mt-4">
              <FeedbackBox
                title={feedback.title}
                message={feedback.message}
                tone={feedback.tone}
              />
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goPrevious}
              disabled={isFirstStep}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Anterior
            </button>
            {!isLastStep ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                Siguiente
              </button>
            ) : (
              <Link
                href="/results"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                <SaveAll className="h-4 w-4" aria-hidden="true" />
                Ver ultimo resultado guardado
              </Link>
            )}
          </div>
        </section>

        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <EquipmentMiniCard scenario={scenario} />
          <section className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Estado actual
            </h2>
            <label className="mt-3 block text-sm text-slate-700">
              Alias de participante
              <span className="relative mt-1 block">
                <User
                  className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  value={traineeAlias}
                  onChange={(event) => setTraineeAlias(event.target.value)}
                  maxLength={32}
                  placeholder="Nombre o alias"
                  className="w-full rounded-md border border-slate-300 bg-white py-2 pl-8 pr-3 text-sm text-slate-900"
                />
              </span>
            </label>
            <p className="mt-2 text-sm text-slate-700">
              Paso {currentStepIndex + 1} de {SIMULATION_STEPS.length}:{" "}
              <span className="font-medium text-slate-900">
                {currentStep.label}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Puntaje parcial:{" "}
              <span className="font-medium text-slate-900">
                {evaluation.score}/{evaluation.maxScore}
              </span>
            </p>
            {currentStep.id === "result" ? (
              <p
                className={`mt-3 rounded-md border px-3 py-2 text-xs ${
                  runSyncStatus === "synced"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : runSyncStatus === "saving"
                      ? "border-slate-200 bg-slate-50 text-slate-700"
                      : runSyncStatus === "error"
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {runSyncStatus === "synced"
                  ? runStorage === "memory"
                    ? "Resultado guardado para esta sesion."
                    : "Resultado registrado para seguimiento docente."
                  : runSyncStatus === "saving"
                    ? "Guardando resultado..."
                    : runSyncStatus === "error"
                      ? "El resultado esta disponible; no se pudo sincronizar."
                      : "Listo para finalizar caso."}
              </p>
            ) : null}
            <button
              type="button"
              onClick={restartCase}
              className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reiniciar caso
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
