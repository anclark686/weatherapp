import './App.css';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import React, { useState, useEffect } from 'react'
import { Form, Card, Button, Col, Row } from 'react-bootstrap'


function App() {

  const [date, setDate] = useState(new Date())


  const { data, isLoading, errorMessage } = useOpenWeather({
    key: process.env.REACT_APP_WEATHER_API,
    lat: '37',
    lon: '-87',
    lang: 'en',
    unit: 'imperial'
  })

  useEffect(() => {
    const timer = setInterval(()=>setDate(new Date()), 1000)
    return function cleanup() {
      clearInterval(timer)
    }
  })

  return (
    <div className="App">

      <ReactWeather
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        lang="en"
        locationLabel="Lexington, KY"
        unitsLabels={{ temperature: 'F', windSpeed: 'mph' }}
        showForecast
      />
    </div>
  )
}

export default App;
