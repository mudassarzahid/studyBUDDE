import './App.css';
import sleepy from './images/sleepy_bot.png';
import awake from './images/awake_bot.png';
import happy from './images/happy_bot.png';
import axios from 'axios';
import nerd from './images/nerd_bot.png';
import disappointed from './images/disappointed_bot.png';
import clock from './images/clock.png';
import red from './images/red.png';
import blue from './images/blue.png';
import yellow from './images/yellow.png';
import pink from './images/pink.png';
import * as VIAM from '@viamrobotics/sdk';
import React, {useEffect, useState} from "react";
import './ghosts.css'
import styled from "styled-components";
import Icon from "@material-ui/core/Icon";
import LinearProgress from "@material-ui/core/LinearProgress";


const TimerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const TimerIcon = styled(Icon)`
  padding: 1rem;
  color: darkblue;
`;

const TimerBar = styled(LinearProgress)`
  width: 100rem;
  border-radius: 10px;
`;

function App() {
  const [robotCharacter, setRobotCharacter]: string = useState(sleepy);
  const [message, setMessage]: string = useState("How good is your concentration?");
  const [timerMinutes, setTimerMinutes]: number = useState(20);
  const [initialTime, setInitialTime]: number = useState(null);
  const [focusMessage, setFocusMessage]: string = useState("Focus Time!")

  function handleFocusButton() {
    setRobotCharacter(awake);
    setInitialTime(timerMinutes * 60000);
    setFocusMessage("Focusing…")
    axios.post(`http://localhost:3003/send_duration`, {"duration": timerMinutes * 60}, {timeout: 5000})
      .then(
        res => {
          console.log(res)
        })
      .catch(function (error) {
        console.log(error);
      });
  }

  function resetTime() {
    setRobotCharacter(sleepy);
    setInitialTime(null);
    setFocusMessage("Focus Time!")
    setResults("")
  }

  const [progress, setProgress] = useState(initialTime);
  const [results, setResults] = useState("");
  const time_to_subtract = 1000;
  const tickFrequency = 1000;
  const timeLeft = initialTime;
  const timerIcon = "⌛"

  const fetchData = () => {
    axios.get('http://localhost:3003/get_json', { timeout: 5000 })
      .then((res) => {
        console.log(res.data)
        if (res.data.json === undefined) {
          setTimeout(fetchData, 1000);
          return
        }
        const mockedAPIResult = 90;
        if (mockedAPIResult > 80) {
          setResults(`You have been focused ${mockedAPIResult}% of the time. Good job!`);
          setRobotCharacter(happy);
          axios.post(`http://localhost:3003/send_result`, {"result": 1}, {timeout: 5000})
            .then(
              res => {
                console.log(res)
              })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          setResults(`You have been focused ${mockedAPIResult}% of the time. Try harder! >:(`);
          setRobotCharacter(disappointed);
          axios.post(`http://localhost:3003/send_result`, {"duration": 0}, {timeout: 5000})
            .then(
              res => {
                console.log(res)
              })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Retry")
        // Retry the request after a delay (e.g., 1 second)
        setTimeout(fetchData, 1000);
      });
  };

  useEffect(() => {
    if (progress === 0) {
      fetchData()
      setFocusMessage("Focus Time!")
      return;
    }

    const progress_timer = setTimeout(() => {
      if (progress > 0) {
        setProgress((progress) => progress - time_to_subtract);
      }
    }, tickFrequency);
    return () => {
      clearInterval(progress_timer);
    };
  }, [progress]);

  useEffect(() => {
    if (!timeLeft || timeLeft > initialTime) return;
    setProgress(timeLeft);
  }, [timeLeft]);

  const formatMillisToPercentage = (milliseconds) => {
    return Math.floor((milliseconds / initialTime) * 100);
  };

  return (
    <>
      <div className="website-title">. . Study BUDD-E . .</div>
      <div className="robot-container">
        <div className="progressbar-container">
          {results === "" ? <TimerContainer>
            <TimerIcon>{timerIcon}</TimerIcon>
            <TimerBar
              variant="determinate"
              value={formatMillisToPercentage(progress)}
            />
          </TimerContainer> : <div>{results}</div>}
        </div>
        <div className="robot-character">
          <img className="robot-img" src={robotCharacter} alt="Robot"/>
        </div>
        <div className="time-wrapper">
          <div className="minutes-wrapper">
            <div className="minus" onClick={() => {
              setTimerMinutes(Math.max(timerMinutes - 5, 0.3));
              resetTime();
            }}>-
            </div>
            <div className="minutes-value">{timerMinutes}</div>
            <div className="plus" onClick={() => {
              setTimerMinutes(Math.ceil(timerMinutes / 5) * 5 + 5);
              resetTime();
            }}>+
            </div>
          </div>
          <div className="spacer-m"/>
          <div className="button focus-button" onClick={handleFocusButton}>{focusMessage}</div>
        </div>
      </div>
      <div className="spacer-l"></div>
      <div className="ghost-container">
        <img src={red} className="ghost red-ghost" alt="Red ghost" onMouseOver={() => setMessage("You can do it!")}/>
        <img src={blue} className="ghost blue-ghost" alt="Blue ghost"
             onMouseOver={() => setMessage("Attention Pays!")}/>
        <img src={pink} className="ghost pink-ghost" alt="Pink ghost" onMouseOver={() => setMessage("Focus and Win!")}/>
        <img src={yellow} className="ghost yellow-ghost" alt="Yellow ghost"
             onMouseOver={() => setMessage("Let's goooooo! :)")}/>
      </div>
      <div className="message">{message}</div>
    </>
  )
    ;
}

export default App;
