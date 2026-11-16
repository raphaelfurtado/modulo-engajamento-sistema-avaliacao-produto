import { ScoreLabel } from "@/components/prova/score-label";

/** Exemplo: 12 pessoas avaliaram uma air fryer (índice = nota, de 0 a 5). */
const SAMPLE_COUNTS = [0, 1, 1, 2, 5, 3];
const SAMPLE_AVERAGE =
  SAMPLE_COUNTS.reduce((sum, count, grade) => sum + count * grade, 0) /
  SAMPLE_COUNTS.reduce((sum, count) => sum + count, 0);

/**
 * A etiqueta de nota de um produto de exemplo, a mesma que aparece na página
 * de cada produto. É o elemento de destaque das telas de conta.
 */
export function GradedReviewSample() {
  return (
    <aside
      aria-label="Exemplo de etiqueta de nota"
      className="w-full max-w-md justify-self-center lg:justify-self-end"
    >
      <p className="mb-3 font-wide text-lg font-extrabold tracking-[-0.01em]">
        Air fryer 4 L
      </p>
      <ScoreLabel counts={SAMPLE_COUNTS} average={SAMPLE_AVERAGE} animated />
      <p className="mt-3 text-sm text-muted-foreground">
        Exemplo. Todo produto na Prova ganha uma etiqueta assim, com as notas de
        quem usou.
      </p>
    </aside>
  );
}
