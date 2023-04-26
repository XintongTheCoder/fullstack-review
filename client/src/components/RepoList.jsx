import React from 'react';

const RepoList = ({ repos }) => (
  <div>
    <h4> Repo List Component </h4>
    <div>There are {repos?.length ?? 0} repos.</div>
    <div className="repo-list">
      {repos?.length &&
        repos.map((repo, index) => (
          <div className="repo-container" key={index}>
            <div>repo_id: {repo.repo_id}</div>
            <a href={repo.repo_url}>name: {repo.name}</a>
            <div>repo_url: {repo.repo_url}</div>
            <div>description: {repo.description}</div>
            <div>owner: {repo.owner}</div>
            <div>owner_url: {repo.owner_url}</div>
            <div>private: {repo.private.toString()}</div>
            <div>created_at: {repo.created_at}</div>
            <div>updated_at: {repo.updated_at}</div>
            <div>size: {repo.size}</div>
            <div>watchers: {repo.watchers}</div>
            <div>forks: {repo.forks}</div>
          </div>
        ))}
    </div>
  </div>
);

export default RepoList;
