import './App.css';
import sleepy from './icons/sleepy_bot.png';
import awake from './icons/awake_bot.png';
import happy from './icons/happy_bot.png';
import red from './icons/red.png';
import blue from './icons/blue.png';
import yellow from './icons/yellow.png';
import pink from './icons/pink.png';
import * as VIAM from '@viamrobotics/sdk';
import {useState} from "react";
import './ghosts.css'

function App() {
  const [robotCharacter, setRobotCharacter]: string = useState(sleepy);

  async function runRobot() {
    const host = 'cleaner-main.z4c0q9m1s6.viam.cloud';

    const robot = await VIAM.createRobotClient({
      host,
      credential: {
        type: 'robot-location-secret',
        payload: 'c67akhprcheo07fqfjo1gca8xn6cup0e5hias3326x2n3dio',
      },
      authEntity: host,
      signalingAddress: 'https://app.viam.com:443',
    });

    console.log('Resources:');
    console.log(await robot.resourceNames());
  }

  function handleCleanButton() {
    setRobotCharacter(awake);
    runRobot().catch((error) => {
      console.error('encountered an error:', error)
    });
    setRobotCharacter(happy);
  }

  return (
    <>
      <div className="website-title">. . . Reward-E . . .</div>
      <div className="robot-container">
        <div className="robot-character">
          <img height="100px" src={robotCharacter} alt="Robot"/>
        </div>
        <div className="button focus-button" onClick={handleCleanButton}>Focus Time</div>
      </div>
      <div className="spacer"></div>
      <div className="ghost-container">
        <img src={red} className="ghost red-ghost" alt="Red ghost"/>
        <img src={blue} className="ghost blue-ghost" alt="Blue ghost"/>
        <img src={pink} className="ghost pink-ghost" alt="Pink ghost"/>
        <img src={yellow} className="ghost yellow-ghost" alt="Yellow ghost"/>
      </div>
    </>
  );
}

export default App;
