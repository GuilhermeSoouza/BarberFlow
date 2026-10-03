import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import TabBarAdmin from '../../components/TabBarAdmin';
import { cores, fontes, sombras, raios } from '../../theme';

function DashboardAdmin() {
    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const { usuario } = useAuth();

    useEffect(() => {
        async function carregarDashboard() {
            try {
                const resposta = await api.get('/admin/dashboard');
                setDados(resposta.data);
            } catch (erro) {
                setErro('Não foi possível carregar o dashboard.');
            } finally {
                setCarregando(false);
            }
        }
        carregarDashboard();
    }, []);

    function formatarMoeda(valor) {
        return `R$ ${Number(valor).toFixed(2)}`;
    }

    return (
        <div style={estilos.container}>
            <p style={estilos.saudacao}>Olá,</p>
            <h2 style={estilos.nome}>{usuario?.nome?.split(' ')[0]}</h2>

            {erro && <p style={estilos.erro}>{erro}</p>}

            {carregando ? (
                <p style={estilos.mensagem}>Carregando...</p>
            ) : (
                <>
                    <div style={estilos.grid}>
                        <div style={estilos.card}>
                            <span style={estilos.numero}>{formatarMoeda(dados.faturamento)}</span>
                            <span style={estilos.label}>Faturamento do mês</span>
                        </div>
                        <div style={estilos.card}>
                            <span style={estilos.numero}>{dados.atendimentos}</span>
                            <span style={estilos.label}>Atendimentos</span>
                        </div>
                        <div style={estilos.card}>
                            <span style={estilos.numero}>{dados.clientes}</span>
                            <span style={estilos.label}>Clientes</span>
                        </div>
                        <div style={estilos.card}>
                            <span style={estilos.numero}>{formatarMoeda(dados.ticketMedio)}</span>
                            <span style={estilos.label}>Ticket médio</span>
                        </div>
                    </div>

                    <p style={estilos.tituloSecao}>Serviços mais vendidos</p>
                    <div style={estilos.ranking}>
                        {dados.servicosTop.length === 0 ? (
                            <p style={estilos.mensagem}>Sem dados ainda.</p>
                        ) : (
                            dados.servicosTop.map((s, i) => (
                                <div key={i} style={estilos.linhaRanking}>
                                    <div style={estilos.rankingEsquerda}>
                                        <span style={estilos.posicaoRanking}>{i + 1}</span>
                                        <span style={estilos.nomeRanking}>{s.nome}</span>
                                    </div>
                                    <span style={estilos.valorRanking}>{s.total} atend.</span>
                                </div>
                            ))
                        )}
                    </div>

                    <p style={estilos.tituloSecao}>Barbeiros com mais atendimentos</p>
                    <div style={estilos.ranking}>
                        {dados.barbeirosTop.length === 0 ? (
                            <p style={estilos.mensagem}>Sem dados ainda.</p>
                        ) : (
                            dados.barbeirosTop.map((b, i) => (
                                <div key={i} style={estilos.linhaRanking}>
                                    <div style={estilos.rankingEsquerda}>
                                        <span style={estilos.posicaoRanking}>{i + 1}</span>
                                        <span style={estilos.nomeRanking}>{b.nome}</span>
                                    </div>
                                    <span style={estilos.valorRanking}>{b.total} atend.</span>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            <TabBarAdmin />
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
        marginBottom: '32px',
    },
    card: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '22px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
    },
    numero: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '20px',
        fontWeight: 600,
        textAlign: 'center',
    },
    label: {
        color: cores.textoSecundario,
        fontSize: '12px',
        textAlign: 'center',
    },
    tituloSecao: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '16px',
        fontWeight: 600,
        marginBottom: '12px',
        marginTop: '4px',
    },
    ranking: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '24px',
    },
    linhaRanking: {
        backgroundColor: cores.superficie,
        borderRadius: raios.md,
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rankingEsquerda: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    posicaoRanking: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '14px',
        fontWeight: 600,
        width: '16px',
    },
    nomeRanking: {
        color: cores.texto,
        fontSize: '14px',
    },
    valorRanking: {
        color: cores.textoSecundario,
        fontSize: '13px',
        fontWeight: 600,
    },
    mensagem: {
        color: cores.textoSecundario,
        textAlign: 'center',
    },
    erro: {
        color: cores.perigo,
        textAlign: 'center',
    },
};

export default DashboardAdmin;