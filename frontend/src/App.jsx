import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AIKeyProvider } from './context/AIKeyContext'
import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AIKeyProvider>
          <Navbar />

          <AppRoutes />

          <Footer />
        </AIKeyProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
