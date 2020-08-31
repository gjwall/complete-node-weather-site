const request = require('request')

const geoCode = (address, callback) => {
    const limit = 'limit=1'
    // Replace the key with your own
    // See this https://www.datree.io/resources/secrets-management-aws
    const geoCodeSecret = 'access_token=pk.eyJ1IjoicjNkczQxZnQiLCJhIjoiY2tlNDh1cjJ1MHFudzJ5bGZpM3FlNTlicyJ9.-CakA1sc051xBnOCTfR2RA'
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?' + geoCodeSecret + '&' + limit

    request({ url, json: true }, (error, {body} = {} ) => {
          if(error) {
                callback('Unable to connect to location services!', undefined)
          } else if (body.features.length === 0) {
                callback('Unable to find location. Try again with a different term', undefined)
          } else {
                const longitude = body.features[0].center[0]
                const latitude = body.features[0].center[1]
                const location = body.features[0].place_name
                callback(undefined, { 
                      latitude: latitude, 
                      longitude: longitude, 
                      location: location 
                })
          }
    })
}

module.exports = geoCode
