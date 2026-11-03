import { Check } from "lucide-react"
import HeroAnimation from "@/components/HeroAnimation"
import { Button } from "@/components/ui"

const steps = [
  { title: "Create your profile", text: "Creators add platforms, niche and audience. Brands add industry and who they want to reach." },
  { title: "Find a fit", text: "Browse by category, audience and platform. Send a connect request with a short note." },
  { title: "Exchange contacts", text: "Contact details unlock only when both sides accept. No cold DMs, no spam." },
  { title: "Track the partnership", text: "Log the affiliate code and the results it brings, and see earnings on your dashboard." }
] as const

const forCreators = [
  "Get found by brands in your niche, even with a small audience",
  "Keep all your affiliate codes and earnings in one place",
  "Decide who sees your contact details"
] as const

const forBrands = [
  "Filter creators by category, audience age and platform",
  "See revenue per creator and per code",
  "Tell creators what you sell and who you want to reach"
] as const

function CheckList({ items, iconClass, textClass }: { items: readonly string[]; iconClass: string; textClass: string }) {
  return (
    <ul className={`flex flex-col gap-3 text-base leading-normal ${textClass}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <Check aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  return (
    <main>
      <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-6 pb-24 pt-12">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <span className="self-start rounded-full bg-brand-soft px-3 py-1.5 text-[13px] font-semibold text-brand-dark">
            A marketplace for growing creators and the brands that fit them
          </span>
          <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-[60px]">
            Find partners who fit. <span className="text-brand">Track what they earn.</span>
          </h1>
          <p className="max-w-[520px] text-[19px] leading-relaxed text-body">
            Creators build a profile and get discovered by companies in their niche. Brands find the right voices,
            connect, and see what every affiliate code brings in — away from the noise of your feeds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup?role=creator" size="lg">
              I&apos;m a creator
            </Button>
            <Button href="/signup?role=brand" size="lg" variant="outline">
              I&apos;m a brand
            </Button>
          </div>
          <p className="text-sm text-muted">Free to join. Contacts are shared only when both sides accept.</p>
        </div>
        <div className="min-w-0 flex-[1_1_480px]">
          <HeroAnimation />
        </div>
      </section>

      <section id="how" className="scroll-mt-6 border-y border-line bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-[88px]">
          <div className="flex max-w-[640px] flex-col gap-3">
            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">How it works</span>
            <h2 className="text-[34px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[40px]">
              From profile to partnership in four steps
            </h2>
          </div>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {steps.map(({ title, text }, i) => (
              <li key={title} className="flex flex-col gap-3 rounded-[18px] bg-paper p-7">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-extrabold ${
                    i === steps.length - 1 ? "bg-sun-soft text-sun-ink" : "bg-brand-soft text-brand-dark"
                  }`}
                >
                  {i + 1}
                </span>
                <h3 className="text-[19px] font-bold">{title}</h3>
                <p className="text-[15px] leading-relaxed text-body">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5 px-6 py-[88px]">
        <div id="creators" className="flex scroll-mt-6 flex-col gap-[18px] rounded-3xl bg-brand-soft p-10">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em]">For creators</h2>
          <CheckList items={forCreators} iconClass="text-brand" textClass="text-[#24332D]" />
          <Button href="/signup?role=creator" className="self-start">
            Create a creator profile
          </Button>
        </div>
        <div id="brands" className="flex scroll-mt-6 flex-col gap-[18px] rounded-3xl bg-ink p-10 text-paper">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em]">For brands</h2>
          <CheckList items={forBrands} iconClass="text-sun" textClass="text-[#D8E2DD]" />
          <Button href="/signup?role=brand" variant="outline" className="self-start">
            Create a brand profile
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-[88px]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-brand px-10 py-14 text-white">
          <h2 className="max-w-[560px] text-[32px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[36px]">
            Your next partnership is one profile away.
          </h2>
          <Button href="/signup" size="lg" variant="outline">
            Create a free profile
          </Button>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-4 px-6 py-7 text-sm text-muted">
          <span>© Influate</span>
          <span>Partnerships for growing creators and brands</span>
        </div>
      </footer>
    </main>
  )
}
