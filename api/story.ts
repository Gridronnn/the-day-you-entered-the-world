import { generateStory } from './services/storyOrchestrator';
import { StoryQuery } from './types/story';

export default async function handler(req: any, res: any) {
  const date = String(req.query.date || '1995-07-15').trim();
  const place = String(req.query.place || 'London, UK').trim();
  const currency = (String(req.query.currency || 'USD').toUpperCase() as StoryQuery['currency']);
  const chartRegion = (String(req.query.chartRegion || 'US').toUpperCase() as StoryQuery['chartRegion']);

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD.' });
  }

  const [yStr, mStr, dStr] = date.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);
  const today = new Date();

  if (y < 1930) {
    return res.status(400).json({ error: 'Dates before 1930 are outside the calibrated historical archive range.' });
  }
  const inputDate = new Date(y, m - 1, d);
  if (inputDate > today) {
    return res.status(400).json({ error: 'Future dates cannot be reconstructed. Please select a historical date.' });
  }

  if (m === 2 && d === 29) {
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    if (!isLeap) {
      return res.status(400).json({ error: `${y} was not a leap year. February 29 does not exist for this year.` });
    }
  }

  try {
    const story = await generateStory({
      date,
      placeInput: place,
      currency: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'].includes(currency) ? currency : 'USD',
      chartRegion: chartRegion === 'UK' ? 'UK' : 'US',
    });

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=7200');
    return res.status(200).json(story);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reconstruct historical day data.', details: err.message });
  }
}
