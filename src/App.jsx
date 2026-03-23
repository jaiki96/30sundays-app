import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PhoneFrame from "./components/PhoneFrame";
import BottomNav from "./components/BottomNav";
import UserToggle from "./components/UserToggle";
import TripNudge from "./components/TripNudge";
import Home from "./pages/Home";
import Destination from "./pages/Destination";
import Listing from "./pages/Listing";
import Detail from "./pages/Detail";
import ItineraryDetail from "./pages/ItineraryDetail";
import Plan from "./pages/Plan";
import FlightListing from "./pages/FlightListing";
import FlightDetail from "./pages/FlightDetail";
import ReviewChanges from "./pages/ReviewChanges";
import HotelListing from "./pages/HotelListing";
import HotelPDP from "./pages/HotelPDP";
import ReviewHotel from "./pages/ReviewHotel";
import MyTrips from "./pages/MyTrips";
import TripDetails from "./pages/TripDetails";
import PaymentDetails from "./pages/PaymentDetails";

function AppContent({ userState, setUserState, selectedFlights, setSelectedFlights, selectedHotels, setSelectedHotels }) {
  const { pathname } = useLocation();
  const showNudge = pathname === "/";

  return (
    <PhoneFrame>
      <UserToggle userState={userState} setUserState={setUserState} />
      <Routes>
        <Route path="/" element={<Home userState={userState} />} />
        <Route path="/destination/:name" element={<Destination />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/itinerary/:id" element={<ItineraryDetail selectedFlights={selectedFlights} selectedHotels={selectedHotels} />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/flights/:itineraryId/:legIndex" element={<FlightListing />} />
        <Route path="/flight-detail/:itineraryId/:legIndex/:flightId" element={<FlightDetail />} />
        <Route path="/review-flight/:itineraryId/:legIndex" element={<ReviewChanges selectedFlights={selectedFlights} setSelectedFlights={setSelectedFlights} />} />
        <Route path="/hotels/:itineraryId/:stayIndex" element={<HotelListing />} />
        <Route path="/hotel-detail/:itineraryId/:stayIndex/:hotelId" element={<HotelPDP />} />
        <Route path="/review-hotel/:itineraryId/:stayIndex" element={<ReviewHotel selectedHotels={selectedHotels} setSelectedHotels={setSelectedHotels} />} />
        <Route path="/trips" element={<MyTrips userState={userState} />} />
        <Route path="/trips/:tripId" element={<TripDetails />} />
        <Route path="/trips/:tripId/payments" element={<PaymentDetails />} />
      </Routes>
      {showNudge && <TripNudge userState={userState} />}
      <BottomNav />
    </PhoneFrame>
  );
}

export default function App() {
  const [userState, setUserState] = useState("new");
  const [selectedFlights, setSelectedFlights] = useState({});
  const [selectedHotels, setSelectedHotels] = useState({});

  return (
    <BrowserRouter>
      <AppContent
        userState={userState}
        setUserState={setUserState}
        selectedFlights={selectedFlights}
        setSelectedFlights={setSelectedFlights}
        selectedHotels={selectedHotels}
        setSelectedHotels={setSelectedHotels}
      />
    </BrowserRouter>
  );
}
