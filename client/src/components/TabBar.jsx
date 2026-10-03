import { useNavigate, useLocation } from 'react-router-dom';
import { cores, fontes, raios } from '../theme';

function TabBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const abas = [
        { rota: '/home', label: 'Home', icon: '⌂' },
        { rota: '/servicos', label: 'Agendar', icon: '✂' },
        { rota: '/meus-agendamentos', label: 'Agenda', icon: '☰' },
        { rota: '/perfil', label: 'Perfil', icon: '◎' },
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
                            ...estilos.iconWrap,
                            background: ativo ? 'rgba(232,197,71,0.12)' : 'transparent',
                        }}>
                            {aba.icon}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: ativo ? 700 : 500 }}>{aba.label}</span>
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
        padding: '10px 0 14px',
        zIndex: 100,
    },
    aba: {
        background: 'none',
        border: 'none',
        fontSize: '12px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        position: 'relative',
        padding: '4px 12px',
        transition: 'color 0.2s',
    },
    iconWrap: {
        width: '36px',
        height: '28px',
        borderRadius: raios.sm,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        transition: 'background 0.2s',
    },
    marcador: {
        position: 'absolute',
        top: 0,
        width: '16px',
        height: '2px',
        borderRadius: '2px',
        backgroundColor: cores.dourado,
    },
};

export default TabBar;