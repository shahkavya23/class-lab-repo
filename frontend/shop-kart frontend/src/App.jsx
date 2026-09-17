import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Products.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'




function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
          <Route path="/home" element=
          {
          <ProtectedRoute>
          <Home />
          </ProtectedRoute>
          } />

          <Route path = "/products" element = {<Product/>}/>
          
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App