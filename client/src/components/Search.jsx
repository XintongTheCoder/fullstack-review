import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [term, setTerm] = useState('');

  const onChange = (e) => {
    setTerm(e.target.value);
  };

  const search = () => {
    event.preventDefault();
    onSearch(term);
    setTerm('');
  };

  return (
    <div>
      <h4>Add more repos!</h4>
      Enter a github username:{' '}
      <input type="text" value={term} onChange={onChange} />
      <button onClick={search}> Add Repos </button>
    </div>
  );
};

export default Search;
