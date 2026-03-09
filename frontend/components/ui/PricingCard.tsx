import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  subtitle: string;
  price: string;
  ctaLabel: string;
  features: string[];
  ctaHref?: string;
  onClick?: () => void;
  disabled?: boolean;
  highlighted?: boolean;
  badge?: string;
}

export default function PricingCard({
  name,
  subtitle,
  price,
  ctaLabel,
  features,
  ctaHref,
  onClick,
  disabled = false,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <article
      className={`relative rounded-2xl border p-8 shadow-sm ${
        highlighted
          ? 'border-indigo-400 bg-gradient-to-b from-indigo-600 to-blue-700 text-white shadow-xl'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      {badge && (
        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            highlighted ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
          }`}
        >
          {badge}
        </span>
      )}
      <h3 className="text-2xl font-bold">{name}</h3>
      <p className={`mt-1 text-sm ${highlighted ? 'text-indigo-100' : 'text-slate-500'}`}>{subtitle}</p>
      <p className="mt-6 text-4xl font-extrabold">{price}<span className={`text-base font-medium ${highlighted ? 'text-indigo-100' : 'text-slate-500'}`}>/month</span></p>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check className={`mt-0.5 h-4 w-4 ${highlighted ? 'text-indigo-100' : 'text-emerald-600'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {onClick ? (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`mt-8 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            disabled
              ? `${highlighted ? 'bg-white/50 text-indigo-700/50' : 'bg-slate-200 text-slate-400'}`
              : highlighted
                ? 'bg-white text-indigo-700 hover:bg-indigo-50'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {ctaLabel}
        </button>
      ) : (
        <Link
          href={ctaHref || '#'}
          className={`mt-8 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            highlighted ? 'bg-white text-indigo-700 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {ctaLabel}
        </Link>
      )}
    </article>
  );
}
