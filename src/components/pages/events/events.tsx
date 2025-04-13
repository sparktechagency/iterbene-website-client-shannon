import React from 'react'
import InvitedEvents from './invited-events/invited-events'
import InterestedEventCard from './interested-events/interested-events-card'
import UpcomingEvents from './upComingEvents/upComing-events'

const Events = () => {
  return (
    <>
    <UpcomingEvents/>
    <InvitedEvents/>
    <InterestedEventCard/>
    </>
  )
}

export default Events