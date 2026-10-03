import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Servicos from './pages/Servicos';
import Barbeiros from './pages/Barbeiros';
import Horario from './pages/Horario';
import Confirmacao from './pages/Confirmacao';
import MeusAgendamentos from './pages/MeusAgendamentos';
import Perfil from './pages/Perfil';
import Fila from './pages/Fila';
import AgendaBarbeiro from './pages/barbeiro/Agenda';
import Atendimento from './pages/barbeiro/Atendimento';
import DashboardBarbeiro from './pages/barbeiro/Dashboard';
import HistoricoBarbeiro from './pages/barbeiro/Historico';
import DashboardAdmin from './pages/admin/Dashboard';
import GestaoBarbeiros from './pages/admin/Barbeiros';
import GestaoServicos from './pages/admin/Servicos';
import ListaClientes from './pages/admin/Clientes';
import AgendamentosGerais from './pages/admin/Agendamentos';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/servicos" element={<Servicos />} />
      <Route path="/barbeiros" element={<Barbeiros />} />
      <Route path="/horario" element={<Horario />} />
      <Route path="/confirmacao" element={<Confirmacao />} />
      <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/fila" element={<Fila />} />
      <Route path="/barbeiro/agenda" element={<AgendaBarbeiro />} />
      <Route path="/barbeiro/atendimento/:id" element={<Atendimento />} />
      <Route path="/barbeiro/dashboard" element={<DashboardBarbeiro />} />
      <Route path="/barbeiro/historico" element={<HistoricoBarbeiro />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/admin/barbeiros" element={<GestaoBarbeiros />} />
      <Route path="/admin/servicos" element={<GestaoServicos />} />
      <Route path="/admin/clientes" element={<ListaClientes />} />
      <Route path="/admin/agendamentos" element={<AgendamentosGerais />} />
    </Routes>
  );
}

export default App;