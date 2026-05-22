import { type CSSProperties, type ReactNode, useEffect, useRef } from "react"

type ScrollFadeProps = {
  children: ReactNode
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

function ScrollFade({ children }: ScrollFadeProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return undefined
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (reducedMotion.matches) {
      element.style.opacity = "1"
      element.style.transform = "none"
      return undefined
    }

    let frame = 0

    const update = () => {
      frame = 0

      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = viewportHeight / 2
      const distance = Math.abs(elementCenter - viewportCenter)
      const fadeStart = viewportHeight * 0.18
      const fadeEnd = viewportHeight * 0.82
      const progress = clamp(1 - (distance - fadeStart) / (fadeEnd - fadeStart), 0, 1)
      const direction = elementCenter < viewportCenter ? -1 : 1
      const opacity = 0.28 + progress * 0.72
      const translateY = direction * (1 - progress) * 28

      element.style.opacity = opacity.toFixed(3)
      element.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`
    }

    const requestUpdate = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [])

  return (
    <div
      className="scroll-fade-section"
      ref={elementRef}
      style={{ "--scroll-fade-opacity": 1 } as CSSProperties}
    >
      {children}
    </div>
  )
}

export default ScrollFade
