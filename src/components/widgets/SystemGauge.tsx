interface SystemGaugeProps {
  label: string;
  value: number;
  max: number;
  color: 'emerald' | 'violet' | 'orange' | 'blue';
}

export function SystemGauge({ label, value, max, color }: SystemGaugeProps) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    emerald: 'stroke-emerald-500',
    violet: 'stroke-violet-500',
    orange: 'stroke-orange-500',
    blue: 'stroke-blue-500',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-slate-700"
          />
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${colorClasses[color]} transition-all duration-500`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{value.toFixed(0)}</span>
        </div>
      </div>
      <p className="text-sm text-slate-400 mt-2">{label}</p>
    </div>
  );
}
