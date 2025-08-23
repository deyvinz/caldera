export function CheckoutStepper({ step }: { step: number }) {
  const steps = ["Dates", "Travelers", "Options", "Summary"];
  return (
    <ol className="flex items-center gap-4 text-sm">
      {steps.map((label, i) => {
        const current = i + 1;
        return (
          <li key={label} className="flex items-center gap-2">
            <span className={`h-6 w-6 rounded-full grid place-items-center text-white ${current <= step ? 'bg-emerald-900' : 'bg-emerald-900/30'}`}>{current}</span>
            <span className={`${current === step ? 'text-emerald-900 font-semibold' : 'text-charcoal-900/70'}`}>{label}</span>
            {current < steps.length && <span className="mx-2 text-charcoal-900/30">/</span>}
          </li>
        );
      })}
    </ol>
  );
}


