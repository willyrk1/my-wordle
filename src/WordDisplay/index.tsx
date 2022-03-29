import { ComponentPropsWithoutRef } from 'react'
import classNames from 'classnames/bind'
import { EvalType, WordEvaluation } from '../EvalTypes'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

export interface WordDisplayProps extends ComponentPropsWithoutRef<'div'> {
  wordEval: WordEvaluation
  className?: string
}

export const WordDisplay = ({ wordEval, className }: WordDisplayProps) => (
  <div className={cx(className, 'word')}>
    {wordEval.map(({ letter, evalType }, key) => (
      <div key={key} className={cx(evalType)}>
        {letter?.toUpperCase()}
      </div>
    ))}
  </div>
)

export interface RawWordDisplayProps {
  word: string
  minLength: number
}

const convertRawToEval = ({ word, minLength }: RawWordDisplayProps): WordEvaluation => {
  const wordEval: WordEvaluation = word?.split('').map(
    c => ({ letter: c, evalType: EvalType.None })
  ) || []

  const wordLength = Math.max(word.length, minLength || 0)

  return [...Array(wordLength)].map((dummy, i) =>
    wordEval[i] || { letter: '', evalType: EvalType.None }
  )
}

export const RawWordDisplay = (props: RawWordDisplayProps) => {
  return <WordDisplay {...props} wordEval={convertRawToEval(props)} />
}
