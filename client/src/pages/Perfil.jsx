import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/TabBar';
import TabBarBarbeiro from '../components/TabBarBarbeiro';
import TabBarAdmin from '../components/TabBarAdmin';
import { cores, fontes, sombras, raios } from '../theme';

function Perfil() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    function iniciais(nome) {
        return nome
            ?.split(' ')
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase();
    }

    function renderizarTabBar() {
        if (usuario?.tipo === 'barbeiro') return <TabBarBarbeiro />;
        if (usuario?.tipo === 'admin') return <TabBarAdmin />;
        return <TabBar />;
    }

    return (
        <div style={estilos.container}>
            <div style={estilos.topo}>
                <div style={estilos.avatarGrande}>{iniciais(usuario?.nome)}</div>
                <h2 style={estilos.nome}>{usuario?.nome}</h2>
                <p style={estilos.tipoConta}>{usuario?.tipo}</p>
            </div>

            <div style={estilos.card}>
                <div style={estilos.linha}>
                    <span style={estilos.label}>Email</span>
                    <span style={estilos.valor}>{usuario?.email}</span>
                </div>
                <div style={{ ...estilos.linha, borderBottom: 'none' }}>
                    <span style={estilos.label}>Telefone</span>
                    <span style={estilos.valor}>{usuario?.telefone || '—'}</span>
                </div>
            </div>

            <button onClick={handleLogout} style={estilos.botaoSair}>
                Sair da conta
            </button>

            {renderizarTabBar()}
        </div>
    );
}

const estilos = {
    container: {
        minHeight: '100vh',
        backgroundColor: cores.fundo,
        fontFamily: fontes.corpo,
        padding: '28px 24px',
        paddingBottom: '100px',
        boxSizing: 'border-box',
    },
    topo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '28px',
    },
    avatarGrande: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: cores.superficieElevada,
        border: `2px solid ${cores.dourado}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '24px',
        fontWeight: 600,
        marginBottom: '14px',
    },
    nome: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '20px',
        fontWeight: 600,
        margin: 0,
    },
    tipoConta: {
        color: cores.textoSecundario,
        fontSize: '13px',
        textTransform: 'capitalize',
        marginTop: '4px',
    },
    card: {
        backgroundColor: cores.superficie,
        borderRadius: raios.lg,
        padding: '4px 20px',
        border: `1px solid ${cores.linha}`,
    },
    linha: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: `1px solid ${cores.linha}`,
    },
    label: {
        color: cores.textoSecundario,
        fontSize: '13px',
    },
    valor: {
        color: cores.texto,
        fontSize: '14px',
        fontWeight: 600,
    },
    botaoSair: {
        width: '100%',
        padding: '15px',
        marginTop: '24px',
        borderRadius: raios.md,
        border: `1px solid ${cores.perigo}`,
        backgroundColor: 'transparent',
        color: cores.perigo,
        fontSize: '14px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
};

export default Perfil;