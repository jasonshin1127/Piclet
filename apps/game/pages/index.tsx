import Quizlet from 'dataset';
import {
  CardSide,
  MediaType,
  SerializedMedia,
  SerializedMediaImage,
  SerializedMediaText,
  StudiableItem,
  StudiableCardSideLabel,
} from 'dataset/types';

import s from './index.module.css';
import React, { useState, useEffect } from 'react';

export default function Game() {
  // to get a specific Set
  // const { disneyPrincessTrivia: quizletSet } = Fun.getAllSetsMap();
  const quizletSet = Quizlet.getRandomSet();

  let itemIndex = 0;

  const getNextWord = () => {
    const labelCardSide = quizletSet.studiableItem[
      itemIndex++
    ].cardSides.filter(
      cardside => cardside.label == StudiableCardSideLabel.WORD
    )[0];

    const text = labelCardSide.media[0] as SerializedMediaText;
    const { plainText } = text;
    return plainText;
  };

  const [timeLeft, setTimeLeft] = useState(10);
  const [word, setWord] = useState('');

  useEffect(() => {
    // SETUP CANVAS
    const canvas = document.getElementById(s.canvas) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const canvasOffsetX = canvas.offsetLeft;
    const canvasOffsetY = canvas.offsetTop;
    canvas.width = window.innerWidth - canvasOffsetX;
    canvas.height = window.innerHeight - canvasOffsetY;

    let isPainting = false;
    let lineWidth = 5;

    // Draw on canvas
    const onMouseMove = e => {
      if (!isPainting || collapsed) {
        return;
      }

      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      ctx.lineTo(e.clientX - canvasOffsetX - 30, e.clientY - 30);
      ctx.stroke();
    };

    canvas.addEventListener('mousedown', e => {
      isPainting = true;
    });

    canvas.addEventListener('mouseup', e => {
      isPainting = false;
      ctx.stroke();
      ctx.beginPath();
    });

    canvas.addEventListener('mousemove', onMouseMove);

    // Setup Toolbar
    const clearButton = document.getElementById('clear');
    const nextButton = document.getElementById('next');
    const quizModeButton = document.getElementById('quizmode');
    const word = document.getElementById('word');

    const onClearButtonClick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const onNextButtonClick = () => {
      collapsed = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setWord(getNextWord());
      timeLeftValue = startingTime;
      setTimeLeft(timeLeftValue);
    };

    clearButton.addEventListener('click', onClearButtonClick);
    nextButton.addEventListener('click', onNextButtonClick);

    // Setup Countdown
    const countdown = document.getElementById('countdown');

    const startingTime = 10;
    let timeLeftValue = 10;
    let collapsed = false;

    const updateTime = () => {
      if (timeLeftValue == 0) {
        collapsed = true;
        return;
      }
      timeLeftValue--;
      setTimeLeft(timeLeftValue);
    };

    let isTimerRunning = false;

    const onQuizModeButtonClick = () => {
      if (isTimerRunning) return;
      setInterval(updateTime, 1000);
      isTimerRunning = true;
      setWord(getNextWord());
    };

    quizModeButton.addEventListener('click', onQuizModeButtonClick);
  }, []);

  return (
    <div className={s.container}>
      <div id={s.toolbar}>
        <h1>
          Word: <span id="word">{word}</span>
        </h1>
        <h2>
          Time: <span id="countdown">{timeLeft}</span>
        </h2>
        <button id="clear">Clear</button>
        <button id="next">Next</button>
        <br />
        <button id="quizmode">Quiz Mode</button>
      </div>
      <div className="drawing-board">
        <canvas id={s.canvas}></canvas>
      </div>
    </div>
  );
}
