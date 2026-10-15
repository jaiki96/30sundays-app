// ─── Where a neighbourhood is ───
//
// The restaurant list holds a neighbourhood and a distance from the centre, not
// a street address, so this is what lets the map put a pin anywhere at all. The
// pin means "in this part of town", which is accurate to a few hundred metres
// and is the honest limit of what we know.
//
// Keyed by region and area together, because the names repeat: "Waterfront" is
// both Labuan Bajo's harbour and Malé's seafront, and "Chaweng" means nothing
// outside Samui.
//
// Two rules:
//
//   1. Only areas that are somewhere. A good third of the list is "On your
//      island", "Any warung", "At your hotel", "Out on the bay". Those are true
//      answers to where you eat and they are not locations, so they get no pin
//      and the map says how many it is showing.
//   2. Nothing invented. Where the street is one I cannot place, it is left
//      out rather than approximated into the sea.
//
// These want a pass from somebody with the addresses before this goes in front
// of a customer. With addresses, each of these becomes exact.

export const AREA_COORDS = {
  // ── Bali ──
  "Ubud::Jalan Raya Ubud": { lat: -8.5069, lng: 115.2625 },
  "Ubud::Penestanan": { lat: -8.5083, lng: 115.2500 },
  "Ubud::Subak Sok Wayah": { lat: -8.4983, lng: 115.2578 },
  "Seminyak::Jalan Double Six": { lat: -8.7006, lng: 115.1680 },
  "Seminyak::Petitenget beach": { lat: -8.6797, lng: 115.1517 },
  "Seminyak::Jalan Kayu Aya": { lat: -8.6838, lng: 115.1556 },
  "Sanur::Danau Tamblingan": { lat: -8.6886, lng: 115.2600 },
  "Sanur::North Sanur": { lat: -8.6700, lng: 115.2600 },
  "Sanur::Jalan Hang Tuah": { lat: -8.6772, lng: 115.2617 },
  "Canggu::Berawa": { lat: -8.6594, lng: 115.1419 },
  "Canggu::Batu Bolong": { lat: -8.6556, lng: 115.1308 },
  "Canggu::Batu Bolong beach": { lat: -8.6578, lng: 115.1292 },
  "Canggu::Padang Linjong": { lat: -8.6500, lng: 115.1350 },
  "Uluwatu::Suluban beach": { lat: -8.8147, lng: 115.0872 },
  "Uluwatu::Jalan Labuansait": { lat: -8.8097, lng: 115.0983 },
  "Uluwatu::Bingin": { lat: -8.8047, lng: 115.1081 },
  "Nusa Penida::Ped, north coast": { lat: -8.6828, lng: 115.5042 },
  "Nusa Penida::Toyapakeh harbour": { lat: -8.6792, lng: 115.4794 },
  "Nusa Penida::Crystal Bay road": { lat: -8.7139, lng: 115.4617 },

  // ── Vietnam ──
  "Hanoi::Old Quarter": { lat: 21.0343, lng: 105.8510 },
  "Hanoi::Le Van Huu": { lat: 21.0186, lng: 105.8508 },
  "Hanoi::Ba Dinh": { lat: 21.0353, lng: 105.8347 },
  "Hoi An::Tran Phu": { lat: 15.8775, lng: 108.3283 },
  "Hoi An::Nguyen Thai Hoc": { lat: 15.8769, lng: 108.3272 },
  "Hoi An::Phan Chu Trinh": { lat: 15.8792, lng: 108.3300 },
  "Da Nang::My Khe beach road": { lat: 16.0589, lng: 108.2472 },
  "Da Nang::Bach Dang": { lat: 16.0678, lng: 108.2244 },
  "Da Nang::Vo Nguyen Giap": { lat: 16.0522, lng: 108.2456 },
  "Da Nang::Hai Chau": { lat: 16.0678, lng: 108.2208 },
  "HCMC::Bui Vien, D1": { lat: 10.7669, lng: 106.6933 },
  "HCMC::District 3": { lat: 10.7828, lng: 106.6869 },
  "Phu Quoc::Long Beach": { lat: 10.1947, lng: 103.9611 },
  "Phu Quoc::Duong Dong": { lat: 10.2175, lng: 103.9611 },

  // ── Thailand ──
  "Bangkok::Surawong": { lat: 13.7275, lng: 100.5267 },
  "Bangkok::Sukhumvit Soi 22": { lat: 13.7314, lng: 100.5636 },
  "Bangkok::Mahachai": { lat: 13.7497, lng: 100.5017 },
  "Chiang Mai::Ratchadamnoen": { lat: 18.7883, lng: 98.9861 },
  "Chiang Mai::Nimman": { lat: 18.7961, lng: 98.9678 },
  "Chiang Mai::Sri Poom": { lat: 18.7925, lng: 98.9869 },
  "Phuket::Patong": { lat: 7.8961, lng: 98.2966 },
  "Phuket::Phuket Old Town": { lat: 7.8844, lng: 98.3878 },
  "Phuket::Kalim cliff": { lat: 7.9108, lng: 98.2869 },
  "Phuket::Ranong Road": { lat: 7.8853, lng: 98.3869 },
  "Koh Samui::Chaweng": { lat: 9.5333, lng: 100.0619 },
  "Koh Samui::Chaweng Noi": { lat: 9.5147, lng: 100.0639 },
  "Koh Samui::Bophut": { lat: 9.5578, lng: 100.0589 },
  "Koh Samui::Bang Por": { lat: 9.5703, lng: 99.9772 },
  "Krabi::Krabi Town": { lat: 8.0863, lng: 98.9063 },
  "Krabi::Ao Nang beach": { lat: 8.0325, lng: 98.8211 },

  // ── Sri Lanka ──
  "Galle::Inside the fort": { lat: 6.0266, lng: 80.2170 },
  "Galle::Church Street": { lat: 6.0269, lng: 80.2167 },
  "Galle::By the lighthouse": { lat: 6.0258, lng: 80.2175 },
  "Kandy::Dalada Veediya": { lat: 7.2936, lng: 80.6400 },
  "Kandy::Temple Street": { lat: 7.2939, lng: 80.6411 },
  "Kandy::Kotugodella": { lat: 7.2944, lng: 80.6358 },
  "Ella::Main Street": { lat: 6.8667, lng: 81.0466 },
  "Ella::Passara road": { lat: 6.8700, lng: 81.0511 },
  "Mirissa::East end beach": { lat: 5.9456, lng: 80.4617 },
  "Mirissa::Matara road": { lat: 5.9478, lng: 80.4583 },

  // ── New Zealand ──
  "Auckland::Ponsonby": { lat: -36.8542, lng: 174.7458 },
  "Auckland::Fort Lane, CBD": { lat: -36.8449, lng: 174.7681 },
  "Auckland::Federal Street": { lat: -36.8478, lng: 174.7628 },
  "Auckland::Karangahape Road": { lat: -36.8575, lng: 174.7625 },
  "Queenstown::Cow Lane": { lat: -45.0312, lng: 168.6600 },
  "Queenstown::Shotover Street": { lat: -45.0306, lng: 168.6589 },
  "Wanaka::Ardmore Street": { lat: -44.6978, lng: 169.1322 },
  "Wanaka::Helwick Street": { lat: -44.6986, lng: 169.1292 },
  "Christchurch::Oxford Terrace": { lat: -43.5306, lng: 172.6367 },
  "Christchurch::Cashel Street": { lat: -43.5322, lng: 172.6361 },
  "Christchurch::New Regent Street": { lat: -43.5300, lng: 172.6375 },
  "Christchurch::St Asaph Street": { lat: -43.5358, lng: 172.6372 },
  "Rotorua::Tutanekai Street": { lat: -38.1372, lng: 176.2478 },
  "Rotorua::Eat Streat": { lat: -38.1375, lng: 176.2475 },

  // ── Maldives ──
  "Malé::Majeedhee Magu": { lat: 4.1750, lng: 73.5089 },
  "Malé::Chaandhanee Magu": { lat: 4.1761, lng: 73.5097 },
  "Malé::Waterfront": { lat: 4.1783, lng: 73.5097 },
};

export const areaCoords = (city, area) => AREA_COORDS[`${city}::${area}`] || null;
