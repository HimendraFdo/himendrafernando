import { useEffect, useRef } from "react"

function DynamicBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const background = backgroundRef.current

    if (!background) {
      return undefined
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (reducedMotion.matches) {
      return undefined
    }

    let frame = 0

    const update = () => {
      frame = 0

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight || 1
      const progress = Math.min(window.scrollY / maxScroll, 1)

      background.style.setProperty("--bg-scroll", progress.toFixed(4))
      background.style.setProperty("--bg-shift", `${(progress * 120).toFixed(2)}px`)
      background.style.setProperty("--bg-drift", `${(progress * 42).toFixed(2)}px`)
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
    <div aria-hidden="true" className="dynamic-background" ref={backgroundRef} />
  )
}

export default DynamicBackground
