import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { WelcomeArt } from '@/components/onboarding/WelcomeIllustration'
import { welcomeSlides } from '@/components/onboarding/welcomeSlides'
import { Button } from '@/components/ui/Button'
import { KovaLogo } from '@/components/ui/KovaLogo'
import { PagerDots } from '@/components/ui/PagerDots'
import { Screen } from '@/components/ui/Screen'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'

export default function WelcomePage() {
  const navigate = useNavigate()
  const install = useInstallPrompt()
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // The carousel is a native horizontal scroller with CSS scroll-snap (smooth, swipeable,
  // no library). We just work out which slide is showing from the scroll position.
  const onScroll = () => {
    const track = trackRef.current
    if (track) setActive(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <Screen
      footer={
        <>
          <Button onClick={() => navigate('/onboarding/create')}>Create a new wallet</Button>
          <Button variant="secondary" onClick={() => navigate('/onboarding/import')}>
            I already have a wallet
          </Button>
          {install.canInstall && (
            <Button variant="ghost" icon="import" onClick={install.install}>
              Install the Kova app
            </Button>
          )}
        </>
      }
    >
      <div className="pt-3">
        <KovaLogo />
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory overflow-x-auto"
        aria-roledescription="carousel"
      >
        {welcomeSlides.map((slide, i) => (
          <section
            key={slide.title}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${welcomeSlides.length}`}
            className="flex w-full shrink-0 snap-center flex-col gap-7 px-5"
          >
            <WelcomeArt slide={i} />
            <div className="flex flex-col gap-2">
              <h1 className="text-h1 font-bold">{slide.title}</h1>
              <p className="text-text-muted">{slide.body}</p>
            </div>
          </section>
        ))}
      </div>

      <PagerDots count={welcomeSlides.length} active={active} />
    </Screen>
  )
}
