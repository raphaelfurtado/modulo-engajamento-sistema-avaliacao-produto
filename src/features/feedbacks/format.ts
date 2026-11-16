/** "1 avaliação", "3 avaliações". */
export function countLabel(count: number): string {
  return count === 1 ? "1 avaliação" : `${count} avaliações`;
}
