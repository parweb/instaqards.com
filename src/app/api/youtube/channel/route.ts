import { unstable_cache } from 'next/cache';
import * as htmlparser2 from 'htmlparser2';

import { type NextRequest, NextResponse } from 'next/server';

const getYouTubeChannelData = unstable_cache(
  async (handle: string, url: string) => {
    console.info('getYouTubeChannelData', handle, url);

    const channelId = url.includes('/channel/')
      ? handle
      : await fetch(`https://www.youtube.com/c/${handle}`)
        .then(async res => await res.text())
        .then(text => text.match(/channel_id=([a-zA-Z0-9\-_]{1,})/)?.[1]);

    const feed = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    )
      .then(async res => htmlparser2.parseFeed(await res.text()))
      .then(feed => feed?.items);

    return { handle, channelId, feed };
  },
  ['youtube-channel'],
  {
    revalidate: 60 * 60 * 24 // 24 hours
  }
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');
  const url = String(searchParams.get('url'));

  if (!handle) {
    return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
  }

  const data = await getYouTubeChannelData(handle, url);
  return NextResponse.json(data);
}
