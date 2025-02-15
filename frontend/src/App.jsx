import React from 'react'
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Signup from './page/signup';
import Login from './page/login';
import { ToastContainer,  } from 'react-toastify';
import Board from './page/Board';
import PrivateRoute from './components/PrivateRoute';
import Headers from './components/headers';


const App = () => {
  return (
<BrowserRouter>
<ToastContainer />
<Headers/>
<Routes>
<Route path='/' element={<Login/>}/>

  <Route path='/signup' element={<Signup/>}/>

  <Route  element={<PrivateRoute/>}>
  <Route path='/home' element={<Board/>}/>
  
  </Route>
</Routes>

</BrowserRouter>
  )
}

export default App
