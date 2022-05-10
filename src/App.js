import React, {useEffect, useState} from "react"
import './App.css';
import {FormControl, Select, MenuItem, Card, CardContent } from "@mui/material";
import axios from "axios";
import InfoBox from "./InfoBox";
import MapPage from "./Map";
import Table from "./Table";
import {sortData} from "./utilits";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css"

function App() {
  const [ countries, setCountries] = useState([])
  const [ country, setCountry] = useState('worldwide')
  const [ countryInfo, setCountryInfo ] = useState({})
  const [ tableData, setTableData ] = useState([])
  const [ mapCenter, setMapCenter ] = useState({ lat:19.075983, lng:72.877655})
  const [ zoomMap, setZoomMap ] = useState(3)
  const [ mapCountries, setMapCountries] = useState([])
  function checkEMail(email){
    console.log(`@@@@@@@@@@@`,email)
    if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/.test(email)){
      return true
    }else{
      return false
    }
  }

  function checkPassword(password){
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/.test(password)){
      return true
    }else{
      return false
    }
  }

  const allCountries = async ()=>{
    const response = await axios.get("https://disease.sh/v3/covid-19/countries")
    const countryData =response.data?.map((res) => {
      return {
        value: res["countryInfo"]["iso2"],
        name: res["country"]
      }
    })
    const data = response.data
    const sortDataByCases = sortData(data)
    setTableData(sortDataByCases)
    setMapCountries(data)
    setCountries(countryData)
  }

  async function getResultOfCountry(countryCode){
    const url = countryCode === "worldwide" ? `https://disease.sh/v3/covid-19/all` : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    const response = await axios.get(url)
    const data =  response.data
    setCountryInfo(data)
    if(countryCode !== "worldwide"){
      setMapCenter([data["countryInfo"].lat, data["countryInfo"].long])
    }
    setZoomMap(4)
  }

  const onHandleChange = async (e)=>{
    const countryCode = e.target.value
    setCountry(countryCode)
    await getResultOfCountry(countryCode)
  }

  useEffect(()=>{
    getResultOfCountry("worldwide")
  }, [])
  useEffect(() => {
    allCountries()
  }, [])
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app_dropdown">

            <Select
                value={country}
                label="Age"
                variant="outlined"
                onChange={onHandleChange}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {
                countries.map((country, index) => (
                    <MenuItem value={country.value} key={index}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo["todayCases"]} total={countryInfo.cases}/>
          <InfoBox title="Recovered" cases={countryInfo["todayRecovered"]} total={countryInfo["recovered"]}/>
          <InfoBox title="Death Cases" cases={countryInfo["todayDeaths"]} total={countryInfo["deaths"]}/>
        </div>

        <MapPage center={mapCenter} zoom={zoomMap} countries={mapCountries}/>
      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live Cases Across the World</h3>
          <Table countries={tableData} />
          <h3>World Wide New Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
