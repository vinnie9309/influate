import { use } from "react"
import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import type { Locale } from "@/i18n/routing"
import CheckList from "@/components/CheckList"
import HeroAnimation from "@/components/HeroAnimation"
import { Button } from "@/components/ui"

const STEPS = [1, 2, 3, 4] as const

export default function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  setRequestLocale(use(params).locale)
  const t = useTranslations("Home")

  return (
    <main>
      <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-6 pb-24 pt-12">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <span className="self-start rounded-full bg-brand-soft px-3 py-1.5 text-[13px] font-semibold text-brand-dark">
            {t("badge")}
          </span>
          <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-[60px]">
            {t("title")} <span className="text-brand">{t("titleAccent")}</span>
          </h1>
          <p className="max-w-[520px] text-[19px] leading-relaxed text-body">{t("intro")}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup?role=creator" size="lg">
              {t("ctaCreator")}
            </Button>
            <Button href="/signup?role=brand" size="lg" variant="outline">
              {t("ctaBrand")}
            </Button>
          </div>
          <p className="text-sm text-muted">{t("freeNote")}</p>
        </div>
        <div className="min-w-0 flex-[1_1_480px]">
          <HeroAnimation />
        </div>
      </section>

      <section id="how" className="scroll-mt-6 border-y border-line bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-[88px]">
          <div className="flex max-w-[640px] flex-col gap-3">
            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">{t("howEyebrow")}</span>
            <h2 className="text-[34px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[40px]">{t("howTitle")}</h2>
          </div>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {STEPS.map((step) => (
              <li key={step} className="flex flex-col gap-3 rounded-[18px] bg-paper p-7">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-extrabold ${
                    step === STEPS.length ? "bg-sun-soft text-sun-ink" : "bg-brand-soft text-brand-dark"
                  }`}
                >
                  {step}
                </span>
                <h3 className="text-[19px] font-bold">{t(`step${step}Title`)}</h3>
                <p className="text-[15px] leading-relaxed text-body">{t(`step${step}Text`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5 px-6 py-[88px]">
        <div id="creators" className="flex scroll-mt-6 flex-col gap-[18px] rounded-3xl bg-brand-soft p-10">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em]">{t("forCreatorsTitle")}</h2>
          <CheckList
            items={[t("forCreators1"), t("forCreators2"), t("forCreators3")]}
            iconClass="text-brand"
            textClass="text-[#24332D]"
          />
          <Button href="/signup?role=creator" className="self-start">
            {t("createCreator")}
          </Button>
        </div>
        <div id="brands" className="flex scroll-mt-6 flex-col gap-[18px] rounded-3xl bg-ink p-10 text-paper">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em]">{t("forBrandsTitle")}</h2>
          <CheckList items={[t("forBrands1"), t("forBrands2"), t("forBrands3")]} iconClass="text-sun" textClass="text-[#D8E2DD]" />
          <Button href="/signup?role=brand" variant="outline" className="self-start">
            {t("createBrand")}
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-[88px]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-brand px-10 py-14 text-white">
          <h2 className="max-w-[560px] text-[32px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[36px]">
            {t("ctaTitle")}
          </h2>
          <Button href="/signup" size="lg" variant="outline">
            {t("ctaButton")}
          </Button>
        </div>
      </section>
    </main>
  )
}
