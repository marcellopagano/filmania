import { loadData, cardsView, pagination, searchFilm } from './lib.js'

const filmCards = document.getElementById('film-cards')
const plays = document.getElementsByClassName('film-card-play')
const player = document.getElementById('player')
const playerClose = document.getElementById('player-close')
const btnUp = document.getElementById('btn-up')
const paginationsticky = document.getElementById('pagination')
const filmTitle = document.getElementById('film-title')
const filmTitleReset = document.getElementById('film-title-reset')
const filmGenre = document.getElementById('film-genre')
const filmOrderBy = document.getElementById('orderby')
const filmOrderType = document.getElementById('ordertype')
const filmSearchBtn = document.getElementById('film-search-btn')
const nFilm = document.getElementById('nfilm')

const slice = 12

const pageInit = (data) => {
    pageBuild(
        filmTitle.value,
        filmGenre.value,
        filmOrderBy.value,
        filmOrderType.value,
        data,
        slice
    )
}

// page build
const pageBuild = (
    filmTitle,
    filmGenre,
    filmOrderBy,
    filmOrderType,
    data,
    sliceRange
) => {
    const dataSearch = searchFilm(
        filmTitle,
        filmGenre,
        filmOrderBy,
        filmOrderType,
        data
    )
    if (dataSearch.length !== 0) {
        nFilm.textContent = dataSearch.length
        const maxSlice = Math.ceil(dataSearch.length / sliceRange)
        cardsView(dataSearch, 0, sliceRange, filmCards, plays, player)
        pagination(paginationsticky, maxSlice, sliceRange, filmCards, dataSearch, plays, player)
        // pagination-select init
        paginationsticky.children[0].classList.add('pagination-select')
    } else {
        nFilm.textContent = 0
        filmCards.textContent = ''
        paginationsticky.textContent = 'Nessun risultato trovato.'
    }
}
// init
void async function () {
    const data = await loadData('./data/film.json')
    pageInit(data)

    filmTitleReset.addEventListener('click', () => {
        filmTitle.value = ''
        filmTitle.focus()
    })
    // search film event
    filmSearchBtn.addEventListener('click', () => {
        pageInit(data)
    })
    // close player click event
    playerClose.addEventListener('click', () => {
        player.children[1].remove();
        player.style.display = 'none'
    })
    // close player escape key event  
    document.addEventListener('keyup', (e) => {
        if (e.key == 'Escape') {
            player.children[1].remove();
            player.style.display = 'none'
        }
    })
    // bnt-top event
    document.addEventListener('scroll', () => {
        window.pageYOffset > 2000 ? btnUp.style.display = 'block' : btnUp.style.display = 'none'
    })
    filmTitle.addEventListener('keyup', (e) => {
        e.preventDefault()
        if (e.key == 'Enter') pageInit(data)
    })
}()