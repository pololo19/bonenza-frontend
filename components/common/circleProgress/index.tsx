export default function ({ progress }: { progress: number }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 64 64">
      <circle stroke-width="7" r="28.5" cx="32" cy="32" fill="transparent" stroke="#46434C" />
      <circle stroke-width="0" r="20" cx="32" cy="32" fill="#46434C" />
      <circle
        stroke-width="7"
        r="28.5"
        cx="32"
        cy="32"
        fill="transparent"
        stroke="#50C627"
        strokeDasharray="180"
        strokeDashoffset={1.8 * (100 - progress)}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: 'center center',
        }}
      />
      <text fill="#ffffff" x="32" y="37" text-anchor="middle" style={{ fontSize: 12 }}>
        {progress}/100
      </text>
    </svg>
  );
}
