import React from 'react'
import SearchLocationData from './SearchLocationData'
import SearchPostData from './SearchPostData'

const Search = () => {
  return (
    <section className='w-full space-y-5 md:space-y-8'>
    <SearchLocationData />
    <SearchPostData />
    </section>
  )
}

export default Search