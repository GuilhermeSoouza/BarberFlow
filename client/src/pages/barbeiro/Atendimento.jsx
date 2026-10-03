import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { cores, fontes, sombras, raios } from '../../theme';

function Atendimento() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [agendamento, setAgendamento] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [iniciado, setIniciado] = useState(false);
    const [finalizado, setFinalizado] = useState(false);
    const [segundos, setSegundos] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        async function carregar() {
            try {
                const resposta = await api.get(`/barbeiro/atendimento/${id}`);
                setAgendamento(resposta.data);
                if (resposta.data.status === 'em_andamento') {
                    setIniciado(true);
                }
                if (resposta.data.status === 'concluido') {
                    setFinalizado(true);
                }
            } catch (erro) {
                setErro('Não foi possível carregar o atendimento.');
            } finally {
                setCarregando(false);
            }
        }
        carregar();
        return () => clearInterval(intervalRef.current);
    }, [id]);

    useEffect(() => {
        if (iniciado && !finalizado) {
            intervalRef.current = setInterval(() => {
                setSegundos((s) => s + 1);
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [iniciado, finalizado]);

    function formatarTempo(totalSegundos) {
        const min = String(Math.floor(totalSegundos / 60)).padStart(2, '0');
        const seg = String(totalSegundos % 60).padStart(2, '0');
        return `${min}:${seg}`;
    }

    async function iniciar() {
        try {
            await api.post(`/barbeiro/atendimento/${id}/iniciar`);
            setIniciado(true);
        } catch (erro) {
            setErro(erro.response?.data?.erro || 'Erro ao iniciar.');
        }
    }

    async function finalizar() {
        try {
            await api.post(`/barbeiro/atendimento/${id}/finalizar`);
            setFinalizado(true);
            clearInterval(intervalRef.current);
        } catch (erro) {
            setErro(erro.response?.data?.erro || 'Erro ao finalizar.');
        }
    }

    if (carregando) return <p style={estilos.mensagem}>Carregando...</p>;
    if (!agendamento) return <p style={estilos.mensagem}>Atendimento não encontrado.</p>;

    return (
        <div style={estilos.container}>
            <button onClick={() => navigate('/barbeiro/agenda')} style={estilos.voltar}>
                ← Voltar
            </button>

            <div style={estilos.card}>
                <div style={estilos.faixaTopo} />
                <div style={estilos.cardConteudo}>
                    <span style={estilos.cliente}>{agendamento.cliente}</span>
                    <span style={estilos.servico}>{agendamento.servico}</span>

                    {iniciado && !finalizado && (
                        <div style={estilos.cronometro}>{formatarTempo(segundos)}</div>
                    )}

                    {!iniciado && !finalizado && (
                        <button onClick={iniciar} style={estilos.botaoIniciar}>
                            Iniciar atendimento
                        </button>
                    )}

                    {iniciado && !finalizado && (
                        <button onClick={finalizar} style={estilos.botaoFinalizar}>
                            Finalizar atendimento
                        </button>
                    )}

                    {finalizado && (
                        <div style={estilos.concluidoBox}>
                            <div style={estilos.iconeConcluido}>✓</div>
                            <p style={estilos.concluidoTexto}>Atendimento concluído</p>
                            <button onClick={() => navigate('/barbeiro/agenda')} style={estilos.botaoIniciar}>
                                Voltar para agenda
                            </button>
                        </div>
                    )}

                    {erro && <p style={estilos.erro}>{erro}</p>}
                </div>
            </div>
        </div>
    );
}

const estilos = {
    container: {
        minHeight: '100vh',
        backgroundColor: cores.fundo,
        fontFamily: fontes.corpo,
        padding: '28px 24px',
        boxSizing: 'border-box',
    },
    voltar: {
        background: 'none',
        border: 'none',
        color: cores.textoSecundario,
        fontSize: '14px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
        marginBottom: '24px',
        padding: 0,
    },
    card: {
        backgroundColor: cores.superficie,
        borderRadius: raios.lg,
        overflow: 'hidden',
        border: `1px solid ${cores.linha}`,
    },
    faixaTopo: {
        height: '3px',
        background: `linear-gradient(90deg, ${cores.dourado}, ${cores.douradoClaro})`,
    },
    cardConteudo: {
        padding: '36px 28px',
        textAlign: 'center',
    },
    cliente: {
        display: 'block',
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '22px',
        fontWeight: 600,
    },
    servico: {
        display: 'block',
        color: cores.textoSecundario,
        fontSize: '14px',
        marginTop: '4px',
    },
    cronometro: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '52px',
        fontWeight: 600,
        margin: '36px 0',
        fontVariantNumeric: 'tabular-nums',
    },
    botaoIniciar: {
        width: '100%',
        padding: '17px',
        marginTop: '36px',
        borderRadius: raios.md,
        border: 'none',
        background: `linear-gradient(135deg, ${cores.dourado} 0%, ${cores.douradoEscuro} 100%)`,
        color: '#0c0c0c',
        fontWeight: 700,
        fontSize: '16px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    botaoFinalizar: {
        width: '100%',
        padding: '17px',
        borderRadius: raios.md,
        border: 'none',
        backgroundColor: cores.perigo,
        color: cores.texto,
        fontWeight: 700,
        fontSize: '16px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    concluidoBox: {
        marginTop: '36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
    },
    iconeConcluido: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: cores.sucesso,
        color: '#0c0c0c',
        fontSize: '24px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    concluidoTexto: {
        color: cores.sucesso,
        fontSize: '15px',
        fontWeight: 600,
        margin: 0,
    },
    erro: {
        color: cores.perigo,
        fontSize: '13px',
        marginTop: '16px',
    },
    mensagem: {
        color: cores.textoSecundario,
        textAlign: 'center',
        marginTop: '40px',
    },
};

export default Atendimento;