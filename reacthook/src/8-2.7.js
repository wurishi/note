import React, { useState, useRef, useEffect } from 'react';

export default function () {
  const [count, setCount] = useState(0);
  const countRef = useRef();
  useEffect(() => {
    countRef.current = count;
  }, [count]);
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + countRef.current);
    }, 3000);
  }
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={handleAlertClick}>Show alert</button>
    </div>
  );
}
