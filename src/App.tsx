import { useState } from 'react';
import Calendar from './components/calendar';
import Stats from './components/stats';
import StartWorkingSession from './components/startWorkingSession';

function App() {

  

  const [
    update, setUpdate
  ] = useState(false);





  return (
    <>
      <Calendar />
      <StartWorkingSession setUpdate={setUpdate} />
      <Stats update={update} setUpdate={setUpdate} />
    </>
  );
}

export default App;
