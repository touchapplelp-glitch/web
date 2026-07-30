
import { Routes, Route } from 'react-router-dom';
import MainContext from '../shared/MainContext.jsx';
import ItemDetailContainer from '../shared/ItemDetail/ItemDetailContainer';
import AboutUs from '../AboutUs.jsx';
import CheckOut from '../CheckOut/CheckOut.jsx';
import Offers from '../shared/Offers.jsx';
import AdminPage from '../admin/AdminPage.jsx';


export const AppRoutes = () => {


  return (
   
    <Routes>
      <Route path='/' element={<MainContext/>}/>
      <Route path='/:categoryId' element={<MainContext/>}/>
      <Route path='/item/:slug' element={<ItemDetailContainer/>}/>
      <Route path='/sobreNosotros' element={<AboutUs/>}/> 
      <Route path='/checkout' element={<CheckOut/>}/>
      <Route path='/Ofertas' element={<Offers/>}/>
      <Route path='/admin' element={<AdminPage />}/>
    </Routes>
  );
};
