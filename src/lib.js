// load data json
export const loadData = async (url) => {
    const response = await fetch(url)
    return response.json()
}
// star generator
export const star = (score) => {
    const star = '&starf;'.repeat(score)
    const sR = 5 - score
    const starEmpty = '&star;'.repeat(sR)
    return `${star}<span class="film-card-star-gray">${starEmpty}</span>`
}
// youtube video generator
export const yt = (video, player) => {
    const span = document.createElement('span')
    span.classList.add('player-iframe')
    span.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/${video}"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen></iframe>`
    player.appendChild(span)
}

//cards generator view 
// @param data - obj[]
// @param sliceStart - integer
// @param sliceEnd - integer
export const cardsView = (
    data,
    sliceStart,
    sliceEnd,
    filmCards,
    plays,
    player
) => {
    filmCards.textContent = ''

    data.slice(sliceStart, sliceEnd).forEach(obj => {

        const card = document.createElement('div')
        obj.score == 5
            ? card.setAttribute('class', 'film-card five-star')
            : card.setAttribute('class', 'film-card')

        for (const key in obj) {
            const item = document.createElement('span')

            if (key == 'id') {
                item.classList.add('film-card-id')
                item.textContent = obj[key]
                card.id = obj[key]
            } else if (key == 'poster') {
                item.classList.add('film-card-poster')
                const img = document.createElement('img')
                const play = document.createElement('span')
                play.classList.add('film-card-play')
                img.src = `./poster/${obj[key]}`
                item.append(img, play)
            } else if (key == 'trailer') {
                item.classList.add('film-card-trailer')
                item.textContent = obj[key]
            } else if (key == 'title') {
                item.classList.add('film-card-title')
                item.textContent = obj[key]
            } else if (key == 'score') {
                item.classList.add('film-card-star')
                item.innerHTML = star(obj[key])
            } else {
                item.textContent = obj[key]
            }
            card.appendChild(item)
        }
        filmCards.appendChild(card)

    })
    //add event for range cards
    Array.from(plays).forEach(e => {
        e.addEventListener('click', (e) => {
            player.style.display = 'flex'
            yt(e.target.offsetParent.children[2].textContent, player)
        })
    })
}

export const pagination = (paginationsticky, maxSlice, sliceRange, filmCards, data, plays, player) => {
    paginationsticky.textContent = ''
    // generation pagination
    const pagination = document.createElement('div')
    pagination.classList.add('pagination')
    for (let i = 1; i <= maxSlice; i++) {
        const link = document.createElement('a')
        // add event to each link pagination
        link.addEventListener('click', (e) => {
            e.preventDefault()
            filmCards.textContent = ''
            location.href = '#film-cards'
            const end = e.target.textContent * sliceRange
            const star = end - sliceRange
            cardsView(data, star, end, filmCards, plays, player)
            // pagination-select
            Array.from(paginationsticky.children).forEach(obj => {
                obj.removeAttribute('class')
            })
            e.target.classList.add('pagination-select')
        })
        link.href = '#'
        link.textContent = i
        paginationsticky.appendChild(link)
    }
}

export const searchFilm = (searchTitle, genre, orderby, ordertype, data) => {
    genre = genre == 'tutti' ? '' : genre

    const orderFn = (a, b) => {
        if (ordertype == 'desc') {
            let tmp = a
            a = b
            b = tmp
        }
        switch (orderby) {
            case 'title': return a.title.localeCompare(b.title)
            case 'score': return a.score - b.score
            case 'year': return a.year - b.year
            default: return a.title.localeCompare(b.title)
        }

    }
    return Object.values(data)
        .filter(data =>
            String(data.title)
                .toLowerCase()
                .includes(searchTitle.trim().toLowerCase()) &&
            String(data.genre)
                .includes(genre)
        )
        .sort((a, b) => orderFn(a, b))
}