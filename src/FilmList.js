import React from 'react'
import Film from './Film'

export default function FilmList({films}) {
    return (
        films.map(film => {
            return <Film key={film.id} film ={film} />
        })
    )
}
