import './EmojiBackground.css';
import { BACKGROUND_EMOJIS } from './backgroundEmojis';

export default function EmojiBackground() {
  return (
    <div className="emoji-background" aria-hidden="true">
      {BACKGROUND_EMOJIS.map(({ emoji, top, left, size, rotate }, index) => (
        <span
          key={index}
          className="emoji-bg-item"
          style={{
            top,
            left,
            fontSize: size,
            '--rotate': rotate,
            animationDelay: `${index * 0.7}s`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
