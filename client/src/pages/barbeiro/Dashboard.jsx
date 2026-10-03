import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import TabBarBarbeiro from '../../components/TabBarBarbeiro';
import { cores, fontes, sombras, raios } from '../../theme';

function DashboardBarbeiro() {
    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const { usuario } = useAuth();

    useEffect(() => {
        async function carregarDashboard() {
            try {
                const resposta = await api.get('/barbeiro/dashboard');
                setDados(resposta.data);
            } catch (erro) {
                setErro('Não foi possível carregar o dashboard.');
            } finally {
                setCarregando(false);
            }
        }
        carregarDashboard();
    }, []);

    return (
        <div style={estilos.container}>
            <p style={estilos.saudacao}>Olá,</p>
            <h2 style={estilos.nome}>{usuario?.nome?.split(' ')[0]}</h2>

            {erro && <p style={estilos.erro}>{erro}</p>}

            {carregando ? (
                <p style={estilos.mensagem}>Carregando...</p>
            ) : (
                <div style={estilos.grid}>
                    <div style={estilos.card}>
                        <span style={estilos.numero}>{dados.clientesHoje}</span>
                        <span style={estilos.label}>Clientes hoje</span>
                    </div>
                    <div style={estilos.card}>
                        <span style={estilos.numero}>{dados.concluidos}</span>
                        <span style={estilos.label}>Concluídos</span>
                    </div>
                    <div style={estilos.card}>
                        <span style={estilos.numero}>{dados.aguardando}</span>
                        <span style={estilos.label}>Aguardando</span>
                    </div>
                    <div
                        style={{
                            ...estilos.card,
                            ...(dados.emAtendimento > 0 ? estilos.cardDestaque : {}),
                        }}
                    >
                        <span style={estilos.numero}>{dados.emAtendimento}</span>
                        <span style={estilos.label}>Em atendimento</span>
                        {dados.emAtendimento > 0 && <span style={estilos.pulso} />}
                    </div>
                </div>
            )}

            <TabBarBarbeiro />
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
    saudacao: { color: cores.textoSecundario, fontSize: '15px', margin: 0 },
    nome: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '28px',
        fontWeight: 600,
        margin: '2px 0 28px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
    },
    card: {
        position: 'relative',
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
    },
    cardDestaque: {
        border: `1px solid ${cores.dourado}`,
    },
    pulso: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${cores.dourado} 0%, ${cores.douradoEscuro} 100%)`,
    },
    numero: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '30px',
        fontWeight: 600,
    },
    label: {
        color: cores.textoSecundario,
        fontSize: '13px',
    },
    mensagem: {
        color: cores.textoSecundario,
        textAlign: 'center',
        marginTop: '40px',
    },
    erro: {
        color: cores.perigo,
        textAlign: 'center',
    },
};

export default DashboardBarbeiro;