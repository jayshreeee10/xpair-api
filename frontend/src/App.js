import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AttributesPage from './pages/AttributesPage';
import XpairsPage from './pages/XpairsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="attributes" element={<AttributesPage />} />
        <Route path="xpairs/*" element={<XpairsPage />} />
        <Route path="*" element={<div>Route not found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
