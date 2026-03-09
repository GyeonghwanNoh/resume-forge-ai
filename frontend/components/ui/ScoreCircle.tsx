import React from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function ScoreCircle({ score, size = 'md', label }: ScoreCircleProps) {
  const sizes = {
    sm: { container: 'h-20 w-20', text: 'text-xl', subtext: 'text-[10px]' },
    md: { container: 'h-28 w-28', text: 'text-3xl', subtext: 'text-xs' },
    lg: { container: 'h-36 w-36', text: 'text-4xl', subtext: 'text-sm' },
  };

  const getColor = (score: number) => {
    if (score >= 80) return { ring: 'from-emerald-400 to-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50' };
    if (score >= 60) return { ring: 'from-indigo-400 to-blue-600', text: 'text-indigo-700', bg: 'bg-indigo-50' };
    if (score >= 40) return { ring: 'from-amber-300 to-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' };
    return { ring: 'from-rose-300 to-rose-600', text: 'text-rose-700', bg: 'bg-rose-50' };
  };

  const color = getColor(score);
  const { container, text: textSize, subtext } = sizes[size];

  return (
    <div className="flex flex-col items-center">
      <div className={`rounded-full bg-gradient-to-br p-[3px] ${color.ring}`}>
        <div className={`${container} ${color.bg} flex rounded-full flex-col items-center justify-center`}>
        <span className={`${textSize} font-bold ${color.text}`}>{score}</span>
        <span className={`${subtext} ${color.text} opacity-75`}>out of 100</span>
        </div>
      </div>
      {label && <p className="mt-2 text-sm font-medium text-slate-700">{label}</p>}
    </div>
  );
}
