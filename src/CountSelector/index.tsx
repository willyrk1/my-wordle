import { ComponentPropsWithoutRef } from 'react'
import classNames from 'classnames/bind'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

export interface CountSelectorProps extends ComponentPropsWithoutRef<'button'> {
  onSelection: (count: number) => void
  className?: string
}

const CountSelector = ({
  onSelection,
  className,
  ...rest
}: CountSelectorProps) => (
  <>
    {[...Array(12)].map((dummy, i) => (
      <button
        {...rest}
        key={i}
        onClick={() => onSelection(i + 3)}
        className={cx(className, 'count-selector')}
      >
        {i + 3}
      </button>
    ))}
  </>
)

export default CountSelector
