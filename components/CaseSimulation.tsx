"use client";

import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  ChartColumnBig,
  ClipboardList,
  FlaskConical,
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
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.12)]">
      <div className="grid lg:grid-cols-[15.5rem_1fr]">
        <aside className="bg-blue-950 p-5 text-white">
          <h2 className="text-sm font-semibold">BioMed Case Simulator</h2>
          <p className="mt-1 text-xs text-blue-200">Caso diagnostico</p>

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">
              Progreso del caso
            </p>
            <ol className="mt-3 space-y-2">
              {SIMULATION_STEPS.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isDone = index < currentStepIndex;
                return (
                  <li key={step.id}>
                    <span
                      className={`flex min-h-9 items-center gap-3 rounded-md px-3 text-sm ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : isDone
                            ? "text-emerald-100"
                            : "text-blue-100"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-white text-blue-900"
                            : isDone
                              ? "bg-emerald-400 text-blue-950"
                              : "bg-white/10 text-blue-100"
                        }`}
                      >
                        {index + 1}
                      </span>
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-7 border-t border-white/10 pt-5 text-xs text-blue-100">
            <p>Tiempo estimado</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {scenario.estimatedMinutes} min
            </p>
            <p className="mt-4">Guardado automatico</p>
            <p className="mt-1 font-semibold text-cyan-100">
              {currentStep.id === "result" ? "Caso finalizado" : "Activo"}
            </p>
          </div>
        </aside>

        <div className="min-w-0 bg-white">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 md:px-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <Link href="/cases" className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-cyan-700">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Caso:
              </Link>
              <span className="font-semibold text-slate-900">{scenario.title}</span>
            </div>
            <Link
              href="/cases"
              className="inline-flex min-h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Salir del caso
            </Link>
          </header>

          <div className="grid min-h-[32rem] lg:grid-cols-[1fr_20rem]">
            <div className="space-y-4 p-4 md:p-6">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Paso {currentStepIndex + 1} de {SIMULATION_STEPS.length}:{" "}
                      {currentStep.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Selecciona la accion o interpretacion mas adecuada.
                    </p>
                  </div>
                  <span className="rounded-md border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800">
                    {evaluation.score}/{evaluation.maxScore} pts
                  </span>
                </div>

                <div className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[0.8fr_1fr]">
                  <div className="flex min-h-32 items-center justify-center rounded-md border border-slate-200 bg-white">
                    <div className="relative h-24 w-36 rounded-lg border-2 border-slate-300 bg-slate-100">
                      <div className="absolute left-4 top-4 h-12 w-20 rounded border border-cyan-300 bg-slate-950">
                        <BrainCircuit className="mx-auto mt-3 h-6 w-8 text-cyan-200" aria-hidden="true" />
                      </div>
                      <div className="absolute bottom-3 left-5 h-2 w-24 rounded bg-slate-300" />
                    </div>
                  </div>
                  <div className="grid content-center gap-2">
                    <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300" defaultChecked />
                      Cable del sensor y conexion al monitor
                    </label>
                    <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                      Estado fisico del accesorio
                    </label>
                  </div>
                </div>

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
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Anterior
                  </button>
                  {!isLastStep ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canGoNext}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <Link
                      href="/results"
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                    >
                      <SaveAll className="h-4 w-4" aria-hidden="true" />
                      Ver ultimo resultado
                    </Link>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-4 border-t border-slate-200 bg-slate-50 p-4 lg:border-l lg:border-t-0">
              <EquipmentMiniCard scenario={scenario} />
              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Informacion del caso
                </h2>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500">Sintoma</dt>
                    <dd className="mt-1 text-slate-900">{scenario.title}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500">Prioridad</dt>
                    <dd className="mt-1 text-slate-900">Media</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Notas rapidas
                </h2>
                <textarea
                  placeholder="Escribe tus observaciones..."
                  className="mt-3 min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  <ClipboardList className="h-4 w-4" aria-hidden="true" />
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
            </aside>
          </div>

          <footer className="grid gap-2 border-t border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Tiempo en caso", `${scenario.estimatedMinutes} min estimados`, ChartColumnBig],
              ["Estado", currentStep.label, BrainCircuit],
              ["Puntaje", `${evaluation.score}/${evaluation.maxScore}`, FlaskConical],
              ["Resultado", currentStep.id === "result" ? evaluation.verdict : "En proceso", ClipboardList],
            ].map(([label, value, Icon]) => (
              <article key={String(label)} className="flex min-h-14 items-center gap-3 rounded-md border border-slate-200 bg-white px-3">
                <Icon className="h-5 w-5 text-cyan-700" aria-hidden="true" />
                <div>
                  <p className="text-xs text-slate-500">{String(label)}</p>
                  <p className="text-sm font-semibold text-slate-950">{String(value)}</p>
                </div>
              </article>
            ))}
          </footer>
        </div>
      </div>
    </section>
  );
}
