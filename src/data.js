// Map coordinate lookup - auto-detected from estate maps
// Maps lot IDs to percentage positions on each village map
export const MAP_COORDINATES = {
  "wine-golf": {
    "D11": { left: "38%", top: "14%" },
    "D12": { left: "42%", top: "14%" },
    "E1": { left: "32%", top: "48%" },
    "E2": { left: "32%", top: "52%" },
    "E5": { left: "32%", top: "38%" },
    "E6": { left: "38%", top: "38%" },
    "E7": { left: "24%", top: "18%" },
    "E8": { left: "18%", top: "20%" },
    "E9": { left: "14%", top: "14%" },
    "E10": { left: "42%", top: "42%" },
    "E10b": { left: "42%", top: "42%" },
    "E11": { left: "48%", top: "38%" },
    "E13": { left: "42%", top: "52%" },
    "E14E": { left: "45%", top: "58%" },
    "E14W": { left: "42%", top: "62%" },
    "E15": { left: "32%", top: "28%" },
    "E17": { left: "17%", top: "8%" },
    "E19": { left: "25%", top: "28%" },
    "E20": { left: "38%", top: "20%" },
    "E21": { left: "17%", top: "32%" },
    "E22": { left: "25%", top: "24%" },
    "E23": { left: "35%", top: "16%" },
    "E24": { left: "32%", top: "18%" },
    "E25": { left: "38%", top: "16%" },
    "E26": { left: "45%", top: "22%" },
    "E27": { left: "42%", top: "24%" },
    "E31": { left: "26%", top: "30%" },
    "F2": { left: "18%", top: "48%" },
    "F3": { left: "22%", top: "48%" },
    "F7": { left: "30%", top: "44%" },
    "F8": { left: "35%", top: "44%" },
    "F9": { left: "39%", top: "44%" },
    "F10": { left: "52%", top: "48%" },
    "F12": { left: "45%", top: "36%" },
    "F13": { left: "55%", top: "32%" },
    "F14": { left: "48%", top: "30%" },
    "F17": { left: "27%", top: "44%" },
    "F18": { left: "24%", top: "44%" },
    "M2": { left: "18%", top: "42%" },
    "M3": { left: "22%", top: "42%" },
    "M4": { left: "26%", top: "42%" },
    "M6": { left: "30%", top: "42%" },
    "M11": { left: "14%", top: "26%" },
    "N7W": { left: "8%", top: "8%" },
  },
  "west-vineyard": {
    "I6": { left: "8%", top: "22%" },
    "I1": { left: "12%", top: "22%" },
    "I3": { left: "18%", top: "18%" },
    "I4": { left: "24%", top: "18%" },
    "I10": { left: "28%", top: "18%" },
    "I11": { left: "32%", top: "20%" },
    "I12": { left: "22%", top: "24%" },
    "I9": { left: "18%", top: "28%" },
    "I14": { left: "28%", top: "28%" },
    "I18": { left: "34%", top: "28%" },
    "I21": { left: "38%", top: "34%" },
    "K1": { left: "28%", top: "48%" },
    "K2": { left: "32%", top: "48%" },
    "K3": { left: "36%", top: "48%" },
    "K4": { left: "32%", top: "52%" },
    "K5": { left: "32%", top: "56%" },
    "K6": { left: "32%", top: "60%" },
    "K7": { left: "12%", top: "10%" },
    "K9": { left: "14%", top: "14%" },
    "K10": { left: "14%", top: "18%" },
  },
  "desert-vineyard": {
    "U4": { left: "44%", top: "28%" },
    "U5": { left: "40%", top: "35%" },
    "U6": { left: "36%", top: "42%" },
    "U8": { left: "32%", top: "52%" },
  },
  "vineyard-estate": {
    "N1": { left: "30%", top: "28%" },
    "N3": { left: "38%", top: "32%" },
    "N4": { left: "44%", top: "36%" },
    "N6": { left: "50%", top: "42%" },
    "N7": { left: "54%", top: "48%" },
    "N8": { left: "48%", top: "54%" },
    "N9": { left: "42%", top: "58%" },
  },
};

// Maps village name to map tab ID
export const VILLAGE_TO_MAP = {
  "Wine & Golf": "wine-golf",
  "Garden Estate": "west-vineyard",
  "Desert & Vineyard": "desert-vineyard",
  "Vineyard Estate": "vineyard-estate",
};

export const CAROUSEL_AWE = [
  "/images/awe/1069905_10151756859575170_1323193143_n.jpg",
  "/images/awe/AWE_ChezGaston%20(29).jpg",
  "/images/awe/AWE_event10.jpg",
  "/images/awe/Carmel-Valley-Ranch-Vineyard-Walk-900x600.jpg",
  "/images/awe/People-toasting-wine-glas-007.jpg",
  "/images/awe/VineyardViews%20(3).JPG",
  "/images/awe/babble-familystyle-dinner.jpg",
  "/images/awe/picada.jpg",
  "/images/awe/slideshow-6.jpg",
  "/images/awe/vineyard_walk.jpg",
];

export const CAROUSEL_GAUCHO = [
  "/images/gaucho/knife-1.png",
  "/images/gaucho/knife-2.png",
  "/images/gaucho/candlesticks.png",
  "/images/gaucho/gaucho-hat.png",
  "/images/gaucho/leather-jacket.png",
];

export const CAROUSEL_WINES = [
  "/images/awe/Algodon%20Wine%20Estates_RestaurantWine.jpg",
  "/images/awe/wine-picnic.jpg",
  "/images/awe/vineyard_walk.jpg",
];


export const LOTS = [
  // Wine & Golf - Existing
  { id: "E7", acres: 1.84, m2: 7444, total: 917906, desc: "Golf Course Estate, 16th Hole, Syrah Vines 1962", maintenance: 446.78, village: "Wine & Golf", status: "available" },
  { id: "E13", acres: 7.70, m2: 31159, total: 1620268, desc: "Golf Course Vineyard Estate, View on 10th Hole", maintenance: 755.07, village: "Wine & Golf", status: "available" },
  { id: "E14E", acres: 1.54, m2: 6220, total: 323446, desc: "Golf Course Vineyard Estate, View on 10th Hole", maintenance: 430.86, village: "Wine & Golf", status: "available" },
  { id: "E14W", acres: 1.54, m2: 6213, total: 310650, desc: "Golf Course Vineyard Estate, View on 10th Hole", maintenance: 430.77, village: "Wine & Golf", status: "available" },
  { id: "E17", acres: 1.97, m2: 7967, total: 654858, desc: "11th Hole Views, Wine & Golf Village", maintenance: 453.57, village: "Wine & Golf", status: "available" },
  { id: "E19", acres: 1.07, m2: 4349, total: 357461, desc: "13th Hole Views, Wine & Golf Village", maintenance: 406.52, village: "Wine & Golf", status: "available" },
  { id: "E20", acres: null, m2: null, total: null, desc: "Please inquire for pricing", maintenance: null, village: "Wine & Golf", status: "inquire" },
  { id: "E31", acres: 0.74, m2: 3001, total: 308271, desc: "14th & 15th Hole Views", maintenance: 389.01, village: "Wine & Golf", status: "available" },
  { id: "F3", acres: 0.99, m2: 4024, total: 275615, desc: "10th Hole and Pond View", maintenance: 402.77, village: "Wine & Golf", status: "available" },
  { id: "F7", acres: 1.23, m2: 4957, total: 339583, desc: "9th Hole", maintenance: 414.45, village: "Wine & Golf", status: "available" },
  { id: "F8", acres: 1.22, m2: 4945, total: 338713, desc: "9th Hole", maintenance: 414.27, village: "Wine & Golf", status: "available" },
  { id: "F9", acres: 1.20, m2: 4852, total: 332392, desc: "9th Hole", maintenance: 413.08, village: "Wine & Golf", status: "available" },
  { id: "F10", acres: 1.08, m2: 4360, total: 310579, desc: "7th & 8th Hole Views", maintenance: 406.68, village: "Wine & Golf", status: "available" },
  { id: "F12", acres: 1.14, m2: 4613, total: 316004, desc: "7th Hole View", maintenance: 409.97, village: "Wine & Golf", status: "available" },
  { id: "F13", acres: 0.85, m2: 3435, total: 277639, desc: "7th Hole View", maintenance: 394.64, village: "Wine & Golf", status: "available" },
  { id: "F14", acres: 0.95, m2: 3824, total: 309113, desc: "15th Hole View", maintenance: 399.71, village: "Wine & Golf", status: "available" },
  { id: "F18", acres: 0.98, m2: 3986, total: 300318, desc: "15th Hole View", maintenance: 401.81, village: "Wine & Golf", status: "available" },
  { id: "M2", acres: 0.74, m2: 3000, total: 234270, desc: "12th Hole View", maintenance: 389.00, village: "Wine & Golf", status: "available" },
  { id: "M3", acres: 0.74, m2: 3000, total: 234270, desc: "12th Hole View", maintenance: 389.00, village: "Wine & Golf", status: "available" },
  { id: "M4", acres: 0.74, m2: 3000, total: 234270, desc: "12th Hole View", maintenance: 389.00, village: "Wine & Golf", status: "available" },
  { id: "M6", acres: 1.25, m2: 5061, total: 395187, desc: "12th Hole View", maintenance: 417.41, village: "Wine & Golf", status: "available" },

  // Wine & Golf - New from maps
  { id: "D11", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "D12", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E1", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E2", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E5", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E6", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E8", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E9", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E10", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E10b", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E11", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E15", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E21", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E22", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E23", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E24", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E25", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E26", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "E27", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "F2", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "F17", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "M11", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },
  { id: "N7W", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Wine & Golf", status: "available" },

  // Desert & Vineyard - Existing
  { id: "U5", acres: 1.36, m2: 5485, total: 413302, desc: "Reservoir, Pond View Desert Estate", maintenance: 421.31, village: "Desert & Vineyard", status: "available" },
  { id: "U6", acres: 1.11, m2: 4497, total: 338859, desc: "Reservoir, Pond View Desert Estate", maintenance: 408.46, village: "Desert & Vineyard", status: "available" },
  { id: "U8", acres: 2.03, m2: 8233, total: 620370, desc: "Reservoir, Pond View Desert Estate", maintenance: 493.33, village: "Desert & Vineyard", status: "available" },

  // Desert & Vineyard - New from maps
  { id: "U4", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Desert & Vineyard", status: "available" },

  // Garden Estate - Existing
  { id: "I14", acres: 0.92, m2: 3706, total: 253890, desc: "Vineyard & Equestrian Meadows", maintenance: 398.18, village: "Garden Estate", status: "available" },
  { id: "I21", acres: 1.13, m2: 4559, total: 312290, desc: "Vineyard & Equestrian Meadows", maintenance: 409.27, village: "Garden Estate", status: "available" },
  { id: "K2", acres: 1.34, m2: 5426, total: 349399, desc: "Vineyard & Equestrian Meadows", maintenance: 411.49, village: "Garden Estate", status: "available" },
  { id: "K3", acres: 1.78, m2: 7213, total: 464423, desc: "Vineyard & Equestrian Meadows", maintenance: 443.78, village: "Garden Estate", status: "available" },
  { id: "K4", acres: 1.36, m2: 5494, total: 353790, desc: "Vineyard & Equestrian Meadows", maintenance: 421.42, village: "Garden Estate", status: "available" },
  { id: "K5", acres: 1.23, m2: 4997, total: 321725, desc: "Vineyard & Equestrian Meadows", maintenance: 414.94, village: "Garden Estate", status: "available" },
  { id: "K6", acres: 1.17, m2: 4731, total: 304621, desc: "Vineyard & Equestrian Meadows", maintenance: 411.49, village: "Garden Estate", status: "available" },

  // Garden Estate - New from maps
  { id: "I1", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "I3", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "I4", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "I6", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "I9", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "I10", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "I11", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "I12", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "I18", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "K1", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "K7", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "K9", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },
  { id: "K10", acres: null, m2: null, total: null, desc: "Contact us for details", maintenance: null, village: "Garden Estate", status: "available" },

  // Vineyard Estate - Existing
  { id: "N1", acres: 1.96, m2: 7929, total: 412318, desc: "Vineyard Estate Homesite", maintenance: 453.08, village: "Vineyard Estate", status: "available" },
  { id: "N3", acres: 1.96, m2: 7929, total: 412308, desc: "Vineyard Estate Homesite", maintenance: 453.08, village: "Vineyard Estate", status: "available" },
  { id: "N4", acres: 1.96, m2: 7929, total: 412308, desc: "Golf Course Garden Estate", maintenance: 453.08, village: "Vineyard Estate", status: "available" },
  { id: "N6", acres: 1.25, m2: 5060, total: 623898, desc: "Golf Course Garden Estate", maintenance: 415.78, village: "Vineyard Estate", status: "available" },
  { id: "N7", acres: 1.25, m2: 5060, total: 623957, desc: "Golf Course Garden Estate", maintenance: 418.48, village: "Vineyard Estate", status: "available" },
  { id: "N8", acres: 1.37, m2: 5553, total: 684632, desc: "Golf Course Garden Estate", maintenance: 417.67, village: "Vineyard Estate", status: "available" },
  { id: "N9", acres: 1.25, m2: 5060, total: 623877, desc: "Golf Course Garden Estate", maintenance: 420.45, village: "Vineyard Estate", status: "available" },
];

export const GAUCHO_PRODUCTS = [
  { name: "Suave Cotton Hoodie Bison", price: null, url: "https://www.gaucho.com/collections/mens-just-in/products/suave-cotton-hoodie-bison", img: "/images/gaucho/hoodie.webp", cat: "Clothing" },
  { name: "Horseshoe Pima T-Shirt", price: null, url: "https://www.gaucho.com/collections/mens-just-in/products/mens-horseshoe-pima-t-shirt", img: "/images/gaucho/heart-shirt.webp", cat: "Clothing" },
  { name: "Iconic Pima T-Shirt Black", price: null, url: "https://www.gaucho.com/collections/mens-just-in/products/mens-iconic-pima-t-shirt-black", img: "/images/gaucho/gaucho-pima-tshirt.webp", cat: "Clothing" },
  { name: "Beating Heart Charm Red", price: null, url: "https://www.gaucho.com/collections/womens-just-in/products/beating-heart-charm-in-red", img: "/images/gaucho/heart-charm.webp", cat: "Accessories" },
  { name: "Quintana Hat Black", price: null, url: "https://www.gaucho.com/collections/womens-hats/products/womens-quintana-hat-in-black", img: "/images/gaucho/quintana-hat.webp", cat: "Accessories" },
  { name: "Rural Scarf Blue", price: null, url: "https://www.gaucho.com/collections/mens-scarves/products/mens-rural-scarf-in-blue", img: "/images/gaucho/rural-scarf.webp", cat: "Accessories" },
  { name: "Gaucho Sunglasses Light Tortoiseshell", price: null, url: "https://www.gaucho.com/collections/mens-sunglasses/products/mens-gaucho-sunglasses-in-light-tortoiseshell", img: "/images/gaucho/glasses.webp", cat: "Accessories" },
  { name: "Tigre Tri-Fold Wallet Black", price: null, url: "https://www.gaucho.com/collections/mens-wallets/products/tigre-tri-fold-wallet-in-black", img: "/images/gaucho/tigre.webp", cat: "Accessories" },
  { name: "Tandil Knife Cow Bone", price: null, url: "https://www.gaucho.com/collections/the-gaucho-knives/products/tandil-knife-cow-bone", img: "/images/gaucho/tandil-cow.webp", cat: "Home" },
  { name: "Tandil Knife Deer Horn Silver", price: null, url: "https://www.gaucho.com/collections/the-gaucho-knives/products/tandil-knife-deer-horn-silver-nickel-alloy", img: "/images/gaucho/tandil-deer.webp", cat: "Home" },
  { name: "Olivos Big Round Centerpiece", price: null, url: "https://www.gaucho.com/collections/serving-trays-platters-centerpieces/products/olivos-big-round-centerpiece-brown-horn-polished-silver", img: "/images/gaucho/olivos-big-round.webp", cat: "Home" },
  { name: "Olivos Rectangular Tray", price: null, url: "https://www.gaucho.com/collections/serving-trays-platters-centerpieces/products/olivos-medium-rectangular-tray-black-horn-polished-copper", img: "/images/gaucho/olivos-rectangular.webp", cat: "Home" },
  { name: "Alvear Candle Holders Silver", price: null, url: "https://www.gaucho.com/collections/candles-candleholders/products/alvear-candle-holders-polished-silver", img: "/images/gaucho/candle-holder.webp", cat: "Home" },
  { name: "Bariloche Bliss Scented Candle", price: null, url: "https://www.gaucho.com/collections/candles-candleholders/products/bariloche-bliss-scented-candle", img: "/images/gaucho/candle.webp", cat: "Home" },
  { name: "Large Square Leather Valet Tray", price: null, url: "https://www.gaucho.com/products/large-square-leather-valet-tray-in-light-blue", img: "/images/gaucho/tray.webp", cat: "Home" },
];

export const WINES = [
  { name: "Reserve Malbec-Bonarda 2019", price: "$34.95", url: "https://algodonfinewines.com/products/algodon-reserve-malbec-bonarda-2019", img: "/images/wines/malbec-bonarda.png", type: "Reserve" },
  { name: "Malbec 2022", price: "$22.95", url: "https://algodonfinewines.com/products/algodon-estate-malbec-2022", img: "/images/wines/malbec.jpg", type: "Estate" },
  { name: "Reserve Cabernet Franc-Malbec 2016", price: "$35.95", url: "https://algodonfinewines.com/products/algodon-reserve-cabernet-franc-malbec-2016", img: "/images/wines/cabernet-franc.png", type: "Reserve" },
  { name: "PIMA 2021", price: "$99.95", url: "https://algodonfinewines.com/products/algodon-pima-2021", img: "/images/wines/pima.png", type: "Icon" },
  { name: "Estate Chardonnay 2023", price: "$22.95", url: "https://algodonfinewines.com/collections/white-wines/products/algodon-estate-chardonnay-2023", img: "/images/wines/chardonnay.png", type: "Estate" },
  { name: "Mauro Nosenzo Black Label 2021", price: "$59.95", url: "https://algodonfinewines.com/products/the-mauro-nosenzo-black-label-signature-blend-2021", img: "/images/wines/mauro-nosenzo.png", type: "Black Label" },
  { name: "Gran Cuvée 2021", price: null, url: "https://algodonfinewines.com/collections/wine-catalog/products/algodon-gran-cuvee-2021", img: "/images/wines/gran-cuvee.png", type: "Reserve" },
  { name: "Malbec Reserve 2018", price: null, url: "https://algodonfinewines.com/collections/wine-catalog/products/algodon-reserve-malbec-2018", img: "/images/wines/malbec-reserve.jpg", type: "Reserve" },
];

// Mock SynXis availability data (replace with real API calls when connected)
export const MOCK_ROOMS = {
  "Algodon Mansion": [
    { id: "AM-SUITE", name: "Luxury Suite", rate: 450, maxGuests: 3, total: 8 },
    { id: "AM-DELUXE", name: "Deluxe Room", rate: 320, maxGuests: 2, total: 12 },
    { id: "AM-PENTH", name: "Penthouse", rate: 890, maxGuests: 4, total: 2 },
  ],
  "Algodon Wine Estates": [
    { id: "AWE-VINE", name: "Vineyard View Suite", rate: 380, maxGuests: 3, total: 6 },
    { id: "AWE-LODGE", name: "Golf Lodge Room", rate: 280, maxGuests: 2, total: 10 },
    { id: "AWE-VILLA", name: "Private Villa", rate: 1200, maxGuests: 6, total: 3 },
  ],
  "Casa Gaucho": [
    { id: "CG-MASTER", name: "Master Suite", rate: 550, maxGuests: 4, total: 1 },
    { id: "CG-GUEST", name: "Guest Room", rate: 350, maxGuests: 2, total: 3 },
  ],
};

// Simulates SynXis OTA_HotelAvailRQ response
export const checkAvailability = (property, checkIn, nights, rooms) => {
  if (!checkIn || !nights) return null;
  const propertyRooms = MOCK_ROOMS[property] || [];
  return propertyRooms.map(room => {
    // Simulate random availability based on date
    const dateHash = checkIn.split("-").reduce((a, b) => a + parseInt(b), 0);
    const available = Math.max(0, room.total - (dateHash % (room.total + 2)));
    return { ...room, available, totalCost: room.rate * parseInt(nights) * parseInt(rooms || 1) };
  });
};
