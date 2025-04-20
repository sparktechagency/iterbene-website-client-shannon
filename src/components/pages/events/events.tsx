import React from 'react'
import InvitedEvents from './invited-events/invited-events'
import InterestedEventCard from './interested-events/interested-events-card'
import UpcomingEvents from './upComingEvents/upComing-events'
import CreateEvent from './CreateEvent/CreateEvent'

const Events = () => {
  return (
    <>
    <CreateEvent/>
    <UpcomingEvents/>
    <InvitedEvents/>
    <InterestedEventCard/>
    </>
  )
}

export default Events