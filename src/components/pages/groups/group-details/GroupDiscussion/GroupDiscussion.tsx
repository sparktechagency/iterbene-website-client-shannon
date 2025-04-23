import CreatePost from '@/components/pages/home/create-post/create-post'
import Posts from '@/components/pages/home/posts/posts'
import React from 'react'

const GroupDiscussion = () => {
  return (
    <section className='w-full space-y-5'>
      <CreatePost/>
      <Posts/>
    </section>
  )
}

export default GroupDiscussion