import { useState, useEffect } from 'react';
import api from '../../services/api';
import TabBarAdmin from '../../components/TabBarAdmin';
import { cores, fontes, sombras, raios } from '../../theme';

function AgendamentosGerais() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('todos');

    useEffect(() => {
        async function carregar() {
            try {
                const resposta = await api.get('/admin/agendamentos');
                setAgendamentos(resposta.data);
            } catch (erro) {
                setErro('Não foi possível carregar os agendamentos.');
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, []);

    function formatarDataHora(iso) {
        const dataObj = new Date(iso);
        const data = dataObj.toLocaleDateString('pt-BR');
        const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${data} às ${hora}`;
    }

    const statusInfo = {
        confirmado: { texto: 'Confirmado', cor: cores.textoSecundario },
        em_andamento: { texto: 'Em andamento', cor: cores.dourado },
        concluido: { texto: 'Concluído', cor: cores.sucesso },
        cancelado: { texto: 'Cancelado', cor: cores.perigo },
    };

    const listaFiltrada = filtroStatus === 'todos'
        ? agendamentos
        : agendamentos.filter((a) => a.status === filtroStatus);

    if (carregando) return <p style={estilos.mensagem}>Carregando...</p>;

    return (
        <div style={estilos.container}>
            <h2 style={estilos.titulo}>Agendamentos</h2>
            {erro && <p style={estilos.erro}>{erro}</p>}

            <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                style={estilos.select}
            >
                <option value="todos">Todos os status</option>
                <option value="confirmado">Confirmado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
            </select>

            {listaFiltrada.length === 0 ? (
                <div style={estilos.vazio}>
                    <p style={estilos.textoVazio}>Nenhum agendamento encontrado.</p>
                </div>
            ) : (
                <div style={estilos.lista}>
                    {listaFiltrada.map((a) => (
                        <div key={a.id} style={estilos.card}>
                            <div style={estilos.linhaTopo}>
                                <span style={estilos.cliente}>{a.cliente}</span>
                                <span style={{ ...estilos.status, color: statusInfo[a.status]?.cor || cores.textoSecundario }}>
                                    {statusInfo[a.status]?.texto || a.status}
                                </span>
                            </div>
                            <p style={estilos.detalhe}>{a.servico} · com {a.barbeiro}</p>
                            <p style={estilos.detalhe}>{formatarDataHora(a.data_hora)}</p>
                        </div>
                    ))}
                </div>
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
    titulo: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '26px',
        fontWeight: 600,
        marginBottom: '16px',
    },
    select: {
        padding: '12px 14px',
        borderRadius: raios.md,
        border: `1px solid ${cores.linha}`,
        backgroundColor: cores.superficieElevada,
        color: cores.texto,
        fontSize: '14px',
        fontFamily: fontes.corpo,
        marginBottom: '20px',
        width: '100%',
        colorScheme: 'dark',
    },
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    card: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '16px',
    },
    linhaTopo: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
    },
    cliente: {
        color: cores.texto,
        fontWeight: 600,
        fontSize: '15px',
    },
    status: {
        fontSize: '12px',
        fontWeight: 700,
    },
    detalhe: {
        color: cores.textoSecundario,
        fontSize: '13px',
        margin: '2px 0',
    },
    vazio: {
        backgroundColor: cores.superficie,
        borderRadius: raios.lg,
        padding: '32px 20px',
        textAlign: 'center',
    },
    textoVazio: {
        color: cores.textoSecundario,
        fontSize: '14px',
        margin: 0,
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

export default AgendamentosGerais;