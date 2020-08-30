// nodemon needs a couple of powershell commands to work on my home pc
// https://stackoverflow.com/questions/16460163/ps1-cannot-be-loaded-because-the-execution-of-scripts-is-disabled-on-this-syste
// Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
// nodemon .\src\app.js
// nodemon .\src\app.js -e js,hbs,css
// Best practice - required core modules before NPM modules
// Heroku links - https://wall-complete-node-weather-app.herokuapp.com/ | https://git.heroku.com/wall-complete-node-weather-app.git
const path = require('path')

const express = require('express')
const hbs = require('hbs')
const geoCode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//console.log(__dirname)
//console.log(path.join(__dirname, '../public'))

// Import the library then call the function to initialize
const app = express()
//Heroku config - the first half of the below line is the port we get from Heroku
// if this is not provided then port 8080 is used
const port = process.env.PORT || 8080

///////////////////////////////////
// Define paths for express config
///////////////////////////////////
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

///////////////////////////////////
// Set up handlebars engine and views location
///////////////////////////////////
// Spacing and capitilisation is very important for the key and value
app.set('view engine', 'hbs')
// By default, the directory has to be in the web server root and be called "views"
// The below command changes it
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

///////////////////////////////////
// Set up static directory to serve
///////////////////////////////////
// The first call is the only one that is used - no use having extra calls to the same paths
app.use(express.static(publicDirectoryPath))
// Make sure there is no matching HTML file otherwise the server will serve the static page ahead of the dynamic one
app.get('', (req, res) => {
    // Match the name of the template
    res.render('index', {
        title: 'Weather',
        name: 'Graham Wallace'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Graham Wallace' 
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'Graham Wallace',
        helpText: 'This is some helpful text'
    })
})

// app.com
// app.com/help
// app.com/about
// Function called using an object - request and response
// app.get('/help', (req, res) => {
//     // res.send({
//     //     name: 'Graham',
//     //     age: 43
//     // })
//     res.send([{
//         name: 'Graham'
//     }, {
//         name: 'Sam'
//     }])
// })

app.get('/help/*', (req, res) => {
    // res.send('Help article not found')
    res.render('404', {
        title: '404',
        name: 'Graham Wallace',
        errorMessage: 'Help article not found'
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    } 

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide enter an address'
        })
    } 

// Call geocode, error handle then call forecast
    geoCode(req.query.address, (error, {latitude, longitude, location} = {} ) => {
        if(error) {
            //console.log('Error returned: ' + error)
            return res.send({ error })
        } 

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                //console.log('Error returned: ' + error)
                return res.send({ error })
            } 

            return res.send({
                location, 
                forecastData: forecastData,
                address: req.query.address
            })
        })
    })
})

app.get('*', (req, res) => {
    // res.send('Help article not found')
    res.render('404', {
        title: '404',
        name: 'Graham Wallace',
        errorMessage: 'Page not found'
    })
})

// Start the server
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})