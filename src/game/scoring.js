// PlayMonster Farkle rules. Combinations must come from the same roll.
export const TARGET_SCORE = 10000
export const ENTRY_SCORE = 500
export const RULES_SOURCE = 'https://www.playmonster.com/wp-content/uploads/2018/06/Farkle-Rules.pdf'

export function scoreDice(values) {
  if (!values.length || values.length > 6 || values.some(v => !Number.isInteger(v) || v < 1 || v > 6)) return 0
  const counts = Array(6).fill(0)
  for (const value of values) counts[value - 1]++
  if (values.length === 6) {
    if (counts.every(n => n === 1)) return 1500
    if (counts.filter(n => n === 2).length === 3) return 1500
    if (counts.includes(4) && counts.includes(2)) return 1500
    if (counts.filter(n => n === 3).length === 2) return 2500
  }
  let total = 0
  for (let i = 0; i < 6; i++) {
    const n = counts[i]
    if (n >= 3) total += n === 6 ? 3000 : n === 5 ? 2000 : n === 4 ? 1000 : i === 0 ? 300 : (i + 1) * 100
    else if (i === 0) total += n * 100
    else if (i === 4) total += n * 50
    else if (n > 0) return 0
  }
  return total
}

export function scoringOptions(dice) {
  const options = []
  for (let mask = 1; mask < 2 ** dice.length; mask++) {
    const chosen = dice.filter((_, index) => mask & (1 << index))
    const score = scoreDice(chosen.map(die => die.value))
    if (score) options.push({ ids: chosen.map(die => die.id), score, remaining: dice.length - chosen.length })
  }
  return options.sort((a, b) => b.score - a.score || a.remaining - b.remaining)
}

export function hasScore(values) {
  if (values.includes(1) || values.includes(5)) return true
  const counts = Array(6).fill(0)
  for (const value of values) counts[value - 1]++
  return counts.some(n => n >= 3) || (values.length === 6 && counts.filter(n => n === 2).length === 3)
}

const riskCache = new Map()
export function farkleProbability(count) {
  if (!Number.isInteger(count) || count < 1 || count > 6) throw new RangeError('Dice count must be 1–6')
  if (riskCache.has(count)) return riskCache.get(count)
  let failures = 0
  function visit(values) {
    if (values.length === count) { if (!hasScore(values)) failures++; return }
    for (let face = 1; face <= 6; face++) visit([...values, face])
  }
  visit([])
  const risk = failures / 6 ** count
  riskCache.set(count, risk)
  return risk
}
