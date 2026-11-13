import type { ComponentType } from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { DressIcon, SuitIcon } from './AttireIcons';
import { CARD_CLASS, ICON_TILE_CLASS } from '../shared/styles';
import type { DressCodeData } from '../../types/wedding';

interface DressCodeSectionProps {
  dressCode: DressCodeData;
  eyebrow?: string;
  title?: string;
  menLabel?: string;
  womenLabel?: string;
  reservedColorLabel?: string;
}

function AttireItem({ Icon, label, attire }: { Icon: ComponentType<{ className?: string }>; label: string; attire: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={ICON_TILE_CLASS}>
        <Icon className="w-12 h-12" />
      </div>
      <p className="font-script text-[36px] text-gold-deep mt-4 leading-none">{label}</p>
      <p className="text-[19px] font-light text-[var(--text-body)] mt-2">{attire}</p>
    </div>
  );
}

export function DressCodeSection({
  dressCode,
  eyebrow = 'Etiqueta',
  title = 'Código de vestimenta',
  menLabel = 'Hombres',
  womenLabel = 'Mujeres',
  reservedColorLabel = 'Color reservado',
}: DressCodeSectionProps) {
  const { type, description, men, women, reservedColor } = dressCode;

  return (
    <section className="max-w-[920px] mx-auto text-center py-[100px] px-10 max-[640px]:px-6">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <p className="font-display text-[clamp(20px,3vw,26px)] tracking-[0.25em] uppercase text-gold-deep">{type}</p>
        {description && (
          <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic mt-3">
            {description}
          </p>
        )}

        {(men || women) && (
          <div className="flex justify-center gap-[clamp(32px,10vw,96px)] mt-12">
            {men && <AttireItem Icon={SuitIcon} label={menLabel} attire={men} />}
            {women && <AttireItem Icon={DressIcon} label={womenLabel} attire={women} />}
          </div>
        )}

        {reservedColor && (
          <div className={`max-w-[420px] mx-auto mt-14 p-5 ${CARD_CLASS}`}>
            <p className="font-script text-[32px] text-ivory bg-gold rounded-xl py-2 leading-tight">{reservedColorLabel}</p>
            <p className="text-[16px] font-light leading-[1.7] text-[var(--text-body)] mt-4 mb-1">
              {reservedColor.hex && (
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full border border-gold/50 align-[-2px] mr-1.5"
                  style={{ backgroundColor: reservedColor.hex }}
                />
              )}
              El color <strong className="font-semibold">{reservedColor.name}</strong> {reservedColor.description}
            </p>
          </div>
        )}
      </Reveal>
    </section>
  );
}
