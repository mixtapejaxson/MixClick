interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
}

const GITHUB_REPO_OWNER = 'mixtapejaxson';
const GITHUB_REPO_NAME = 'MixClick';
const LAST_SEEN_VERSION_COOKIE = 'lastSeenVersion';

/**
 * Fetch the latest release from GitHub
 */
export async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`
    );
    
    if (!response.ok) {
      console.error('Failed to fetch latest release:', response.statusText);
      return null;
    }
    
    const release: GitHubRelease = await response.json();
    return release;
  } catch (error) {
    console.error('Error fetching latest release:', error);
    return null;
  }
}

/**
 * Get the last seen version from localStorage
 */
export function getLastSeenVersion(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_SEEN_VERSION_COOKIE);
}

/**
 * Set the last seen version in localStorage
 */
export function setLastSeenVersion(version: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_SEEN_VERSION_COOKIE, version);
}

/**
 * Check if there's a new release available
 */
export async function checkForNewRelease(): Promise<{ isNewRelease: boolean; release: GitHubRelease | null }> {
  const latestRelease = await fetchLatestRelease();
  
  if (!latestRelease) {
    return { isNewRelease: false, release: null };
  }
  
  const lastSeenVersion = getLastSeenVersion();
  
  // If no version has been seen before, or if the latest version is different from the last seen version
  const isNewRelease = !lastSeenVersion || lastSeenVersion !== latestRelease.tag_name;
  
  return { isNewRelease, release: latestRelease };
}
