// ─── What kind of thing an activity is ───
//
// The page used to label these off the activity builder, which answers in the
// vocabulary of a listings site: Tour, Experience, Point of Interest. Three
// cards in a row all saying "Point of Interest" told a couple nothing about
// whether they would be climbing something or lying down.
//
// These are the words people use when they describe a day to each other.
// Matched on the name, in order, because the names are descriptive: the first
// rule that fits wins, so the more particular ones come first.

const RULES = [
  [/temple|pagoda|mosque|shrine|\bwat\b|buddha|church|cathedral|monk|puja|tooth/i, "Temple"],
  [/monkey|elephant|turtle|dolphin|whale|komodo|dragon trek|bird|manta|safari/i, "Wildlife"],
  [/bungee|skydiv|zip|rafting|rock climb|climbing|abseil|quad|\batv\b|zorb|jet boat|paraglid|parasail|canyon/i, "Adventure"],
  [/spa|massage|yoga|hot pool|hot spring|soak|relax|pool day|villa morning|retreat|afternoon|beach day|beach morning|lagoon swim|lake swim/i, "Relax"],
  [/snorkel|diving|\bdive\b|kayak|paddle|cruise|\bboat\b|sail|ferry|canoe|punting|rafting|surf|fishing|island hop|island-hop|4-island/i, "On the water"],
  [/beach|sandbank|cove|bay\b/i, "Beach"],
  [/cooking class|masterclass|tasting|dinner|lunch|brunch|food|feast|trail|crawl|cafe|coffee|\bbbq\b|warung|seafood|burger|wine|tea factory|khao soi|banh mi|pho\b|cao lau|hedhikaa/i, "Food"],
  [/market|bazaar|shopping|tailor|boutique|walking street/i, "Market"],
  [/nightlife|night bazaar|\bbar\b|club|party|cocktail/i, "After dark"],
  [/hike|trek|\bwalk\b|climb|\bridge\b|peak|cycling|cycle|biking/i, "On foot"],
  [/viewpoint|sunset|sunrise|lookout|gondola|tower|bridge|cape|hill\b/i, "View"],
  [/waterfall|forest|garden|park|rice|terrace|volcano|geothermal|cave|mangrove|lake|nature|plantation|island\b/i, "Nature"],
  [/museum|show|dance|puppet|workshop|cultural|fort|palace|village|old town|ancient|ruins|tunnels|memorial/i, "Culture"],
];

// A handful the rules get wrong, because the name says one thing and the day
// is another.
const OVERRIDE = {
  "Sacred Monkey Forest": "Nature",
  "White water rafting": "Adventure",
  "Kelingking Beach hike": "View",
  "Padar Island viewpoint": "View",
  "Komodo dragon trek": "Wildlife",
  "Train Street visit": "Culture",
  "Tailor session": "Market",
  "Hobbiton tour": "Culture",
  "Puzzling World": "Culture",
  "Cu Chi Tunnels": "Culture",
  "War Remnants Museum": "Culture",
  "Fergburger & wine": "Food",
  "Cable car ride": "View",
  "Golden Bridge": "View",
  "Nine Arches Bridge": "View",
  "Dragon Bridge night": "After dark",
  "Scenic train ride": "View",
  "TranzAlpine train": "View",
  "Underwater restaurant": "Food",
  "Starlight dinner": "Food",
  "Private beach dinner": "Food",
  "Tea plantation tour": "Nature",
  "Fish sauce factory": "Culture",
  "Pepper farm visit": "Nature",
  "Monk chat session": "Culture",
  "Elephant sanctuary": "Wildlife",
  "Whale watching trip": "Wildlife",
  "Turtle hatchery visit": "Wildlife",
  "Night squid fishing": "On the water",
  "Bungee jumping": "Adventure",
  "Japanese Bridge": "Culture",
  "Private pool villa": "Relax",
  "Angel's Billabong": "Nature",
  "Sunrise tai chi on deck": "Relax",
  "Kecak dance at sunset": "Culture",
  "Tirta Empul purification": "Temple",
  "Beach villa morning": "Relax",
  "Overwater spa morning": "Relax",
  "Overwater villa morning": "Relax",
};

export function activityKind(name = "") {
  if (OVERRIDE[name]) return OVERRIDE[name];
  const hit = RULES.find(([re]) => re.test(name));
  return hit ? hit[1] : "Culture";
}

// A colour per kind, so a rail of nine cards reads as a mix rather than a
// list. Tints only: the tag is a label, not a button.
export const KIND_TONE = {
  Temple: { bg: "#F4F0FF", fg: "#6938EF" },
  Wildlife: { bg: "#ECFDF3", fg: "#027A48" },
  Adventure: { bg: "#FFF1F3", fg: "#C01048" },
  Relax: { bg: "#FFF4E0", fg: "#B54708" },
  "On the water": { bg: "#EAF2FE", fg: "#175CD3" },
  Beach: { bg: "#EAF2FE", fg: "#175CD3" },
  Food: { bg: "#FFF4E0", fg: "#B54708" },
  Market: { bg: "#FDF2FA", fg: "#C11574" },
  "After dark": { bg: "#F2F4F7", fg: "#363F72" },
  "On foot": { bg: "#E5F6F5", fg: "#007E72" },
  View: { bg: "#E5F6F5", fg: "#007E72" },
  Nature: { bg: "#ECFDF3", fg: "#027A48" },
  Culture: { bg: "#F4F0FF", fg: "#6938EF" },
};
