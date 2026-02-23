/**
 * Generates update-cities-set.json with all 579 Bank of Ceylon branch names.
 * Run: node scripts/generate-cities-json.js
 */

const fs = require('fs');
const path = require('path');

// Branch names from Bank of Ceylon (ceylonexchange.com.au) - 579 entries
const BRANCH_NAMES = [
  'Addalachchenai', 'Adikarigama', 'Agalawatta', 'Agarapathana', 'Ahangama', 'Ahungalla',
  'Akkaraipattu', 'Akurana', 'Akuressa', 'Aladeniya', 'Alankerny', 'Alaveddy', 'Alawathugoda',
  'Alawwa', 'Aluthgama', 'Aluthkade', 'Aluthwala', 'Ambalangoda', 'Ambalantota', 'Ambanpola',
  'Ampara', 'Anamaduwa', 'Anawilundawa', 'Andankulam', 'Andiambalama', 'Angunakolapelessa',
  'Ankumbura', 'Anuradhapura', 'Anuradhapura Bazzar', 'Anuradhapura New Town', 'Araiyampathy',
  'Aralaganwila', 'Aranayake', 'Asiri Central', 'Atchuvely', 'Athurugiriya', 'Avissawella',
  'Ayagama', 'Badalkumbura', 'Baddegama', 'Badulla', 'Badulla City', 'Baduraliya', 'Bakamuna',
  'Balangoda', 'Ballaketuwa', 'Bambalapitiya', 'Bandaragama', 'Bandarawela', 'Barawakumbura',
  'Batapola', 'Battaramulla', 'Batticaloa', 'Batticaloa Town', 'Batuwatte', 'Beliatta',
  'Bentota', 'Beruwala', 'Bibile', 'Bingiriya', 'Biyagama', 'BOC premier', 'Bogahakumbura',
  'Bogaswewa', 'Bogawantalawa', 'Bokkawala', 'Bombuwela', 'Bopitiya', 'Boragas', 'Boralesgamuwa',
  'Borella 2nd', 'Borella S/G', 'Botanical Gardens Peradeniya', 'Bulathkohupitiya', 'Bulathsinhala', 'Buttala',
  'Central Bus Stand', 'Central Camp', 'Central Office', 'Central Super Market', 'CEYBANK Credit card centre',
  'Chankanai', 'Chavakachcheri', 'Cheddikulam', 'Chenkalady', 'Chilaw', 'China Bay', 'Chunnakam',
  'City Office', 'Corporate', 'Corporate 2nd', 'Court Complex Kandy', 'Dalugama', 'Dambadeniya',
  'Dambagalla', 'Dambulla', 'Dankotuwa', 'Danture', 'Daulagala', 'Dedicated Economic Centre – Meegoda',
  'Dehiattakandiya', 'Dehiowita', 'Dehiwala', 'Deiyandara', 'Delft', 'Delgoda', 'Demanhandiya', 'Dematagoda',
  'Deniyaya', 'Deraniyagala', 'Devinuwara', 'Dharga Town', 'Digana', 'Digana Village', 'Dikwella',
  'Divulapitiya', 'Diyabeduma', 'Diyasenpura', 'Diyatalawa', 'Dodangoda', 'Doramadalawa',
  'Dummalasuriya', 'Eastern University', 'Eheliyagoda', 'Elakanda', 'Electronic Banking Unit',
  'Ella', 'Elpitiya', 'Embilipitiya', 'Embilipitiya City', 'Endana', 'Enderamulla', 'Eppawala',
  'Eravur', 'Ethiliwewa', 'Ethimale', 'Ettampitiya', 'Fifth City', 'Fish Market Peliyagoda',
  'Galagedera', 'Galaha', 'Galamuna', 'Galenbindunuwewa', 'Galewela', 'Galgamuwa', 'Galigamuwa',
  'Galkiriyagama', 'Galle Bazaar', 'Galle Fort', 'Galnewa', 'Gampaha S/G', 'Gampola', 'Gampola City',
  'Ganemulla', 'Geli Oya', 'General Hospital, A\' pura', 'Ginigathhena', 'Girandurukotte',
  'Giriulla', 'Godakawela', 'Gonagaldeniya', 'Gonagolla', 'Gonapola', 'Gothatuwa', 'Grandpass',
  'Habarana', 'Hakmana', 'Haldummulla', 'Hali ela', 'Hambantota', 'Hanwella', 'Haputale',
  'Hasalaka', 'Hatharaliyadda', 'Hatton', 'Head Office', 'Hemmathagama', 'Hettipola', 'Hikkaduwa',
  'Hingurakgoda', 'Hingurana', 'Hiripitiya', 'Homagama', 'Horana', 'Horowpathana', 'Hyde Park',
  'Ibbagamuwa', 'Illavalai', 'Imaduwa', 'Independent Square', 'Ingiriya', 'International Division',
  'Ipalogama', 'Irakkamam', 'Islamic Banking Unit', 'Ja Ela', 'Jaffna', 'Jaffna 2nd Branch',
  'Jaffna Bus Stand', 'Jaffna Main Street', 'Jaffna University', 'Jayanthipura', 'Kadawatha',
  'Kadawatha 2nd City', 'Kaduruwela', 'Kaduwela', 'Kahatagasdigiliya', 'Kahawatte', 'Kaithady',
  'Kalawana', 'Kallady', 'Kallar', 'Kalmunai', 'Kalpitiya', 'Kalutara S/G', 'Kaluwanchikudy',
  'Kalviyankadu', 'Kamburupitiya', 'Kandana', 'Kandapola', 'Kandy', 'Kandy 2nd', 'Kandy City Centre',
  'Kandy Hospital', 'Kankesanthurai', 'Kantale Bazaar', 'Karadiyanaru', 'Karainagar', 'Karaitivu',
  'Karanavai', 'Karapitiya', 'Karawanella', 'Karawita', 'Katana', 'Kataragama', 'Kattankudy',
  'Katubedda', 'Katugastota', 'Katukurunda', 'Katunayake I.P.Z.', 'Katuneriya', 'Katupotha',
  'Katuwana', 'Katuwellegama Courtaulds Clothing Lanka (Pvt) Ltd', 'Kayts', 'Kebithigollawa',
  'Kegalle', 'Kegalle Bazaar', 'Kegalle Hospital', 'Kekanadura', 'Kekirawa', 'Keppetipola',
  'Kesbewa', 'Keselwatte', 'Kilinochchi', 'Kinniya', 'Kiran', 'Kiribathgoda', 'Kiriella',
  'Kirimetiyana', 'Kirindiwela', 'Kirulapana', 'Kitulgala', 'Kobeigane', 'Kochchikade',
  'Kodikamam', 'Koggala E.P.Z', 'Kokkadicholai', 'Kokuvil', 'Kollupitiya', 'Kollupitiya 2nd',
  'Kolonna', 'Kolonnawa', 'Kopay', 'Koslanda', 'Kosmodera', 'Kotagala', 'Kotahena',
  'Kothalawala Defence University', 'Kotiyakumbura', 'Kottawa', 'Kudawella', 'Kuliyapitiya',
  'Kumbukgete', 'Kurunduwatte', 'Kurunegala', 'Kurunegala Bazaar', 'Kuruwita', 'Lake House',
  'Lake View', 'Lanka Hospital', 'Lunugala', 'Lunugamvehera', 'Lunuwatte', 'Madampe',
  'Madatugama', 'Madawakkulama', 'Madawala', 'Madhu', 'Madurankuliya', 'Maha-Edanda',
  'Mahaoya', 'Maharagama', 'Mahawewa', 'Mahiyangana', 'Maho', 'Main Street', 'Makandura',
  'Makandura – Matara', 'Makola', 'Malabe', 'Malimbada', 'Malkaduwawa', 'Mallavi',
  'Malwatte', 'Mamangama', 'Manipay', 'Mankulam', 'Mannar', 'Manthikai', 'Maradana',
  'Marassana', 'Marawila', 'Maruthamunai', 'Maruthankerny', 'Maskeliya', 'Matale',
  'Matara', 'Matara City', 'Mattala Airport', 'Mattegoda', 'Matugama', 'Mawanella',
  'Mawathagama', 'Medagama', 'Medawachchiya', 'Medawala', 'Medirigiriya', 'Meegahakiwula',
  'Meegalewa', 'Meepilimana', 'Melsiripura', 'Menikhinna', 'Metropolitan', 'Middeniya',
  'Mihintale', 'Milagiriya', 'Minneriya', 'Minuwangoda', 'Mirigama', 'Mollipothana',
  'Monaragala', 'Moneragala Town', 'Moratumulla', 'Moratuwa', 'Morawaka', 'Morawewa',
  'Morontota', 'Mount Lavinia', 'Mulankavil', 'Mullativu', 'Mulleriyawa New Town', 'Mulliyawalai',
  'Murungan', 'Muttur', 'Nagoda', 'Nainativu', 'Naiwala', 'Nallur', 'Nanatan', 'Narahenpita',
  'Narammala', 'National Institute Of Education', 'Nattandiya', 'Naula', 'Navithanvely',
  'Nawalapitiya', 'Nedunkerny', 'Negombo', 'Negombo Bazzar', 'Nelliady', 'Nelundeniya',
  'Neluwa', 'Nikaweratiya', 'Nilavely', 'Nintavur', 'Nittambuwa', 'Nivitigala', 'Nochchiyagama',
  'Norchcholei', 'Nugegoda Supergrade', 'Nuwara Eliya', 'Oddamavady', 'Oddusudan', 'Okkampitiya',
  'Oluwil', 'Omanthai', 'Padavi Parakramapura', 'Padaviya', 'Padiyapelella', 'Padiyatalawa',
  'Padukka', 'Palapathwela', 'Palaviya', 'Pallai', 'Pallama', 'Pallebedda', 'Pallekelle',
  'Pallepola', 'Palmuddai', 'Palugamam', 'Panadura', 'Panadura Bazaar', 'Pannala',
  'Paragahadeniya', 'Paranthan', 'Parliamentary Complex', 'Pasgoda', 'Passara',
  'Pelawatta', 'Pelawatte City Kalutara', 'Peliyagoda', 'Pelmadulla', 'Pemaduwa',
  'Peradeniya', 'Personal', 'Pesalai', 'Pettah', 'Pilimatalawa', 'Piliyandala', 'Pinnawala',
  'Pitabeddara', 'Pitakotte', 'Pitigala', 'Point Pedro', 'Polgahawela', 'Polonnaruwa New Town',
  'Polpithigama', 'Polwatte', 'Poonagary', 'Poovarasankulam', 'Pothuhera', 'Potuvil',
  'Primary Dealer Unit', 'Provincial Council Complex, Pallakelle', 'Pugoda', 'Pujapitiya',
  'Pundaluoya', 'Punnalaikadduvan', 'Pussellawa', 'Puthukudieruppu', 'Puthukulam', 'Puttalam',
  'Raddolugama', 'Ragala', 'Ragama', 'Rajagiriya', 'Rajanganaya', 'Rajina Junction', 'Rakwana',
  'Rambewa', 'Rambukkana', 'Ranajayapura', 'Ranna', 'Rathgama', 'Ratmalana', 'Ratnapura',
  'Ratnapura Bazaar', 'Ratnapura Hospital', 'Rattota', 'Regent Street', 'Ridigama', 'Rikillagaskada',
  'Ruhunu Campus', 'Ruwanwella', 'Sabaragamuwa Provincial Council', 'Sabaragamuwa University',
  'Sainthamarathu', 'Saliyawewa', 'Samanthurai', 'Savalkaddu', 'Seeduwa', 'Seethawakapura',
  'Serunuwara', 'Sevanapitiya', 'Sewagama', 'Sigiriya', 'Sirupiddy', 'Siyambalanduwa',
  'Sri Jayawardenapura Hospital', 'Suriyawewa', 'Talatuoya', 'Talawakelle', 'Talgaswela',
  'Tambuttegama', 'Tangalle', 'Taprobane', 'Tawalama', 'Teldeniya', 'Thalaimannar Pier',
  'Thalawa', 'Thalawathugoda', 'Thalduwa', 'Thambiluvil', 'Thampalakamam', 'Thanamalwila',
  'Thanthirimale', 'Thihagoda', 'Thimbirigasyaya', 'Thirumurukandi', 'Thirunelvely', 'Thoduwawa',
  'Thoppur', 'Tirappane', 'Tissamaharama', 'Treasury Division', 'Trincomalee', 'Trincomalee Bazaar',
  'Uda Dumbara', 'Udappuwa', 'Udawalawe', 'Udugama', 'Uhana', 'Ukuwela', 'Union Place',
  'University Of Peradeniya', 'Upcott', 'Uppuvely', 'Uragasmanhandiya', 'Urubokka', 'Urumpirai',
  'Uva Paranagama', 'Vaddukoddai', 'Vakarai', 'Valachchenai', 'Valvettithurai', 'Vavunathivu',
  'Vavuniya', 'Vavuniya City', 'Velanai', 'Vellaveli', 'Veyangoda', 'Visakha', 'Visuvamadu',
  'Wadduwa', 'Wahalkada', 'Waikkal', 'Walapane', 'Walasmulla', 'Walgama', 'Wanduramba',
  'Warakapola', 'Warapitiya', 'Ward Place', 'Wariyapola', 'Wattala', 'Wattegama', 'Wayamba University',
  'Weeraketiya', 'Weerapokuna', 'Weligama', 'Weligepola', 'Welikanda', 'Welimada', 'Weli-Oya',
  'Welioya-Sampath Nuwara', 'Welisara', 'Weliweriya', 'Wellawa', 'Wellawatte', 'Wellawaya',
  'Welpalla', 'Wennappuwa', 'Wijerama Junction', 'Wilgamuwa', 'Yakkala', 'Yakkalamulla',
  'Yatawatte', 'Yatiyantota'
];

function nameToCode(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[,.'()––\-]/g, '')
    .replace(/[&]/g, 'and')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const cities = BRANCH_NAMES.map((name, i) => ({
  code: nameToCode(name),
  name,
  active: true,
  order: i + 1
}));

const output = {
  $set: {
    cities,
    updatedAt: { $date: new Date().toISOString() }
  }
};

const outPath = path.join(__dirname, 'update-cities-set.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log('Written', cities.length, 'cities to', outPath);
