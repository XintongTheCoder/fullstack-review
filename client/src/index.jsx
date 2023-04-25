import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const serverUrl = 'http://127.0.0.1:1128/repos';
  const [repos, setRepos] = useState([]);
  const popup = (msg) => {
    toast(msg);
  };

  const fetchRepos = (successCB, errorCB = null) => {
    $.ajax({
      url: serverUrl,
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        successCB(data);
      },
      error:
        errorCB ||
        ((error) => {
          console.error('Failed to fetch repos', error);
        }),
    });
  };

  useEffect(() => {
    fetchRepos(setRepos);
  }, []);

  const search = (term, successCB = setRepos, errorCB = null) => {
    $.ajax({
      url: serverUrl,
      type: 'POST',
      data: JSON.stringify({ username: term }),
      contentType: 'application/json',
      success: (data) => {
        successCB(data);
      },
      error:
        errorCB ||
        ((error) => {
          console.error('Failed to search username', term, error);
          const popupMessage = `Failed to search username ${term}`;
          popup(popupMessage);
        }),
    });
    console.log(`${term} was searched`);
  };

  return (
    <div>
      <h1>Github Fetcher</h1>
      <Search onSearch={search} />
      <ToastContainer></ToastContainer>
      <RepoList repos={repos} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
