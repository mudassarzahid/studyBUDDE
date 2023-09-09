import './App.css';
import sleepy from './icons/sleepy_bot.png';
import awake from './icons/awake_bot.png';
import happy from './icons/happy_bot.png';
import * as VIAM from '@viamrobotics/sdk';
import {useState} from "react";

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
      <div className="App">
        <div className="robot-character"><img height="100px" src={robotCharacter} alt="Robot"></img></div>
        <div className="clean-button" onClick={handleCleanButton}>Clean</div>
      </div>
    </>
  );
}

export default App;
