import './App.css';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import React, { useState, useEffect } from 'react'
import { Form, Card, Button, Col, Row } from 'react-bootstrap'


function App() {
  const [zip, setZip] = useState("")
  let lon = ""
  let lat = ""
  const [date, setDate] = useState(new Date())
  const [msg, setMsg] = useState("")

  const getLonLat = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${process.env.REACT_APP_GOOGLE_API}`)
      const data = await response.json()
      lat = data.results[0].geometry.location.lat
      lon = data.results[0].geometry.location.lng
      console.log(`longitude: ${lon}, latitude: ${lat}`)
      console.log(typeof lon.toString())
      setMsg("")
      getWeather()
    } catch (err) {
      console.log(err)
      setMsg("Location not found, please try again")
    }
  }

  const getWeather = async () => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API}`)
    const data = await response.json()
    console.log(data)
  }

  const { data, isLoading, errorMessage } = useOpenWeather({
    key: process.env.REACT_APP_WEATHER_API,
    lat: lat.toString(),
    lon: lon.toString(),
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
      <Card>
        <p>{msg}</p>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">Zip Code or City, State</Form.Label>
            <Col sm="10">
              <Form.Control 
                type="text" 
                placeholder="12345" 
                onChange={(e) => setZip(e.target.value)}/>
            </Col>
            <Button 
              variant="light" 
              type="submit"
              onClick={getLonLat}>
              Submit
            </Button>
          </Form.Group>
        </Form>
        <p> Date : {date.toLocaleDateString()} | Time: {date.toLocaleTimeString()}</p>
      </Card>
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
