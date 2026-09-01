import { useEffect, useRef, useState } from 'react'

/** Adds .is-visible when the element scrolls into view (one-shot). */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export interface Repo {
  name: string
  html_url: string
  description: string | null
  language: string | null
  topics?: string[]
}

/**
 * Fetches public repos from the GitHub API with a graceful fallback
 * to a static, verified list when the API is unavailable or rate-limited.
 */
export function useGithubRepos(username: string, fallback: Repo[]) {
  const [repos, setRepos] = useState<Repo[]>(fallback)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 6000)
    fetch(`https://api.github.com/users/${username}/repos?per_page=6&sort=updated`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Repo[]) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setRepos(
            data.map((r) => ({
              name: r.name,
              html_url: r.html_url,
              description: r.description,
              language: r.language,
            })),
          )
          setLive(true)
        }
      })
      .catch(() => {
        /* keep fallback */
      })
      .finally(() => clearTimeout(timer))
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [username])

  return { repos, live }
}
