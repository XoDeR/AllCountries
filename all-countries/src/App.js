import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  useParams,
  Route,
  Link,
} from "react-router-dom";
import "./style.css";
import load from "./Snake.gif";
const url = "https://restcountries.eu/rest/v2/all";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
