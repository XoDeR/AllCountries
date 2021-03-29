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
  return <Home />;
}

const Home = () => {
  return (
    <Router>
      <Route exact path="/">
        <div />
      </Route>
      <Route path="/:name">
        <div />
      </Route>
    </Router>
  );
}

export default App;
