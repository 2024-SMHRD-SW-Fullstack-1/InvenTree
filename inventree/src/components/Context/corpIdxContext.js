import React, { createContext, useState } from 'react';

const initialCorpIdx = localStorage.getItem('CorpIdx') || ''; // 초기에 localStorage에서 CorpIdx 값을 가져옴

export const corpIdxContext = createContext({
  CorpIdx: initialCorpIdx,
  updateCorpIdx: () => {},
});

export const CorpIdxProvider = ({ children }) => {
  const [CorpIdx, setCorpIdx] = useState(initialCorpIdx);

  const updateCorpIdx = (newCorpIdx) => {
    setCorpIdx(newCorpIdx);
    localStorage.setItem('CorpIdx', newCorpIdx); // localStorage에 CorpIdx 값을 저장
  };

  return (
    <corpIdxContext.Provider value={{ CorpIdx, updateCorpIdx }}>
      {children}
    </corpIdxContext.Provider>
  );
};
