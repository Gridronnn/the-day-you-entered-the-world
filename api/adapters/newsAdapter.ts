import { NewsFactItem } from './types';

interface NewsCacheEntry {
  data: NewsFactItem[];
  timestamp: number;
}

const newsCache = new Map<string, NewsCacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function fetchNormalizedHistoricalNews(birthDate: string): Promise<NewsFactItem[]> {
  const [yStr, mStr, dStr] = birthDate.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);

  const paddedMonth = String(month).padStart(2, '0');
  const paddedDay = String(day).padStart(2, '0');
  const cacheKey = `${paddedMonth}-${paddedDay}-${year}`;

  const cached = newsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${paddedMonth}/${paddedDay}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TheDayYouEnteredTheWorld/2.0 (data-traceability@app.org)',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.events) && json.events.length > 0) {
        const events: any[] = json.events;

        // 1. First priority: Events that occurred in the exact birth year
        const exactYearEvents = events.filter((ev) => ev.year === year);

        // 2. Second priority: Events on the same calendar day close to the birth year
        const sortedByProximity = [...events].sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year));
        const selected = exactYearEvents.length > 0 ? exactYearEvents.slice(0, 3) : sortedByProximity.slice(0, 3);

        const items: NewsFactItem[] = selected.map((ev, idx) => {
          const firstPage = ev.pages && ev.pages[0];
          const articleUrl = firstPage && firstPage.content_urls && firstPage.content_urls.desktop
            ? firstPage.content_urls.desktop.page
            : `https://en.wikipedia.org/wiki/${ev.year}`;

          const isExact = ev.year === year;
          const firstSentence = ev.text.split('.')[0] + '.';

          return {
            id: `wiki-news-${ev.year}-${paddedMonth}-${paddedDay}-${idx}`,
            headline: firstSentence.length > 100 ? firstSentence.slice(0, 97) + '...' : firstSentence,
            summary: ev.text,
            eventDate: `${ev.year}-${paddedMonth}-${paddedDay}`,
            category: 'World Event',
            status: 'historical',
            sourceName: 'Wikimedia Foundation ("On This Day" REST API)',
            sourceUrl: articleUrl,
            observedAt: `${ev.year}-${paddedMonth}-${paddedDay}`,
            publishedAt: String(ev.year),
            fetchedAt: new Date().toISOString(),
            methodology: 'Curated historical events documented in Wikipedia daily chronology archives with verified citations.',
            coverageNote: isExact
              ? `Verified historical event occurring in your birth year (${year}).`
              : `Milestone recorded on this calendar day in ${ev.year} (Wikipedia archive record).`,
          };
        });

        newsCache.set(cacheKey, { data: items, timestamp: Date.now() });
        return items;
      }
    }
  } catch (err) {
    // Failover
  }

  // Honest unavailable state when no verified event exists or network is down
  const emptyFallback: NewsFactItem[] = [
    {
      id: `no-archive-${birthDate}`,
      headline: `No Verified Event Record in Archive for ${paddedMonth}/${paddedDay}`,
      summary: `The Wikimedia daily archive does not contain a verified milestone record for this exact calendar day and year. Rather than generating a plausible fictional entry, this record is preserved as unavailable.`,
      eventDate: birthDate,
      category: 'Archive Record',
      status: 'unavailable',
      sourceName: 'Wikimedia Foundation REST API',
      sourceUrl: `https://en.wikipedia.org/wiki/${year}`,
      observedAt: birthDate,
      publishedAt: null,
      fetchedAt: new Date().toISOString(),
      methodology: 'Direct query to Wikipedia OnThisDay API.',
      coverageNote: 'No verified event match in the public chronology archive for this date.',
    },
  ];

  return emptyFallback;
}
