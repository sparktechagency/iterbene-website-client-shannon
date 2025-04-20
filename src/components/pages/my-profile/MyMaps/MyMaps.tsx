import MapSection from "./MapSection";
import MyMapHeader from "./MyMapHeader";
import TripList from "./TripList";


const MyMaps: React.FC = () => {
  return (
    <div className="w-full bg-white p-5 rounded-2xl">
      <MyMapHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 ">
        <TripList />
        <MapSection />
      </div>
    </div>
  );
};

export default MyMaps;