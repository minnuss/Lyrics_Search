const form = document.getElementById('form')
const searchInput = document.getElementById('search')
const result = document.getElementById('result')
const more = document.getElementById('more')

const apiURL = 'https://api.lyrics.ovh'

// SEARCH BY SONG OR ARTIST
async function searchSongs(term) {

    const res = await fetch(`${apiURL}/suggest/${term}`)
    const data = await res.json()

    // console.log(data)
    showData(data)
}

// SHOW SONG AND ARTIST IN DOM
function showData(songs) {
    // console.log(songs)

    // METHOD 1 FOR CREATING OUTPUT
    // ******************************
    // variable for all data from API

    // let output = ''

    // // create li for each song
    // songs.data.forEach(song => {
    //     output += `
    //     <li>
    //     <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    //     <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Lyrics</button>
    //     </li>
    //     `
    // })

    // // put all output results to ul element
    // result.innerHTML = `
    // <ul class="songs">
    // ${output}
    // </ul>
    // `
    // console.log(output)
    // ******************************


    // METHOD 2 FOR CREATING OUTPUT
    // ******************************
    // put all data into map, and then join at the end
    result.innerHTML = `
    <ul class="songs">
    ${songs.data.map(song => `
        <li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Lyrics</button>
        </li>
    `).join('')
        }    
    `
    // ******************************

    // check if there are more results, next or prev - show buttons, and pass urls to getMoreSongs func
    if (songs.prev || songs.next) {
        more.innerHTML = `
        ${songs.prev ? `<button class="btn" onclick="getMoreSongs('${songs.prev}')">Prev</button>` : ''}
        ${songs.next ? `<button class="btn" onclick="getMoreSongs('${songs.next}')">Next</button>` : ''}
        `
    } else {
        more.innerHTML = ''
    }
}

// GET PREV AND NEXT RESULTS OF SONGS
async function getMoreSongs(url) {
    const res = await fetch(`${url}`)
    const data = await res.json()

    // console.log(data)
    showData(data)
}

// GET LYRICS FOR A CLICKED SONG
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
    const data = await res.json()

    // console.log(data)
    // replace "new line" with <br>
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, `<br>`)
    // console.log(lyrics)

    // output results
    result.innerHTML = `
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>
    `

    // clear buttons if they are any
    more.innerHTML = ''
}

// EVENTS
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = searchInput.value.trim()
    // console.log(searchTerm)

    if (!searchTerm) {
        alert('Please type in a search term')
    } else {
        searchSongs(searchTerm)
    }
})

// GET LYRICS BUTTON CLICK
result.addEventListener('click', (e) => {
    // console.log(e.target)
    const clickedEl = e.target
    // console.log(clickedEl.tagName)

    // if tagName is button
    if (clickedEl.tagName = 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist')
        const songTitle = clickedEl.getAttribute('data-songtitle')

        // pass artist and songTitle from data attributes
        getLyrics(artist, songTitle)
    }

})