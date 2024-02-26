import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import HomePage from './Pages/HomePage'
import EditForm from './Components/EditForm';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add" element={<EditForm />} />
    </Routes>
  </Router>
  )
}


export default App
