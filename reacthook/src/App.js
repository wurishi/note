import React from 'react';
import logo from './logo.svg';
import './App.css';

import Example1 from './1-example';
import Example2 from './2-useeffect';
import Example7 from './7-usecontext';
import Example7_1 from './7-usereducer';
import Example7_2 from './7-useref';

function App() {
  return (
    <div className='App'>
      <Example7_2 />
    </div>
  );
}

export default App;
