import type { DetailCardData } from '../../types/wedding';

interface DetailCardProps {
  detail: DetailCardData;
}

export function DetailCard({ detail }: DetailCardProps) {
  return (
    <div className="border border-gold/30 py-10 px-[30px] relative bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))] transition-[transform,box-shadow] duration-[400ms] ease hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(201,168,76,0.12)]">
      <span className="text-[28px] mb-4 block opacity-60">{detail.icon}</span>
      <p className="font-display text-[9px] tracking-[0.5em] text-gold uppercase mb-3">{detail.label}</p>
      <h3 className="font-script text-[32px] text-gold-deep mb-2.5">{detail.title}</h3>
      <p className="text-[15px] font-light leading-[1.8] text-[#4a3820]">
        {detail.lines.map((line, index) => (
          <span key={`${index}-${line}`}>
            {line}
            <br />
          </span>
        ))}
        {detail.time && (
          <>
            <br />
            <strong className="font-display text-[11px] tracking-[0.3em] text-gold">{detail.time}</strong>
          </>
        )}
        {detail.note && (
          <>
            <br />
            <em className="text-[13px] opacity-70">
              {detail.note}
              {detail.code && <strong>{` ${detail.code}`}</strong>}
            </em>
          </>
        )}
      </p>
    </div>
  );
}
