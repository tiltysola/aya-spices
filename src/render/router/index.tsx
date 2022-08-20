import { Navigate, Route, Routes } from 'react-router-dom';

import IndexPage from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Setting from '@/pages/Setting';
import Tray from '@/pages/Tray';
import Layout from '@/components/Layout';

const Index = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/app" />} />
      <Route path="/app" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="setting" element={<Setting />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/tray" element={<Tray />} />
    </Routes>
  );
};

export default Index;
