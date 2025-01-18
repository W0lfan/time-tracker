import React, { useEffect, useState } from "react";
import { updateLocalStorageInMilliseconds } from "./stats";
import './styles/working-session.scss';

interface StartWorkingSessionProps {
  setUpdate: (update: boolean) => void;
}




const StartWorkingSession: React.FC<StartWorkingSessionProps> = ({
  setUpdate,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [feeling, setFeeling] = useState<string | null>("Neutral");

  const convertTOHHMMSS = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const nameOfEmojies: { [key: string]: string } = {
    "🙂": "Happy",
    "😃": "Very Happy",
    "😐": "Neutral",
    "😴": "Sleepy",
    "😞": "Sad"
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const workingSessionElement = document.querySelector('.working-session');
    const duration : number = 300;
    const size = "60px"

    if (isRunning) {
      if (workingSessionElement) {
        workingSessionElement.animate(
          [
            { height: size },
            { height: '100vh' }
          ],
          {
            duration: duration,
            fill: 'forwards'
          }
        );
      }
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        if (Notification.permission === "granted") {
            if (!("notification" in window)) return;
            let notification = new Notification("Time Tracker", {
              body: `Time elapsed: ${convertTOHHMMSS(time + 1)}`,
            });
            setInterval(() => {
              notification.close();
              notification = new Notification("Time Tracker", {
                body: `Time elapsed: ${convertTOHHMMSS(time + 1)}`,
              });
            }, 1000);
        } else {
          Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
              new Notification("Time Tracker", {
                  body: `Time elapsed: ${convertTOHHMMSS(time + 1)}`,
              });
            }
          });
        }
      }, 1000);
    } else {
      if (workingSessionElement && time === 0) {
        workingSessionElement.animate(
          [
            { height: '100vh' },
            { height: size }
          ],
          {
            duration: duration,
            fill: 'forwards'
          }
        );
      }
      if (interval) clearInterval(interval);
    }

    if (navigator.vibrate) {
        navigator.vibrate(1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStop = () => {
    updateLocalStorageInMilliseconds(
      new Date().toLocaleDateString(), 
      time * 1000,
      document.querySelector('textarea')?.value || null,
      feeling ? nameOfEmojies[feeling] : "Neutral"
    );
    setTime(0);
    setIsRunning(false);
    setUpdate(true);
    const workingSessionElement = document.querySelector('.working-session');
    if (workingSessionElement) {
      workingSessionElement.animate(
        [
          { height: '100vh' },
          { height: '60px' }
        ],
        {
          duration: 300,
          fill: 'forwards'
        }
      );
    }
  };

  return (
    <div className={
      isRunning || time > 0 ? 'working-session running' : 'working-session'
    }>
        <div className="content">
          <div className="content-element">
            <div className="content-title">
              Notes
            </div>
            <textarea placeholder="What are you working on?"></textarea>
          </div>
          <div className="content-element">
              <div className="content-title">
                  How are you feeling?
              </div>
              <div className="content-emotions">
                {
                  ["🙂","😃","😐","😴","😞"].map((el,key) => {
                    return (
                      <button onClick={() => {
                        setFeeling(el);
                      }} className={
                        feeling === el ? 'selected' : ''
                      } key={key}><img src={`https://emojicdn.elk.sh/${el}`} alt={el} /></button>
                    )
                  })
                }
              </div>
          </div>
        </div>
        <div className="timer">
          <div className="working-session-title">{convertTOHHMMSS(time)}</div>
          <div className="buttons">
            {/*
                Pause
                Resume 
                Start 
                Stop
            */}
          {isRunning ? (
              <button onClick={() => setIsRunning(false)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M640-200q-33 0-56.5-23.5T560-280v-400q0-33 23.5-56.5T640-760q33 0 56.5 23.5T720-680v400q0 33-23.5 56.5T640-200Zm-320 0q-33 0-56.5-23.5T240-280v-400q0-33 23.5-56.5T320-760q33 0 56.5 23.5T400-680v400q0 33-23.5 56.5T320-200Z"/></svg></button>
            ) : time > 0 ? (
              <button onClick={() => setIsRunning(true)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-280v-400q0-17 11.5-28.5T280-720q17 0 28.5 11.5T320-680v400q0 17-11.5 28.5T280-240q-17 0-28.5-11.5T240-280Zm221 4q-20 12-40.5 0T400-311v-338q0-23 20.5-35t40.5 0l282 170q20 12 20 34t-20 34L461-276Z"/></svg></button>
            ) : (
              <button onClick={() => {
                setIsRunning(true);
                setTime(1);
              }}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/></svg></button>
            )}
            {time > 0 && (
              <button onClick={handleStop} className="stop-button">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-320v-320q0-33 23.5-56.5T320-720h320q33 0 56.5 23.5T720-640v320q0 33-23.5 56.5T640-240H320q-33 0-56.5-23.5T240-320Z"/></svg>
              </button>
            )}
          </div>
        </div>
    </div>
  );
};

export default StartWorkingSession;
