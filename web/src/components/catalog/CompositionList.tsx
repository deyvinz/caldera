export function CompositionList({
  items,
}: {
  items: { partnerName: string; service: string }[];
}) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((it, idx) => (
        <li key={idx} className="flex items-center justify-between text-sm">
          <span className="font-medium">{it.service}</span>
          <span className="text-charcoal-900/70">{it.partnerName}</span>
        </li>
      ))}
    </ul>
  );
}


