import { Routes, Route } from 'react-router-dom'
import HomePage from './pages'
import EquipePage from './pages/equipe'
import AvaliarPage from './pages/avaliar/[id]'
import ResultadosPage from './pages/resultados'

function App() {

  return (
    <Routes>
      <Route path='/' element={ <HomePage /> } />
      <Route path="/equipe" element={<EquipePage />} />
      <Route path="/avaliar/:id" element={<AvaliarPage />} />
      <Route path="/resultados" element={<ResultadosPage />} />
    </Routes>
  )
}

export default App
