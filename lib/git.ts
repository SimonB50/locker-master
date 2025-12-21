import commitInfo from 'git-commit-info';

const remote = 'SimonB50/locker-master';
const checkUpdates = async () => {
  try {
    const localInfo = commitInfo();
    if (!localInfo.hash) return null;
    const response = await fetch(`https://api.github.com/repos/${remote}/commits/main`).catch(() => null);
    if (!response || !response.ok) return null;
    const remoteInfo = await response.json();
    if (localInfo.hash === remoteInfo.sha) return null;
    if (!remoteInfo.files.some((file: { filename: string }) => !file.filename.endsWith('.md'))) return null;
    return {
      local: {
        hash: localInfo.hash,
        date: localInfo.date ? new Date(localInfo.date).toISOString() : new Date().toISOString(),
        message: localInfo.message,
      },
      remote: {
        hash: remoteInfo.sha,
        date: new Date(remoteInfo.commit.author.date).toISOString(),
        message: remoteInfo.commit.message,
      }
    };
  } catch (error) {
    console.error('Error fetching commit info:', error);
    return null;
  }
}

export { checkUpdates };