export default function PinDots({ filled = 0, error = false }) {
  return (
    <div className="pin-dots">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`pin-dot${error ? ' error' : i < filled ? ' filled' : ''}`}
        />
      ))}
    </div>
  )
}
