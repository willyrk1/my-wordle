import { ComponentPropsWithoutRef } from 'react'
import classNames from 'classnames/bind'
import styles from './style.module.scss'
import { EvalType } from '../EvalTypes'

const cx = classNames.bind(styles)

export interface KeyboardProps extends ComponentPropsWithoutRef<'div'> {
  onLetterPressed: (letter: string) => void
  onEnterPressed: () => void
  isEnterDisabled?: boolean
  keyColors: Record<string, EvalType>
  className?: string
}

export const Keyboard = ({
  onLetterPressed,
  onEnterPressed,
  isEnterDisabled,
  keyColors,
  className,
  ...rest
}: KeyboardProps) => (
  <div {...rest} className={cx(className, 'keyboard')}>
    {['QWERTYUIOP', 'ASDFGHJKL', '<ZXCVBNM'].map(line => (
      <div key={line} className={cx('keyboard-line')}>
        {line.split('').map(letter => (
          <button
            key={letter}
            onClick={() => onLetterPressed(letter)}
            className={cx(keyColors[letter.toLowerCase()])}
          >
            {letter}
          </button>
        ))}
      </div>
    ))}

    <div className={cx('keyboard-line')}>
      <button onClick={onEnterPressed} disabled={isEnterDisabled}>
        ENTER
      </button>
    </div>
  </div>
)
