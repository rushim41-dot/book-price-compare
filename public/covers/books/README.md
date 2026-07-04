# Book Cover Assets

This folder is reserved for approved local book-cover assets.

Do not copy remote OpenLibrary, Amazon, Flipkart, BooksWagon, publisher, or retailer images here unless the source terms allow local hosting for Books2Buy.

Use local cover paths from `lib/cover-overrides.ts` only after the asset is approved, for example:

```ts
thumbnail: "/covers/books/example-title"
```

Until then, prefer verified remote cover URLs and document each override note.

The app may also serve generated Books2Buy display covers from `app/covers/books/[slug]/route.ts` for titles whose remote cover routes are unreliable. These are intentionally branded as display covers and must not be treated as official publisher or retailer cover art.
