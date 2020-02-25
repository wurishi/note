import React, { useContext, useState } from 'react';

const themes = {
  light: {
    color: '#000000',
    background: '#eeeeee'
  },
  dark: {
    color: '#ffffff',
    background: '#222222'
  }
};

const ThemeContext = React.createContext(themes.light);

export default function App() {
  const [currentTheme, setCurrentTheme] = useState(themes.light);
  return (
    <ThemeContext.Provider value={currentTheme}>
      <select onChange={e => setCurrentTheme(themes[e.target.value])}>
        <option value='light'>light</option>
        <option value='dark'>dark</option>
      </select>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={theme}>
      I am styled by theme context!
    </button>
  );
}