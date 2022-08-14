import './App.css';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import React, { useState, useEffect } from 'react'
import { Form, Card, Button, Col, Row } from 'react-bootstrap'


const GetWeather = (props) => {
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: process.env.REACT_APP_WEATHER_API,
    lat: props.lat,
    lon: props.lon,
    lang: 'en',
    unit: 'imperial'
  })

  

  return (
    <ReactWeather
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel={props.city}
      unitsLabels={{ temperature: 'F', windSpeed: 'mph' }}
      showForecast
    />
  )
}


function App() {
  const [zip, setZip] = useState("")
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")
  const [date, setDate] = useState(new Date())
  const [msg, setMsg] = useState("")
  const [city, setCity] = useState("")

  const getLonLat = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${process.env.REACT_APP_GOOGLE_API}`)
      const data = await response.json()
      setCity(data.results[0].address_components[1].long_name)
      console.log(data.results[0])
      setLat(data.results[0].geometry.location.lat.toString())
      setLon(data.results[0].geometry.location.lng.toString())
      console.log(`longitude: ${lon}, latitude: ${lat}`)
      setMsg("")
    } catch (err) {
      console.log(err)
      setMsg("Location not found, please try again")
    }
  }

  useEffect(() => {
    const timer = setInterval(()=>setDate(new Date()), 1000)
    return function cleanup() {
      clearInterval(timer)
    }
  })
  

  return (
    <div className="App">
      <Card className="zipCard">
        <h1>Weather App</h1>
        <p>{msg}</p>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2" className="label">Zip Code or City, State</Form.Label>
            <Col>
              <Form.Control 
                type="text" 
                placeholder="12345" 
                className="input"
                onChange={(e) => setZip(e.target.value)}/>
            </Col>
          </Form.Group>
          <Button 
              variant="light" 
              type="submit"
              onClick={getLonLat}>
              Submit
            </Button>
        </Form>
        <h5 className="dateTime">{date.toLocaleDateString()} | {date.toLocaleTimeString()}</h5>
      </Card>
      {city !== "" ? <GetWeather lat={lat} lon={lon} city={city} /> : null}
    </div>
  )
}

export default App;
