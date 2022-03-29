import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import history from 'history/browser'
import queryString from 'query-string'
import styles from './App.module.scss'
import simpleWords from './simpleWords'
import allWords from './allWords'
import evaluateGuess from './evaluateGuess'
import CountSelector from './CountSelector'
import { WordDisplay, RawWordDisplay } from './WordDisplay'
import { Keyboard } from './Keyboard'
import { EvalType, WordEvaluation } from './EvalTypes'

const cx = classNames.bind(styles)

const App = () => {
  const [theWord, setTheWord] = useState('')
  const [wordLength, setWordLength] = useState(5)
  const [evaluatedList, setEvaluatedList] = useState<WordEvaluation[]>([])
  const [inProgress, setInProgress] = useState('')
  const [keyColors, setKeyColors] = useState<Record<string, EvalType>>({})
  const [showHint, setShowHint] = useState(false)
  const [possibles, setPossibles] = useState<string[]>([])

  const setNewWord = (newLength: number) => {
    const pool = simpleWords.filter(word => word.length === newLength && word === word.toLowerCase())
    setTheWord(pool[Math.floor(Math.random() * pool.length)])
  }

  const handleLengthChange = (newLength: number) => {
    // Clear word query param.
    const { word, ...newParams } = queryString.parse(history.location.search)
    history.push({ search: queryString.stringify(newParams) })

    setEvaluatedList([])
    setInProgress('')
    setWordLength(newLength)
    setNewWord(newLength)
    setKeyColors({})
    setPossibles([])
    setShowHint(false)
  }

  const handleInProgressLetter = (letter: string) => {
    if (letter === '<') {
      setInProgress(inProgress.slice(0, -1))
    }
    else {
      setInProgress(`${inProgress}${letter.toLowerCase()}`.slice(0, wordLength))
    }
  }

  const inProgressValid = inProgress.length === wordLength && allWords.includes(inProgress)

  const handleEnter = () => {
    if (inProgressValid) {
      const evalTypeRanks: Record<EvalType, number> = {
        [EvalType.Match]: 2,
        [EvalType.PartialMatch]: 1,
        [EvalType.NoMatch]: 0,
        [EvalType.None]: -1,
      }

      const evaluation = evaluateGuess(inProgress, theWord)

      /*
       * Update the keyboard colors based on this evaluation.
       */
      const newKeyColors = evaluation.reduce((acc, { letter, evalType }) => {
        if (evalTypeRanks[evalType] >= evalTypeRanks[acc[letter] || EvalType.NoMatch]) {
          acc[letter] = evalType
        }
        return acc
      }, { ...keyColors })

      setKeyColors(newKeyColors)
      setEvaluatedList([...evaluatedList, evaluation])
      setInProgress('')

      const newEvals = [...evaluatedList, evaluation]
      const possibles = allWords.filter(word => {
        if (word.length === wordLength && word === word.toLowerCase()) {
          return newEvals.every(thisEval => {
            const evalWord = thisEval.map(({ letter }) => letter).join('')
            const testEval = evaluateGuess(evalWord, word)
            return JSON.stringify(thisEval.map(({ evalType }) => evalType)) ===
                   JSON.stringify(testEval.map(({ evalType }) => evalType))
          })
        }
      })

      setPossibles(possibles)
    }
  }

  const handleSurrender = () => {
    setInProgress(theWord)
  }

  useEffect(() => {
    const wordParam = queryString.parse(history.location.search).word
    if (wordParam && typeof wordParam == 'string') {
      setTheWord(wordParam)
    }
    else {
      setNewWord(wordLength)
    }
  }, [wordLength])

  return (
    <div className={cx('app')}>
      <div>Word length:&nbsp;</div>
      <div>
        <CountSelector onSelection={handleLengthChange} />
      </div>

      <div className={cx('surrender')}>
        <button onClick={() => handleSurrender()}>
          I GIVE UP!!!
        </button>
      </div>
      
      {evaluatedList.map((evaluatedWord, eIndex) => (
        <WordDisplay key={eIndex} wordEval={evaluatedWord} />
      ))}

      <RawWordDisplay word={inProgress} minLength={wordLength} />

      <Keyboard
        onLetterPressed={handleInProgressLetter}
        onEnterPressed={handleEnter}
        isEnterDisabled={!inProgressValid}
        keyColors={keyColors}
      />

      <div className={cx('hint')}>
        <button onClick={() => setShowHint(!showHint)}>HINT!</button>

        {showHint && (
          <div className={cx('hint-words')}>
            <ul>
              {possibles.map(possible => <li key={possible}>{possible.toUpperCase()}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
