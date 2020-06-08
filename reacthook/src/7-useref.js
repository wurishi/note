import React, { useRef } from 'react';

export default function () {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };

  return (
    <>
      <input ref={inputEl} type='text' />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
