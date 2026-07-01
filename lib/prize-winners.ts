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
    description: "High-signal Booker shortlisted and longlisted books to verify next.",
    href: null,
    status: "planned",
  },
  {
    label: "International Booker Winners",
    description: "Translated fiction winners and notable international editions.",
    href: null,
    status: "planned",
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
    href: null,
    status: "planned",
  },
  {
    label: "National Book Award Fiction Winners",
    description: "US National Book Award fiction winners and notable editions.",
    href: null,
    status: "planned",
  },
  {
    label: "Women's Prize for Fiction Winners",
    description: "Women's Prize winners and reader-friendly shortlisted books.",
    href: null,
    status: "planned",
  },
  {
    label: "JCB Prize for Literature Winners",
    description: "Indian literary prize winners with careful ISBN verification.",
    href: null,
    status: "planned",
  },
  {
    label: "Sahitya Akademi Award selected important books",
    description: "Selected Indian language works and translations for later curation.",
    href: null,
    status: "planned",
  },
  {
    label: "Hugo Award Winners",
    description: "Science fiction and fantasy winners, separated from base fiction shelves.",
    href: null,
    status: "planned",
  },
  {
    label: "Nebula Award Winners",
    description: "Speculative fiction award winners to curate by exact edition.",
    href: null,
    status: "planned",
  },
  {
    label: "Edgar Award Winners",
    description: "Mystery and crime award winners for future genre shelves.",
    href: null,
    status: "planned",
  },
  {
    label: "Newbery Medal Winners",
    description: "Children's literature winners with age and edition checks.",
    href: null,
    status: "planned",
  },
  {
    label: "Carnegie Medal Winners",
    description: "Carnegie Medal books planned for a verified children's classics shelf.",
    href: null,
    status: "planned",
  },
];
