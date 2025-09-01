import SuggationConnections from "./suggestion-connections/SuggestionConnections";
import RequestedConnections from "./requested-connections/requested-connections";
import MyAllConnections from "./my-all-connections/MyAllConnections";

const Connections = () => {
  return (
    <section className="w-full pb-10 min-h-screen space-y-8">
      <MyAllConnections/>
      <RequestedConnections />
      <SuggationConnections />
    </section>
  );
};

export default Connections;
