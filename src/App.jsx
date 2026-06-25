import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PhoneFrame from "./components/PhoneFrame";
import BottomNav from "./components/BottomNav";
import UserToggle from "./components/UserToggle";
import TripNudge from "./components/TripNudge";
import Home from "./pages/Home";
import HomeV2 from "./pages/HomeV2";
import HomeV3 from "./pages/HomeV3";
import HomeV4 from "./pages/HomeV4";
import HomeV5 from "./pages/HomeV5";
import HomeV6 from "./pages/HomeV6";
import ChatScreen from "./pages/ChatScreen";
import Destination from "./pages/Destination";
import MaldivesDestination from "./pages/MaldivesDestination";
import ResortDetail from "./pages/ResortDetail";
import Listing from "./pages/Listing";
import Detail from "./pages/Detail";
import ItineraryDetail from "./pages/ItineraryDetail";
import Plan from "./pages/Plan";
import Build from "./pages/Build";
import LoginV2 from "./pages/LoginV2";
import LogoAnim from "./pages/LogoAnim";
import MediaLab from "./pages/MediaLab";
import FlightListing from "./pages/FlightListing";
import FlightDetail from "./pages/FlightDetail";
import ReviewChanges from "./pages/ReviewChanges";
import HotelListing from "./pages/HotelListing";
import HotelPDP from "./pages/HotelPDP";
import ReviewHotel from "./pages/ReviewHotel";
import MyTrips from "./pages/MyTrips";
import TripDetails from "./pages/TripDetails";
import TripDocsDemo from "./pages/TripDocsDemo";
import BookedHotelPDP from "./pages/BookedHotelPDP";
import ActivityDetail from "./pages/ActivityDetail";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentPlan from "./pages/PaymentPlan";
import Account from "./pages/Account";
import HotelUpgradeNudge from "./prototypes/HotelUpgradeNudge";
import WatchDeepLink from "./pages/WatchDeepLink";
import ErrorBoundary from "./components/ErrorBoundary";
import Discover from "./pages/Discover";
import DiscoverRoutes from "./pages/DiscoverRoutes";
import RoutesCouples from "./pages/RoutesCouples";
import DiscoverWF from "./pages/DiscoverWF";
import WishlistWF from "./pages/WishlistWF";
import RoutesWF from "./pages/RoutesWF";
import { DealsProvider } from "./data/deals";
import { SavesProvider } from "./data/saves";

function AppContent({ userState, setUserState, leadData, setLeadData, selectedFlights, setSelectedFlights, selectedHotels, setSelectedHotels }) {
  const { pathname } = useLocation();
  const showNudge = pathname === "/";
  const isPrototype = pathname.startsWith("/prototype/");
  // Returning users see the tab bar on /plan (their plans); new users get the full-screen login.
  const hideShell = pathname === "/login-v2" || pathname === "/logo-anim" || pathname === "/media-lab" || pathname === "/build" || (pathname === "/plan" && userState === "new");

  if (isPrototype) {
    return (
      <Routes>
        <Route path="/prototype/hotel-upgrade" element={<HotelUpgradeNudge />} />
      </Routes>
    );
  }

  return (
    <PhoneFrame>
      <UserToggle userState={userState} setUserState={setUserState} />
      <Routes>
        <Route path="/" element={<HomeV2 />} />
        <Route path="/v3" element={<HomeV3 />} />
        <Route path="/v4" element={<HomeV4 userState={userState} />} />
        <Route path="/v5" element={<HomeV5 userState={userState} />} />
        <Route path="/v6" element={<HomeV6 userState={userState} />} />
        <Route path="/discover/:name" element={<Discover />} />
        <Route path="/discover/:name/routes" element={<DiscoverRoutes />} />
        <Route path="/discover-couples/:name" element={<Discover routesBase="/discover-couples" />} />
        <Route path="/discover-couples/:name/routes" element={<RoutesCouples />} />
        <Route path="/wf/:name" element={<DiscoverWF />} />
        <Route path="/wf/:name/wishlist" element={<WishlistWF />} />
        <Route path="/wf/:name/routes" element={<RoutesWF />} />
        <Route path="/v1" element={<Home userState={userState} />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/destination/Maldives" element={<MaldivesDestination />} />
        <Route path="/resort/:resortId" element={<ResortDetail />} />
        <Route path="/destination/:name" element={<Destination />} />
        <Route path="/listing" element={<Listing userState={userState} leadData={leadData} />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/itinerary/:id" element={<ItineraryDetail selectedFlights={selectedFlights} selectedHotels={selectedHotels} setSelectedHotels={setSelectedHotels} />} />
        <Route path="/itinerary/:id/payment-plan" element={<PaymentPlan />} />
        <Route path="/plan" element={<Plan userState={userState} setUserState={setUserState} leadData={leadData} setLeadData={setLeadData} />} />
        <Route path="/build" element={<Build />} />
        <Route path="/login-v2" element={<LoginV2 />} />
        <Route path="/logo-anim" element={<LogoAnim />} />
        <Route path="/media-lab" element={<MediaLab />} />
        <Route path="/flights/:itineraryId/:legIndex" element={<FlightListing selectedFlights={selectedFlights} setSelectedFlights={setSelectedFlights} />} />
        <Route path="/flight-detail/:itineraryId/:legIndex/:flightId" element={<FlightDetail />} />
        <Route path="/review-flight/:itineraryId/:legIndex" element={<ReviewChanges selectedFlights={selectedFlights} setSelectedFlights={setSelectedFlights} />} />
        <Route path="/hotels/:itineraryId/:stayIndex" element={<HotelListing selectedHotels={selectedHotels} setSelectedHotels={setSelectedHotels} />} />
        <Route path="/hotel-detail/:itineraryId/:stayIndex/:hotelId" element={<HotelPDP />} />
        <Route path="/review-hotel/:itineraryId/:stayIndex" element={<ReviewHotel selectedHotels={selectedHotels} setSelectedHotels={setSelectedHotels} />} />
        <Route path="/trips" element={<MyTrips userState={userState} leadData={leadData} />} />
        <Route path="/trips/:tripId" element={<TripDetails />} />
        <Route path="/trip-docs-demo/:tripId" element={<TripDocsDemo />} />
        <Route path="/trip-docs-demo" element={<TripDocsDemo />} />
        <Route path="/trips/:tripId/hotel/:hotelIdx" element={<BookedHotelPDP />} />
        <Route path="/trips/:tripId/day/:dayIdx/activity/:actIdx" element={<ActivityDetail />} />
        <Route path="/itinerary/:id/day/:dayIdx/activity/:actIdx" element={<ActivityDetail />} />
        <Route path="/trips/:tripId/payments" element={<PaymentDetails />} />
        <Route path="/account" element={<Account userState={userState} leadData={leadData} setUserState={setUserState} setLeadData={setLeadData} />} />
        <Route path="/watch/:videoId" element={<WatchDeepLink />} />
      </Routes>
      {showNudge && <TripNudge userState={userState} />}
      {!hideShell && <BottomNav userState={userState} />}
    </PhoneFrame>
  );
}

export default function App() {
  const [userState, setUserState] = useState("new");
  const [leadData, setLeadData] = useState(null); // { phone, countryCode, name, dests, adults, children }
  const [selectedFlights, setSelectedFlights] = useState({});
  const [selectedHotels, setSelectedHotels] = useState({});

  return (
    <ErrorBoundary>
    <DealsProvider>
    <SavesProvider>
      <BrowserRouter>
        <AppContent
          userState={userState}
          setUserState={setUserState}
          leadData={leadData}
          setLeadData={setLeadData}
          selectedFlights={selectedFlights}
          setSelectedFlights={setSelectedFlights}
          selectedHotels={selectedHotels}
          setSelectedHotels={setSelectedHotels}
        />
      </BrowserRouter>
    </SavesProvider>
    </DealsProvider>
    </ErrorBoundary>
  );
}
