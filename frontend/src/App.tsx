import axios from 'axios';

import HomePage from './Components/HomePage';
import { BASE_URL } from './Constants/api';
import './App.css';

axios.defaults.baseURL = BASE_URL;

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <HomePage />
      </div>
    </div>
  );
}

export default App;
