import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TabBar from '../components/TabBar';
import { cores, fontes, sombras, raios } from '../theme';

function MeusAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [cancelandoId, setCancelandoId] = useState(null);
    const [avaliandoId, setAvaliandoId] = useState(null);
    const [notaSelecionada, setNotaSelecionada] = useState(0);
    const [avaliados, setAvaliados] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        carregarAgendamentos();
    }, []);

    async function carregarAgendamentos() {
        try {
            const resposta = await api.get('/agendamentos');
            setAgendamentos(resposta.data);
        } catch (erro) {
            setErro('Não foi possível carregar seus agendamentos.');
        } finally {
            setCarregando(false);
        }
    }

    async function cancelarAgendamento(id) {
        const confirmar = window.confirm('Tem certeza que deseja cancelar este agendamento?');
        if (!confirmar) return;

        setCancelandoId(id);
        try {
            await api.delete(`/agendamentos/${id}`);
            setAgendamentos((atual) =>
                atual.map((a) => (a.id === id ? { ...a, status: 'cancelado' } : a))
            );
        } catch (erro) {
            alert(erro.response?.data?.erro || 'Erro ao cancelar agendamento.');
        } finally {
            setCancelandoId(null);
        }
    }

    function abrirAvaliacao(id) {
        setAvaliandoId(id);
        setNotaSelecionada(0);
    }

    async function enviarAvaliacao(id) {
        if (notaSelecionada === 0) return;

        try {
            await api.post(`/agendamentos/${id}/avaliar`, { nota: notaSelecionada });
            setAvaliados((atual) => ({ ...atual, [id]: notaSelecionada }));
            setAvaliandoId(null);
        } catch (erro) {
            alert(erro.response?.data?.erro || 'Erro ao enviar avaliação.');
        }
    }

    function formatarDataHora(iso) {
        const dataObj = new Date(iso);
        const data = dataObj.toLocaleDateString('pt-BR');
        const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${data} às ${hora}`;
    }

    function corStatus(status) {
        if (status === 'confirmado') return cores.dourado;
        if (status === 'concluido') return cores.sucesso;
        if (status === 'cancelado') return cores.perigo;
        return cores.textoSecundario;
    }

    if (carregando) return <p style={estilos.mensagem}>Carregando...</p>;

    return (
        <div style={estilos.container}>
            <h2 style={estilos.titulo}>Meus agendamentos</h2>

            {erro && <p style={estilos.erro}>{erro}</p>}

            {agendamentos.length === 0 && !erro && (
                <p style={estilos.mensagem}>Você ainda não tem agendamentos.</p>
            )}

            <div style={estilos.lista}>
                {agendamentos.map((ag) => (
                    <div key={ag.id} style={estilos.cardAgendamento}>
                        <div style={estilos.linhaTopo}>
                            <span style={estilos.nomeServico}>{ag.servico}</span>
                            <span style={{ ...estilos.status, color: corStatus(ag.status) }}>
                                {ag.status}
                            </span>
                        </div>
                        <p style={estilos.detalhe}>com {ag.barbeiro}</p>
                        <p style={estilos.detalhe}>{formatarDataHora(ag.data_hora)}</p>

                        {ag.status === 'confirmado' && (
                            <button
                                onClick={() => cancelarAgendamento(ag.id)}
                                disabled={cancelandoId === ag.id}
                                style={estilos.botaoCancelar}
                            >
                                {cancelandoId === ag.id ? 'Cancelando...' : 'Cancelar'}
                            </button>
                        )}

                        {ag.status === 'concluido' && !avaliados[ag.id] && (
                            <>
                                {avaliandoId === ag.id ? (
                                    <div style={estilos.avaliacaoBox}>
                                        <div style={estilos.estrelas}>
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <span
                                                    key={n}
                                                    onClick={() => setNotaSelecionada(n)}
                                                    style={{
                                                        ...estilos.estrela,
                                                        color: n <= notaSelecionada ? cores.dourado : cores.linha,
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => enviarAvaliacao(ag.id)}
                                            disabled={notaSelecionada === 0}
                                            style={estilos.botaoEnviarAvaliacao}
                                        >
                                            Enviar avaliação
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => abrirAvaliacao(ag.id)} style={estilos.botaoAvaliar}>
                                        Avaliar
                                    </button>
                                )}
                            </>
                        )}

                        {avaliados[ag.id] && (
                            <p style={estilos.avaliadoTexto}>
                                Você avaliou com {avaliados[ag.id]} ★
                            </p>
                        )}
                    </div>
                ))}
            </div>

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
    titulo: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '26px',
        fontWeight: 600,
        marginBottom: '24px',
    },
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    cardAgendamento: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '18px',
    },
    linhaTopo: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
    },
    nomeServico: {
        color: cores.texto,
        fontWeight: 600,
        fontSize: '15px',
    },
    status: {
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'capitalize',
    },
    detalhe: {
        color: cores.textoSecundario,
        fontSize: '13px',
        margin: '2px 0',
    },
    botaoCancelar: {
        marginTop: '14px',
        padding: '9px 16px',
        borderRadius: raios.sm,
        border: `1px solid ${cores.perigo}`,
        backgroundColor: 'transparent',
        color: cores.perigo,
        fontSize: '13px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    botaoAvaliar: {
        marginTop: '14px',
        padding: '9px 16px',
        borderRadius: raios.sm,
        border: `1px solid ${cores.dourado}`,
        backgroundColor: 'transparent',
        color: cores.dourado,
        fontSize: '13px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    avaliacaoBox: {
        marginTop: '14px',
    },
    estrelas: {
        display: 'flex',
        gap: '4px',
        marginBottom: '12px',
    },
    estrela: {
        fontSize: '28px',
        cursor: 'pointer',
        userSelect: 'none',
    },
    botaoEnviarAvaliacao: {
        padding: '9px 16px',
        borderRadius: raios.sm,
        border: 'none',
        background: `linear-gradient(135deg, ${cores.dourado} 0%, ${cores.douradoEscuro} 100%)`,
        color: '#0c0c0c',
        fontWeight: 700,
        fontSize: '13px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    avaliadoTexto: {
        marginTop: '14px',
        color: cores.dourado,
        fontSize: '14px',
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

export default MeusAgendamentos;