import React, { useEffect, useState } from "react";
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
    const final = await response.json();
    setData(final);
    setDataDef(final);
    setDrop(final);
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
        
        <div className="header">
          <div className="header-info">
            <h1>Where in the world?</h1>
            <button className="quiz-btn">
              <Link to="/quiz">
                <span>
                  <i className="fas fa-address-book-o"></i>
                </span>
                <span>Quiz</span>
              </Link>
            </button>
          </div>
        </div>
        
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
          {data.filter((item) => { return item.population >= 1000000 }).map((item) => {
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
      <Route exact path="/quiz">
        <Quiz data={data} />
      </Route>
      <Route exact path="/quizReload">
        <QuizReload data={data} />
      </Route>
    </Router>
  );
}

const QuizReload = ({ data }) => {
  let history = useHistory();
  
  useEffect(
    () => {
      let timer1 = setTimeout(() => { history.push("/quiz"); }, 500);

      // this will clear Timeout
      // when component unmount like in willComponentUnmount
      // and show will not change to true
      return () => {
        clearTimeout(timer1);
      };
    },
    // useEffect will run only one time with empty []
    // if you pass a value to array,
    // like this - [data]
    // than clearTimeout will run every time
    // this value changes (useEffect re-run)
    []
  );

  return (<></>)
}

const Quiz = ({ data }) => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  const [item, setItem] = useState(data[Math.floor(Math.random() * data.length)]);
  
  const [capital, setCapital] = useState(item.capital);
  
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
            <button className="back-btn">
              <Link to="/">
                <span>
                  <i className="fas fa-arrow-left"></i>
                </span>
                <span>Back</span>
              </Link>
            </button>
            <button className="next-btn">
              <Link to="/quizReload">
                <span>
                  <i className="fas fa-arrow-right"></i>
                </span>
                <span>Next</span>
              </Link>
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
