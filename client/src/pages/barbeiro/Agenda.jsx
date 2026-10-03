import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import TabBarBarbeiro from '../../components/TabBarBarbeiro';
import { cores, fontes, sombras, raios } from '../../theme';

function hojeISO() {
    return new Date().toISOString().split('T')[0];
}

function AgendaBarbeiro() {
    const [data, setData] = useState(hojeISO());
    const [agendamentos, setAgendamentos] = useState([]);
    const [fila, setFila] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const navigate = useNavigate();
    const { usuario } = useAuth();

    useEffect(() => {
        carregar();
    }, [data]);

    async function carregar() {
        setCarregando(true);
        try {
            const [agResp, filaResp] = await Promise.all([
                api.get(`/barbeiro/agenda?data=${data}`),
                api.get('/barbeiro/fila'),
            ]);
            setAgendamentos(agResp.data);
            setFila(filaResp.data);
        } catch (erro) {
            setErro('Não foi possível carregar a agenda.');
        } finally {
            setCarregando(false);
        }
    }

    async function chamarProximo() {
        try {
            await api.post('/barbeiro/fila/chamar');
            carregar();
        } catch (erro) {
            alert(erro.response?.data?.erro || 'Erro ao chamar.');
        }
    }

    async function concluirFila(id) {
        try {
            await api.post(`/barbeiro/fila/${id}/concluir`);
            carregar();
        } catch (erro) {
            alert(erro.response?.data?.erro || 'Erro ao concluir.');
        }
    }

    function formatarHora(iso) {
        return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    const statusInfo = {
        confirmado: { texto: 'Confirmado', cor: cores.textoSecundario },
        em_andamento: { texto: 'Em andamento', cor: cores.dourado },
        concluido: { texto: 'Concluído', cor: cores.sucesso },
        cancelado: { texto: 'Cancelado', cor: cores.perigo },
    };

    if (carregando) return <p style={estilos.mensagem}>Carregando...</p>;

    return (
        <div style={estilos.container}>
            <h2 style={estilos.titulo}>Agenda</h2>
            {erro && <p style={estilos.erro}>{erro}</p>}

            {/* Fila */}
            <p style={estilos.tituloSecao}>Fila de espera</p>
            {fila.length === 0 ? (
                <div style={estilos.vazio}>
                    <p style={estilos.textoVazio}>Ninguém na fila no momento.</p>
                </div>
            ) : (
                <div style={estilos.lista}>
                    {fila.map((item, i) => (
                        <div key={item.id} style={estilos.cardFila}>
                            <div style={estilos.infoFila}>
                                <span style={estilos.posicao}>#{i + 1}</span>
                                <div>
                                    <span style={estilos.clienteFila}>{item.cliente}</span>
                                    <span style={estilos.servicoFila}>{item.servico}</span>
                                </div>
                            </div>
                            {i === 0 ? (
                                <button onClick={() => concluirFila(item.id)} style={estilos.botaoConcluir}>
                                    Concluir
                                </button>
                            ) : i === 0 || true ? (
                                <button onClick={chamarProximo} style={estilos.botaoChamar}>
                                    Chamar
                                </button>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}

            {/* Agenda do dia */}
            <p style={estilos.tituloSecao}>Agendamentos do dia</p>
            <label style={estilos.label}>Data</label>
            <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                style={estilos.inputData}
            />

            {agendamentos.length === 0 ? (
                <div style={estilos.vazio}>
                    <p style={estilos.textoVazio}>Nenhum agendamento neste dia.</p>
                </div>
            ) : (
                <div style={estilos.lista}>
                    {agendamentos.map((a) => (
                        <button
                            key={a.id}
                            onClick={() => navigate(`/barbeiro/atendimento/${a.id}`)}
                            style={estilos.cardAgendamento}
                        >
                            <span style={estilos.horaAgendamento}>{formatarHora(a.data_hora)}</span>
                            <div style={estilos.infoAgendamento}>
                                <span style={estilos.clienteAgendamento}>{a.cliente}</span>
                                <span style={estilos.servicoAgendamento}>{a.servico}</span>
                            </div>
                            <span style={{ ...estilos.statusAgendamento, color: statusInfo[a.status]?.cor || cores.textoSecundario }}>
                                {statusInfo[a.status]?.texto || a.status}
                            </span>
                        </button>
                    ))}
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
    titulo: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '26px',
        fontWeight: 600,
        marginBottom: '20px',
    },
    tituloSecao: {
        color: cores.textoSecundario,
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        margin: '24px 0 12px',
    },
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    cardFila: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoFila: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    posicao: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontWeight: 700,
        fontSize: '16px',
    },
    clienteFila: {
        display: 'block',
        color: cores.texto,
        fontWeight: 600,
        fontSize: '14px',
    },
    servicoFila: {
        display: 'block',
        color: cores.textoSecundario,
        fontSize: '12px',
    },
    botaoChamar: {
        padding: '7px 16px',
        borderRadius: raios.sm,
        border: 'none',
        background: `linear-gradient(135deg, ${cores.dourado} 0%, ${cores.douradoEscuro} 100%)`,
        color: '#0c0c0c',
        fontWeight: 700,
        fontSize: '12px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    botaoConcluir: {
        padding: '7px 16px',
        borderRadius: raios.sm,
        border: 'none',
        backgroundColor: cores.sucesso,
        color: '#0c0c0c',
        fontWeight: 700,
        fontSize: '12px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    label: {
        color: cores.textoSecundario,
        fontSize: '12px',
        fontWeight: 600,
        display: 'block',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    inputData: {
        padding: '12px 14px',
        borderRadius: raios.md,
        border: `1px solid ${cores.linha}`,
        backgroundColor: cores.superficieElevada,
        color: cores.texto,
        fontSize: '14px',
        fontFamily: fontes.corpo,
        colorScheme: 'dark',
        marginBottom: '16px',
        width: '100%',
        boxSizing: 'border-box',
    },
    cardAgendamento: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
    },
    horaAgendamento: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontWeight: 600,
        fontSize: '16px',
        minWidth: '52px',
    },
    infoAgendamento: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    clienteAgendamento: { color: cores.texto, fontWeight: 600, fontSize: '14px' },
    servicoAgendamento: { color: cores.textoSecundario, fontSize: '13px' },
    statusAgendamento: { fontSize: '12px', fontWeight: 700 },
    vazio: {
        backgroundColor: cores.superficie,
        borderRadius: raios.lg,
        padding: '24px 20px',
        textAlign: 'center',
        marginBottom: '8px',
    },
    textoVazio: { color: cores.textoSecundario, fontSize: '14px', margin: 0 },
    mensagem: { color: cores.textoSecundario, textAlign: 'center', marginTop: '40px' },
    erro: { color: cores.perigo, textAlign: 'center' },
};

export default AgendaBarbeiro;