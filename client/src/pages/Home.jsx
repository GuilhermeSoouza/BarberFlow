import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TabBar from '../components/TabBar';
import { cores, fontes, sombras, raios } from '../theme';

function Home() {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [proximo, setProximo] = useState(null);
    const [totalCortes, setTotalCortes] = useState(0);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregar() {
            try {
                const resposta = await api.get('/agendamentos');
                const agendamentos = resposta.data;

                const futuros = agendamentos
                    .filter((a) => a.status === 'confirmado' && new Date(a.data_hora) > new Date())
                    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));

                setProximo(futuros[0] || null);
                setTotalCortes(agendamentos.filter((a) => a.status === 'concluido').length);
            } catch (erro) {
                // silencioso
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, []);

    function formatarDataHora(iso) {
        const dataObj = new Date(iso);
        const data = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${data} · ${hora}`;
    }

    return (
        <div style={estilos.container}>
            <div style={estilos.header}>
                <p style={estilos.saudacao}>Olá,</p>
                <h2 style={estilos.nome}>{usuario?.nome?.split(' ')[0]}</h2>
            </div>

            {!carregando && (
                <div className="bf-fade-in" style={estilos.card}>
                    <div className="bf-poste" style={{ height: '4px' }} />
                    <div style={estilos.cardConteudo}>
                        {proximo ? (
                            <>
                                <p style={estilos.labelCard}>Próximo agendamento</p>
                                <p style={estilos.servicoProximo}>{proximo.servico}</p>
                                <p style={estilos.detalheProximo}>
                                    com {proximo.barbeiro} · {formatarDataHora(proximo.data_hora)}
                                </p>
                            </>
                        ) : (
                            <>
                                <p style={estilos.labelCard}>Você não tem agendamentos futuros</p>
                                <button onClick={() => navigate('/servicos')} className="bf-botao" style={estilos.botaoCard}>
                                    Agendar horário
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <p style={estilos.tituloSecao}>Ações rápidas</p>
            <div style={estilos.grid}>
                <button onClick={() => navigate('/servicos')} style={estilos.acaoRapida}>
                    <span style={estilos.acaoIcone}>✂</span>
                    <span style={estilos.acaoTexto}>Agendar horário</span>
                </button>
                <button onClick={() => navigate('/fila')} style={estilos.acaoRapida}>
                    <span style={estilos.acaoIcone}>◷</span>
                    <span style={estilos.acaoTexto}>Entrar na fila</span>
                </button>
            </div>

            {!carregando && totalCortes > 0 && (
                <div style={estilos.statCard}>
                    <span style={estilos.statNumero}>{totalCortes}</span>
                    <span style={estilos.statLabel}>
                        {totalCortes === 1 ? 'corte já feito com a gente' : 'cortes já feitos com a gente'}
                    </span>
                </div>
            )}

            <TabBar />
        </div>
    );
}

const estilos = {
    container: {
        minHeight: '100vh',
        backgroundColor: cores.fundo,
        fontFamily: fontes.corpo,
        padding: '28px 20px',
        paddingBottom: '110px',
    },
    header: { marginBottom: '28px' },
    saudacao: { color: cores.textoSecundario, fontSize: '15px', margin: 0 },
    nome: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '32px',
        fontWeight: 700,
        margin: '4px 0 0',
        letterSpacing: '0.5px',
    },
    card: {
        backgroundColor: cores.superficie,
        borderRadius: raios.lg,
        overflow: 'hidden',
        border: `1px solid ${cores.linha}`,
        boxShadow: sombras.card,
        marginBottom: '28px',
    },
    cardConteudo: {
        padding: '22px 20px',
    },
    labelCard: {
        color: cores.textoSecundario,
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        margin: '0 0 10px',
    },
    servicoProximo: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '22px',
        fontWeight: 600,
        margin: '0 0 6px',
    },
    detalheProximo: {
        color: cores.textoSecundario,
        fontSize: '14px',
        margin: 0,
    },
    botaoCard: {
        marginTop: '14px',
        padding: '12px 20px',
        borderRadius: raios.md,
        border: 'none',
        background: `linear-gradient(135deg, ${cores.dourado} 0%, ${cores.douradoEscuro} 100%)`,
        color: '#0c0c0c',
        fontWeight: 700,
        fontSize: '14px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
        boxShadow: sombras.botao,
    },
    tituloSecao: {
        color: cores.textoSecundario,
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '14px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '24px',
    },
    acaoRapida: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '22px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: sombras.suave,
    },
    acaoIcone: {
        fontSize: '24px',
        color: cores.dourado,
    },
    acaoTexto: {
        color: cores.texto,
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: fontes.corpo,
        textAlign: 'center',
    },
    statCard: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '12px',
        padding: '20px 4px',
        borderTop: `1px solid ${cores.linha}`,
    },
    statNumero: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '32px',
        fontWeight: 700,
    },
    statLabel: {
        color: cores.textoSecundario,
        fontSize: '14px',
    },
};

export default Home;