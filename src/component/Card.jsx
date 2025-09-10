export default function Card({ title, value, color }) {
  return (
    <div
      className="card text-center"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <h3 className="font-bold">{title}</h3>
      <p className="text-2xl font-semibold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
