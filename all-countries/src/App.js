import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  useParams,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { Redirect } from 'react-router';
import "./style.css";
import load from "./Snake.gif";
const url = "https://restcountries.eu/rest/v2/all";

function App() {
  return <Home />;
}

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataDef, setDataDef] = useState([]);
  const [down, setDown] = useState(false);
  const [search, setSearch] = useState("");
  const [drop, setDrop] = useState([]);
  const [dropName, setDropName] = useState("Filter By Region");
  
  const getCountries = async () => {
    const response = await fetch(url);
    const finalResponse = await response.json();
    
    setData(finalResponse.filter((item) => { return item.population >= 1000000 }));
    setDataDef(finalResponse.filter((item) => { return item.population >= 1000000 }));
    setDrop(finalResponse.filter((item) => { return item.population >= 1000000 }));
    
    setLoading(false);
  };
  const sort = [...new Set(drop.map((item) => item.region))];
  
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  useEffect(() => {
    getCountries();
  }, []);
  
  useEffect(() => {
    const filtered = dataDef.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
    setData(filtered);
  }, [search, dataDef]);
  
  const Trial = () => {
    if (loading) {
      return (
        <div className="loading">
          <img src={load} alt="loader" />
        </div>
      );
    }
    return (
      <div className="container">
        
        <button className="quiz1-btn">
          <Link to="/quiz1">
            <span>
              <i className="fas fa-address-book-o"></i>
            </span>
            <span>Quiz 1</span>
          </Link>
        </button>
    
        <button className="quiz2-btn">
          <Link to="/quiz2">
            <span>
              <i className="fas fa-address-book-o"></i>
            </span>
            <span>Quiz 2</span>
          </Link>
        </button>
        
        <div className="filter">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search for a country..."
              value={search}
              autoFocus
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className="dropdown">
            <div
              className={`trash ${dropName === "Filter By Region" && `dead`}`}
              onClick={() => {
                setDropName("Filter By Region");
                setData(drop);
                setDown(false);
              }}
            >
              <i className="far fa-trash-alt"></i>
            </div>
            <div
              className="shown"
              onClick={() => {
                setDown(!down);
              }}
            >
              <p>{dropName}</p>
              <i className="fas fa-chevron-down"></i>
            </div>
            <div className={`hidden ${down && "true"} `}>
              {sort.map((item, index) => {
                if (!item) {
                  return null;
                }
                return (
                  <button
                    className="filter-btn"
                    key={index}
                    onClick={() => {
                      setData(drop.filter((e) => e.region === item));
                      setDropName(item);
                      setDown(false);
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="countries">
          {
            data.map((item) => {
            return (
              <Link to={`/${item.name}`} className="card" key={item.name}>
                <img src={item.flag} alt="flag" />
                <div className="text">
                  <h4>{item.name}</h4>
                  <h5>
                    <span className="bold">Population: </span>
                    <span className="light">
                      {numberWithCommas(item.population)}
                    </span>
                  </h5>
                  <h5>
                    <span className="bold">Region: </span>
                    <span className="light">{item.region}</span>
                  </h5>
                  <h5>
                    <span className="bold">Capital: </span>
                    <span className="light">{item.capital}</span>
                  </h5>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <Router>
      <Route exact path="/">
        <Trial />
      </Route>
      <Route path="/:name">
        <SingleCountry data={data} />
      </Route>
      <Route exact path="/quiz1">
        <Quiz1 data={data} />
      </Route>
      <Route exact path="/quiz2">
        <Quiz2 data={data} />
      </Route>
    </Router>
  );
}

const Quiz1 = ({ data }) => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  const [countriesRemaining, setCountriesRemaining] = useState(data);
  
  const [item, setItem] = useState(countriesRemaining[Math.floor(Math.random() * countriesRemaining.length)]);
  
  const [inputCapital, setInputCapital] = useState("");
  
  const [capitalCorrect, setCapitalCorrect] = useState(false);
  
  const [isNewQuiz, setIsNewQuiz] = useState(false);
  
  const [guessMade, setGuessMade] = useState(false);
  const [guessedCorrect, setGuessedCorrect] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  
  const isCapitalCorrectFirstRun = useRef(true);
  useEffect (() => {
    if (isCapitalCorrectFirstRun.current) {
      isCapitalCorrectFirstRun.current = false;
      return;
    }
    if (capitalCorrect === true) {
      setGuessedCorrect(guessedCorrect + 1);
    }
    
    setCapitalCorrect(false);
    console.log("capitalCorrect");
  }, [capitalCorrect]);
  
  const isNewQuizFirstRun = useRef(true);
  useEffect (() => {
    if (isNewQuizFirstRun.current) {
      isNewQuizFirstRun.current = false;
      return;
    }
    
    if (isNewQuiz == true) {
      console.log("isNewQuiz");
      startNewQuiz();
    }
  }, [isNewQuiz]);
  
  const startNewQuiz = () => {
    if (guessMade === false) {
      setTotalGuesses(totalGuesses + 1);
    }
    
    setGuessMade(false);
    
    setInputCapital("");

    // remove item from all the countries
    for( var i = 0; i < countriesRemaining.length; i++){ 
        if ( countriesRemaining[i] === item) { 
            countriesRemaining.splice(i, 1); 
        }
    }
    // new item
    setItem(countriesRemaining[Math.floor(Math.random() * countriesRemaining.length)]);
    setIsNewQuiz(false);
  }
  
  const handleInput = () => {
    if (inputCapital.length !== 0) {
      checkIfCorrect();
    }
  }
  
  const checkIfCorrect = () => {
    if (item && guessMade === false) {
      setGuessMade(true);
      setTotalGuesses(totalGuesses + 1);
      let capital = item.capital;
      if (inputCapital === capital) {
        setCapitalCorrect(true);
        var audio = new Audio('https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3');
        audio.play();
      }
      else {
        setCapitalCorrect(false);
        setInputCapital(capital);
      }
    }
  };
  
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      checkIfCorrect();
    }
  };
  
  if (item == null) {
    return (<></>);
  }
  return (
    <>
      <div className="container">
        <div className="header">
          <div className="header-info">
            <h1>Where in the world?</h1>
          </div>
        </div>
        <div className="custom-cont">
          <div>
            {/*<!-- Back -->*/}
            <button className="back-btn">
              <Link to="/">
                <span>
                  <i className="fas fa-arrow-left"></i>
                </span>
                <span>Back</span>
              </Link>
            </button>
            
            <h5>
              {guessedCorrect} / {totalGuesses}
            </h5>
            
            {/*<!-- Next -->*/}
            <button className="next-btn" onClick={() => { setIsNewQuiz(true); }}>
              <div>
                <span>
                    <i className="fas fa-arrow-right"></i>
                </span>
                <span>Next</span>
              </div>
            </button>
          
          </div>
          <div className="input-capital">
            <i className="fas fa-search"></i>
            
            <input
              type="text"
              placeholder="Capital..."
              value={inputCapital}
              autoFocus
              onChange={(e) => {
                setInputCapital(e.target.value);
              }}
              onKeyPress={handleKeyPress}
            />
            
            <button onClick={() => { handleInput(); }}>
              Enter
            </button>
            
          </div>
          <div className="custom-grid">
            <div className="custom-img">
              <img src={item.flag} alt="img" />
            </div>
            <div className="custom-text">
              <h2>{item.name}</h2>
              <div className="tc">
                <div className="1">
                  <h5>
                    <span className="bold">Native Name: </span>
                    <span className="light">{item.nativeName}</span>
                  </h5>
                  <h5>
                    <span className="bold">Population: </span>
                    <span className="light">
                      {numberWithCommas(item.population)}
                    </span>
                  </h5>
                  <h5>
                    <span className="bold">Region: </span>
                    <span className="light">{item.region}</span>
                  </h5>
                  <h5>
                    <span className="bold">Sub Region: </span>
                    <span className="light">{item.subregion}</span>
                  </h5>
                </div>
                <div className="2">
                  <h5>
                    <span className="bold">Top Level Domain: </span>
                    <span className="light">{item.topLevelDomain}</span>
                  </h5>
                  <h5>
                    <span className="bold">Currencies: </span>
                    <span className="light">
                      {item.currencies[0].name}
                    </span>
                  </h5>
                  <h5>
                    <span className="bold">Languages: </span>
                    <span className="light">
                      {item.languages.map((r) => r.name).join(", ")}
                    </span>
                  </h5>
                </div>
              </div>
              <div className="border">
                <h4>Border Countries: </h4>
                <span>
                  {item.borders.map((f, index) => {
                    if (!f) {
                      return <p>No Bordering Countries</p>;
                    }
                    return (
                      <button className="border-btn">
                        {f}
                      </button>
                    );
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Quiz2 = ({ data }) => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  const [countriesRemaining, setCountriesRemaining] = useState(data);
  
  const [capitalVariants, setCapitalVariants] = useState([]);
  
  const [item, setItem] = useState(countriesRemaining[Math.floor(Math.random() * countriesRemaining.length)]);
  
  const [inputCapital, setInputCapital] = useState("");
  
  const [capitalCorrect, setCapitalCorrect] = useState(false);

  const [isNewQuiz, setIsNewQuiz] = useState(false);
  
  const [guessMade, setGuessMade] = useState(false);
  const [guessedCorrect, setGuessedCorrect] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  
  const initCapitalVariantsList = () => {
    console.log("initCapitalVariantsList");
    
    let countryItemListAux = data;
    let counter = 0;
    let capitalsToAdd = [];
    while (counter < 6) {
      let countryItem = countryItemListAux[Math.floor(Math.random() * countryItemListAux.length)];
      
      capitalsToAdd.push({key : counter, capital : countryItem.capital});

      for (var i = 0; i < countryItemListAux.length; i++){ 
        if (countryItemListAux[i] === item) { 
          countryItemListAux.splice(i, 1); 
        }
      }
      
      counter++;
    }
    
    let randomIndex = Math.floor(Math.random() * capitalsToAdd.length);
    capitalsToAdd[randomIndex] = {key : randomIndex, capital : item.capital};
    
    setCapitalVariants(capitalsToAdd);
  }
  
  useEffect (() => {
    initCapitalVariantsList();
  }, [])
  
  const isCapitalCorrectFirstRun = useRef(true);
  useEffect (() => {
    if (isCapitalCorrectFirstRun.current) {
      isCapitalCorrectFirstRun.current = false;
      return;
    }
    if (capitalCorrect === true) {
      setGuessedCorrect(guessedCorrect + 1);
    }
    
    setCapitalCorrect(false);
    console.log("capitalCorrect");
  }, [capitalCorrect]);
  
  const isNewQuizFirstRun = useRef(true);
  useEffect (() => {
    if (isNewQuizFirstRun.current) {
      isNewQuizFirstRun.current = false;
      return;
    }
    
    if (isNewQuiz === true) {
      console.log("isNewQuiz");
      startNewQuiz();
    }
  }, [isNewQuiz]);
  
  const isItemFirstRun = useRef(true);
  useEffect (() => {
    if (isItemFirstRun.current) {
      isItemFirstRun.current = false;
      return;
    }
    initCapitalVariantsList();
  }, [item]);
  
  const inputCapitalFirstRun = useRef(true);
  useEffect (() => {
    if (inputCapitalFirstRun.current) {
      inputCapitalFirstRun.current = false;
      return;
    }
    if (item && guessMade === false && inputCapital !== "") {
      console.log("inputCapital useEffect");
      checkIfCorrect();
    }
  }, [inputCapital]);
  
  const startNewQuiz = () => {
    console.log("startNewQuiz");
    
    if (guessMade === false) {
      setTotalGuesses(totalGuesses + 1);
    }
    
    setGuessMade(false);
    setInputCapital("");

    // remove item from all the countries
    for (var i = 0; i < countriesRemaining.length; i++){ 
      if (countriesRemaining[i] === item) { 
        countriesRemaining.splice(i, 1); 
      }
    }
    // new item
    setItem(countriesRemaining[Math.floor(Math.random() * countriesRemaining.length)]);
    setIsNewQuiz(false);
    
    console.log("startNewQuiz finished");
  }
  
  const checkIfCorrect = () => {
    console.log("checkIfCorrect start");
    if (item && guessMade === false) {
      setGuessMade(true);
      setTotalGuesses(totalGuesses + 1);
      let capital = item.capital;
      console.log("inputCapital");
      console.log(inputCapital);
      console.log("capital");
      console.log(capital);
      if (inputCapital === capital) {
        setCapitalCorrect(true);
        var audio = new Audio('https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3');
        audio.play();
      }
      else {
        setCapitalCorrect(false);
      }
    }
  };
  
  const handleButtonGuessOnClick = (id) => {
    setInputCapital(capitalVariants[id].capital);
  }

  return (
    <>
      <div className="container">
        <div className="header">
          <div className="header-info">
            <h1>Where in the world?</h1>
          </div>
        </div>
        <div className="button-guess-container">
          <div className="button-guess-center">
            <GuessButtons 
              isGuessMade={guessMade === true}
              isCapitalCorrect={capitalCorrect === true}
              capitalVariantList={capitalVariants}
              capital={item.capital}
              handleButtonGuessOnClick={handleButtonGuessOnClick}
            />
          </div>
        </div>
        <div className="custom-cont">
          <div>
          
            {/*<!-- Back -->*/}
            <button className="back-btn">
              <Link to="/">
                <span>
                  <i className="fas fa-arrow-left"></i>
                </span>
                <span>Back</span>
              </Link>
            </button>
            
            <h5>
              {guessedCorrect} / {totalGuesses}
            </h5>
            
            {/*<!-- Next -->*/}
            <button className="next-btn" onClick={() => { setIsNewQuiz(true); }}>
              <div>
                <span>
                  <i className="fas fa-arrow-right"></i>
                </span>
                <span>Next</span>
              </div>
            </button>
            
          </div>
          <div className="custom-grid">
            <div className="custom-img">
              <img src={item.flag} alt="img" />
            </div>
            <div className="custom-text">
              <h2>{item.name}</h2>
              <div className="tc">
                <div className="1">
                  <h5>
                    <span className="bold">Native Name: </span>
                    <span className="light">{item.nativeName}</span>
                  </h5>
                  <h5>
                    <span className="bold">Population: </span>
                    <span className="light">
                      {numberWithCommas(item.population)}
                    </span>
                  </h5>
                  <h5>
                    <span className="bold">Region: </span>
                    <span className="light">{item.region}</span>
                  </h5>
                  <h5>
                    <span className="bold">Sub Region: </span>
                    <span className="light">{item.subregion}</span>
                  </h5>
                </div>
                <div className="2">
                  <h5>
                    <span className="bold">Top Level Domain: </span>
                    <span className="light">{item.topLevelDomain}</span>
                  </h5>
                  <h5>
                    <span className="bold">Currencies: </span>
                    <span className="light">
                      {item.currencies[0].name}
                    </span>
                  </h5>
                  <h5>
                    <span className="bold">Languages: </span>
                    <span className="light">
                      {item.languages.map((r) => r.name).join(", ")}
                    </span>
                  </h5>
                </div>
              </div>
              <div className="border">
                <h4>Border Countries: </h4>
                <span>
                  {item.borders.map((f, index) => {
                    if (!f) {
                      return <p>No Bordering Countries</p>;
                    }
                    return (
                      <button className="border-btn">
                        {f}
                      </button>
                    );
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const GuessButtons = (props) => {
  if (props.isGuessMade === false) {
    return (props.capitalVariantList.map(item =>
                  <button key={item.key} className="button-guess-variant" onClick={ () => props.handleButtonGuessOnClick(item.key)}>
                  {item.capital}
                  </button>
                )
            );
  }
  else {
    if (props.isCapitalCorrect === true) {
      return (<button className="button-guess-variant">
               {props.capital}
              </button>);
    }
    else {
      return (<button className="button-guess-variant">
               {props.capital}
              </button>);
    }
  }
};

const SingleCountry = ({ data }) => {
  const { name } = useParams();
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <>
      <div className="container">
        <div className="header">
          <div className="header-info">
            <h1>Where in the world?</h1>
          </div>
        </div>
        {data
          .filter((e) => e.name === name)
          .map((item, index) => {
            return (
              <div className="custom-cont" key={index}>
                <button className="back-btn">
                  <Link to="/">
                    <span>
                      <i className="fas fa-arrow-left"></i>
                    </span>
                    <span>Back</span>
                  </Link>
                </button>
                <div className="custom-grid">
                  <div className="custom-img">
                    <img src={item.flag} alt="img" />
                  </div>
                  <div className="custom-text">
                    <h2>{item.name}</h2>
                    <div className="tc">
                      <div className="1">
                        <h5>
                          <span className="bold">Native Name: </span>
                          <span className="light">{item.nativeName}</span>
                        </h5>
                        <h5>
                          <span className="bold">Population: </span>
                          <span className="light">
                            {numberWithCommas(item.population)}
                          </span>
                        </h5>
                        <h5>
                          <span className="bold">Region: </span>
                          <span className="light">{item.region}</span>
                        </h5>
                        <h5>
                          <span className="bold">Sub Region: </span>
                          <span className="light">{item.subregion}</span>
                        </h5>
                        <h5>
                          <span className="bold">Capital: </span>
                          <span className="light">{item.capital}</span>
                        </h5>
                      </div>
                      <div className="2">
                        <h5>
                          <span className="bold">Top Level Domain: </span>
                          <span className="light">{item.topLevelDomain}</span>
                        </h5>
                        <h5>
                          <span className="bold">Currencies: </span>
                          <span className="light">
                            {item.currencies[0].name}
                          </span>
                        </h5>
                        <h5>
                          <span className="bold">Languages: </span>
                          <span className="light">
                            {item.languages.map((r) => r.name).join(", ")}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="border">
                      <h4>Border Countries: </h4>
                      <span>
                        {item.borders.map((f, index) => {
                          if (!f) {
                            return <p>No Bordering Countries</p>;
                          }
                          return (
                            <button className="border-btn" key={index}>
                              {f}
                            </button>
                          );
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default App;
