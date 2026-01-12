import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => {
  const headers: HeadersInit = {};
  if (process.env.REACT_APP_GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.REACT_APP_GITHUB_TOKEN}`;
  }
  return fetch(url, { headers }).then((res) => res.json());
};

interface Props {
  owner: string;
  repo: string;
}

export default function GitHubRepoItem({ owner, repo }: Props) {
  const { data: repoData } = useSWR(`https://api.github.com/repos/${owner}/${repo}`, fetcher);
  const { data: release } = useSWR(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, fetcher);

  if (!repoData) {
    return (
      <a href={`https://github.com/${owner}/${repo}`} className="github-repo md-source" target="_blank" rel="noopener noreferrer" title="GitHub repository">
        <div className="md-source__icon md-icon"></div>
        <div className="md-source__repository">{owner}/{repo}</div>
      </a>
    );
  }

  return (
    <a href={`https://github.com/${owner}/${repo}`} className="github-repo md-source" target="_blank" rel="noopener noreferrer" title="GitHub repository">
      <div className="md-source__icon md-icon"></div>
      <div className="md-source__repository md-source__repository--active">
        {owner}/{repo}
        <ul className="md-source__facts">
          {release && (
            <li className="md-source__fact md-source__fact--version">
              {release?.tag_name ?? 'v2.5.8'}
            </li>
          )}
          <li className="md-source__fact md-source__fact--stars">
            {repoData?.stargazers_count?.toLocaleString() ?? '126'}
          </li>
          <li className="md-source__fact md-source__fact--forks">
            {repoData?.forks_count?.toLocaleString() ?? '32'}
          </li>
        </ul>
      </div>
    </a>
  );
}
