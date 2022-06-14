import { FC, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { routes, IPublic } from './route/routes';
import Error from './components/Modules/Warning/Error';
import './App.scss';
import Header from './components/Modules/Header';

const App: FC = () => {
  return (    
    <div className='app'>
      <Header />
      <Routes>
        {routes.public.map(({ path, component: Component }: IPublic, idx: number) => 
          <Route path={path} key={`${idx} -${path}`} element={<Component />} />
        )}
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
