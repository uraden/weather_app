import "./App.css";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Axios from "axios";


import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  registerables as registerablesJS
} from "chart.js";
import { Chart} from "react-chartjs-2";
ChartJS.register(...registerablesJS);



ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);




function App() {
  const [city, setCity] = useState("London");
  const [showtemp, setShowtemp] = useState("");
  const [icon, setIcon] = useState("");
  const [cityNname, setCityName] = useState("");
  const [weatherDesc, setWeatherDesc] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [dateTimeline, setDateTimeline] = useState("");
  const [averageTemp, setAverageTemp] = useState();

  //https://www.weatherbit.io/static/img/icons/r01d.png
  

  const d = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let month = months[d.getMonth()];





  //adding the dates

  var dd = String(d.getDate()).padStart(2, "0");
  var mm = String(d.getMonth()).padStart(2, "0"); //January is 0!
  var yyyy = d.getFullYear();
  var lastmonth = yyyy + "-" + mm + "-" + dd;
  var thismonth = d.toISOString().split("T")[0];

  //average temp calc


  const data = {
    labels: ["red", "blue", "yellow", "green", "purple", "orange"],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3],
      },
    ],
  };

  //const testmepls = [12.8, 8.9, 11.7, 11.7, 15, 21.7, 25, 25.6, 23.3, 21.7, 17.8, 13.9, 11.7, 18.9, 23.3, 23.9, 15.6, 11.7, 17.8, 13.3, 8.3, 11.1, 17.2, 12.2, 12.2, 16.1, 8.9, 15, 19.4, 22]

  let day = days[d.getDay()];
  var urlApi = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${process.env.REACT_APP_WEATHER_API_KEY}`;
  var historyApi = `https://api.weatherbit.io/v2.0/history/daily?&city=${city}&start_date=${lastmonth}&end_date=${thismonth}&key=${process.env.REACT_APP_WEATHER_API_KEY}`;

 

  /// AFTER FINISHING AVERAGE TEMP COMMENT OUT BELOW

  useEffect(() => {
    findCity();
  }, []);

  const findCity = async (e) => {
    if (city === "") {
      alert("Please make enter the valid city name");
    } else {
      const resp = await Axios.get(urlApi);
      if (resp.data.data === undefined) {
        alert("No such a city. Please check again");
      } else {
        setShowtemp(resp.data.data[0].app_temp);
        setIcon(resp.data.data[0].weather.icon);
        setCityName(resp.data.data[0].city_name);
        setWeatherDesc(resp.data.data[0].weather.description);
      }
    }

    Axios.get(historyApi)
      .then(function (response) {
        // handle success
        setMinTemp(response.data.data.map((me) => me.min_temp));
        setMaxTemp(response.data.data.map((me) => me.max_temp));
        setAverageTemp(response.data.data.map((me) => me.temp));
        setDateTimeline(response.data.data.map((me) => me.datetime));
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  

  const options = {
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 0,
        to: 0.45,
        loop: false,
      },
    },

    layout: {
      padding: 40,
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // const labels = ["January","February","March","April","May","June","July","August","September","October","November","December", "January","February","March","April","May","June","July","August","September","October","November","December","July","August","September","October","November","December"];

  const labels = dateTimeline;

  const data_test = {
    labels,
    datasets: [
      {
        type: "line",
        label: "Average Temp in ℃",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        data: averageTemp,
      },
      {
        type: "bar",
        label: "Min Temp in ℃",
        backgroundColor: "rgb(53, 162, 235)",
        data: minTemp,
        borderColor: "white",
        borderWidth: 2,
      },
      {
        type: "bar",
        label: "Max Temp in ℃",
        backgroundColor: "rgb(75, 192, 192)",
        data: maxTemp,
      },
    ],
  };

  return (
    <div className="App">
      <div className="main">
        {/*  <button onClick={historyDataFunc}> CLick me  </button> */}
        <div className="title"> Weather App </div>
        <div className="search_bar">
          
          <input
            tpye="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search_input"
            onKeyPress={(e) => e.key === 'Enter' && findCity()}
          ></input>
          <button onClick={(e) => findCity(e) }   
          className="search_btn">
            <AiOutlineSearch />{" "}
          </button>
          
        </div>

        <div className="curent_city">
          <div className="current_date">
            {" "}
            <h3>
              {" "}
              {day} {"  "} {d.getDate()}, {month} <br /> <br /> Today in{" "}
              {cityNname}{" "}
            </h3>{" "}
          </div>
          <div className="weather_icon">
            {icon ? (
              <img
                className="icon_img"
                src={`https://www.weatherbit.io/static/img/icons/${icon}.png`}
              />
            ) : (
              <img
                className="icon_img"
                src={`https://www.weatherbit.io/static/img/icons/r01d.png`}
              />
            )}
            <img className="icon_img" />{" "}
            <h4 className="title_weather"> {weatherDesc} </h4>
          </div>
          <div className="weather_temp">
            {" "}
            <h1>
              {" "}
              {showtemp} {"   "} &#8451;
            </h1>{" "}
          </div>

          {/* <div className="contenet-wether"> <h1> 32 {showcity}</h1> </div> */}
          {/*<div className='icon'> {icon ? <img src={`https://www.weatherbit.io/static/img/icons/${icon}.png`} /> : <img src={`https://www.weatherbit.io/static/img/icons/r01d.png`} />} </div> */}
        </div>

        <div className="chart">
          <h1>Weather History of {cityNname} city</h1>
          <Chart
            type="bar"
            data={data_test}
            options={options}
            className="weather_Chart"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
