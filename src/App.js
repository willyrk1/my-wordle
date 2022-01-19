import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import styles from './App.module.scss'
import simpleWords from './simpleWords'
import allWords from './allWords'

const cx = classNames.bind(styles)

const evaluateGuess = (guess, correct) => {
  /*
   * First find perfect matches and non-matches.
   */
  const retVal = guess
    .split('')
    .map((letter, index) => {
      const evalType = (() => {
        if (correct[index] === letter) {
          return 'match'
        }
        if (!correct.includes(letter)) {
          return 'no-match'
        }
      })()
      return { letter, evalType }
    })

  /*
   * Now find the partial matches making sure not to double match any.
   */
  const matches = {}

  for (let index = 0; index < retVal.length; index++) {
    const { letter, evalType } = retVal[index]
    if (!evalType) {
      const firstMatch = correct
        .split('')
        .findIndex((c, sIndex) => {
          return c === letter && sIndex >= (matches[c] || 0) && retVal[sIndex].evalType !== 'match'
        })
      if (firstMatch >= 0) {
        retVal[index].evalType = 'partial-match'
        matches[letter] = firstMatch + 1
      }
      else {
        retVal[index].evalType = 'no-match'
      }
    }
  }

  return retVal
}

const evalTypeRanks = {
  match: 2,
  'partial-match': 1,
  'no-match': 0,
}

const App = () => {
  const [theWord, setTheWord] = useState()
  const [wordLength, setWordLength] = useState(5)
  const [evaluatedList, setEvaluatedList] = useState([])
  const [inProgress, setInProgress] = useState('')
  const [keyColors, setKeyColors] = useState({})

  const setNewWord = newLength => {
    const pool = simpleWords.filter(word => word.length === newLength && word === word.toLowerCase())
    setTheWord(pool[Math.floor(Math.random() * pool.length)])
  }

  const handleLengthChange = newLength => {
    setEvaluatedList([])
    setInProgress('')
    setWordLength(newLength)
    setNewWord(newLength)
    setKeyColors({})
  }

  const handleInProgressLetter = letter => {
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
      const evaluation = evaluateGuess(inProgress, theWord)

      /*
       * Update the keyboard colors based on this evaluation.
       */
      const newKeyColors = evaluation.reduce((acc, { letter, evalType }) => {
        if (evalTypeRanks[evalType] >= evalTypeRanks[acc[letter] || 'no-match']) {
          acc[letter] = evalType
        }
        return acc
      }, { ...keyColors })

      setKeyColors(newKeyColors)
      setEvaluatedList([...evaluatedList, evaluation])
      setInProgress('')
    }
  }

  useEffect(() => {
    setNewWord(wordLength)
  }, [wordLength])

  return (
    <div className={cx('app')}>
      <div className={cx('keyboard', 'keyboard-line')}>
        Word length:&nbsp;
        {[...Array(6)].map((dummy, i) => (
          <button key={i} onClick={() => handleLengthChange(i + 3)}>
            {i + 3}
          </button>
        ))}
      </div>
      
      {evaluatedList.map((evaluatedWord, eIndex) => (
        <div key={eIndex} className={cx('word')}>
          {evaluatedWord.map(({ letter, evalType }, lIndex) => (
            <div key={lIndex} className={cx(evalType)}>
              {letter.toUpperCase()}
            </div>
          ))}
        </div>
      ))}

      <div className={cx('word')}>
        {[...Array(wordLength)].map((dummy, i) => (
          <div key={i}>{inProgress[i]?.toUpperCase() || ''}</div>
        ))}
      </div>

      <div className={cx('keyboard')}>
        {['QWERTYUIOP', 'ASDFGHJKL', '<ZXCVBNM'].map(line => (
          <div key={line} className={cx('keyboard-line')}>
            {line.split('').map(letter => (
              <button
                key={letter}
                onClick={() => handleInProgressLetter(letter)}
                className={cx(keyColors[letter.toLowerCase()])}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}

        <div className={cx('keyboard-line')}>
          <button onClick={() => handleEnter()} disabled={!inProgressValid}>
            ENTER
          </button>
        </div>
      </div>
    </div>
  );
}

export default App
