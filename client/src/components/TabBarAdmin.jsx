import { useNavigate, useLocation } from 'react-router-dom';
import { cores, fontes, raios } from '../theme';

function TabBarAdmin() {
    const navigate = useNavigate();
    const location = useLocation();

    const abas = [
        { rota: '/admin/dashboard', label: 'Dashboard' },
        { rota: '/admin/agendamentos', label: 'Agenda' },
        { rota: '/admin/barbeiros', label: 'Barbeiros' },
        { rota: '/admin/servicos', label: 'Serviços' },
        { rota: '/admin/clientes', label: 'Clientes' },
    ];

    return (
        <div className="bf-tabbar" style={estilos.tabBar}>
            {abas.map((aba) => {
                const ativo = location.pathname === aba.rota;
                return (
                    <button
                        key={aba.rota}
                        onClick={() => navigate(aba.rota)}
                        style={{
                            ...estilos.aba,
                            color: ativo ? cores.dourado : cores.textoSecundario,
                        }}
                    >
                        <span style={{
                            fontSize: '11px',
                            fontWeight: ativo ? 700 : 500,
                            letterSpacing: '0.02em',
                        }}>{aba.label}</span>
                        {ativo && <span style={estilos.marcador} />}
                    </button>
                );
            })}
        </div>
    );
}

const estilos = {
    tabBar: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(17, 19, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        borderTop: `1px solid ${cores.linha}`,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0 14px',
        zIndex: 100,
    },
    aba: {
        background: 'none',
        border: 'none',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        position: 'relative',
        padding: '6px 8px',
        transition: 'color 0.2s',
    },
    marcador: {
        position: 'absolute',
        top: 0,
        width: '20px',
        height: '2px',
        borderRadius: '2px',
        backgroundColor: cores.dourado,
    },
};

export default TabBarAdmin;