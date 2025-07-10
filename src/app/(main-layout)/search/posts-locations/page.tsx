import PostsLocationsSearch from '@/components/pages/search/PostsLocationsSearch'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsLocationsSearch/>
    </Suspense>
  )
}

export default page