import SuggationConnections from "./suggestion-connections/SuggestionConnections";
import RequestedConnections from "./requested-connections/requested-connections";

const Connections = () => {
  return (
    <section className="w-full pb-10 min-h-screen space-y-8">
      <RequestedConnections />
      <SuggationConnections />
    </section>
  );
};

export default Connections;
