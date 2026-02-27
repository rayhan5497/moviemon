import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import filterData from '@/shared/data/filters.json';
const languages = filterData.languages;

import { useSnackbar } from '@/shared/context/SnackbarProvider';

const PROXY_URL = import.meta.env.VITE_HLS_PROXY_URL;
const SUBTITLE_FILE_URL = import.meta.env.VITE_SERVER_BASE_URL;
const SUBTITLE_LIST_URL = import.meta.env.VITE_SERVER_BASE_URL;

export default function HlsPlayer({
  videoSrc,
  setMenifestLoaded,
  imdbId,
  season,
  episode,
}) {
  const { showSnackbar } = useSnackbar();

  const videoRef = useRef(null);
  const plyrRef = useRef(null);
  const hlsRef = useRef(null);
  const abortControllerRef = useRef(null);

  const subtitlesDataRef = useRef([]);
  const loadedSubtitlesRef = useRef(new Set());

  const lastTapRef = useRef(0);

  const handleTouchEnd = (e) => {
    const plyr = plyrRef.current;
    if (!plyr) return;

    const now = Date.now();
    if (now - lastTapRef.current > 300) {
      lastTapRef.current = now;
      return;
    }
    lastTapRef.current = 0;

    const rect = plyr.elements.container.getBoundingClientRect();
    const x = e.changedTouches[0].clientX - rect.left;
    const w = rect.width;

    if (x < w * 0.3) {
      plyr.currentTime = Math.max(0, plyr.currentTime - 10);
      return;
    }

    if (x > w * 0.7) {
      plyr.currentTime = Math.min(plyr.duration, plyr.currentTime + 10);
      return;
    }

    plyr.togglePlay();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    const source = `${PROXY_URL}/api/hls?url=${encodeURIComponent(videoSrc)}`;

    let hls;
    let subtitlesLoaded = false;
    let isMounted = true;

    abortControllerRef.current = new AbortController();

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        renderTextTracksNatively: true,
      });

      hlsRef.current = hls;
      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setMenifestLoaded?.(true);
        if (plyrRef.current) return;

        const qualities = hls.levels.map((l) => l.height).filter(Boolean);

        plyrRef.current = new Plyr(video, {
          keyboard: { focused: true, global: true },
          quality: {
            default: 0,
            options: [0, ...qualities],
            forced: true,
            onChange: (q) => {
              if (q === 0) {
                hls.currentLevel = -1; // HLS auto
              } else {
                hls.currentLevel = hls.levels.findIndex((l) => l.height === q);
              }
            },
            i18n: {
              qualityLabel: { 0: 'Auto' },
            },
          },
        });

        plyrRef.current.elements.container.addEventListener(
          'touchend',
          handleTouchEnd,
          { passive: true }
        );

        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          const node = document.querySelector(
            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
          );
          const node2 = document.querySelectorAll('.plyr__menu__value');
          if (!node && node2.length < 0) return;

          //first get element with textContent including '0p'
          const OpNode = Array.from(node2).find((n) =>
            n.textContent.includes('0p')
          );

          if (hls.autoLevelEnabled) {
            node.textContent = `AUTO (${hls.levels[data.level].height}p)`;
            OpNode.textContent = `AUTO (${hls.levels[data.level].height}p)`;
          } else {
            node.textContent = 'AUTO';
          }
        });

        if (!subtitlesLoaded) {
          subtitlesLoaded = true;
          loadSubtitles(imdbId, season, episode);
        }
        plyrRef.current.on('languagechange', () => {
          handleLanguageChange();
        });
      });

      // Listen to Plyr's languagechange event

      function handleLanguageChange() {
        if (!isMounted) return;

        const currentTrack = plyrRef.current?.currentTrack;
        if (!currentTrack || currentTrack === -1) return;

        const textTracks = video.textTracks;
        const activeTrack = textTracks[currentTrack];

        if (
          activeTrack &&
          !loadedSubtitlesRef.current.has(activeTrack.language)
        ) {
          loadSubtitleFile(activeTrack.language);
        }
      }

      async function loadSubtitleFile(srclang) {
        console.log('🔵 [SUB] Requested:', srclang);
        if (loadedSubtitlesRef.current.has(srclang)) return;

        const subData = subtitlesDataRef.current.find(
          (s, idx) => `${s.iso}-${idx}` === srclang
        );
        if (!subData) return;

        const url = `${SUBTITLE_FILE_URL}/api/subtitles/file?id=${encodeURIComponent(
          subData.id
        )}&imdb=${encodeURIComponent(imdbId)}`;

        console.log('🟡 [SUB] Trying:', srclang);

        try {
          const res = await fetch(url);

          // ⏳ 429 handling
          if (res.status === 429) {
            const msg =
              (await res.json().catch(() => null))?.error ||
              'Please wait 30 seconds before trying again';

            console.warn('⏳ [SUB] Rate-limited:', msg);
            showSnackbar(msg, { color: 'red' });
            // alert(msg);
            return;
          }

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }

          const vtt = await res.text();
          const blobUrl = URL.createObjectURL(
            new Blob([vtt], { type: 'text/vtt' })
          );

          // 🔥 DESTROY OLD TRACK COMPLETELY
          const oldTrack = Array.from(video.querySelectorAll('track')).find(
            (t) => t.srclang === srclang
          );

          if (oldTrack) {
            const newTrack = document.createElement('track');
            newTrack.kind = 'subtitles';
            newTrack.srclang = srclang;
            newTrack.label = oldTrack.label;
            newTrack.src = blobUrl;
            newTrack.default = true;

            video.replaceChild(newTrack, oldTrack);
          } else {
            // fallback
            const newTrack = document.createElement('track');
            newTrack.kind = 'subtitles';
            newTrack.srclang = srclang;
            newTrack.label = srclang;
            newTrack.src = blobUrl;
            video.appendChild(newTrack);
          }

          loadedSubtitlesRef.current.add(srclang);
          console.log('✅ [SUB] Loaded clean:', srclang);
        } catch (err) {
          console.error('❌ [SUB] Failed:', err);
        }
      }

      async function loadSubtitles(imdb, season, episode) {
        try {
          const res = await fetch(
            `${SUBTITLE_LIST_URL}/api/subtitles/list?imdb=${imdb}&season=${season}&episode=${episode}`,
            { signal: abortControllerRef.current?.signal }
          );

          if (!isMounted) return;

          if (!res.ok) {
            console.warn('Subtitle list failed:', res.status);
            return;
          }

          const subs = await res.json();
          if (!isMounted || !subs.length) return;

          subs.sort((a, b) => {
            const labelA =
              languages.find((l) => l.iso_639_1 === a.iso)?.english_name ||
              a.lang;
            const labelB =
              languages.find((l) => l.iso_639_1 === b.iso)?.english_name ||
              b.lang;
            return labelA.localeCompare(labelB);
          });

          subtitlesDataRef.current = subs;

          video.querySelectorAll('track').forEach((t) => t.remove());
          loadedSubtitlesRef.current.clear();

          if (!isMounted) return;

          for (let index = 0; index < subs.length; index++) {
            const sub = subs[index];

            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.srclang = `${sub.iso}-${index}`;
            track.label =
              (languages.find((l) => l.iso_639_1 === sub.iso)?.english_name ||
                sub.lang) + ` (${sub.variant})`;

            video.appendChild(track);
          }

          const engIndex = subs.findIndex((s) => s.iso === 'en');
          loadSubtitleFile(
            engIndex !== -1
              ? `${subs[engIndex].iso}-${engIndex}`
              : `${subs[0].iso}-0`
          );
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('Subtitle loading aborted');
            return;
          }
          if (isMounted) {
            console.error('Failed to load subtitles:', error);
          }
        }
      }

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR)
          hls.recoverMediaError();
        else hls.destroy();
      });
    }

    return () => {
      isMounted = false;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (plyrRef.current) {
        plyrRef.current.off('languagechange');
        plyrRef.current.elements.container.removeEventListener(
          'touchend',
          handleTouchEnd
        );
      }

      plyrRef.current?.destroy();
      plyrRef.current = null;
      hlsRef.current?.destroy();
      hlsRef.current = null;
      subtitlesDataRef.current = [];
      loadedSubtitlesRef.current.clear();
    };
  }, [videoSrc, imdbId, season, episode]);

  return (
    <div className="contents">
      <video
        style={{ position: 'absolute' }}
        ref={videoRef}
        className="plyr-react absolute w-full h-full bg-black"
        playsInline
        controls
        crossOrigin="anonymous"
        autoPlay
      />
    </div>
  );
}

