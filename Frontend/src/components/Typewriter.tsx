import React, { useEffect, useRef, useState } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number; // ms per char
  className?: string;
  emojiPause?: number; // extra pause before emojis (ms)
}

const isEmoji = (ch: string) => {
  const cp = ch.codePointAt(0) ?? 0;
  return cp >= 0x1f000 && cp <= 0x1ffff;
};

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 60, className, emojiPause = 250 }) => {
  const [display, setDisplay] = useState('');
  const mountedRef = useRef(true);
  const timerRef = useRef<number | null>(null);
  const charsRef = useRef<string[]>([]);
  const idxRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    // prepare chars as code points
    charsRef.current = Array.from(text);
    idxRef.current = 0;
    setDisplay('');

    const tick = () => {
      if (!mountedRef.current) return;
      const chars = charsRef.current;
      if (idxRef.current >= chars.length) return;
      const ch = chars[idxRef.current];
      setDisplay((d) => d + ch);
      idxRef.current += 1;

      // if char is emoji, pause slightly longer
      const delay = isEmoji(ch) ? Math.max(emojiPause, speed) : speed;
      timerRef.current = window.setTimeout(tick, delay);
    };

    // start after a small initial delay so it's visible
    timerRef.current = window.setTimeout(tick, speed);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [text, speed, emojiPause]);

  return (
    <span className={className}>
      {display}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

export default Typewriter;
