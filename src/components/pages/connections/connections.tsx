import SuggationConnections from "./suggestion-connections/SuggestionConnections";
import RequestedConnections from "./requested-connections/requested-connections";

const Connections = () => {
  return (
    <section className="w-full pb-10 space-y-8">
      <RequestedConnections />
      <hr className="border-t border-gray-400" />
      <SuggationConnections />
    </section>
  );
};

export default Connections;
