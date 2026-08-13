import seedrandom from "seedrandom";

const DEFAULT_SEED = "default-vtuber-seed";

let rng: seedrandom.PRNG = seedrandom(DEFAULT_SEED);

function toCleanSeed(seed: string): string {
  const cleanSeed = seed.trim();
  return cleanSeed.length > 0 ? cleanSeed : DEFAULT_SEED;
}

export function initPRNG(seed: string): void {
  const cleanSeed = toCleanSeed(seed);
  rng = seedrandom(cleanSeed);
}

export function getRandom(): number {
  return rng();
}

export function getRandomInt(min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

export function checkChance(chancePercentage: number): boolean {
  return rng() * 100 <= chancePercentage;
}

export function getRandomArrayItem<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("getRandomArrayItem requires a non-empty array.");
  }

  return array[getRandomInt(0, array.length - 1)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const next = [...array];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomInt(0, index);
    const current = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = current;
  }

  return next;
}
