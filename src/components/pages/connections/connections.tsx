import AddConnections from "./add-connections/add-connections";
import RequestedConnections from "./requested-connections/requested-connections";

const Connections = () => {
  return (
    <section className="w-full space-y-8">
      <RequestedConnections />
      <hr className="border-t border-gray-400" />
      <AddConnections />
    </section>
  );
};

export default Connections;
