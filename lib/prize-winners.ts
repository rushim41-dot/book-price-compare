export type PrizeWinnerShelf = {
  label: string;
  description: string;
  href: string | null;
  status: "open" | "planned";
};

export const PRIZE_WINNER_SHELVES: PrizeWinnerShelf[] = [
  {
    label: "Booker Prize Winners",
    description: "Award-winning modern fiction already curated in Books2Buy.",
    href: "/collections/booker-prize-winners",
    status: "open",
  },
  {
    label: "Booker Shortlist / Longlist important books",
    description: "High-signal Booker shortlisted and longlisted books.",
    href: "/collections/booker-finalists",
    status: "open",
  },
  {
    label: "International Booker Winners",
    description: "Translated fiction winners and notable international editions.",
    href: "/collections/international-booker-winners",
    status: "open",
  },
  {
    label: "Nobel Prize Literature Authors + key books",
    description: "Nobel laureates and selected readable entry points.",
    href: "/collections/nobel-prize-winners",
    status: "open",
  },
  {
    label: "Pulitzer Prize for Fiction Winners",
    description: "Major US fiction winners to add after edition checks.",
    href: "/collections/pulitzer-fiction-winners",
    status: "open",
  },
  {
    label: "National Book Award Fiction Winners",
    description: "US National Book Award fiction winners and notable editions.",
    href: "/collections/national-book-award-fiction-winners",
    status: "open",
  },
  {
    label: "Women's Prize for Fiction Winners",
    description: "Women's Prize winners and reader-friendly shortlisted books.",
    href: "/collections/womens-prize-fiction-winners",
    status: "open",
  },
  {
    label: "JCB Prize for Literature Winners",
    description: "Indian literary prize winners with careful ISBN verification.",
    href: "/collections/jcb-prize-winners",
    status: "open",
  },
  {
    label: "Sahitya Akademi Award selected important books",
    description: "Selected Indian language works and translations for later curation.",
    href: "/collections/sahitya-akademi-english",
    status: "open",
  },
  {
    label: "Hugo Award Winners",
    description: "Science fiction and fantasy winners, separated from base fiction shelves.",
    href: "/collections/hugo-best-novel-winners",
    status: "open",
  },
  {
    label: "Nebula Award Winners",
    description: "Speculative fiction award winners to curate by exact edition.",
    href: "/collections/nebula-best-novel-winners",
    status: "open",
  },
  {
    label: "Edgar Award Winners",
    description: "Mystery and crime award winners for future genre shelves.",
    href: "/collections/edgar-best-novel-winners",
    status: "open",
  },
  {
    label: "Newbery Medal Winners",
    description: "Children's literature winners with age and edition checks.",
    href: "/collections/newbery-medal-winners",
    status: "open",
  },
  {
    label: "Carnegie Medal Winners",
    description: "Carnegie Medal books planned for a verified children's classics shelf.",
    href: "/collections/carnegie-medal-writing-winners",
    status: "open",
  },
];
