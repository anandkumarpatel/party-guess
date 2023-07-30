import cx from 'classnames'
import React, { useEffect } from 'react'
import { isIOS } from 'react-device-detect'
import './game.scss'
import { hash } from './images'
import countdownSoundFile from './sounds/countdown.mp3'
import correctSound from './sounds/sound_correct.mp3'
import skipSound from './sounds/sound_skip.mp3'
import { AutoTextSize } from 'auto-text-size'

const removeUnderscores = (str) => str.replace(/_/g, ' ')

const toMMSS = (s) => (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s

const countdownStartTime = isIOS ? 12 : 11

const Game = ({ activeCollection, inGameTimer, activeItem, isAnimating, removeAnimationClasses, enableSoundEffects }) => {
  const countdownSound = new Audio(countdownSoundFile)
  const soundFile = new Audio()

  useEffect(() => {
    if (enableSoundEffects && activeItem !== '' && activeItem !== undefined) {
      if (isAnimating === 'correct') {
        soundFile.src = correctSound
        soundFile.play()
      }
      if (isAnimating === 'skip') {
        soundFile.src = skipSound
        soundFile.play()
      }
    }
    if (inGameTimer === countdownStartTime) {
      countdownSound.src = countdownSoundFile
      countdownSound.play()
    }
  }, [activeItem, isAnimating, inGameTimer, enableSoundEffects])

  const getActiveItem = () => {
    return activeCollection.name.toLowerCase().includes('kids') ? <img src={hash[activeItem]} alt={removeUnderscores(activeItem)} className='Game-image' /> : activeItem
  }

  const lessThanTen = inGameTimer < 10
  const timer = toMMSS(inGameTimer)
  const statusText = isAnimating === 'correct' ? 'Correct!' : 'Skip!'

  return (
    <>
      <div
        className={cx('Staging', {
          'Staging--correct': isAnimating === 'correct',
          'Staging--skip': isAnimating === 'skip',
        })}
        style={{ height: '100vh', margin: '0 auto' }}
        onTransitionEnd={removeAnimationClasses}
      >
        {activeItem !== undefined ? (
          <div style={{ height: '90vh', margin: '0 auto' }}>
            <AutoTextSize mode='box'>{isAnimating !== '' ? statusText : getActiveItem()}</AutoTextSize>
          </div>
        ) : (
          <p>
            Category is empty :( <br /> Carefully shake device to return to menu.
          </p>
        )}
        <div
          className={cx('Timer', {
            'is-countdown': lessThanTen,
          })}
        >
          {timer}
        </div>
      </div>
    </>
  )
}

export default Game
