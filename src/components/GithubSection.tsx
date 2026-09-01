import { profile } from '../data/content'
import { knownRepos } from '../data/projects'
import { useGithubRepos, type Repo } from '../hooks/hooks'
import { Section, Icons } from './ui'

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a className="repo-card" href={repo.html_url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
      <span className="repo-name">
        <Icons.github /> {repo.name}
      </span>
      <span className="repo-desc">{repo.description ?? 'No description provided.'}</span>
      <span className="repo-meta">
        {repo.language && (
          <span>
            <span className="lang-dot" aria-hidden="true" />
            {repo.language}
          </span>
        )}
        <span>view ↗</span>
      </span>
    </a>
  )
}

export function GithubSection() {
  const { repos, live } = useGithubRepos(profile.githubUser, knownRepos)
  return (
    <Section
      id="code"
      kicker="09 · Open Source"
      title="Code & Research"
      intro="Public repositories and open research implementations."
    >
      <div className="repo-grid">
        {repos.map((r) => (
          <RepoCard repo={r} key={r.name} />
        ))}
      </div>
      {!live && (
        <p className="repo-note">
          Live repository data unavailable (rate limit or offline) — showing verified static list.
        </p>
      )}
      <p className="repo-note">
        Additional project archives are added as they are released publicly.{' '}
        <a href={profile.github} target="_blank" rel="noreferrer">
          github.com/{profile.githubUser} ↗
        </a>
      </p>
    </Section>
  )
}
