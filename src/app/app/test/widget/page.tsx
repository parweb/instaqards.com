import InstagramWidget from './components/InstagramWidget';
import { SpotifyWidget } from './components/SpotifyWidget';
import { TiktokWidget } from './components/TiktokWidget';
import { YoutubeWidget } from './components/YoutubeWidget';

export default function TestWidgetPage() {
  return (
    <div className="flex flex-col gap-5 w-[40%] mx-auto">
      <div>
        <SpotifyWidget albumId="3OxfaVgvTxUTy7276t7SPU" />
      </div>

      <div>
        <YoutubeWidget videoId="VCyuZhnm71I" />
      </div>

      <div>
        <TiktokWidget postId="7401431134904569120" />
      </div>

      <div>
        <InstagramWidget postId="DELQtvXpG7c" />
      </div>
    </div>
  );
}
