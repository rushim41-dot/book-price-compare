export type PrizeCatalogSeedRow = readonly [
  slug: string,
  title: string,
  authors: readonly string[],
  awardYear: string,
  collectionSlug: string,
];

export const PRIZE_COLLECTION_DEFINITIONS = [
  ["booker-prize-winners", "Booker Prize Winners", "Booker Prize-winning novels, expanded across recent decades."],
  ["booker-finalists", "Booker Finalists", "Important Booker shortlisted and longlisted novels selected for further reading."],
  ["international-booker-winners", "International Booker Winners", "Translated fiction winners from the current International Booker format."],
  ["nobel-prize-winners", "Nobel Literature: Key Books", "Readable entry points by Nobel Prize in Literature laureates; the prize is awarded to authors, not individual books."],
  ["pulitzer-fiction-winners", "Pulitzer Fiction Winners", "Pulitzer Prize for Fiction winners, with strong recent-year coverage."],
  ["national-book-award-fiction-winners", "National Book Award Fiction Winners", "Recent winners of the US National Book Award for Fiction."],
  ["womens-prize-fiction-winners", "Women's Prize Fiction Winners", "The complete Women's Prize for Fiction winner run through 2026."],
  ["jcb-prize-winners", "JCB Prize Winners", "The winning books from the JCB Prize for Literature."],
  ["sahitya-akademi-english", "Sahitya Akademi: English", "Selected English-language Sahitya Akademi Award-winning fiction and story collections."],
  ["hugo-best-novel-winners", "Hugo Best Novel Winners", "Recent winners of the Hugo Award for Best Novel."],
  ["nebula-best-novel-winners", "Nebula Best Novel Winners", "Recent winners of the Nebula Award for Best Novel."],
  ["edgar-best-novel-winners", "Edgar Best Novel Winners", "Recent winners of the Edgar Award for Best Novel."],
  ["newbery-medal-winners", "Newbery Medal Winners", "Recent winners of the Newbery Medal for children's literature."],
  ["carnegie-medal-writing-winners", "Carnegie Medal Writing Winners", "Recent winners of the Carnegie Medal for Writing."],
] as const;

const RAW_PRIZE_CATALOG_SEED_ROWS: PrizeCatalogSeedRow[] = [
  // Booker Prize winners, 2000-2025 (existing catalog winners are linked separately).
  ["flesh", "Flesh", ["David Szalay"], "2025", "booker-prize-winners"],
  ["orbital", "Orbital", ["Samantha Harvey"], "2024", "booker-prize-winners"],
  ["prophet-song", "Prophet Song", ["Paul Lynch"], "2023", "booker-prize-winners"],
  ["the-seven-moons-of-maali-almeida", "The Seven Moons of Maali Almeida", ["Shehan Karunatilaka"], "2022", "booker-prize-winners"],
  ["the-promise-damon-galgut", "The Promise", ["Damon Galgut"], "2021", "booker-prize-winners"],
  ["shuggie-bain", "Shuggie Bain", ["Douglas Stuart"], "2020", "booker-prize-winners"],
  ["girl-woman-other", "Girl, Woman, Other", ["Bernardine Evaristo"], "2019", "booker-prize-winners"],
  ["the-testaments", "The Testaments", ["Margaret Atwood"], "2019", "booker-prize-winners"],
  ["milkman", "Milkman", ["Anna Burns"], "2018", "booker-prize-winners"],
  ["lincoln-in-the-bardo", "Lincoln in the Bardo", ["George Saunders"], "2017", "booker-prize-winners"],
  ["the-sellout", "The Sellout", ["Paul Beatty"], "2016", "booker-prize-winners"],
  ["a-brief-history-of-seven-killings", "A Brief History of Seven Killings", ["Marlon James"], "2015", "booker-prize-winners"],
  ["the-narrow-road-to-the-deep-north", "The Narrow Road to the Deep North", ["Richard Flanagan"], "2014", "booker-prize-winners"],
  ["the-luminaries", "The Luminaries", ["Eleanor Catton"], "2013", "booker-prize-winners"],
  ["bring-up-the-bodies", "Bring Up the Bodies", ["Hilary Mantel"], "2012", "booker-prize-winners"],
  ["the-sense-of-an-ending", "The Sense of an Ending", ["Julian Barnes"], "2011", "booker-prize-winners"],
  ["the-finkler-question", "The Finkler Question", ["Howard Jacobson"], "2010", "booker-prize-winners"],
  ["wolf-hall", "Wolf Hall", ["Hilary Mantel"], "2009", "booker-prize-winners"],
  ["the-gathering", "The Gathering", ["Anne Enright"], "2007", "booker-prize-winners"],
  ["the-sea", "The Sea", ["John Banville"], "2005", "booker-prize-winners"],
  ["the-line-of-beauty", "The Line of Beauty", ["Alan Hollinghurst"], "2004", "booker-prize-winners"],
  ["vernon-god-little", "Vernon God Little", ["DBC Pierre"], "2003", "booker-prize-winners"],
  ["true-history-of-the-kelly-gang", "True History of the Kelly Gang", ["Peter Carey"], "2001", "booker-prize-winners"],
  ["the-blind-assassin", "The Blind Assassin", ["Margaret Atwood"], "2000", "booker-prize-winners"],

  // High-signal Booker finalists from recent prize years.
  ["james", "James", ["Percival Everett"], "2024", "booker-finalists"],
  ["creation-lake", "Creation Lake", ["Rachel Kushner"], "2024", "booker-finalists"],
  ["held", "Held", ["Anne Michaels"], "2024", "booker-finalists"],
  ["the-safekeep", "The Safekeep", ["Yael van der Wouden"], "2024", "booker-finalists"],
  ["stone-yard-devotional", "Stone Yard Devotional", ["Charlotte Wood"], "2024", "booker-finalists"],
  ["this-strange-eventful-history", "This Strange Eventful History", ["Claire Messud"], "2024", "booker-finalists"],
  ["wandering-stars", "Wandering Stars", ["Tommy Orange"], "2024", "booker-finalists"],
  ["my-friends", "My Friends", ["Hisham Matar"], "2024", "booker-finalists"],
  ["western-lane", "Western Lane", ["Chetna Maroo"], "2023", "booker-finalists"],
  ["the-bee-sting", "The Bee Sting", ["Paul Murray"], "2023", "booker-finalists"],
  ["study-for-obedience", "Study for Obedience", ["Sarah Bernstein"], "2023", "booker-finalists"],
  ["if-i-survive-you", "If I Survive You", ["Jonathan Escoffery"], "2023", "booker-finalists"],
  ["the-trees", "The Trees", ["Percival Everett"], "2022", "booker-finalists"],
  ["small-things-like-these", "Small Things Like These", ["Claire Keegan"], "2022", "booker-finalists"],
  ["great-circle", "Great Circle", ["Maggie Shipstead"], "2021", "booker-finalists"],
  ["bewilderment", "Bewilderment", ["Richard Powers"], "2021", "booker-finalists"],
  ["no-one-is-talking-about-this", "No One Is Talking About This", ["Patricia Lockwood"], "2021", "booker-finalists"],
  ["real-life", "Real Life", ["Brandon Taylor"], "2020", "booker-finalists"],
  ["the-shadow-king", "The Shadow King", ["Maaza Mengiste"], "2020", "booker-finalists"],
  ["ducks-newburyport", "Ducks, Newburyport", ["Lucy Ellmann"], "2019", "booker-finalists"],

  // International Booker winners under the annual single-book format.
  ["heart-lamp", "Heart Lamp", ["Banu Mushtaq", "Deepa Bhasthi"], "2025", "international-booker-winners"],
  ["kairos", "Kairos", ["Jenny Erpenbeck", "Michael Hofmann"], "2024", "international-booker-winners"],
  ["time-shelter", "Time Shelter", ["Georgi Gospodinov", "Angela Rodel"], "2023", "international-booker-winners"],
  ["at-night-all-blood-is-black", "At Night All Blood Is Black", ["David Diop", "Anna Moschovakis"], "2021", "international-booker-winners"],
  ["the-discomfort-of-evening", "The Discomfort of Evening", ["Marieke Lucas Rijneveld", "Michele Hutchison"], "2020", "international-booker-winners"],
  ["celestial-bodies", "Celestial Bodies", ["Jokha Alharthi", "Marilyn Booth"], "2019", "international-booker-winners"],
  ["flights", "Flights", ["Olga Tokarczuk", "Jennifer Croft"], "2018", "international-booker-winners"],
  ["a-horse-walks-into-a-bar", "A Horse Walks into a Bar", ["David Grossman", "Jessica Cohen"], "2017", "international-booker-winners"],
  ["the-vegetarian", "The Vegetarian", ["Han Kang", "Deborah Smith"], "2016", "international-booker-winners"],

  // Entry points by Nobel literature laureates.
  ["never-let-me-go", "Never Let Me Go", ["Kazuo Ishiguro"], "2005", "nobel-prize-winners"],
  ["the-remains-of-the-day", "The Remains of the Day", ["Kazuo Ishiguro"], "1989", "nobel-prize-winners"],
  ["blindness", "Blindness", ["Jose Saramago"], "1995", "nobel-prize-winners"],
  ["snow-orhan-pamuk", "Snow", ["Orhan Pamuk"], "2002", "nobel-prize-winners"],
  ["my-name-is-red", "My Name Is Red", ["Orhan Pamuk"], "1998", "nobel-prize-winners"],
  ["the-grass-is-singing", "The Grass Is Singing", ["Doris Lessing"], "1950", "nobel-prize-winners"],
  ["the-bluest-eye", "The Bluest Eye", ["Toni Morrison"], "1970", "nobel-prize-winners"],
  ["chronicle-of-a-death-foretold", "Chronicle of a Death Foretold", ["Gabriel Garcia Marquez"], "1981", "nobel-prize-winners"],
  ["steppenwolf", "Steppenwolf", ["Hermann Hesse"], "1927", "nobel-prize-winners"],
  ["the-years-annie-ernaux", "The Years", ["Annie Ernaux", "Alison L. Strayer"], "2008", "nobel-prize-winners"],
  ["human-acts", "Human Acts", ["Han Kang", "Deborah Smith"], "2014", "nobel-prize-winners"],
  ["paradise-abdulrazak-gurnah", "Paradise", ["Abdulrazak Gurnah"], "1994", "nobel-prize-winners"],
  ["drive-your-plow-over-the-bones-of-the-dead", "Drive Your Plow Over the Bones of the Dead", ["Olga Tokarczuk", "Antonia Lloyd-Jones"], "2009", "nobel-prize-winners"],
  ["dear-life", "Dear Life", ["Alice Munro"], "2012", "nobel-prize-winners"],
  ["missing-person-patrick-modiano", "Missing Person", ["Patrick Modiano", "Daniel Weissbort"], "1978", "nobel-prize-winners"],
  ["red-sorghum", "Red Sorghum", ["Mo Yan", "Howard Goldblatt"], "1986", "nobel-prize-winners"],
  ["the-feast-of-the-goat", "The Feast of the Goat", ["Mario Vargas Llosa", "Edith Grossman"], "2000", "nobel-prize-winners"],

  // Pulitzer Prize for Fiction winners, 2000-2026 (2012 had no award).
  ["angel-down", "Angel Down", ["Daniel Kraus"], "2026", "pulitzer-fiction-winners"],
  ["james", "James", ["Percival Everett"], "2025", "pulitzer-fiction-winners"],
  ["night-watch", "Night Watch", ["Jayne Anne Phillips"], "2024", "pulitzer-fiction-winners"],
  ["trust-hernan-diaz", "Trust", ["Hernan Diaz"], "2023", "pulitzer-fiction-winners"],
  ["demon-copperhead", "Demon Copperhead", ["Barbara Kingsolver"], "2023", "pulitzer-fiction-winners"],
  ["the-netanyahus", "The Netanyahus", ["Joshua Cohen"], "2022", "pulitzer-fiction-winners"],
  ["the-night-watchman", "The Night Watchman", ["Louise Erdrich"], "2021", "pulitzer-fiction-winners"],
  ["the-nickel-boys", "The Nickel Boys", ["Colson Whitehead"], "2020", "pulitzer-fiction-winners"],
  ["the-overstory", "The Overstory", ["Richard Powers"], "2019", "pulitzer-fiction-winners"],
  ["less", "Less", ["Andrew Sean Greer"], "2018", "pulitzer-fiction-winners"],
  ["the-underground-railroad", "The Underground Railroad", ["Colson Whitehead"], "2017", "pulitzer-fiction-winners"],
  ["the-sympathizer", "The Sympathizer", ["Viet Thanh Nguyen"], "2016", "pulitzer-fiction-winners"],
  ["all-the-light-we-cannot-see", "All the Light We Cannot See", ["Anthony Doerr"], "2015", "pulitzer-fiction-winners"],
  ["the-goldfinch", "The Goldfinch", ["Donna Tartt"], "2014", "pulitzer-fiction-winners"],
  ["the-orphan-masters-son", "The Orphan Master's Son", ["Adam Johnson"], "2013", "pulitzer-fiction-winners"],
  ["a-visit-from-the-goon-squad", "A Visit from the Goon Squad", ["Jennifer Egan"], "2011", "pulitzer-fiction-winners"],
  ["tinkers", "Tinkers", ["Paul Harding"], "2010", "pulitzer-fiction-winners"],
  ["olive-kitteridge", "Olive Kitteridge", ["Elizabeth Strout"], "2009", "pulitzer-fiction-winners"],
  ["the-brief-wondrous-life-of-oscar-wao", "The Brief Wondrous Life of Oscar Wao", ["Junot Diaz"], "2008", "pulitzer-fiction-winners"],
  ["the-road", "The Road", ["Cormac McCarthy"], "2007", "pulitzer-fiction-winners"],
  ["march", "March", ["Geraldine Brooks"], "2006", "pulitzer-fiction-winners"],
  ["gilead", "Gilead", ["Marilynne Robinson"], "2005", "pulitzer-fiction-winners"],
  ["the-known-world", "The Known World", ["Edward P. Jones"], "2004", "pulitzer-fiction-winners"],
  ["middlesex", "Middlesex", ["Jeffrey Eugenides"], "2003", "pulitzer-fiction-winners"],
  ["empire-falls", "Empire Falls", ["Richard Russo"], "2002", "pulitzer-fiction-winners"],
  ["the-amazing-adventures-of-kavalier-and-clay", "The Amazing Adventures of Kavalier & Clay", ["Michael Chabon"], "2001", "pulitzer-fiction-winners"],

  // National Book Award for Fiction winners, 2005-2025.
  ["the-true-true-story-of-raja-the-gullible-and-his-mother", "The True True Story of Raja the Gullible (and His Mother)", ["Rabih Alameddine"], "2025", "national-book-award-fiction-winners"],
  ["james", "James", ["Percival Everett"], "2024", "national-book-award-fiction-winners"],
  ["blackouts", "Blackouts", ["Justin Torres"], "2023", "national-book-award-fiction-winners"],
  ["the-rabbit-hutch", "The Rabbit Hutch", ["Tess Gunty"], "2022", "national-book-award-fiction-winners"],
  ["hell-of-a-book", "Hell of a Book", ["Jason Mott"], "2021", "national-book-award-fiction-winners"],
  ["interior-chinatown", "Interior Chinatown", ["Charles Yu"], "2020", "national-book-award-fiction-winners"],
  ["trust-exercise", "Trust Exercise", ["Susan Choi"], "2019", "national-book-award-fiction-winners"],
  ["the-friend", "The Friend", ["Sigrid Nunez"], "2018", "national-book-award-fiction-winners"],
  ["sing-unburied-sing", "Sing, Unburied, Sing", ["Jesmyn Ward"], "2017", "national-book-award-fiction-winners"],
  ["the-underground-railroad", "The Underground Railroad", ["Colson Whitehead"], "2016", "national-book-award-fiction-winners"],
  ["fortune-smiles", "Fortune Smiles", ["Adam Johnson"], "2015", "national-book-award-fiction-winners"],
  ["redeployment", "Redeployment", ["Phil Klay"], "2014", "national-book-award-fiction-winners"],
  ["the-good-lord-bird", "The Good Lord Bird", ["James McBride"], "2013", "national-book-award-fiction-winners"],
  ["the-round-house", "The Round House", ["Louise Erdrich"], "2012", "national-book-award-fiction-winners"],
  ["salvage-the-bones", "Salvage the Bones", ["Jesmyn Ward"], "2011", "national-book-award-fiction-winners"],
  ["lord-of-misrule", "Lord of Misrule", ["Jaimy Gordon"], "2010", "national-book-award-fiction-winners"],
  ["let-the-great-world-spin", "Let the Great World Spin", ["Colum McCann"], "2009", "national-book-award-fiction-winners"],
  ["shadow-country", "Shadow Country", ["Peter Matthiessen"], "2008", "national-book-award-fiction-winners"],
  ["tree-of-smoke", "Tree of Smoke", ["Denis Johnson"], "2007", "national-book-award-fiction-winners"],
  ["the-echo-maker", "The Echo Maker", ["Richard Powers"], "2006", "national-book-award-fiction-winners"],
  ["europe-central", "Europe Central", ["William T. Vollmann"], "2005", "national-book-award-fiction-winners"],

  // Women's Prize for Fiction winners, 1996-2026.
  ["the-correspondent", "The Correspondent", ["Virginia Evans"], "2026", "womens-prize-fiction-winners"],
  ["the-safekeep", "The Safekeep", ["Yael van der Wouden"], "2025", "womens-prize-fiction-winners"],
  ["brotherless-night", "Brotherless Night", ["V. V. Ganeshananthan"], "2024", "womens-prize-fiction-winners"],
  ["demon-copperhead", "Demon Copperhead", ["Barbara Kingsolver"], "2023", "womens-prize-fiction-winners"],
  ["the-book-of-form-and-emptiness", "The Book of Form and Emptiness", ["Ruth Ozeki"], "2022", "womens-prize-fiction-winners"],
  ["piranesi", "Piranesi", ["Susanna Clarke"], "2021", "womens-prize-fiction-winners"],
  ["hamnet", "Hamnet", ["Maggie O'Farrell"], "2020", "womens-prize-fiction-winners"],
  ["an-american-marriage", "An American Marriage", ["Tayari Jones"], "2019", "womens-prize-fiction-winners"],
  ["home-fire", "Home Fire", ["Kamila Shamsie"], "2018", "womens-prize-fiction-winners"],
  ["the-power", "The Power", ["Naomi Alderman"], "2017", "womens-prize-fiction-winners"],
  ["the-glorious-heresies", "The Glorious Heresies", ["Lisa McInerney"], "2016", "womens-prize-fiction-winners"],
  ["how-to-be-both", "How to Be Both", ["Ali Smith"], "2015", "womens-prize-fiction-winners"],
  ["a-girl-is-a-half-formed-thing", "A Girl Is a Half-formed Thing", ["Eimear McBride"], "2014", "womens-prize-fiction-winners"],
  ["may-we-be-forgiven", "May We Be Forgiven", ["A. M. Homes"], "2013", "womens-prize-fiction-winners"],
  ["the-tigers-wife", "The Tiger's Wife", ["Tea Obreht"], "2011", "womens-prize-fiction-winners"],
  ["the-lacuna", "The Lacuna", ["Barbara Kingsolver"], "2010", "womens-prize-fiction-winners"],
  ["home-marilynne-robinson", "Home", ["Marilynne Robinson"], "2009", "womens-prize-fiction-winners"],
  ["the-road-home", "The Road Home", ["Rose Tremain"], "2008", "womens-prize-fiction-winners"],
  ["half-of-a-yellow-sun", "Half of a Yellow Sun", ["Chimamanda Ngozi Adichie"], "2007", "womens-prize-fiction-winners"],
  ["on-beauty", "On Beauty", ["Zadie Smith"], "2006", "womens-prize-fiction-winners"],
  ["we-need-to-talk-about-kevin", "We Need to Talk About Kevin", ["Lionel Shriver"], "2005", "womens-prize-fiction-winners"],
  ["small-island", "Small Island", ["Andrea Levy"], "2004", "womens-prize-fiction-winners"],
  ["property", "Property", ["Valerie Martin"], "2003", "womens-prize-fiction-winners"],
  ["bel-canto", "Bel Canto", ["Ann Patchett"], "2002", "womens-prize-fiction-winners"],
  ["the-idea-of-perfection", "The Idea of Perfection", ["Kate Grenville"], "2001", "womens-prize-fiction-winners"],
  ["when-i-lived-in-modern-times", "When I Lived in Modern Times", ["Linda Grant"], "2000", "womens-prize-fiction-winners"],
  ["a-crime-in-the-neighborhood", "A Crime in the Neighborhood", ["Suzanne Berne"], "1999", "womens-prize-fiction-winners"],
  ["larrys-party", "Larry's Party", ["Carol Shields"], "1998", "womens-prize-fiction-winners"],
  ["fugitive-pieces", "Fugitive Pieces", ["Anne Michaels"], "1997", "womens-prize-fiction-winners"],
  ["a-spell-of-winter", "A Spell of Winter", ["Helen Dunmore"], "1996", "womens-prize-fiction-winners"],

  // JCB Prize winners.
  ["jasmine-days", "Jasmine Days", ["Benyamin", "Shahnaz Habib"], "2018", "jcb-prize-winners"],
  ["moustache", "Moustache", ["S. Hareesh", "Jayasree Kalathil"], "2020", "jcb-prize-winners"],
  ["delhi-a-soliloquy", "Delhi: A Soliloquy", ["M. Mukundan", "Fathima E. V.", "Nandakumar K."], "2021", "jcb-prize-winners"],
  ["fire-bird", "Fire Bird", ["Perumal Murugan", "Janani Kannan"], "2023", "jcb-prize-winners"],

  // Recent English-language Sahitya Akademi fiction and story winners.
  ["crimson-spring", "Crimson Spring", ["Navtej Sarna"], "2025", "sahitya-akademi-english"],
  ["spirit-nights", "Spirit Nights", ["Easterine Kire"], "2024", "sahitya-akademi-english"],
  ["requiem-in-raga-janki", "Requiem in Raga Janki", ["Neelum Saran Gour"], "2023", "sahitya-akademi-english"],
  ["all-the-lives-we-never-lived", "All the Lives We Never Lived", ["Anuradha Roy"], "2022", "sahitya-akademi-english"],
  ["things-to-leave-behind", "Things to Leave Behind", ["Namita Gokhale"], "2021", "sahitya-akademi-english"],
  ["the-blind-ladys-descendants", "The Blind Lady's Descendants", ["Anees Salim"], "2018", "sahitya-akademi-english"],
  ["the-black-hill", "The Black Hill", ["Mamang Dai"], "2017", "sahitya-akademi-english"],
  ["chronicle-of-a-corpse-bearer", "Chronicle of a Corpse Bearer", ["Cyrus Mistry"], "2015", "sahitya-akademi-english"],
  ["laburnum-for-my-head", "Laburnum for My Head", ["Temsula Ao"], "2013", "sahitya-akademi-english"],
  ["book-of-rachel", "Book of Rachel", ["Esther David"], "2010", "sahitya-akademi-english"],

  // Recent Hugo Best Novel winners.
  ["the-tainted-cup", "The Tainted Cup", ["Robert Jackson Bennett"], "2025", "hugo-best-novel-winners"],
  ["some-desperate-glory", "Some Desperate Glory", ["Emily Tesh"], "2024", "hugo-best-novel-winners"],
  ["nettle-and-bone", "Nettle & Bone", ["T. Kingfisher"], "2023", "hugo-best-novel-winners"],
  ["a-desolation-called-peace", "A Desolation Called Peace", ["Arkady Martine"], "2022", "hugo-best-novel-winners"],
  ["network-effect", "Network Effect", ["Martha Wells"], "2021", "hugo-best-novel-winners"],
  ["a-memory-called-empire", "A Memory Called Empire", ["Arkady Martine"], "2020", "hugo-best-novel-winners"],
  ["the-calculating-stars", "The Calculating Stars", ["Mary Robinette Kowal"], "2019", "hugo-best-novel-winners"],
  ["the-stone-sky", "The Stone Sky", ["N. K. Jemisin"], "2018", "hugo-best-novel-winners"],
  ["the-obelisk-gate", "The Obelisk Gate", ["N. K. Jemisin"], "2017", "hugo-best-novel-winners"],
  ["the-fifth-season", "The Fifth Season", ["N. K. Jemisin"], "2016", "hugo-best-novel-winners"],
  ["the-three-body-problem", "The Three-Body Problem", ["Cixin Liu", "Ken Liu"], "2015", "hugo-best-novel-winners"],
  ["ancillary-justice", "Ancillary Justice", ["Ann Leckie"], "2014", "hugo-best-novel-winners"],
  ["redshirts", "Redshirts", ["John Scalzi"], "2013", "hugo-best-novel-winners"],
  ["among-others", "Among Others", ["Jo Walton"], "2012", "hugo-best-novel-winners"],
  ["blackout-all-clear", "Blackout/All Clear", ["Connie Willis"], "2011", "hugo-best-novel-winners"],
  ["the-windup-girl", "The Windup Girl", ["Paolo Bacigalupi"], "2010", "hugo-best-novel-winners"],
  ["the-city-and-the-city", "The City & the City", ["China Mieville"], "2010", "hugo-best-novel-winners"],
  ["the-yiddish-policemens-union", "The Yiddish Policemen's Union", ["Michael Chabon"], "2008", "hugo-best-novel-winners"],
  ["rainbows-end", "Rainbows End", ["Vernor Vinge"], "2007", "hugo-best-novel-winners"],
  ["spin", "Spin", ["Robert Charles Wilson"], "2006", "hugo-best-novel-winners"],

  // Nebula Best Novel winners, 2013-2025.
  ["the-buffalo-hunter-hunter", "The Buffalo Hunter Hunter", ["Stephen Graham Jones"], "2025", "nebula-best-novel-winners"],
  ["someone-you-can-build-a-nest-in", "Someone You Can Build a Nest In", ["John Wiswell"], "2024", "nebula-best-novel-winners"],
  ["the-saint-of-bright-doors", "The Saint of Bright Doors", ["Vajra Chandrasekera"], "2023", "nebula-best-novel-winners"],
  ["babel", "Babel", ["R. F. Kuang"], "2022", "nebula-best-novel-winners"],
  ["a-master-of-djinn", "A Master of Djinn", ["P. Djeli Clark"], "2021", "nebula-best-novel-winners"],
  ["network-effect", "Network Effect", ["Martha Wells"], "2020", "nebula-best-novel-winners"],
  ["a-song-for-a-new-day", "A Song for a New Day", ["Sarah Pinsker"], "2019", "nebula-best-novel-winners"],
  ["the-calculating-stars", "The Calculating Stars", ["Mary Robinette Kowal"], "2018", "nebula-best-novel-winners"],
  ["the-stone-sky", "The Stone Sky", ["N. K. Jemisin"], "2017", "nebula-best-novel-winners"],
  ["all-the-birds-in-the-sky", "All the Birds in the Sky", ["Charlie Jane Anders"], "2016", "nebula-best-novel-winners"],
  ["uprooted", "Uprooted", ["Naomi Novik"], "2015", "nebula-best-novel-winners"],
  ["annihilation", "Annihilation", ["Jeff VanderMeer"], "2014", "nebula-best-novel-winners"],
  ["ancillary-justice", "Ancillary Justice", ["Ann Leckie"], "2013", "nebula-best-novel-winners"],

  // Recent Edgar Best Novel winners.
  ["hard-town", "Hard Town", ["Adam Plantinga"], "2026", "edgar-best-novel-winners"],
  ["the-tainted-cup", "The Tainted Cup", ["Robert Jackson Bennett"], "2025", "edgar-best-novel-winners"],
  ["flags-on-the-bayou", "Flags on the Bayou", ["James Lee Burke"], "2024", "edgar-best-novel-winners"],
  ["notes-on-an-execution", "Notes on an Execution", ["Danya Kukafka"], "2023", "edgar-best-novel-winners"],
  ["five-decembers", "Five Decembers", ["James Kestrel"], "2022", "edgar-best-novel-winners"],
  ["djinn-patrol-on-the-purple-line", "Djinn Patrol on the Purple Line", ["Deepa Anappara"], "2021", "edgar-best-novel-winners"],
  ["the-stranger-diaries", "The Stranger Diaries", ["Elly Griffiths"], "2020", "edgar-best-novel-winners"],
  ["down-the-river-unto-the-sea", "Down the River Unto the Sea", ["Walter Mosley"], "2019", "edgar-best-novel-winners"],
  ["bluebird-bluebird", "Bluebird, Bluebird", ["Attica Locke"], "2018", "edgar-best-novel-winners"],
  ["before-the-fall", "Before the Fall", ["Noah Hawley"], "2017", "edgar-best-novel-winners"],
  ["let-me-die-in-his-footsteps", "Let Me Die in His Footsteps", ["Lori Roy"], "2016", "edgar-best-novel-winners"],

  // Newbery Medal winners, 2005-2026.
  ["all-the-blues-in-the-sky", "All the Blues in the Sky", ["Renee Watson"], "2026", "newbery-medal-winners"],
  ["the-first-state-of-being", "The First State of Being", ["Erin Entrada Kelly"], "2025", "newbery-medal-winners"],
  ["the-eyes-and-the-impossible", "The Eyes and the Impossible", ["Dave Eggers"], "2024", "newbery-medal-winners"],
  ["freewater", "Freewater", ["Amina Luqman-Dawson"], "2023", "newbery-medal-winners"],
  ["the-last-cuentista", "The Last Cuentista", ["Donna Barba Higuera"], "2022", "newbery-medal-winners"],
  ["when-you-trap-a-tiger", "When You Trap a Tiger", ["Tae Keller"], "2021", "newbery-medal-winners"],
  ["new-kid", "New Kid", ["Jerry Craft"], "2020", "newbery-medal-winners"],
  ["merci-suarez-changes-gears", "Merci Suarez Changes Gears", ["Meg Medina"], "2019", "newbery-medal-winners"],
  ["hello-universe", "Hello, Universe", ["Erin Entrada Kelly"], "2018", "newbery-medal-winners"],
  ["the-girl-who-drank-the-moon", "The Girl Who Drank the Moon", ["Kelly Barnhill"], "2017", "newbery-medal-winners"],
  ["last-stop-on-market-street", "Last Stop on Market Street", ["Matt de la Pena"], "2016", "newbery-medal-winners"],
  ["the-crossover", "The Crossover", ["Kwame Alexander"], "2015", "newbery-medal-winners"],
  ["flora-and-ulysses", "Flora & Ulysses", ["Kate DiCamillo"], "2014", "newbery-medal-winners"],
  ["the-one-and-only-ivan", "The One and Only Ivan", ["Katherine Applegate"], "2013", "newbery-medal-winners"],
  ["dead-end-in-norvelt", "Dead End in Norvelt", ["Jack Gantos"], "2012", "newbery-medal-winners"],
  ["moon-over-manifest", "Moon Over Manifest", ["Clare Vanderpool"], "2011", "newbery-medal-winners"],
  ["when-you-reach-me", "When You Reach Me", ["Rebecca Stead"], "2010", "newbery-medal-winners"],
  ["the-graveyard-book", "The Graveyard Book", ["Neil Gaiman"], "2009", "newbery-medal-winners"],
  ["good-masters-sweet-ladies", "Good Masters! Sweet Ladies!", ["Laura Amy Schlitz"], "2008", "newbery-medal-winners"],
  ["the-higher-power-of-lucky", "The Higher Power of Lucky", ["Susan Patron"], "2007", "newbery-medal-winners"],
  ["criss-cross", "Criss Cross", ["Lynne Rae Perkins"], "2006", "newbery-medal-winners"],
  ["kira-kira", "Kira-Kira", ["Cynthia Kadohata"], "2005", "newbery-medal-winners"],

  // Carnegie Medal for Writing winners, 2005-2026.
  ["wolf-siren", "Wolf Siren", ["Beth O'Brien"], "2026", "carnegie-medal-writing-winners"],
  ["glasgow-boys", "Glasgow Boys", ["Margaret McDonald"], "2025", "carnegie-medal-writing-winners"],
  ["the-boy-lost-in-the-maze", "The Boy Lost in the Maze", ["Joseph Coelho"], "2024", "carnegie-medal-writing-winners"],
  ["the-blue-book-of-nebo", "The Blue Book of Nebo", ["Manon Steffan Ros"], "2023", "carnegie-medal-writing-winners"],
  ["october-october", "October, October", ["Katya Balen"], "2022", "carnegie-medal-writing-winners"],
  ["look-both-ways", "Look Both Ways", ["Jason Reynolds"], "2021", "carnegie-medal-writing-winners"],
  ["lark", "Lark", ["Anthony McGowan"], "2020", "carnegie-medal-writing-winners"],
  ["the-poet-x", "The Poet X", ["Elizabeth Acevedo"], "2019", "carnegie-medal-writing-winners"],
  ["where-the-world-ends", "Where the World Ends", ["Geraldine McCaughrean"], "2018", "carnegie-medal-writing-winners"],
  ["one-sarah-crossan", "One", ["Sarah Crossan"], "2016", "carnegie-medal-writing-winners"],
  ["buffalo-soldier", "Buffalo Soldier", ["Tanya Landman"], "2015", "carnegie-medal-writing-winners"],
  ["the-bunker-diary", "The Bunker Diary", ["Kevin Brooks"], "2014", "carnegie-medal-writing-winners"],
  ["maggot-moon", "Maggot Moon", ["Sally Gardner"], "2013", "carnegie-medal-writing-winners"],
  ["a-monster-calls", "A Monster Calls", ["Patrick Ness"], "2012", "carnegie-medal-writing-winners"],
  ["monsters-of-men", "Monsters of Men", ["Patrick Ness"], "2011", "carnegie-medal-writing-winners"],
  ["the-graveyard-book", "The Graveyard Book", ["Neil Gaiman"], "2010", "carnegie-medal-writing-winners"],
  ["bog-child", "Bog Child", ["Siobhan Dowd"], "2009", "carnegie-medal-writing-winners"],
  ["here-lies-arthur", "Here Lies Arthur", ["Philip Reeve"], "2008", "carnegie-medal-writing-winners"],
  ["just-in-case", "Just in Case", ["Meg Rosoff"], "2007", "carnegie-medal-writing-winners"],
  ["tamar", "Tamar", ["Mal Peet"], "2005", "carnegie-medal-writing-winners"],
];

export const PRIZE_CATALOG_SEED_ROWS = mergePrizeRows(
  RAW_PRIZE_CATALOG_SEED_ROWS
);

export const EXISTING_PRIZE_COLLECTION_BOOK_SLUGS: Record<string, string[]> = {
  "booker-prize-winners": [
    "midnights-children",
    "life-of-pi",
    "the-god-of-small-things",
    "the-white-tiger",
    "shame",
    "the-inheritance-of-loss",
  ],
  "international-booker-winners": ["tomb-of-sand"],
  "nobel-prize-winners": [
    "gitanjali",
    "old-man-and-the-sea",
    "one-hundred-years-of-solitude",
    "beloved",
    "the-plague",
    "siddhartha",
    "the-stranger",
  ],
  "pulitzer-fiction-winners": [
    "old-man-and-the-sea",
    "beloved",
    "interpreter-of-maladies",
  ],
  "womens-prize-fiction-winners": ["the-song-of-achilles"],
  "jcb-prize-winners": ["the-far-field", "tomb-of-sand"],
  "sahitya-akademi-english": ["em-and-the-big-hoom"],
  "hugo-best-novel-winners": ["the-graveyard-book"],
  "carnegie-medal-writing-winners": [
    "the-graveyard-book",
    "salt-to-the-sea",
  ],
};

export function getPrizeCollectionBookSlugs(collectionSlug: string) {
  const seededSlugs = PRIZE_CATALOG_SEED_ROWS.filter((row) =>
    row[4].includes(collectionSlug)
  ).map((row) => row[0]);

  return Array.from(
    new Set([
      ...(EXISTING_PRIZE_COLLECTION_BOOK_SLUGS[collectionSlug] ?? []),
      ...seededSlugs,
    ])
  );
}

function mergePrizeRows(rows: PrizeCatalogSeedRow[]) {
  const merged = new Map<string, PrizeCatalogSeedRow>();

  for (const row of rows) {
    const existing = merged.get(row[0]);
    if (!existing) {
      merged.set(row[0], row);
      continue;
    }

    if (
      existing[1] !== row[1] ||
      existing[2].join("|") !== row[2].join("|")
    ) {
      throw new Error(`Conflicting prize metadata for ${row[0]}`);
    }

    merged.set(row[0], [
      existing[0],
      existing[1],
      existing[2],
      existing[3],
      Array.from(new Set([...existing[4].split("|"), row[4]])).join("|"),
    ]);
  }

  return Array.from(merged.values());
}
