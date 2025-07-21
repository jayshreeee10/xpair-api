import { Routes, Route } from 'react-router-dom';
import XpairList from '../components/xpairs/XpairList';
import XpairOverview from '../components/xpairs/XpairOverview';

const XpairsPage = () => {
  return (
        <Routes>
      <Route index element={<XpairOverview />} />
      <Route path=":ioId" element={<XpairList />} />
    </Routes>
  );
};

export default XpairsPage;