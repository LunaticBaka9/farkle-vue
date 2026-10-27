import test from 'node:test'
import assert from 'node:assert/strict'
import { ENTRY_SCORE, TARGET_SCORE, farkleProbability, hasScore, scoreDice, scoringOptions } from '../src/game/scoring.js'
import { bankPoints, canBank, chooseAiMove, createGame, finishFarkle, isValidTargetScore, rollDice, selectionScore, startNextTurn } from '../src/game/engine.js'

const faces = values => { let i = 0; return () => (values[i++ % values.length] - .5) / 6 }
const roll = (game, values, ids = []) => rollDice(game, ids, faces(values))
const allIds = game => game.dice.map(d => d.id)
function seeded(seed) { let s = seed; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } }

test('custom target score is validated, stored, and drives the final-round trigger', () => {
  for (const target of [1000, 1500, 5000, 10000, 100000]) assert.equal(isValidTargetScore(target), true)
  for (const target of [0, 500, 999, 1250, 100500, 10000.5, NaN, '5000']) assert.equal(isValidTargetScore(target), false)
  assert.equal(createGame('local').targetScore, TARGET_SCORE)
  assert.equal(createGame('ai', 'bold', 5000).targetScore, 5000)
  assert.throws(() => createGame('ai', 'balanced', 1250), RangeError)
  let game = createGame('local', 'balanced', 5000)
  game.players[0].score = 4500
  game = roll(game, [6, 6, 6, 2, 3, 4])
  game = bankPoints(game, game.dice.slice(0, 3).map(d => d.id))
  assert.equal(game.players[0].score, 5100)
  assert.equal(game.finalStarter, 0)
  assert.equal(game.phase, 'handoff')
})

test('AI uses the selected target when deciding whether to bank', () => {
  let game = createGame('ai', 'balanced', 5000)
  game.players[1].score = 4400
  game = roll(game, [6, 6, 6, 2, 3, 4])
  const action = chooseAiMove(game)
  assert.equal(action.type, 'bank')
  assert.ok(game.players[1].score + action.score >= game.targetScore)
})

test('custom target awards the last turn to the opponent and compares final scores', () => {
  let game = createGame('local', 'balanced', 5000)
  game.players[0].score = 4500
  game.players[1].score = 5000
  game = roll(game, [6, 6, 6, 2, 3, 4])
  game = bankPoints(game, game.dice.slice(0, 3).map(d => d.id))
  assert.equal(game.players[0].score, 5100)
  assert.equal(game.finalStarter, 0)
  game = startNextTurn(game)
  game = roll(game, [6, 6, 6, 2, 3, 4])
  game = bankPoints(game, game.dice.slice(0, 3).map(d => d.id))
  assert.equal(game.phase, 'finished')
  assert.equal(game.winner, 1)
  assert.equal(game.players[1].score, 5600)
})

test('single dice, triples and every four/five/six-of-a-kind match publisher table', () => {
  assert.equal(scoreDice([1]), 100)
  assert.equal(scoreDice([5]), 50)
  assert.equal(scoreDice([1, 1, 5, 5]), 300)
  for (let face = 1; face <= 6; face++) {
    assert.equal(scoreDice(Array(3).fill(face)), face === 1 ? 300 : face * 100)
    for (const [n, score] of [[4, 1000], [5, 2000], [6, 3000]]) assert.equal(scoreDice(Array(n).fill(face)), score)
  }
})

test('all special six-dice combinations are recognized as complete selections', () => {
  for (const [values, score] of [
    [[1, 2, 3, 4, 5, 6], 1500], [[2, 2, 3, 3, 4, 4], 1500],
    [[1, 1, 5, 5, 6, 6], 1500], [[2, 2, 2, 2, 6, 6], 1500],
    [[1, 1, 1, 5, 5, 5], 2500], [[2, 2, 2, 3, 3, 3], 2500],
  ]) { assert.equal(scoreDice(values), score); assert.ok(hasScore(values)) }
})

test('unscorable leftovers cannot be smuggled into scoring selections', () => {
  for (const values of [[], [2], [1, 2], [5, 6], [3, 3], [1, 1, 2, 3, 5], [0], [7], [1.5], Array(7).fill(1)]) assert.equal(scoreDice(values), 0)
  const game = roll(createGame(), [1, 5, 2, 3, 4, 6])
  assert.equal(selectionScore(game, [game.dice[0].id, 'unknown']), 0)
  assert.equal(selectionScore(game, [game.dice[0].id, game.dice[0].id]), 0)
  assert.equal(scoringOptions(game.dice)[0].score, 1500)
})

test('exact Farkle probabilities decrease as more dice are available', () => {
  assert.equal(farkleProbability(1), 4 / 6)
  assert.equal(farkleProbability(2), 16 / 36)
  for (let count = 2; count <= 6; count++) assert.ok(farkleProbability(count) < farkleProbability(count - 1))
  assert.ok(Math.abs(farkleProbability(6) - 1080 / 46656) < 1e-10)
  assert.throws(() => farkleProbability(0), RangeError)
})

test('quick Farkle detector agrees with selectable combinations', () => {
  const random = seeded(271828)
  for (let i = 0; i < 3000; i++) {
    const dice = Array.from({ length: 1 + i % 6 }, (_, id) => ({ id, value: Math.floor(random() * 6) + 1 }))
    assert.equal(hasScore(dice.map(d => d.value)), scoringOptions(dice).length > 0)
  }
})

test('first bank needs 500; future turns may bank 50; each roll needs a selected scoring die', () => {
  let game = roll(createGame(), [1, 2, 2, 3, 4, 6])
  assert.equal(canBank(game, [game.dice[0].id]), false)
  assert.throws(() => bankPoints(game, [game.dice[0].id]))
  game = roll(createGame(), [6, 6, 6, 2, 3, 4])
  const ids = game.dice.slice(0, 3).map(d => d.id)
  const banked = bankPoints(game, ids)
  assert.equal(game.players[0].score, 0, 'actions do not mutate their input')
  assert.equal(banked.players[0].score, 600)
  game = roll({ ...createGame(), turnScore: 500 }, [5, 2, 2, 3, 4, 6])
  assert.equal(canBank(game, []), false, 'must select after every roll')
  game = createGame(); game.players[0].score = 600
  game = roll(game, [5, 2, 2, 3, 4, 6])
  assert.equal(canBank(game, [game.dice[0].id]), true)
  assert.equal(bankPoints(game, [game.dice[0].id]).players[0].score, 650)
})

test('kept dice across rolls never combine into a triple', () => {
  let game = roll(createGame(), [1, 2, 2, 3, 4, 6])
  game = roll(game, [1, 1, 2, 3, 4], [game.dice[0].id])
  assert.equal(game.turnScore, 100)
  const ids = game.dice.slice(0, 2).map(d => d.id)
  assert.equal(selectionScore(game, ids), 200)
  assert.equal(canBank(game, ids), false)
  assert.equal(game.kept[0].score, 100)
})

test('Hot Dice refreshes all six dice and carries the running score', () => {
  let game = roll(createGame(), [1, 2, 3, 4, 5, 6])
  game = roll(game, [1, 1, 1, 1, 1, 1], allIds(game))
  assert.equal(game.turnScore, 1500)
  assert.equal(game.dice.length, 6)
  assert.equal(game.kept.length, 0)
  assert.equal(game.lastEvent.type, 'hot')
  assert.equal(bankPoints(game, allIds(game)).players[0].score, 4500)
})

test('Farkle loses only the current turn, keeps banked scores, and hands off safely', () => {
  let game = createGame(); game.players[0].score = 800
  game = roll(game, [1, 2, 3, 4, 5, 6])
  game = roll(game, [2, 2, 3, 3, 4, 6], allIds(game))
  assert.equal(game.phase, 'farkle')
  assert.equal(game.turnScore, 0)
  assert.equal(game.players[0].score, 800)
  assert.equal(game.history[0].points, 1500)
  game = startNextTurn(finishFarkle(game))
  assert.equal(game.active, 1); assert.equal(game.phase, 'ready'); assert.deepEqual(game.dice, [])
  assert.throws(() => bankPoints(game)); assert.throws(() => startNextTurn(game))
})

function triggerFinal(a = 9500, b = 9400) {
  let game = createGame(); game.players[0].score = a; game.players[1].score = b
  game = roll(game, [6, 6, 6, 2, 3, 4])
  game = bankPoints(game, game.dice.slice(0, 3).map(d => d.id))
  assert.equal(game.finalStarter, 0); assert.equal(game.phase, 'handoff'); assert.equal(game.players[0].score, a + 600)
  return startNextTurn(game)
}

test('opponent gets exactly one final turn and can overtake the first player', () => {
  let game = triggerFinal()
  game = roll(game, [2, 2, 2, 2, 2, 2]); game = bankPoints(game, allIds(game))
  assert.equal(game.phase, 'finished'); assert.equal(game.winner, 1); assert.equal(game.players[1].score, 12400)
  assert.throws(() => roll(game, [1])); assert.throws(() => startNextTurn(game))
})

test('a Farkle on the final turn ends the match; equal totals are a draw', () => {
  let game = roll(triggerFinal(), [2, 2, 3, 3, 4, 6])
  game = finishFarkle(game)
  assert.equal(game.phase, 'finished'); assert.equal(game.winner, 0)
  game = roll(triggerFinal(9500, 9500), [6, 6, 6, 2, 3, 4])
  game = bankPoints(game, game.dice.slice(0, 3).map(d => d.id))
  assert.equal(game.phase, 'finished'); assert.equal(game.winner, 'tie')
})

test('AI must chase on the final turn and stops as soon as it can win', () => {
  let game = triggerFinal(); game = roll(game, [6, 6, 6, 2, 3, 4])
  const move = chooseAiMove(game)
  assert.equal(move.type, 'roll', '10000 is not enough to beat 10100')
  game = roll(triggerFinal(), [6, 6, 6, 6, 2, 3])
  assert.equal(chooseAiMove(game).type, 'bank')
})

test('local player names persist and turns alternate', () => {
  let game = createGame('local'); game.players[0].name = '小林'; game.players[1].name = '小陈'
  game = roll(game, [2, 2, 3, 3, 4, 6]); game = startNextTurn(finishFarkle(game))
  assert.equal(game.active, 1); assert.equal(game.players[1].name, '小陈'); assert.equal(game.mode, 'local')
})

test('90 deterministic full matches terminate with legal scores for all AI styles', () => {
  for (const [styleIndex, style] of ['cautious', 'balanced', 'bold'].entries()) {
    for (let seed = 1; seed <= 30; seed++) {
      let game = createGame('ai', style)
      const random = seeded(seed + styleIndex * 1000)
      let actions = 0
      while (game.phase !== 'finished' && actions++ < 4000) {
        if (game.phase === 'farkle') game = finishFarkle(game)
        else if (game.phase === 'handoff') game = startNextTurn(game)
        else {
          const move = chooseAiMove(game)
          assert.ok(move)
          if (move.type === 'bank') {
            assert.ok(canBank(game, move.ids)); game = bankPoints(game, move.ids)
          } else game = rollDice(game, move.ids, random)
        }
        assert.ok(game.players.every(p => Number.isInteger(p.score) && p.score >= 0 && p.score % 50 === 0))
      }
      assert.equal(game.phase, 'finished', `style ${style}, seed ${seed} failed to finish`)
      assert.ok(Math.max(...game.players.map(p => p.score)) >= TARGET_SCORE)
      assert.ok(game.history.filter(e => e.type === 'bank').every(e => e.points > 0))
    }
  }
})
