require('dotenv').config()

const { Client } = require('pg')
const axios = require('axios')

const LATITUDE = process.env.LATITUDE || 40.70098574912939
const LONGITUDE = process.env.LONGITUDE || -73.9837906003035
const INTERVAL = process.env.INTERVAL || 1800
let url

console.log(`Getting Forecast URL for lat/lng: ${LATITUDE},${LONGITUDE}...`)
const pollNOAA = () => {
  axios
    .get(url)
    .then((response) => {
      if (
        response &&
        response.data &&
        response.data.properties &&
        response.data.properties.periods
      ) {
        const periods = response.data.properties.periods
        return periods
      }
    })
    .then((data) => {
      const client = new Client()
      client.connect().then(() => {
        // console.log(data)
        const a = []
        data.forEach((obj) => {
          a.push(`(
              ${obj.number},
              '${obj.name}',
              '${obj.startTime}',
              '${obj.endTime}',
              ${obj.isDaytime === undefined ? false : obj.isDaytime},
              ${obj.temperature},
              '${obj.temperatureUnit}',
              '${obj.temperatureTrend}',
              '${obj.windSpeed}',
              '${obj.windDirection}',
              '${obj.icon}',
              '${obj.shortForecast}',
              '${obj.detailedForecast}'
            )`)
        })
        const s = a.join(', ')
        const query = `DELETE FROM forecast;
          INSERT INTO forecast 
              (number, name, "startTime", "endTime", "isDaytime", temperature, "temperatureUnit", "temperatureTrend", "windSpeed", "windDirection",
              icon, "shortForecast", "detailedForecast")
              VALUES ${s}`

        client
          .query(query)
          .then((r) => {
            // console.log(r)
            client.end()
          })
          .catch((e) => {
            console.log(e)
            client.end()
          })
      })
    })

  console.log(url)
}
// Make a request for a user with a given ID
axios
  .get(`https://api.weather.gov/points/${LATITUDE},${LONGITUDE}`)
  .then((response) => {
    // handle success
    if (
      response &&
      response.data &&
      response.data.properties &&
      response.data.properties.forecast
    ) {
      url = response.data.properties.forecast
      console.log(`Forecast URL: ${url}`)
    }
    pollNOAA()
    console.log(`Querying ${url} every ${INTERVAL} seconds...`)
    setInterval(pollNOAA, INTERVAL * 1000)
  })
  .catch(function (error) {
    // handle error
    console.log(error)
  })
