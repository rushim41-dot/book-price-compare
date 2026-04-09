"use client";

import Image from "next/image";
import { FormEvent, useState, useTransition } from "react";

type BookResult = {
  id: string;
  title: string;
  price: number | null;
  priceText: string;
  link: string;
  store: "amazon" | "flipkart";
  isFallback: boolean;
};

type GoogleBook = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string | null;
  infoLink: string;
  publishedDate: string | null;
  publisher: string | null;
};

type SearchResponse = {
  query: string;
  googleBook: GoogleBook | null;
  amazon: BookResult[];
  flipkart: BookResult[];
  cheapestId: string | null;
  notes: string[];
};

type BuyOptionsProps = {
  amazonLink: string;
  flipkartLink: string;
};

function BuyOptions({ amazonLink, flipkartLink }: BuyOptionsProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-slate-950">
            Buy / compare
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Check current book prices on trusted stores.
          </h2>
          <p className="mt-3 leading-7 text-slate-300">
            We send you directly to the store search page so you can see today&apos;s
            price, delivery date, seller, and available editions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={amazonLink}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl bg-white p-5 text-slate-950 transition hover:-translate-y-1 hover:bg-orange-50"
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-sm font-semibold text-orange-700">Amazon India</p>
                <h3 className="mt-2 text-2xl font-bold">View on Amazon</h3>
              </div>
              <span className="text-sm font-semibold text-slate-600 transition group-hover:text-orange-700">
                Open store search
              </span>
            </div>
          </a>

          <a
            href={flipkartLink}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl bg-white p-5 text-slate-950 transition hover:-translate-y-1 hover:bg-blue-50"
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-sm font-semibold text-blue-700">Flipkart</p>
                <h3 className="mt-2 text-2xl font-bold">View on Flipkart</h3>
              </div>
              <span className="text-sm font-semibold text-slate-600 transition group-hover:text-blue-700">
                Open store search
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function runSearch(nextQuery: string) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(nextQuery)}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Search failed.");
      }

      const payload = (await response.json()) as SearchResponse;
      setData(payload);
    } catch (searchError) {
      setData(null);
      setError(
        searchError instanceof Error ? searchError.message : "Something went wrong."
      );
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter a book name.");
      return;
    }

    setError("");

    startTransition(() => {
      void runSearch(trimmedQuery);
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8e8_0%,#eef4ff_50%,#f8fafc_100%)] px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-5">
              <div className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                Book price comparison for India
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                  Find book details and compare buying options in one search.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Search a book, confirm the title with Google Books, then open fast
                  Amazon and Flipkart buying links.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-xl"
            >
              <label htmlFor="book-query" className="mb-3 block text-sm font-medium text-slate-300">
                Search for a book
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="book-query"
                  type="text"
                  placeholder="Atomic Habits, Ikigai, Rich Dad Poor Dad..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white outline-none ring-0 placeholder:text-slate-500 focus:border-amber-300"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-2xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Searching..." : "Search now"}
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Tip: use the full book title for cleaner matches.
              </p>
            </form>
          </div>
        </section>

        {error ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </section>
        ) : null}

        {data ? (
          <>
            {data.googleBook ? (
              <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-0 md:grid-cols-[180px_1fr]">
                  <div className="flex items-center justify-center bg-slate-100 p-6">
                    {data.googleBook.thumbnail ? (
                      <Image
                        src={data.googleBook.thumbnail}
                        alt={data.googleBook.title}
                        width={144}
                        height={208}
                        className="h-52 w-auto rounded-xl object-cover shadow-md"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-52 w-36 items-center justify-center rounded-xl bg-slate-200 text-sm font-medium text-slate-500">
                        No cover
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                        Google Books match
                      </span>
                      {data.googleBook.publishedDate ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          Published {data.googleBook.publishedDate}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {data.googleBook.title}
                      </h2>
                      {data.googleBook.authors.length > 0 ? (
                        <p className="mt-2 text-base text-slate-600">
                          By {data.googleBook.authors.join(", ")}
                        </p>
                      ) : null}
                      {data.googleBook.publisher ? (
                        <p className="mt-1 text-sm text-slate-500">
                          Publisher: {data.googleBook.publisher}
                        </p>
                      ) : null}
                    </div>

                    <a
                      href={data.googleBook.infoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
                    >
                      View Google Books info
                    </a>
                  </div>
                </div>
              </section>
            ) : null}

            {data.notes.length > 0 ? (
              <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <div className="space-y-2">
                  {data.notes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </section>
            ) : null}

            <BuyOptions
              amazonLink={data.amazon[0]?.link ?? "https://www.amazon.in/s?k=books&i=stripbooks"}
              flipkartLink={data.flipkart[0]?.link ?? "https://www.flipkart.com/search?q=books"}
            />
          </>
        ) : (
          <section className="grid gap-4 md:grid-cols-3">
            {["Search both stores", "See top 3 results", "Spot the cheapest deal"].map((item) => (
              <article
                key={item}
                className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900">{item}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The app keeps the flow simple so you can grow it into a bigger product later.
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
