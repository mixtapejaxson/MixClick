async function checkAndUpdateReleaseNotes() {
  const repoOwner = 'mixtapejaxson'; 
  const repoName = 'MixClick'; 
  const currentVersion = '1.0.0'; 

  // Function to fetch the latest release notes from GitHub API
  async function fetchLatestReleaseNotes(repoOwner, repoName) {
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      const release = await response.json();
      return {
        version: release.tag_name,
        notes: release.body
      };
    } catch (error) {
      console.error('Failed to fetch release notes:', error);
      return null;
    }
  }

  // Function to display release notes in a modal
  function displayReleaseNotes(version, notes) {
    const modal = document.createElement('div');
    modal.classList.add('update-modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('update-modal-content');

    const versionHeader = document.createElement('h2');
    versionHeader.textContent = `New Update: Version ${version}`;
	versionHeader.classList.add('update-version-header');
    modalContent.appendChild(versionHeader);

    const notesContainer = document.createElement('div');
    notesContainer.classList.add('update-notes-container');
    // Replace newlines with <br> tags for line breaks
    notesContainer.innerHTML = notes.replace(/\n/g, '<br>');
    modalContent.appendChild(notesContainer);

    // Button container for close and view release notes buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('update-button-container');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.marginTop = '10px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => modal.remove();
	closeButton.classList.add('update-close-button');
    // View Full Release Notes button
    const viewReleaseNotesButton = document.createElement('button');
    viewReleaseNotesButton.textContent = 'View Full Release Notes';
    viewReleaseNotesButton.classList.add('update-close-button'); // Use same style as close button
    viewReleaseNotesButton.onclick = () => window.open(`https://github.com/mixtapejaxson/MixClick/releases/tag/${version}`, '_blank');
    buttonContainer.appendChild(viewReleaseNotesButton);

    buttonContainer.appendChild(closeButton);

    modalContent.appendChild(buttonContainer);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }

  // Get the last seen version from localStorage
  const lastSeenVersion = localStorage.getItem('lastSeenVersion') || '0.0.0';

  // Fetch the latest release notes
  const latestRelease = await fetchLatestReleaseNotes(repoOwner, repoName);

  if (latestRelease) {
    const { version, notes } = latestRelease;

    // Compare the current version with the last seen version
    if (version !== lastSeenVersion) {
      // Display the release notes
      displayReleaseNotes(version, notes);

      // Update the last seen version in localStorage
      localStorage.setItem('lastSeenVersion', version);
    }
  }
}

// Call the function to check and update release notes on page load
window.addEventListener('load', checkAndUpdateReleaseNotes);
