import { scoreQueryAgainstBook } from "@/lib/book-matching";
import { PEACOCK_CLASSICS_SEED_ROWS } from "@/lib/peacock-classics";

export type StoreName = "amazon" | "flipkart" | "bookswagon";

const ENABLE_MANUAL_CATALOG_PRICES = false;

export type BookCategory =
  | "self-help"
  | "productivity"
  | "business"
  | "psychology"
  | "personal-finance"
  | "fiction";

export type CatalogPrice = {
  amountInr: number | null;
  label: string;
  lastUpdated: string | null;
};

export type CatalogStoreOffer = {
  store: StoreName;
  affiliateQuery: string;
  price: CatalogPrice;
  deliveryText: string | null;
  offerSummary: string | null;
};

export type CatalogBookRecord = {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  description: string;
  category: BookCategory;
  thumbnail: string | null;
  publisher: string | null;
  publishedDate: string | null;
  isbn13: string | null;
  isbn10: string | null;
  language: string;
  format: string;
  pages: number | null;
  tags: string[];
  featuredCollectionSlugs: string[];
  offers: CatalogStoreOffer[];
};

export type CatalogMatch = {
  book: CatalogBookRecord;
  score: number;
  confidence: "exact-isbn" | "exact-title-author" | "strong-title-author" | "related";
};

export type CategoryRecord = {
  slug: BookCategory;
  label: string;
  description: string;
};

export type CollectionRecord = {
  slug: string;
  label: string;
  description: string;
  bookSlugs: string[];
};

export type CatalogCollectionRecord = CollectionRecord & {
  books: CatalogBookRecord[];
};

export const CATEGORY_RECORDS: CategoryRecord[] = [
  {
    slug: "self-help",
    label: "Self Help",
    description: "Popular habit, motivation, and life-improvement reads.",
  },
  {
    slug: "productivity",
    label: "Productivity",
    description: "Books for focus, routines, and better work systems.",
  },
  {
    slug: "business",
    label: "Business",
    description: "Startup, strategy, and decision-making essentials.",
  },
  {
    slug: "psychology",
    label: "Psychology",
    description: "Behavior, thinking, and cognitive bias titles.",
  },
  {
    slug: "personal-finance",
    label: "Personal Finance",
    description: "Money habits, wealth thinking, and investing basics.",
  },
  {
    slug: "fiction",
    label: "Fiction",
    description: "Reader favorites that still benefit from price comparison.",
  },
];

const WORLD_CLASSICS_BOOK_SLUGS = [
  "pride-and-prejudice",
  "jane-eyre",
  "wuthering-heights",
  "frankenstein",
  "dracula",
  "the-picture-of-dorian-gray",
  "great-expectations",
  "a-tale-of-two-cities",
  "oliver-twist",
  "david-copperfield",
  "middlemarch",
  "silas-marner",
  "moby-dick",
  "the-scarlet-letter",
  "adventures-of-huckleberry-finn",
  "the-adventures-of-tom-sawyer",
  "uncle-tom-s-cabin",
  "little-women",
  "alice-s-adventures-in-wonderland-and-through-the-looking-glass",
  "treasure-island",
  "kim",
  "the-jungle-books",
  "crime-and-punishment",
  "the-brothers-karamazov",
  "notes-from-underground",
  "anna-karenina",
  "war-and-peace",
  "the-death-of-ivan-ilyich-and-other-stories",
  "madame-bovary",
  "les-miserables",
  "the-hunchback-of-notre-dame",
  "the-count-of-monte-cristo",
  "the-three-musketeers",
  "don-quixote",
  "the-odyssey",
  "the-iliad",
  "the-aeneid",
  "the-divine-comedy-inferno",
  "the-canterbury-tales",
  "the-decameron",
  "meditations",
  "the-republic",
  "tao-te-ching",
  "the-art-of-war",
  "nineteen-eighty-four",
  "animal-farm",
  "to-the-lighthouse",
  "mrs-dalloway",
  "ulysses",
  "dubliners",
  "a-portrait-of-the-artist-as-a-young-man",
  "the-metamorphosis-and-other-stories",
  "the-trial",
  "siddhartha",
  "the-stranger",
  "the-plague",
  "the-great-gatsby",
  "of-mice-and-men",
  "the-grapes-of-wrath",
  "lord-of-the-flies",
];

const INDIAN_AUTHORS_BOOK_SLUGS = [
  "the-god-of-small-things",
  "the-ministry-of-utmost-happiness",
  "midnights-children",
  "the-satanic-verses",
  "the-moor-s-last-sigh",
  "the-white-tiger",
  "last-man-in-tower",
  "a-suitable-boy",
  "the-golden-gate",
  "sea-of-poppies",
  "river-of-smoke",
  "flood-of-fire",
  "the-shadow-lines",
  "the-hungry-tide",
  "the-glass-palace",
  "train-to-pakistan",
  "delhi-a-novel",
  "malgudi-days",
  "swami-and-friends",
  "the-guide",
  "the-english-teacher",
  "untouchable",
  "coolie",
  "kanthapura",
  "the-serpent-and-the-rope",
  "the-great-indian-novel",
  "interpreter-of-maladies",
  "the-namesake",
  "the-inheritance-of-loss",
  "fasting-feasting",
  "clear-light-of-day",
  "in-custody",
  "the-palace-of-illusions",
  "the-forest-of-enchantments",
  "the-immortals-of-meluha",
  "the-secret-of-the-nagas",
  "the-oath-of-the-vayuputras",
  "five-point-someone",
  "2-states",
  "the-3-mistakes-of-my-life",
  "revolution-2020",
  "half-girlfriend",
  "the-blue-umbrella",
  "the-room-on-the-roof",
  "rusty-the-boy-from-the-hills",
  "wise-and-otherwise",
  "the-day-i-stopped-drinking-milk",
  "dollar-bahu",
  "the-twentieth-wife",
  "the-feast-of-roses",
  "those-pricey-thakur-girls",
  "serious-men",
  "the-illicit-happiness-of-other-people",
  "em-and-the-big-hoom",
  "the-lives-of-others",
  "narcopolis",
  "the-far-field",
  "tomb-of-sand",
  "the-legends-of-khasak",
  "goat-days",
];

const PEACOCK_CLASSICS_BOOK_SLUGS = PEACOCK_CLASSICS_SEED_ROWS.map(
  ([slug]) => slug
);

const BOOKER_PRIZE_WINNER_BOOK_SLUGS = [
  "midnights-children",
  "life-of-pi",
  "the-god-of-small-things",
  "the-white-tiger",
  "shame",
];

const NOBEL_PRIZE_WINNER_BOOK_SLUGS = [
  "gitanjali",
  "old-man-and-the-sea",
  "one-hundred-years-of-solitude",
  "beloved",
  "the-plague",
];

const PRIZE_WINNER_BOOK_SLUGS = [
  ...BOOKER_PRIZE_WINNER_BOOK_SLUGS,
  ...NOBEL_PRIZE_WINNER_BOOK_SLUGS,
];

const FIRST_READ_BOOK_SLUGS = [
  "and-then-there-were-none",
  "none-of-this-is-true",
  "gone-girl",
  "keep-your-friends-close",
  "one-step-too-far",
  "reckless-girls",
  "the-golden-couple",
  "run",
  "the-good-girl",
  "recursion",
  "dark-matter",
  "project-hail-mary",
  "ghost-station",
  "detour",
  "a-darker-shade-of-magic",
  "a-gathering-of-shadows",
  "a-conjuring-of-light",
  "a-winter-s-promise",
  "the-missing-of-clairdelune",
  "the-memory-of-babel",
  "the-storm-of-echoes",
  "the-house-in-the-cerulean-sea",
  "the-chronicles-of-narnia",
  "the-song-of-achilles",
  "salt-to-the-sea",
  "the-book-of-lost-names",
  "five-survive",
  "thirteen-reasons-why",
  "children-of-blood-and-bone",
  "the-escape-game",
  "taste",
  "becoming",
  "brain-on-fire",
  "bossypants",
  "shoe-dog",
];

export const COLLECTION_RECORDS: CollectionRecord[] = [
  {
    slug: "bestsellers",
    label: "Bestsellers This Week",
    description: "High-intent books people commonly compare before buying.",
    bookSlugs: [
      "atomic-habits",
      "psychology-of-money",
      "deep-work",
      "think-and-grow-rich",
      "subtle-art",
    ],
  },
  {
    slug: "career-growth",
    label: "Career Growth",
    description: "Focus, leadership, business, and skill-building picks.",
    bookSlugs: [
      "deep-work",
      "5am-club",
      "rich-dad-poor-dad",
      "thinking-fast-and-slow",
      "zero-to-one",
    ],
  },
  {
    slug: "reader-favorites",
    label: "Reader Favorites",
    description: "Books frequently saved, tracked, and revisited by buyers.",
    bookSlugs: [
      "atomic-habits",
      "power-of-habit",
      "psychology-of-money",
      "subtle-art",
      "ikigai",
    ],
  },
  {
    slug: "first-book-start-here",
    label: "First Book? Start Here",
    description: "Easy, gripping reads selected for readers building a reading habit.",
    bookSlugs: FIRST_READ_BOOK_SLUGS,
  },
  {
    slug: "world-classics",
    label: "World Classics",
    description: "Timeless novels and literary staples readers always come back to.",
    bookSlugs: WORLD_CLASSICS_BOOK_SLUGS,
  },
  {
    slug: "peacock-classics",
    label: "Peacock Classics",
    description:
      "Peacock Books paperback classics imported from publisher catalog data with verified ISBN-13 seeds.",
    bookSlugs: PEACOCK_CLASSICS_BOOK_SLUGS,
  },
  {
    slug: "prize-winners",
    label: "Prize Winners",
    description:
      "Award-winning books grouped by major literary prizes, with verified shelves opened as catalog quality improves.",
    bookSlugs: PRIZE_WINNER_BOOK_SLUGS,
  },
  {
    slug: "booker-prize-winners",
    label: "Booker Prize Winners",
    description: "Modern classics and award-winning fiction worth discovering.",
    bookSlugs: BOOKER_PRIZE_WINNER_BOOK_SLUGS,
  },
  {
    slug: "nobel-prize-winners",
    label: "Nobel Prize Winners",
    description: "Essential works by Nobel laureates from across the world.",
    bookSlugs: NOBEL_PRIZE_WINNER_BOOK_SLUGS,
  },
  {
    slug: "indian-authors",
    label: "Indian Authors",
    description: "Acclaimed Indian writing across fiction, poetry, and contemporary classics.",
    bookSlugs: INDIAN_AUTHORS_BOOK_SLUGS,
  },
];

const PRICE_PRESETS: Record<
  string,
  Partial<
    Record<
      StoreName,
      {
        amountInr: number;
        deliveryText: string;
        offerSummary: string | null;
      }
    >
  >
> = {
  "atomic-habits": {
    amazon: { amountInr: 476, deliveryText: "2-4 days", offerSummary: "Paperback deal" },
    flipkart: { amountInr: 449, deliveryText: "3-5 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 462, deliveryText: "4-6 days", offerSummary: "Reader favorite" },
  },
  "deep-work": {
    amazon: { amountInr: 389, deliveryText: "2-4 days", offerSummary: "Prime eligible" },
    flipkart: { amountInr: 372, deliveryText: "3-5 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 399, deliveryText: "4-6 days", offerSummary: null },
  },
  "psychology-of-money": {
    amazon: { amountInr: 319, deliveryText: "2-4 days", offerSummary: "Lightning deal" },
    flipkart: { amountInr: 334, deliveryText: "3-5 days", offerSummary: null },
    bookswagon: { amountInr: 311, deliveryText: "4-6 days", offerSummary: "Best price" },
  },
  "thinking-fast-and-slow": {
    amazon: { amountInr: 499, deliveryText: "2-4 days", offerSummary: null },
    flipkart: { amountInr: 474, deliveryText: "4-6 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 489, deliveryText: "5-7 days", offerSummary: null },
  },
  "power-of-habit": {
    amazon: { amountInr: 358, deliveryText: "2-4 days", offerSummary: "Reader pick" },
    flipkart: { amountInr: 341, deliveryText: "3-5 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 349, deliveryText: "4-6 days", offerSummary: null },
  },
  "subtle-art": {
    amazon: { amountInr: 284, deliveryText: "2-4 days", offerSummary: null },
    flipkart: { amountInr: 276, deliveryText: "3-5 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 289, deliveryText: "4-6 days", offerSummary: null },
  },
  "zero-to-one": {
    amazon: { amountInr: 329, deliveryText: "2-4 days", offerSummary: null },
    flipkart: { amountInr: 315, deliveryText: "3-5 days", offerSummary: "Startup pick" },
    bookswagon: { amountInr: 322, deliveryText: "4-6 days", offerSummary: "Best price" },
  },
  "rich-dad-poor-dad": {
    amazon: { amountInr: 369, deliveryText: "2-4 days", offerSummary: null },
    flipkart: { amountInr: 348, deliveryText: "3-5 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 356, deliveryText: "4-6 days", offerSummary: null },
  },
  "5am-club": {
    amazon: { amountInr: 294, deliveryText: "2-4 days", offerSummary: null },
    flipkart: { amountInr: 279, deliveryText: "3-5 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 286, deliveryText: "4-6 days", offerSummary: null },
  },
  ikigai: {
    amazon: { amountInr: 264, deliveryText: "2-4 days", offerSummary: null },
    flipkart: { amountInr: 249, deliveryText: "3-5 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 257, deliveryText: "4-6 days", offerSummary: null },
  },
  "think-and-grow-rich": {
    amazon: { amountInr: 299, deliveryText: "2-4 days", offerSummary: null },
    flipkart: { amountInr: 284, deliveryText: "3-5 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 289, deliveryText: "4-6 days", offerSummary: "Budget pick" },
  },
  "the-alchemist": {
    amazon: { amountInr: 248, deliveryText: "2-4 days", offerSummary: null },
    flipkart: { amountInr: 236, deliveryText: "3-5 days", offerSummary: "Best price" },
    bookswagon: { amountInr: 242, deliveryText: "4-6 days", offerSummary: null },
  },
};

const WORLD_CLASSICS_SEED_ROWS = [
  ["jane-eyre", "Jane Eyre", "Charlotte Bronte", "1847", "Penguin Classics", "2006-06-29", "9780141441146", "0141441143", 624, "High"],
  ["wuthering-heights", "Wuthering Heights", "Emily Bronte", "1847", "Penguin Classics", "2002-12-31", "9780141439556", "0141439556", 416, "High"],
  ["frankenstein", "Frankenstein", "Mary Shelley", "1818", "Penguin Classics", "2003-01-30", "9780141439471", "0141439475", 352, "High"],
  ["dracula", "Dracula", "Bram Stoker", "1897", "Penguin Classics", "2003", "9780141439846", "014143984X", 512, "Medium"],
  ["the-picture-of-dorian-gray", "The Picture of Dorian Gray", "Oscar Wilde", "1890", "Penguin Classics", "2003", "9780141439570", "0141439572", 256, "Medium"],
  ["great-expectations", "Great Expectations", "Charles Dickens", "1861", "Penguin Classics", "2003", "9780141439563", "0141439564", 544, "Medium"],
  ["a-tale-of-two-cities", "A Tale of Two Cities", "Charles Dickens", "1859", "Penguin Classics", "2003", "9780141439600", "0141439602", 544, "Medium"],
  ["oliver-twist", "Oliver Twist", "Charles Dickens", "1838", "Penguin Classics", "2003", "9780141439747", "0141439742", 608, "Medium"],
  ["david-copperfield", "David Copperfield", "Charles Dickens", "1850", "Penguin Classics", "2004", "9780140439441", "0140439447", 1024, "Medium"],
  ["middlemarch", "Middlemarch", "George Eliot", "1871", "Penguin Classics", "2003", "9780141439549", "0141439548", 904, "Medium"],
  ["silas-marner", "Silas Marner", "George Eliot", "1861", "Penguin Classics", "2003", "9780141439754", "0141439750", 240, "Medium"],
  ["moby-dick", "Moby-Dick", "Herman Melville", "1851", "Penguin Classics", "2003", "9780142437247", "0142437247", 720, "Medium"],
  ["the-scarlet-letter", "The Scarlet Letter", "Nathaniel Hawthorne", "1850", "Penguin Classics", "2003", "9780142437261", "0142437263", 272, "Medium"],
  ["adventures-of-huckleberry-finn", "Adventures of Huckleberry Finn", "Mark Twain", "1884", "Penguin Classics", "2002", "9780142437179", "0142437174", 368, "Medium"],
  ["the-adventures-of-tom-sawyer", "The Adventures of Tom Sawyer", "Mark Twain", "1876", "Penguin Classics", "2006", "9780143039563", "0143039563", 272, "Medium"],
  ["uncle-tom-s-cabin", "Uncle Tom's Cabin", "Harriet Beecher Stowe", "1852", "Penguin Classics", "1986", "9780140390032", "0140390030", 544, "Medium"],
  ["little-women", "Little Women", "Louisa May Alcott", "1868", "Penguin Classics", "2014", "9780147514011", "0147514010", 816, "Medium"],
  ["alice-s-adventures-in-wonderland-and-through-the-looking-glass", "Alice's Adventures in Wonderland and Through the Looking-Glass", "Lewis Carroll", "1865", "Penguin Classics", "2003", "9780141439761", "0141439769", 400, "Medium"],
  ["treasure-island", "Treasure Island", "Robert Louis Stevenson", "1883", "Penguin Classics", "1999", "9780140437683", "0140437681", 240, "Medium"],
  ["kim", "Kim", "Rudyard Kipling", "1901", "Penguin Classics", "2011", "9780141442372", "0141442379", 368, "Medium"],
  ["the-jungle-books", "The Jungle Books", "Rudyard Kipling", "1894", "Penguin Classics", "2006", "9780141441597", "0141441593", 448, "Medium"],
  ["crime-and-punishment", "Crime and Punishment", "Fyodor Dostoevsky", "1866", "Penguin Classics", "2002", "9780140449136", "0140449132", 576, "Medium"],
  ["the-brothers-karamazov", "The Brothers Karamazov", "Fyodor Dostoevsky", "1880", "Penguin Classics", "2003", "9780140449242", "0140449248", 1056, "Medium"],
  ["notes-from-underground", "Notes from Underground", "Fyodor Dostoevsky", "1864", "Penguin Classics", "1972", "9780140442526", "0140442529", 160, "Medium"],
  ["anna-karenina", "Anna Karenina", "Leo Tolstoy", "1878", "Penguin Classics", "2004", "9780143035008", "0143035002", 864, "Medium"],
  ["war-and-peace", "War and Peace", "Leo Tolstoy", "1869", "Vintage Classics", "2008", "9781400079988", "1400079985", 1296, "Medium"],
  ["the-death-of-ivan-ilyich-and-other-stories", "The Death of Ivan Ilyich and Other Stories", "Leo Tolstoy", "1886", "Penguin Classics", "2008", "9780140449617", "0140449612", 528, "Medium"],
  ["madame-bovary", "Madame Bovary", "Gustave Flaubert", "1857", "Penguin Classics", "2002", "9780140449129", "0140449124", 384, "Medium"],
  ["les-miserables", "Les Miserables", "Victor Hugo", "1862", "Penguin Classics", "1982", "9780140444308", "0140444300", 1232, "Medium"],
  ["the-hunchback-of-notre-dame", "The Hunchback of Notre-Dame", "Victor Hugo", "1831", "Penguin Classics", "1978", "9780140443530", "0140443533", 512, "Medium"],
  ["the-count-of-monte-cristo", "The Count of Monte Cristo", "Alexandre Dumas", "1844", "Penguin Classics", "2003", "9780140449266", "0140449264", 1276, "Medium"],
  ["the-three-musketeers", "The Three Musketeers", "Alexandre Dumas", "1844", "Penguin Classics", "1952", "9780140440256", "0140440251", 736, "Medium"],
  ["don-quixote", "Don Quixote", "Miguel de Cervantes", "1605", "Penguin Classics", "2003", "9780142437230", "0142437239", 1056, "Medium"],
  ["the-odyssey", "The Odyssey", "Homer", "-700", "Penguin Classics", "1997", "9780140268867", "0140268863", 560, "Medium"],
  ["the-iliad", "The Iliad", "Homer", "-750", "Penguin Classics", "1998", "9780140275360", "0140275363", 704, "Medium"],
  ["the-aeneid", "The Aeneid", "Virgil", "-19", "Penguin Classics", "2010", "9780143106296", "0143106293", 464, "Medium"],
  ["the-divine-comedy-inferno", "The Divine Comedy: Inferno", "Dante Alighieri", "1320", "Penguin Classics", "2002", "9780142437223", "0142437220", 432, "Medium"],
  ["the-canterbury-tales", "The Canterbury Tales", "Geoffrey Chaucer", "1400", "Penguin Classics", "2005", "9780140424386", "0140424385", 528, "Medium"],
  ["the-decameron", "The Decameron", "Giovanni Boccaccio", "1353", "Penguin Classics", "2003", "9780140449303", "0140449302", 1072, "Medium"],
  ["meditations", "Meditations", "Marcus Aurelius", "180", "Penguin Classics", "2006", "9780140449334", "0140449337", 304, "Medium"],
  ["the-republic", "The Republic", "Plato", "-375", "Penguin Classics", "2007", "9780140455113", "0140455116", 416, "Medium"],
  ["tao-te-ching", "Tao Te Ching", "Lao Tzu", "-400", "Penguin Classics", "1963", "9780140441314", "014044131X", 160, "Medium"],
  ["the-art-of-war", "The Art of War", "Sun Tzu", "-500", "Penguin Classics", "2009", "9780140455526", "0140455523", 112, "Medium"],
  ["animal-farm", "Animal Farm", "George Orwell", "1945", "Penguin Classics", "2008", "9780141036137", "0141036133", 112, "Medium"],
  ["to-the-lighthouse", "To the Lighthouse", "Virginia Woolf", "1927", "Penguin Classics", "2000", "9780141183411", "0141183411", 224, "Medium"],
  ["mrs-dalloway", "Mrs Dalloway", "Virginia Woolf", "1925", "Penguin Classics", "2000", "9780141182490", "0141182490", 224, "Medium"],
  ["ulysses", "Ulysses", "James Joyce", "1922", "Penguin Classics", "2000", "9780141182803", "0141182806", 1040, "Medium"],
  ["dubliners", "Dubliners", "James Joyce", "1914", "Penguin Classics", "2000", "9780141182452", "0141182458", 272, "Medium"],
  ["a-portrait-of-the-artist-as-a-young-man", "A Portrait of the Artist as a Young Man", "James Joyce", "1916", "Penguin Classics", "2000", "9780141182667", "0141182660", 288, "Medium"],
  ["the-metamorphosis-and-other-stories", "The Metamorphosis and Other Stories", "Franz Kafka", "1915", "Penguin Classics", "2007", "9780141188126", "0141188124", 320, "Medium"],
  ["the-trial", "The Trial", "Franz Kafka", "1925", "Schocken", "1999", "9780805209990", "0805209999", 304, "Medium"],
  ["siddhartha", "Siddhartha", "Hermann Hesse", "1922", "Penguin Classics", "1999", "9780141181233", "0141181237", 160, "Medium"],
  ["the-stranger", "The Stranger", "Albert Camus", "1942", "Vintage", "1989", "9780679720201", "0679720200", 123, "Medium"],
  ["the-great-gatsby", "The Great Gatsby", "F. Scott Fitzgerald", "1925", "Penguin Classics", "2000", "9780141182636", "0141182636", 192, "Medium"],
  ["of-mice-and-men", "Of Mice and Men", "John Steinbeck", "1937", "Penguin Classics", "2000", "9780141185101", "0141185100", 128, "Medium"],
  ["the-grapes-of-wrath", "The Grapes of Wrath", "John Steinbeck", "1939", "Penguin Classics", "2000", "9780141185064", "0141185062", 528, "Medium"],
  ["lord-of-the-flies", "Lord of the Flies", "William Golding", "1954", "Faber & Faber", "1958", "9780571056866", "0571056865", 256, "Medium"],
] as const;

const WORLD_CLASSICS_SEED_BOOKS: CatalogBookRecord[] = WORLD_CLASSICS_SEED_ROWS.map(
  ([
    slug,
    title,
    author,
    originalPublicationYear,
    publisher,
    publishedDate,
    isbn13,
    isbn10,
    pages,
    confidence,
  ]) =>
    buildWorldClassicSeedBook({
      slug,
      title,
      author,
      originalPublicationYear,
      publisher,
      publishedDate,
      isbn13,
      isbn10,
      pages,
      confidence,
    })
);

const INDIAN_AUTHORS_SEED_ROWS = [
  ["the-ministry-of-utmost-happiness", "The Ministry of Utmost Happiness", "Arundhati Roy", "Literary fiction", "2017", "Penguin", "2018", "9780241980767", "0241980763", 464, "Medium"],
  ["the-satanic-verses", "The Satanic Verses", "Salman Rushdie", "Literary fiction", "1988", "Vintage", "2013", "9780099578611", "0099578611", 560, "Medium"],
  ["the-moor-s-last-sigh", "The Moor's Last Sigh", "Salman Rushdie", "Literary fiction", "1995", "Vintage", "1996", "9780099592419", "009959241X", 448, "Medium"],
  ["last-man-in-tower", "Last Man in Tower", "Aravind Adiga", "Literary fiction", "2011", "Atlantic Books", "2012", "9781848875173", "1848875177", 432, "Medium"],
  ["the-golden-gate", "The Golden Gate", "Vikram Seth", "Novel in verse", "1986", "Faber & Faber", "2010", "9780571265893", "0571265898", 320, "Medium"],
  ["sea-of-poppies", "Sea of Poppies", "Amitav Ghosh", "Historical fiction", "2008", "John Murray", "2009", "9780719568978", "0719568978", 544, "Medium"],
  ["river-of-smoke", "River of Smoke", "Amitav Ghosh", "Historical fiction", "2011", "John Murray", "2012", "9780719568893", "0719568897", 560, "Medium"],
  ["flood-of-fire", "Flood of Fire", "Amitav Ghosh", "Historical fiction", "2015", "John Murray", "2016", "9780719569029", "0719569028", 624, "Medium"],
  ["the-shadow-lines", "The Shadow Lines", "Amitav Ghosh", "Literary fiction", "1988", "Penguin India", "2009", "9780143066569", "0143066560", 288, "Medium"],
  ["the-hungry-tide", "The Hungry Tide", "Amitav Ghosh", "Literary fiction", "2004", "HarperCollins", "2005", "9780007141784", "0007141785", 432, "Medium"],
  ["the-glass-palace", "The Glass Palace", "Amitav Ghosh", "Historical fiction", "2000", "HarperCollins", "2001", "9780006514091", "000651409X", 560, "Medium"],
  ["delhi-a-novel", "Delhi: A Novel", "Khushwant Singh", "Historical fiction", "1990", "Penguin India", "1990", "9780140126198", "0140126198", 391, "Medium"],
  ["malgudi-days", "Malgudi Days", "R. K. Narayan", "Short stories / classic", "1943", "Penguin Classics", "2006-08-29", "9780143039655", "0143039652", 288, "High"],
  ["swami-and-friends", "Swami and Friends", "R. K. Narayan", "Classic fiction", "1935", "Penguin Classics", "2000", "9780141186115", "0141186119", 208, "Medium"],
  ["the-guide", "The Guide", "R. K. Narayan", "Classic fiction", "1958", "Penguin Classics", "2006", "9780143039648", "0143039644", 224, "Medium"],
  ["the-english-teacher", "The English Teacher", "R. K. Narayan", "Classic fiction", "1945", "Vintage Classics", "2001", "9780099282280", "0099282283", 208, "Medium"],
  ["untouchable", "Untouchable", "Mulk Raj Anand", "Classic fiction", "1935", "Penguin Classics", "1990", "9780140183955", "0140183957", 160, "Medium"],
  ["coolie", "Coolie", "Mulk Raj Anand", "Classic fiction", "1936", "Penguin Classics", "1993", "9780140186802", "0140186808", 320, "Medium"],
  ["kanthapura", "Kanthapura", "Raja Rao", "Classic fiction", "1938", "Oxford University Press India", "2014", "9780199455256", "0199455252", 232, "Medium"],
  ["the-serpent-and-the-rope", "The Serpent and the Rope", "Raja Rao", "Classic fiction", "1960", "Penguin Classics", "2001", "9780141185088", "0141185082", 408, "Medium"],
  ["the-great-indian-novel", "The Great Indian Novel", "Shashi Tharoor", "Satire / literary fiction", "1989", "Penguin India", "1989", "9780140120493", "0140120491", 432, "Medium"],
  ["interpreter-of-maladies", "Interpreter of Maladies", "Jhumpa Lahiri", "Short stories", "1999", "HarperCollins", "2000", "9780006551799", "0006551793", 198, "Medium"],
  ["the-namesake", "The Namesake", "Jhumpa Lahiri", "Literary fiction", "2003", "HarperCollins", "2007", "9780007258918", "0007258917", 291, "Medium"],
  ["the-inheritance-of-loss", "The Inheritance of Loss", "Kiran Desai", "Literary fiction", "2006", "Penguin", "2007", "9780141027289", "0141027282", 336, "Medium"],
  ["fasting-feasting", "Fasting, Feasting", "Anita Desai", "Literary fiction", "1999", "Vintage", "2000", "9780099289616", "009928961X", 240, "Medium"],
  ["clear-light-of-day", "Clear Light of Day", "Anita Desai", "Literary fiction", "1980", "Vintage", "2001", "9780099275749", "0099275740", 192, "Medium"],
  ["in-custody", "In Custody", "Anita Desai", "Literary fiction", "1984", "Vintage", "2001", "9780099428497", "0099428490", 240, "Medium"],
  ["the-palace-of-illusions", "The Palace of Illusions", "Chitra Banerjee Divakaruni", "Mythological fiction", "2008", "Picador", "2009", "9780330458535", "0330458531", 384, "Medium"],
  ["the-forest-of-enchantments", "The Forest of Enchantments", "Chitra Banerjee Divakaruni", "Mythological fiction", "2019", "HarperCollins India", "2019", "9789353025984", "9353025982", 372, "Medium"],
  ["the-immortals-of-meluha", "The Immortals of Meluha", "Amish Tripathi", "Mythological fiction / fantasy", "2010", "Westland", "2010", "9789380658742", "9380658745", 411, "High"],
  ["the-secret-of-the-nagas", "The Secret of the Nagas", "Amish Tripathi", "Mythological fiction / fantasy", "2011", "Westland", "2011", "9789381626344", "9381626340", 396, "Medium"],
  ["the-oath-of-the-vayuputras", "The Oath of the Vayuputras", "Amish Tripathi", "Mythological fiction / fantasy", "2013", "Westland", "2013", "9789382618348", "9382618341", 575, "Medium"],
  ["five-point-someone", "Five Point Someone", "Chetan Bhagat", "Commercial fiction", "2004", "Rupa Publications", "2014", "9788129135490", "8129135493", 270, "Medium"],
  ["2-states", "2 States", "Chetan Bhagat", "Commercial fiction / romance", "2009", "Rupa Publications", "2014", "9788129135520", "8129135523", 269, "Medium"],
  ["the-3-mistakes-of-my-life", "The 3 Mistakes of My Life", "Chetan Bhagat", "Commercial fiction", "2008", "Rupa Publications", "2008", "9788129113726", "8129113724", 258, "Medium"],
  ["revolution-2020", "Revolution 2020", "Chetan Bhagat", "Commercial fiction", "2011", "Rupa Publications", "2011", "9788129118806", "8129118807", 296, "Medium"],
  ["half-girlfriend", "Half Girlfriend", "Chetan Bhagat", "Commercial fiction / romance", "2014", "Rupa Publications", "2014", "9788129135728", "8129135728", 280, "Medium"],
  ["the-blue-umbrella", "The Blue Umbrella", "Ruskin Bond", "Children / novella", "1980", "Rupa Publications", "2011", "9788129119773", "8129119773", 96, "Medium"],
  ["the-room-on-the-roof", "The Room on the Roof", "Ruskin Bond", "Young adult / classic", "1956", "Puffin India", "2014", "9780143333388", "0143333380", 240, "Medium"],
  ["rusty-the-boy-from-the-hills", "Rusty, the Boy from the Hills", "Ruskin Bond", "Young adult / stories", "2003", "Puffin India", "2016", "9780143335474", "0143335472", 232, "Medium"],
  ["wise-and-otherwise", "Wise and Otherwise", "Sudha Murty", "Inspirational stories / nonfiction", "2002", "Penguin India", "2006", "9780143062226", "0143062220", 232, "Medium"],
  ["the-day-i-stopped-drinking-milk", "The Day I Stopped Drinking Milk", "Sudha Murty", "Inspirational stories / nonfiction", "2012", "Penguin India", "2012", "9780143418658", "0143418653", 224, "Medium"],
  ["dollar-bahu", "Dollar Bahu", "Sudha Murty", "Fiction", "2007", "Penguin India", "2007", "9780143103769", "0143103768", 142, "Medium"],
  ["the-twentieth-wife", "The Twentieth Wife", "Indu Sundaresan", "Historical fiction", "2002", "Washington Square Press", "2003", null, null, 384, "Medium"],
  ["the-feast-of-roses", "The Feast of Roses", "Indu Sundaresan", "Historical fiction", "2003", "Washington Square Press", "2004", null, null, 432, "Medium"],
  ["those-pricey-thakur-girls", "Those Pricey Thakur Girls", "Anuja Chauhan", "Commercial fiction / romance", "2013", "HarperCollins India", "2013", "9789350293294", "9350293293", 390, "Medium"],
  ["serious-men", "Serious Men", "Manu Joseph", "Literary fiction / satire", "2010", "Faber & Faber", "2011", "9780571233199", "0571233198", 320, "Medium"],
  ["the-illicit-happiness-of-other-people", "The Illicit Happiness of Other People", "Manu Joseph", "Literary fiction / satire", "2012", "Picador", "2013", "9781447205579", "144720557X", 310, "Medium"],
  ["em-and-the-big-hoom", "Em and the Big Hoom", "Jerry Pinto", "Literary fiction", "2012", "Aleph Book Company", "2012", "9789382277200", "938227720X", 248, "Medium"],
  ["the-lives-of-others", "The Lives of Others", "Neel Mukherjee", "Literary fiction", "2014", "Vintage", "2015", "9780099554486", "0099554488", 528, "Medium"],
  ["narcopolis", "Narcopolis", "Jeet Thayil", "Literary fiction", "2012", "Faber & Faber", "2013", "9780571286638", "0571286631", 304, "Medium"],
  ["the-far-field", "The Far Field", "Madhuri Vijay", "Literary fiction", "2019", "Grove Press", "2020", "9780802147233", "0802147232", 448, "Medium"],
  ["tomb-of-sand", "Tomb of Sand", "Geetanjali Shree; translated by Daisy Rockwell", "Translated literary fiction", "2018", "Penguin India", "2021", "9780143450832", "0143450832", 740, "Medium"],
  ["the-legends-of-khasak", "The Legends of Khasak", "O. V. Vijayan; translated by the author", "Translated literary fiction", "1969", "Penguin India", "2008", "9780143065685", "0143065688", 216, "Medium"],
  ["goat-days", "Goat Days", "Benyamin; translated by Joseph Koyippally", "Translated literary fiction", "2008", "Penguin India", "2012", "9780143416333", "0143416332", 254, "Medium"],
] as const;

const INDIAN_AUTHORS_SEED_BOOKS: CatalogBookRecord[] = INDIAN_AUTHORS_SEED_ROWS.map(
  ([
    slug,
    title,
    author,
    subCategory,
    originalPublicationYear,
    publisher,
    publishedDate,
    isbn13,
    isbn10,
    pages,
    confidence,
  ]) =>
    buildIndianAuthorSeedBook({
      slug,
      title,
      author,
      subCategory,
      originalPublicationYear,
      publisher,
      publishedDate,
      isbn13,
      isbn10,
      pages,
      confidence,
    })
);

const PEACOCK_CLASSICS_SEED_BOOKS: CatalogBookRecord[] =
  PEACOCK_CLASSICS_SEED_ROWS.map(
    ([slug, title, author, publishedDate, isbn13, pages, sourcePage]) =>
      buildPeacockClassicSeedBook({
        slug,
        title,
        author,
        publishedDate,
        isbn13,
        pages,
        sourcePage,
      })
  );

const FIRST_READ_SEED_ROWS = [
  {
    slug: "and-then-there-were-none",
    title: "And Then There Were None",
    authors: ["Agatha Christie"],
    isbn13: "9780008123208",
    shelfGenre: "Mysteries & Thrillers",
    publisher: "HarperCollins",
  },
  {
    slug: "none-of-this-is-true",
    title: "None of This Is True",
    authors: ["Lisa Jewell"],
    isbn13: "9781804940204",
    shelfGenre: "Mysteries & Thrillers",
    publisher: "Penguin",
  },
  {
    slug: "gone-girl",
    title: "Gone Girl",
    authors: ["Gillian Flynn"],
    isbn13: "9780385347778",
    shelfGenre: "Mysteries & Thrillers",
    publisher: "Orion Publishing",
  },
  {
    slug: "keep-your-friends-close",
    title: "Keep Your Friends Close",
    authors: ["Lucinda Berry"],
    isbn13: "9781662512605",
    shelfGenre: "Mysteries & Thrillers",
    publisher: "Penguin",
  },
  {
    slug: "one-step-too-far",
    title: "One Step Too Far",
    authors: ["Lisa Gardner"],
    isbn13: "9781529157895",
    shelfGenre: "Mysteries & Thrillers",
    publisher: "HarperCollins",
  },
  {
    slug: "reckless-girls",
    title: "Reckless Girls",
    authors: ["Rachel Hawkins"],
    isbn13: "9780008495589",
    shelfGenre: "Mysteries & Thrillers",
    publisher: "Pan",
  },
  {
    slug: "the-golden-couple",
    title: "The Golden Couple",
    authors: ["Greer Hendricks", "Sarah Pekkanen"],
    isbn13: "9781529056105",
    shelfGenre: "Mysteries & Thrillers",
    publisher: "HarperCollins",
  },
  {
    slug: "run",
    title: "Run",
    authors: ["Blake Crouch"],
    isbn13: "9781035044665",
    shelfGenre: "Mysteries & Thrillers",
    publisher: "Macmillan",
  },
  {
    slug: "the-good-girl",
    title: "The Good Girl",
    authors: ["Mary Kubica"],
    isbn13: "9780778317760",
    shelfGenre: "Mysteries & Thrillers",
    publisher: "Mira Books",
  },
  {
    slug: "recursion",
    title: "Recursion",
    authors: ["Blake Crouch"],
    isbn13: "9781509866670",
    shelfGenre: "Sci-Fi",
    publisher: "Pan Macmillan UK",
  },
  {
    slug: "dark-matter",
    title: "Dark Matter",
    authors: ["Blake Crouch"],
    isbn13: "9781035034659",
    shelfGenre: "Sci-Fi",
    publisher: "Pan",
  },
  {
    slug: "project-hail-mary",
    title: "Project Hail Mary",
    authors: ["Andy Weir"],
    isbn13: "9781529157468",
    shelfGenre: "Sci-Fi",
    publisher: "Penguin",
  },
  {
    slug: "ghost-station",
    title: "Ghost Station",
    authors: ["S. A. Barnes"],
    isbn13: "9781250884947",
    shelfGenre: "Sci-Fi",
    publisher: "Tor Nightfire",
  },
  {
    slug: "detour",
    title: "Detour",
    authors: ["Jeff Rake", "Rob Hart"],
    isbn13: null,
    shelfGenre: "Sci-Fi",
    publisher: null,
  },
  {
    slug: "a-darker-shade-of-magic",
    title: "A Darker Shade of Magic",
    authors: ["V. E. Schwab"],
    isbn13: "9781783295401",
    shelfGenre: "Fantasy",
    publisher: "Titan Books",
  },
  {
    slug: "a-gathering-of-shadows",
    title: "A Gathering of Shadows",
    authors: ["V. E. Schwab"],
    isbn13: "9781783295425",
    shelfGenre: "Fantasy",
    publisher: "Titan Books",
  },
  {
    slug: "a-conjuring-of-light",
    title: "A Conjuring of Light",
    authors: ["V. E. Schwab"],
    isbn13: "9781785652448",
    shelfGenre: "Fantasy",
    publisher: "Titan Books",
  },
  {
    slug: "a-winter-s-promise",
    title: "A Winter's Promise",
    authors: ["Christelle Dabos"],
    isbn13: "9781787701809",
    shelfGenre: "Fantasy",
    publisher: "Europa Editions",
  },
  {
    slug: "the-missing-of-clairdelune",
    title: "The Missing of Clairdelune",
    authors: ["Christelle Dabos"],
    isbn13: "9781787702257",
    shelfGenre: "Fantasy",
    publisher: "Europa Editions",
  },
  {
    slug: "the-memory-of-babel",
    title: "The Memory of Babel",
    authors: ["Christelle Dabos"],
    isbn13: "9781787703087",
    shelfGenre: "Fantasy",
    publisher: "Europa Editions",
  },
  {
    slug: "the-storm-of-echoes",
    title: "The Storm of Echoes",
    authors: ["Christelle Dabos"],
    isbn13: "9781787704237",
    shelfGenre: "Fantasy",
    publisher: "Europa Editions",
  },
  {
    slug: "the-house-in-the-cerulean-sea",
    title: "The House in the Cerulean Sea",
    authors: ["T. J. Klune"],
    isbn13: "9781529087949",
    shelfGenre: "Fantasy",
    publisher: "Tor",
  },
  {
    slug: "the-chronicles-of-narnia",
    title: "The Chronicles of Narnia",
    authors: ["C. S. Lewis"],
    isbn13: null,
    shelfGenre: "Fantasy",
    publisher: null,
  },
  {
    slug: "the-song-of-achilles",
    title: "The Song of Achilles",
    authors: ["Madeline Miller"],
    isbn13: null,
    shelfGenre: "Historical Fiction",
    publisher: null,
  },
  {
    slug: "salt-to-the-sea",
    title: "Salt to the Sea",
    authors: ["Ruta Sepetys"],
    isbn13: null,
    shelfGenre: "Historical Fiction",
    publisher: null,
  },
  {
    slug: "the-book-of-lost-names",
    title: "The Book of Lost Names",
    authors: ["Kristin Harmel"],
    isbn13: null,
    shelfGenre: "Historical Fiction",
    publisher: null,
  },
  {
    slug: "five-survive",
    title: "Five Survive",
    authors: ["Holly Jackson"],
    isbn13: null,
    shelfGenre: "Young Adult",
    publisher: null,
  },
  {
    slug: "thirteen-reasons-why",
    title: "Thirteen Reasons Why",
    authors: ["Jay Asher"],
    isbn13: null,
    shelfGenre: "Young Adult",
    publisher: null,
  },
  {
    slug: "children-of-blood-and-bone",
    title: "Children of Blood and Bone",
    authors: ["Tomi Adeyemi"],
    isbn13: null,
    shelfGenre: "Young Adult",
    publisher: null,
  },
  {
    slug: "the-escape-game",
    title: "The Escape Game",
    authors: ["Marissa Meyer"],
    isbn13: null,
    shelfGenre: "Young Adult",
    publisher: null,
  },
  {
    slug: "taste",
    title: "Taste",
    authors: ["Stanley Tucci"],
    isbn13: null,
    shelfGenre: "Memoir",
    publisher: null,
  },
  {
    slug: "becoming",
    title: "Becoming",
    authors: ["Michelle Obama"],
    isbn13: null,
    shelfGenre: "Memoir",
    publisher: null,
  },
  {
    slug: "brain-on-fire",
    title: "Brain on Fire",
    authors: ["Susannah Cahalan"],
    isbn13: null,
    shelfGenre: "Memoir",
    publisher: null,
  },
  {
    slug: "bossypants",
    title: "Bossypants",
    authors: ["Tina Fey"],
    isbn13: null,
    shelfGenre: "Memoir",
    publisher: null,
  },
  {
    slug: "shoe-dog",
    title: "Shoe Dog",
    authors: ["Phil Knight"],
    isbn13: null,
    shelfGenre: "Memoir",
    publisher: null,
  },
] satisfies Array<{
  slug: string;
  title: string;
  authors: string[];
  isbn13: string | null;
  shelfGenre: string;
  publisher: string | null;
}>;

const FIRST_READ_SEED_BOOKS: CatalogBookRecord[] = FIRST_READ_SEED_ROWS.map(
  buildFirstReadSeedBook
);

export const CATALOG_BOOKS: CatalogBookRecord[] = [
  {
    id: "catalog-atomic-habits",
    slug: "atomic-habits",
    title: "Atomic Habits",
    authors: ["James Clear"],
    description:
      "A practical playbook for building good habits and breaking bad ones with small repeated actions.",
    category: "self-help",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781847941831-L.jpg",
    publisher: "Penguin Random House India",
    publishedDate: "2018",
    isbn13: "9781847941831",
    isbn10: "1847941834",
    language: "English",
    format: "Paperback",
    pages: 320,
    tags: ["habits", "self improvement", "productivity"],
    featuredCollectionSlugs: ["bestsellers", "reader-favorites"],
    offers: buildCatalogOffers("atomic-habits", "Atomic Habits", ["James Clear"]),
  },
  {
    id: "catalog-deep-work",
    slug: "deep-work",
    title: "Deep Work",
    authors: ["Cal Newport"],
    description:
      "A guide to focused work and attention management in a distracted world.",
    category: "productivity",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
    publisher: "Grand Central Publishing",
    publishedDate: "2016",
    isbn13: "9781455586691",
    isbn10: "1455586692",
    language: "English",
    format: "Paperback",
    pages: 304,
    tags: ["focus", "work", "attention"],
    featuredCollectionSlugs: ["career-growth", "reader-favorites"],
    offers: buildCatalogOffers("deep-work", "Deep Work", ["Cal Newport"]),
  },
  {
    id: "catalog-psychology-of-money",
    slug: "psychology-of-money",
    title: "The Psychology of Money",
    authors: ["Morgan Housel"],
    description:
      "Short essays on behavior, wealth, patience, and the psychology behind financial decisions.",
    category: "personal-finance",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
    publisher: "Harriman House",
    publishedDate: "2020",
    isbn13: "9780857197689",
    isbn10: "0857197681",
    language: "English",
    format: "Paperback",
    pages: 256,
    tags: ["money", "finance", "behavior"],
    featuredCollectionSlugs: ["bestsellers", "reader-favorites"],
    offers: buildCatalogOffers("psychology-of-money", "The Psychology of Money", ["Morgan Housel"]),
  },
  {
    id: "catalog-thinking-fast-and-slow",
    slug: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    authors: ["Daniel Kahneman"],
    description:
      "A landmark book on decision-making, bias, and the two systems of thought.",
    category: "psychology",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141033570-L.jpg",
    publisher: "Penguin Books",
    publishedDate: "2012",
    isbn13: "9780141033570",
    isbn10: "0141033576",
    language: "English",
    format: "Paperback",
    pages: 512,
    tags: ["decision making", "bias", "psychology"],
    featuredCollectionSlugs: ["career-growth"],
    offers: buildCatalogOffers("thinking-fast-and-slow", "Thinking, Fast and Slow", ["Daniel Kahneman"]),
  },
  {
    id: "catalog-power-of-habit",
    slug: "power-of-habit",
    title: "The Power of Habit",
    authors: ["Charles Duhigg"],
    description:
      "How habits work in daily life, organizations, and social systems.",
    category: "self-help",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780812981605-L.jpg",
    publisher: "Random House Trade Paperbacks",
    publishedDate: "2014",
    isbn13: "9780812981605",
    isbn10: "081298160X",
    language: "English",
    format: "Paperback",
    pages: 400,
    tags: ["habits", "behavior", "change"],
    featuredCollectionSlugs: ["reader-favorites"],
    offers: buildCatalogOffers("power-of-habit", "The Power of Habit", ["Charles Duhigg"]),
  },
  {
    id: "catalog-subtle-art",
    slug: "subtle-art",
    title: "The Subtle Art of Not Giving a F*ck",
    authors: ["Mark Manson"],
    description:
      "A direct, modern self-help book on choosing what actually matters.",
    category: "self-help",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg",
    publisher: "HarperOne",
    publishedDate: "2017",
    isbn13: "9780062457714",
    isbn10: "0062457713",
    language: "English",
    format: "Paperback",
    pages: 224,
    tags: ["mindset", "life advice", "self help"],
    featuredCollectionSlugs: ["bestsellers", "reader-favorites"],
    offers: buildCatalogOffers("subtle-art", "The Subtle Art of Not Giving a F*ck", ["Mark Manson"]),
  },
  {
    id: "catalog-zero-to-one",
    slug: "zero-to-one",
    title: "Zero to One",
    authors: ["Peter Thiel", "Blake Masters"],
    description:
      "Startup thinking about building unique businesses rather than copying the market.",
    category: "business",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780753555194-L.jpg",
    publisher: "Virgin Books",
    publishedDate: "2015",
    isbn13: "9780753555194",
    isbn10: "0753555190",
    language: "English",
    format: "Paperback",
    pages: 224,
    tags: ["startups", "business", "innovation"],
    featuredCollectionSlugs: ["career-growth"],
    offers: buildCatalogOffers("zero-to-one", "Zero to One", ["Peter Thiel", "Blake Masters"]),
  },
  {
    id: "catalog-rich-dad-poor-dad",
    slug: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    authors: ["Robert T. Kiyosaki"],
    description:
      "A long-running personal finance title on assets, income, and financial mindset.",
    category: "personal-finance",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781612681139-L.jpg",
    publisher: "Plata Publishing",
    publishedDate: "2017",
    isbn13: "9781612681139",
    isbn10: "1612681131",
    language: "English",
    format: "Paperback",
    pages: 336,
    tags: ["money", "wealth", "personal finance"],
    featuredCollectionSlugs: ["career-growth"],
    offers: buildCatalogOffers("rich-dad-poor-dad", "Rich Dad Poor Dad", ["Robert T. Kiyosaki"]),
  },
  {
    id: "catalog-5am-club",
    slug: "5am-club",
    title: "The 5 AM Club",
    authors: ["Robin Sharma"],
    description:
      "A structured routine book about mornings, productivity, and long-term discipline.",
    category: "productivity",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781443456623-L.jpg",
    publisher: "HarperCollins",
    publishedDate: "2018",
    isbn13: "9781443456623",
    isbn10: "1443456624",
    language: "English",
    format: "Paperback",
    pages: 336,
    tags: ["morning routine", "discipline", "productivity"],
    featuredCollectionSlugs: ["career-growth"],
    offers: buildCatalogOffers("5am-club", "The 5 AM Club", ["Robin Sharma"]),
  },
  {
    id: "catalog-ikigai",
    slug: "ikigai",
    title: "Ikigai",
    authors: ["Hector Garcia", "Francesc Miralles"],
    description:
      "A gentle guide to purpose, longevity, and living with intention.",
    category: "self-help",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781786330895-L.jpg",
    publisher: "Hutchinson",
    publishedDate: "2017",
    isbn13: "9781786330895",
    isbn10: "178633089X",
    language: "English",
    format: "Paperback",
    pages: 208,
    tags: ["purpose", "wellbeing", "lifestyle"],
    featuredCollectionSlugs: ["reader-favorites"],
    offers: buildCatalogOffers("ikigai", "Ikigai", ["Hector Garcia", "Francesc Miralles"]),
  },
  {
    id: "catalog-think-and-grow-rich",
    slug: "think-and-grow-rich",
    title: "Think and Grow Rich",
    authors: ["Napoleon Hill"],
    description:
      "A classic on ambition, persistence, and mindset for wealth-building.",
    category: "personal-finance",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg",
    publisher: "TarcherPerigee",
    publishedDate: "2005",
    isbn13: "9781585424337",
    isbn10: "1585424331",
    language: "English",
    format: "Paperback",
    pages: 320,
    tags: ["wealth", "mindset", "classic"],
    featuredCollectionSlugs: ["bestsellers"],
    offers: buildCatalogOffers("think-and-grow-rich", "Think and Grow Rich", ["Napoleon Hill"]),
  },
  {
    id: "catalog-alchemist",
    slug: "the-alchemist",
    title: "The Alchemist",
    authors: ["Paulo Coelho"],
    description:
      "A fiction favorite many readers browse across stores before purchasing.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9788172234980-L.jpg",
    publisher: "HarperCollins India",
    publishedDate: "2015",
    isbn13: "9788172234980",
    isbn10: "8172234988",
    language: "English",
    format: "Paperback",
    pages: 208,
    tags: ["fiction", "classic", "inspiration"],
    featuredCollectionSlugs: [],
    offers: buildCatalogOffers("the-alchemist", "The Alchemist", ["Paulo Coelho"]),
  },
  {
    id: "catalog-pride-and-prejudice",
    slug: "pride-and-prejudice",
    title: "Pride and Prejudice",
    authors: ["Jane Austen"],
    description:
      "A beloved classic of wit, romance, and social observation that still draws new readers.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    publisher: "Penguin Classics",
    publishedDate: "1813",
    isbn13: "9780141439518",
    isbn10: "0141439513",
    language: "English",
    format: "Paperback",
    pages: 448,
    tags: ["classic", "romance", "literature"],
    featuredCollectionSlugs: ["world-classics"],
    offers: buildCatalogOffers("pride-and-prejudice", "Pride and Prejudice", ["Jane Austen"]),
  },
  {
    id: "catalog-nineteen-eighty-four",
    slug: "nineteen-eighty-four",
    title: "1984",
    authors: ["George Orwell"],
    description:
      "A defining dystopian novel about surveillance, truth, and power.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141036144-L.jpg",
    publisher: "Penguin Classics",
    publishedDate: "2008",
    isbn13: "9780141036144",
    isbn10: "0141036141",
    language: "English",
    format: "Paperback",
    pages: 336,
    tags: ["classic", "dystopia", "fiction"],
    featuredCollectionSlugs: ["world-classics"],
    offers: buildCatalogOffers("nineteen-eighty-four", "1984", ["George Orwell"]),
  },
  {
    id: "catalog-old-man-and-the-sea",
    slug: "old-man-and-the-sea",
    title: "The Old Man and the Sea",
    authors: ["Ernest Hemingway"],
    description:
      "A slim, powerful classic about endurance, pride, and the dignity of struggle.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780099908401-L.jpg",
    publisher: "Arrow Books",
    publishedDate: "1952",
    isbn13: "9780099908401",
    isbn10: "0099908409",
    language: "English",
    format: "Paperback",
    pages: 128,
    tags: ["classic", "nobel", "literature"],
    featuredCollectionSlugs: ["world-classics", "nobel-prize-winners"],
    offers: buildCatalogOffers("old-man-and-the-sea", "The Old Man and the Sea", ["Ernest Hemingway"]),
  },
  {
    id: "catalog-one-hundred-years-of-solitude",
    slug: "one-hundred-years-of-solitude",
    title: "One Hundred Years of Solitude",
    authors: ["Gabriel Garcia Marquez"],
    description:
      "A landmark of world literature blending family saga, myth, and magical realism.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780241968581-L.jpg",
    publisher: "Penguin Classics",
    publishedDate: "1967",
    isbn13: "9780241968581",
    isbn10: "0241968585",
    language: "English",
    format: "Paperback",
    pages: 432,
    tags: ["classic", "nobel", "magical realism"],
    featuredCollectionSlugs: ["world-classics", "nobel-prize-winners"],
    offers: buildCatalogOffers("one-hundred-years-of-solitude", "One Hundred Years of Solitude", ["Gabriel Garcia Marquez"]),
  },
  {
    id: "catalog-midnights-children",
    slug: "midnights-children",
    title: "Midnight's Children",
    authors: ["Salman Rushdie"],
    description:
      "A Booker Prize-winning modern classic that reimagines India's birth through one extraordinary life.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780099578512-L.jpg",
    publisher: "Vintage",
    publishedDate: "2013",
    isbn13: "9780099578512",
    isbn10: "0099578514",
    language: "English",
    format: "Paperback",
    pages: 672,
    tags: ["booker", "indian author", "literary fiction"],
    featuredCollectionSlugs: ["booker-prize-winners", "indian-authors"],
    offers: buildCatalogOffers("midnights-children", "Midnight's Children", ["Salman Rushdie"]),
  },
  {
    id: "catalog-life-of-pi",
    slug: "life-of-pi",
    title: "Life of Pi",
    authors: ["Yann Martel"],
    description:
      "An imaginative Booker Prize-winning novel of survival, storytelling, and wonder.",
    category: "fiction",
    thumbnail: null,
    publisher: "Canongate Books",
    publishedDate: "2001",
    isbn13: "9781786891686",
    isbn10: "1786891689",
    language: "English",
    format: "Paperback",
    pages: 336,
    tags: ["booker", "adventure", "fiction"],
    featuredCollectionSlugs: ["booker-prize-winners"],
    offers: buildCatalogOffers("life-of-pi", "Life of Pi", ["Yann Martel"]),
  },
  {
    id: "catalog-god-of-small-things",
    slug: "the-god-of-small-things",
    title: "The God of Small Things",
    authors: ["Arundhati Roy"],
    description:
      "A Booker Prize-winning Indian novel rich with memory, politics, and family history.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780006550686-L.jpg",
    publisher: "HarperCollins",
    publishedDate: "1998-10-14",
    isbn13: "9780006550686",
    isbn10: "0006550681",
    language: "English",
    format: "Paperback",
    pages: 368,
    tags: ["booker", "indian author", "literary fiction"],
    featuredCollectionSlugs: ["booker-prize-winners", "indian-authors"],
    offers: buildCatalogOffers("the-god-of-small-things", "The God of Small Things", ["Arundhati Roy"]),
  },
  {
    id: "catalog-white-tiger",
    slug: "the-white-tiger",
    title: "The White Tiger",
    authors: ["Aravind Adiga"],
    description:
      "A sharp Booker Prize-winning portrait of class, ambition, and modern India.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781416562603-L.jpg",
    publisher: "Free Press / Simon & Schuster",
    publishedDate: "2008-10-14",
    isbn13: "9781416562603",
    isbn10: "1416562605",
    language: "English",
    format: "Paperback",
    pages: 304,
    tags: ["booker", "indian author", "contemporary fiction"],
    featuredCollectionSlugs: ["booker-prize-winners", "indian-authors"],
    offers: buildCatalogOffers("the-white-tiger", "The White Tiger", ["Aravind Adiga"]),
  },
  {
    id: "catalog-shame",
    slug: "shame",
    title: "Shame",
    authors: ["J. M. Coetzee"],
    description:
      "A powerful contemporary novel by one of the most celebrated voices in world literature.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780099289524-L.jpg",
    publisher: "Vintage",
    publishedDate: "1999",
    isbn13: "9780099289524",
    isbn10: "0099289520",
    language: "English",
    format: "Paperback",
    pages: 272,
    tags: ["booker", "literary fiction", "award winner"],
    featuredCollectionSlugs: ["booker-prize-winners"],
    offers: buildCatalogOffers("shame", "Shame", ["J. M. Coetzee"]),
  },
  {
    id: "catalog-gitanjali",
    slug: "gitanjali",
    title: "Gitanjali",
    authors: ["Rabindranath Tagore"],
    description:
      "The Nobel Prize-winning collection that remains central to Indian literary history.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9788171676118-L.jpg",
    publisher: "Rupa Publications",
    publishedDate: "1910",
    isbn13: "9788171676118",
    isbn10: "8171676111",
    language: "English",
    format: "Paperback",
    pages: 160,
    tags: ["nobel", "indian author", "poetry"],
    featuredCollectionSlugs: ["nobel-prize-winners", "indian-authors"],
    offers: buildCatalogOffers("gitanjali", "Gitanjali", ["Rabindranath Tagore"]),
  },
  {
    id: "catalog-beloved",
    slug: "beloved",
    title: "Beloved",
    authors: ["Toni Morrison"],
    description:
      "A Nobel laureate's masterpiece exploring memory, trauma, and freedom.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg",
    publisher: "Vintage",
    publishedDate: "1987",
    isbn13: "9781400033416",
    isbn10: "1400033411",
    language: "English",
    format: "Paperback",
    pages: 352,
    tags: ["nobel", "classic", "literary fiction"],
    featuredCollectionSlugs: ["nobel-prize-winners"],
    offers: buildCatalogOffers("beloved", "Beloved", ["Toni Morrison"]),
  },
  {
    id: "catalog-the-plague",
    slug: "the-plague",
    title: "The Plague",
    authors: ["Albert Camus"],
    description:
      "A philosophical modern classic by a Nobel laureate, still urgently relevant.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141185132-L.jpg",
    publisher: "Penguin Modern Classics",
    publishedDate: "2001",
    isbn13: "9780141185132",
    isbn10: "0141185139",
    language: "English",
    format: "Paperback",
    pages: 320,
    tags: ["nobel", "classic", "philosophical fiction"],
    featuredCollectionSlugs: ["world-classics", "nobel-prize-winners"],
    offers: buildCatalogOffers("the-plague", "The Plague", ["Albert Camus"]),
  },
  ...WORLD_CLASSICS_SEED_BOOKS,
  ...PEACOCK_CLASSICS_SEED_BOOKS,
  ...INDIAN_AUTHORS_SEED_BOOKS,
  ...FIRST_READ_SEED_BOOKS,
  {
    id: "catalog-train-to-pakistan",
    slug: "train-to-pakistan",
    title: "Train to Pakistan",
    authors: ["Khushwant Singh"],
    description:
      "A foundational Indian novel set against the upheaval of Partition.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780143065883-L.jpg",
    publisher: "Penguin Random House India",
    publishedDate: "2009",
    isbn13: "9780143065883",
    isbn10: "0143065882",
    language: "English",
    format: "Paperback",
    pages: 190,
    tags: ["indian author", "historical fiction", "classic"],
    featuredCollectionSlugs: ["indian-authors"],
    offers: buildCatalogOffers("train-to-pakistan", "Train to Pakistan", ["Khushwant Singh"]),
  },
  {
    id: "catalog-a-suitable-boy",
    slug: "a-suitable-boy",
    title: "A Suitable Boy",
    authors: ["Vikram Seth"],
    description:
      "An expansive Indian family epic and one of the landmark novels of modern English literature.",
    category: "fiction",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781474618793-L.jpg",
    publisher: "Orion / Phoenix",
    publishedDate: "2020",
    isbn13: "9781474618793",
    isbn10: "1474618790",
    language: "English",
    format: "Paperback",
    pages: 1536,
    tags: ["indian author", "literary fiction", "family saga"],
    featuredCollectionSlugs: ["indian-authors"],
    offers: buildCatalogOffers("a-suitable-boy", "A Suitable Boy", ["Vikram Seth"]),
  },
];

export function getCatalogCategories() {
  return CATEGORY_RECORDS;
}

export function getCatalogCategoryBySlug(slug: string) {
  return CATEGORY_RECORDS.find((category) => category.slug === slug) ?? null;
}

export function getCatalogCollections() {
  return COLLECTION_RECORDS.map((collection) => ({
    ...collection,
    books: collection.bookSlugs
      .map((slug) => CATALOG_BOOKS.find((book) => book.slug === slug))
      .filter((book): book is CatalogBookRecord => Boolean(book)),
  }));
}

export function getCatalogCollectionBySlug(slug: string) {
  return (
    getCatalogCollections().find((collection) => collection.slug === slug) ?? null
  );
}

export function getFeaturedCatalogBooks(limit = 8) {
  return CATALOG_BOOKS.slice(0, limit);
}

export function getCatalogBooksByCategory(category: BookCategory) {
  return CATALOG_BOOKS.filter((book) => book.category === category);
}

export function getCatalogBookBySlug(slug: string) {
  return CATALOG_BOOKS.find((book) => book.slug === slug) ?? null;
}

export function findCatalogMatchByQuery(query: string) {
  return resolveCatalogMatchByQuery(query)?.book ?? null;
}

export function resolveCatalogMatchByQuery(query: string) {
  return (
    CATALOG_BOOKS.map((book) => ({
      book,
      ...scoreQueryAgainstBook(query, {
        title: book.title,
        authors: book.authors,
        isbn13: book.isbn13,
        isbn10: book.isbn10,
        tags: book.tags,
      }),
    }))
      .filter(
        (candidate): candidate is CatalogMatch =>
          candidate.confidence !== null && candidate.score >= 55
      )
      .sort((left, right) => right.score - left.score)[0] ?? null
  );
}

export function resolveCatalogMatchForBook(book: {
  title: string;
  authors: string[];
  isbn13?: string | null;
  isbn10?: string | null;
}) {
  if (book.isbn13 || book.isbn10) {
    const isbnQuery = book.isbn13 ?? book.isbn10 ?? "";
    const isbnMatch = resolveCatalogMatchByQuery(isbnQuery);
    if (isbnMatch?.confidence === "exact-isbn") {
      return isbnMatch;
    }
  }

  return resolveCatalogMatchByQuery([book.title, ...book.authors].join(" "));
}

function buildCatalogOffers(
  bookSlug: string,
  title: string,
  authors: string[]
): CatalogStoreOffer[] {
  void authors;
  const affiliateQuery = title;

  return [
    buildOffer(bookSlug, "amazon", affiliateQuery),
    buildOffer(bookSlug, "flipkart", affiliateQuery),
    buildOffer(bookSlug, "bookswagon", affiliateQuery),
  ];
}

function buildWorldClassicSeedBook(book: {
  slug: string;
  title: string;
  author: string;
  originalPublicationYear: string;
  publisher: string;
  publishedDate: string;
  isbn13: string;
  isbn10: string;
  pages: number;
  confidence: string;
}): CatalogBookRecord {
  const originalYear = formatOriginalPublicationYear(book.originalPublicationYear);

  return {
    id: `catalog-${book.slug}`,
    slug: book.slug,
    title: book.title,
    authors: [book.author],
    description: `A World Classics pick first published in ${originalYear}, using the ${book.publisher} paperback edition for safer catalog matching.`,
    category: "fiction",
    thumbnail: `https://covers.openlibrary.org/b/isbn/${book.isbn13}-L.jpg`,
    publisher: book.publisher,
    publishedDate: book.publishedDate,
    isbn13: book.isbn13,
    isbn10: book.isbn10,
    language: "English",
    format: "Paperback",
    pages: book.pages,
    tags: [
      "world classic",
      "classic",
      "literature",
      book.confidence === "High" ? "high confidence edition" : "seed edition",
    ],
    featuredCollectionSlugs: ["world-classics"],
    offers: buildCatalogOffers(book.slug, book.title, [book.author]),
  };
}

function buildIndianAuthorSeedBook(book: {
  slug: string;
  title: string;
  author: string;
  subCategory: string;
  originalPublicationYear: string;
  publisher: string;
  publishedDate: string;
  isbn13: string | null;
  isbn10: string | null;
  pages: number;
  confidence: string;
}): CatalogBookRecord {
  const authors = parseIndianAuthorNames(book.author);

  return {
    id: `catalog-${book.slug}`,
    slug: book.slug,
    title: book.title,
    authors,
    description: `An Indian Authors shelf pick in ${book.subCategory.toLowerCase()}, first published in ${book.originalPublicationYear}.`,
    category: "fiction",
    thumbnail: book.isbn13
      ? `https://covers.openlibrary.org/b/isbn/${book.isbn13}-L.jpg`
      : null,
    publisher: book.publisher,
    publishedDate: book.publishedDate,
    isbn13: book.isbn13,
    isbn10: book.isbn10,
    language: "English",
    format: "Paperback",
    pages: book.pages,
    tags: [
      "indian author",
      "indian writing",
      ...buildIndianAuthorTags(book.subCategory),
      book.confidence === "High" ? "high confidence edition" : "seed edition",
    ],
    featuredCollectionSlugs: ["indian-authors"],
    offers: buildCatalogOffers(book.slug, book.title, authors),
  };
}

function buildPeacockClassicSeedBook(book: {
  slug: string;
  title: string;
  author: string;
  publishedDate: string;
  isbn13: string;
  pages: number;
  sourcePage: number;
}): CatalogBookRecord {
  void book.sourcePage;

  return {
    id: `catalog-${book.slug}`,
    slug: book.slug,
    title: book.title,
    authors: [book.author],
    description:
      "A Peacock Books World Classics paperback catalog seed using the publisher-listed ISBN-13 for safer catalog matching.",
    category: "fiction",
    thumbnail: `https://covers.openlibrary.org/b/isbn/${book.isbn13}-L.jpg`,
    publisher: "Peacock Books",
    publishedDate: book.publishedDate,
    isbn13: book.isbn13,
    isbn10: null,
    language: "English",
    format: "Paperback",
    pages: book.pages,
    tags: [
      "peacock classics",
      "world classic",
      "classic",
      "publisher catalog seed",
    ],
    featuredCollectionSlugs: ["peacock-classics"],
    offers: buildCatalogOffers(book.slug, book.title, [book.author]),
  };
}

function buildFirstReadSeedBook(
  book: (typeof FIRST_READ_SEED_ROWS)[number]
): CatalogBookRecord {
  const genreTag = book.shelfGenre.toLowerCase();

  return {
    id: `catalog-${book.slug}`,
    slug: book.slug,
    title: book.title,
    authors: book.authors,
    description: `A ${book.shelfGenre.toLowerCase()} pick selected for the First Book? Start Here shelf.`,
    category: "fiction",
    thumbnail: book.isbn13
      ? `https://covers.openlibrary.org/b/isbn/${book.isbn13}-L.jpg`
      : null,
    publisher: book.publisher,
    publishedDate: null,
    isbn13: book.isbn13,
    isbn10: null,
    language: "English",
    format: "Paperback",
    pages: null,
    tags: ["first book start here", genreTag],
    featuredCollectionSlugs: ["first-book-start-here"],
    offers: buildCatalogOffers(book.slug, book.title, book.authors),
  };
}

function buildOffer(
  bookSlug: string,
  store: StoreName,
  affiliateQuery: string
): CatalogStoreOffer {
  const preset = PRICE_PRESETS[bookSlug]?.[store];
  const trustedAmount = ENABLE_MANUAL_CATALOG_PRICES ? preset?.amountInr ?? null : null;
  const hasVerifiedPrice = trustedAmount !== null;

  return {
    store,
    affiliateQuery,
    price: {
      amountInr: trustedAmount,
      label:
        hasVerifiedPrice
          ? formatPriceLabel(trustedAmount)
          : "Check latest price",
      lastUpdated: hasVerifiedPrice ? "2026-06-18" : null,
    },
    deliveryText: hasVerifiedPrice ? preset?.deliveryText ?? null : null,
    offerSummary: hasVerifiedPrice ? preset?.offerSummary ?? null : null,
  };
}

function parseIndianAuthorNames(author: string) {
  const translatedBy = "; translated by ";
  if (!author.includes(translatedBy)) {
    return [author];
  }

  const [primaryAuthor, translator] = author.split(translatedBy);
  if (!translator || translator === "the author") {
    return [primaryAuthor];
  }

  return [primaryAuthor, translator];
}

function buildIndianAuthorTags(subCategory: string) {
  return subCategory
    .split("/")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 2);
}

function formatOriginalPublicationYear(year: string) {
  if (year.startsWith("-")) {
    return `${year.slice(1)} BCE`;
  }

  return year;
}

function formatPriceLabel(amountInr: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInr);
}
