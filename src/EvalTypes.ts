
export enum EvalType {
  None = 'none',
  Match = 'match',
  PartialMatch = 'partial-match',
  NoMatch = 'no-match'
}

export interface LetterEvaluation {
  letter: string
  evalType: EvalType
}

export type WordEvaluation = LetterEvaluation[]
