import { EvalType, WordEvaluation } from "./EvalTypes"

const evaluateGuess = (guess: string, correct: string): WordEvaluation => {
  /*
   * First find perfect matches and non-matches.
   */
  const retVal: WordEvaluation = guess
    .split('')
    .map((letter, index) => {
      const evalType = (() => {
        if (correct[index] === letter) {
          return EvalType.Match
        }
        if (!correct.includes(letter)) {
          return EvalType.NoMatch
        }
        return EvalType.None
      })()
      return { letter, evalType }
    })

  /*
   * Now find the partial matches making sure not to double match any.
   */
  const matches: { [letter: string]: number } = {}

  for (let index = 0; index < retVal.length; index++) {
    const { letter, evalType } = retVal[index]
    if (evalType === EvalType.None) {
      const firstMatch = correct
        .split('')
        .findIndex((c, sIndex) => {
          return c === letter && sIndex >= (matches[c] || 0) && retVal[sIndex].evalType !== 'match'
        })
      if (firstMatch >= 0) {
        retVal[index].evalType = EvalType.PartialMatch
        matches[letter] = firstMatch + 1
      }
      else {
        retVal[index].evalType = EvalType.NoMatch
      }
    }
  }

  return retVal
}

export default evaluateGuess
