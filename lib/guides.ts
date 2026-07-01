export type GuideRecord = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  updatedAt: string;
  relatedLinks: Array<{
    label: string;
    href: string;
  }>;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export const GUIDE_RECORDS: GuideRecord[] = [
  {
    slug: "best-world-classics-to-start-with",
    title: "Best World Classics to Start With",
    description:
      "A practical starter path for readers who want approachable classics before moving into denser literary works.",
    category: "World Classics",
    readingTime: "5 min read",
    updatedAt: "2026-06-26",
    relatedLinks: [
      { label: "Browse World Classics", href: "/collections/world-classics" },
      { label: "Browse Peacock Classics", href: "/collections/peacock-classics" },
    ],
    sections: [
      {
        heading: "Start with story-first books",
        body:
          "If you are new to classics, start with books that move quickly and have a clear narrative hook: Animal Farm, The Great Gatsby, The Old Man and the Sea, The Strange Case of Dr. Jekyll and Mr. Hyde, or The Time Machine.",
      },
      {
        heading: "Move into richer novels",
        body:
          "After a few short classics, try Pride and Prejudice, Jane Eyre, Treasure Island, Little Women, or The Picture of Dorian Gray. These books give you stronger character work without becoming too heavy at the start.",
      },
      {
        heading: "Check editions carefully",
        body:
          "Classics often have many editions, abridged versions, deluxe hardbacks, and bundled sets. For price comparison, the safest first match is usually a normal paperback of the base work.",
      },
    ],
  },
  {
    slug: "how-to-compare-book-prices-safely",
    title: "How to Compare Book Prices Safely",
    description:
      "A reader-friendly checklist for comparing books online without getting misled by edition mismatches or fake discounts.",
    category: "Buying Guide",
    readingTime: "6 min read",
    updatedAt: "2026-06-26",
    relatedLinks: [
      { label: "Search Books2Buy", href: "/search" },
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    ],
    sections: [
      {
        heading: "Compare the actual book, not only the title",
        body:
          "Many books share similar titles, subtitles, translations, summaries, or workbook editions. Before buying, confirm the title, author, format, publisher, and ISBN when the store shows it.",
      },
      {
        heading: "Treat very low prices with care",
        body:
          "A cheaper listing may be a different format, old edition, used copy, summary, or import listing. The lowest visible price is not always the best match for the book you meant to buy.",
      },
      {
        heading: "Use store pages for final truth",
        body:
          "Books2Buy keeps prices hidden until exact product sources are verified. Final price, delivery, seller, and return details should always be checked on the store page before checkout.",
      },
    ],
  },
  {
    slug: "indian-authors-worth-reading",
    title: "Indian Authors Worth Reading",
    description:
      "A starter guide to Indian fiction, contemporary novels, translated literature, and reader-friendly classics.",
    category: "Indian Authors",
    readingTime: "5 min read",
    updatedAt: "2026-06-26",
    relatedLinks: [
      { label: "Browse Indian Authors", href: "/collections/indian-authors" },
      { label: "Browse Fiction", href: "/categories/fiction" },
    ],
    sections: [
      {
        heading: "Begin with accessible modern fiction",
        body:
          "The Guide, Malgudi Days, The White Tiger, The Namesake, and The Palace of Illusions are strong starting points because they are widely read and easy to discuss.",
      },
      {
        heading: "Try literary award winners",
        body:
          "Midnight's Children, The God of Small Things, The Inheritance of Loss, and Tomb of Sand reward slower reading and are useful choices for readers exploring prize-winning Indian literature.",
      },
      {
        heading: "Do not ignore translation",
        body:
          "Translated Indian literature opens a much wider shelf. When comparing editions, check translator names because two translations of the same work can read very differently.",
      },
    ],
  },
  {
    slug: "self-help-books-worth-comparing",
    title: "Self Help Books Worth Comparing",
    description:
      "How to pick self-help books that match your goal instead of buying whatever is trending this week.",
    category: "Self Help",
    readingTime: "4 min read",
    updatedAt: "2026-06-26",
    relatedLinks: [
      { label: "Browse Self Help", href: "/categories/self-help" },
      { label: "Browse Productivity", href: "/categories/productivity" },
    ],
    sections: [
      {
        heading: "Match the book to the problem",
        body:
          "Atomic Habits is useful for routines, Deep Work for focus, The Power of Habit for behaviour loops, and Think Again for changing your mind. A good match matters more than a popular title.",
      },
      {
        heading: "Avoid workbook confusion",
        body:
          "Self-help searches often return journals, workbooks, summaries, and study guides. Those may be useful, but they should not replace the base book unless you searched for them directly.",
      },
      {
        heading: "Compare format before price",
        body:
          "Paperback, hardcover, Kindle, audiobook, and international editions can all appear together. Check the format before assuming one store is cheaper.",
      },
    ],
  },
  {
    slug: "paperback-vs-hardcover-which-to-buy",
    title: "Paperback vs Hardcover: Which Should You Buy?",
    description:
      "A simple decision guide for choosing between paperback, hardcover, collector editions, and boxed sets.",
    category: "Buying Guide",
    readingTime: "4 min read",
    updatedAt: "2026-06-26",
    relatedLinks: [
      { label: "Browse Peacock Classics", href: "/collections/peacock-classics" },
      { label: "Browse Reader Favorites", href: "/collections/reader-favorites" },
    ],
    sections: [
      {
        heading: "Choose paperback for reading value",
        body:
          "Paperbacks are usually lighter, easier to carry, and better for everyday reading. They are also easier to compare across stores when the edition is clearly listed.",
      },
      {
        heading: "Choose hardcover for durability or gifting",
        body:
          "Hardcovers can be better for gifts, collections, and books you expect to keep for years. They should be treated as separate editions in comparison results.",
      },
      {
        heading: "Watch for bundled editions",
        body:
          "Boxed sets and collections can look cheaper per book, but they are not the same product as a single paperback. Compare them only when you actually want the full set.",
      },
    ],
  },
  {
    slug: "book-categories-explained",
    title: "Book Categories Explained for Online Buyers",
    description:
      "A quick explanation of how Books2Buy uses categories and collections for safer browsing.",
    category: "Catalog Guide",
    readingTime: "4 min read",
    updatedAt: "2026-06-26",
    relatedLinks: [
      { label: "Browse Categories", href: "/categories/fiction" },
      { label: "Browse Collections", href: "/collections/world-classics" },
    ],
    sections: [
      {
        heading: "Categories describe the book type",
        body:
          "Categories like Fiction, Self Help, Productivity, Psychology, Business, and Personal Finance describe the broad shelf a book belongs to.",
      },
      {
        heading: "Collections describe reader intent",
        body:
          "Collections like World Classics, Indian Authors, and Peacock Classics are curated groups. They can overlap with categories but are more useful for browsing.",
      },
      {
        heading: "Search still matters",
        body:
          "If you know the exact book, search by title. If you are exploring, use categories and collections to narrow the shelf before comparing stores.",
      },
    ],
  },
  {
    slug: "classic-books-for-students-and-new-readers",
    title: "Classic Books for Students and New Readers",
    description:
      "Short, approachable classics that are easier to finish and discuss before moving to longer works.",
    category: "World Classics",
    readingTime: "5 min read",
    updatedAt: "2026-06-26",
    relatedLinks: [
      { label: "Browse World Classics", href: "/collections/world-classics" },
      { label: "Browse Fiction", href: "/categories/fiction" },
    ],
    sections: [
      {
        heading: "Pick shorter works first",
        body:
          "Animal Farm, The Time Machine, The Little Prince, The Old Man and the Sea, and The Strange Case of Dr. Jekyll and Mr. Hyde are good first classics because they are compact and memorable.",
      },
      {
        heading: "Choose familiar themes",
        body:
          "Students often connect faster with books about ambition, friendship, justice, identity, or survival. Familiar themes make older language easier to handle.",
      },
      {
        heading: "Avoid accidental adaptations",
        body:
          "Graphic novels, abridged editions, and study guides are common in classics searches. Buy those only when you specifically need that format.",
      },
    ],
  },
  {
    slug: "how-books2buy-handles-prices",
    title: "How Books2Buy Handles Prices",
    description:
      "Why Books2Buy hides prices until exact store products and trusted sources are verified.",
    category: "Trust and Safety",
    readingTime: "3 min read",
    updatedAt: "2026-06-26",
    relatedLinks: [
      { label: "About Books2Buy", href: "/about" },
      { label: "Terms of Use", href: "/terms" },
    ],
    sections: [
      {
        heading: "Search links are not price sources",
        body:
          "A generic store search can show many editions and sellers. That is useful for discovery, but it is not enough to claim a live price for one exact book.",
      },
      {
        heading: "Exact product verification comes later",
        body:
          "Price tracking should use verified store product URLs, ASINs, or product IDs. Until those are connected, Books2Buy keeps price labels conservative.",
      },
      {
        heading: "This protects readers",
        body:
          "Hiding uncertain prices is less flashy, but it avoids misleading buyers with stale, scraped, or mismatched information.",
      },
    ],
  },
];

export function getGuides() {
  return GUIDE_RECORDS;
}

export function getGuideBySlug(slug: string) {
  return GUIDE_RECORDS.find((guide) => guide.slug === slug) ?? null;
}
