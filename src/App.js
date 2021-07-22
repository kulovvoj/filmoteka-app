import React, {useState, useRef, useEffect} from 'react'
import FilmList from './FilmList';
import uuidv4 from 'uuid/dist/v4'

const LOCAL_STORAGE_KEY = 'filmoteka-app.films'

function App() {
  const [films, setFilms] = useState(() => [])

  const [viewSeen, setViewSeen] = useState(() => false)

  const [randomMovie, setRandomMovie] = useState(() => null)

  const filmNameRef = useRef()

  // Loads stores films
  useEffect(() => {
    const storedFilms = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedFilms) setFilms(storedFilms)
  }, [])

  // Stores films
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(films))
  }, [films])

  function handleAddFilm(watched) {
    const name = filmNameRef.current.value
    
    // Protect against empty string
    if (name === '') return

    // Take previous list, unravel it and add the new film behind it
    setFilms(prevFilms => {
      return [...prevFilms, {id: uuidv4(), name: name, watched: watched}]
    })

    // Clear the text field
    filmNameRef.current.value = null
  }

  // Filters films based on whether they were watched or not
  function filterFilms(watched) {
    const filteredFilms = films.filter(film => film.watched === watched)
    return filteredFilms
  }

  function pickRandom(watched) {
    const filteredFilms = filterFilms(watched)
    const randomNumber = Math.floor(Math.random() * filteredFilms.length);
    const retVal = filteredFilms[randomNumber]
    return retVal
  }

  function toggleViewSeen(e) {
    setViewSeen(prevViewSeen => !prevViewSeen)
    setRandomMovie(null)
  }

  if (!viewSeen) {
    return (
      <>
        <FilmList films={filterFilms(false)} />
        <input ref={filmNameRef} type="text" />
        <button onClick={() => handleAddFilm(false)}>Add film</button>
        <button onClick={() => setRandomMovie(pickRandom(false))}>Pick random</button>
        <button onClick={toggleViewSeen}>View seen</button>
        <div>{randomMovie ? randomMovie.name : ''}</div>
      </>
    )
  } else {
    return (
      <>
        <FilmList films={filterFilms(true)} />
        <input ref={filmNameRef} type="text" />
        <button onClick={() => handleAddFilm(true)}>Add film</button>
        <button onClick={() => setRandomMovie(pickRandom(true))}>Pick random</button>
        <button onClick={toggleViewSeen}>View unseen</button>
        <div>{randomMovie ? randomMovie.name : ''}</div>
      </>
    )
  }
}

export default App;
