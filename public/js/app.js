//console.log('Client side javascript file is loaded')

// The .then API is part of something called "promises"
// fetch is client side API only
/*
fetch('http://puzzle.mead.io/puzzle').then((response) => {
    response.json().then((data) => {
        console.log(data)
    })
})
//*/

const weatherForm = document.querySelector('form')
const search = document.querySelector('input') 
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value 
    //console.log(location)

    messageOne.textContent = 'Loading ...'
    messageTwo.textContent = ''

    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            //console.log(data)

            if(data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = data.location 
                messageTwo.textContent = data.forecastData
            }

        })
    })
})