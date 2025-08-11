import Image from "next/image";
import Link from "next/link";

interface SectionHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  overlayClassName?: string;
}

export default function SectionHero({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  primaryCta,
  secondaryCta,
  overlayClassName = "bg-black/50",
}: SectionHeroProps) {
  return (
    <section className="relative isolate min-h-[50vh] sm:min-h-[56vh] md:min-h-[60vh] flex items-end">
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        <div className={`absolute inset-0 ${overlayClassName}`} />
      </div>

      <div className="w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
          <div className="max-w-2xl">
            {eyebrow && (
              <div className="mb-3 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                {eyebrow}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-white/85 text-base sm:text-lg md:text-xl">
                {subtitle}
              </p>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
                  >
                    {primaryCta.label}
                  </Link>
                )}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex items-center justify-center rounded-lg border border-white/60 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
                  >
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
