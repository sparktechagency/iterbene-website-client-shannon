import AddConnections from './add-connections/add-connections'
import RequestedConnections from './requested-connections/requested-connections'

const Connections = () => {
    return (
        <>
            <RequestedConnections />
            <AddConnections/>
        </>
    )
}

export default Connections