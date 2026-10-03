import { useState, useEffect } from 'react';
import api from '../../services/api';
import TabBarBarbeiro from '../../components/TabBarBarbeiro';
import { cores, fontes, sombras, raios } from '../../theme';

function HistoricoBarbeiro() {
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregar() {
            try {
                const resposta = await api.get('/barbeiro/historico');
                setHistorico(resposta.data);
            } catch (erro) {
                setErro('Não foi possível carregar o histórico.');
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

    if (carregando) return <p style={estilos.mensagem}>Carregando...</p>;

    return (
        <div style={estilos.container}>
            <h2 style={estilos.titulo}>Histórico</h2>
            {erro && <p style={estilos.erro}>{erro}</p>}

            {historico.length === 0 ? (
                <div style={estilos.vazio}>
                    <p style={estilos.textoVazio}>Nenhum atendimento no histórico.</p>
                </div>
            ) : (
                <div style={estilos.lista}>
                    {historico.map((item) => (
                        <div key={item.id} style={estilos.card}>
                            <div style={estilos.linhaTopo}>
                                <span style={estilos.cliente}>{item.cliente}</span>
                                {item.duracao_minutos != null && (
                                    <span style={estilos.duracao}>{item.duracao_minutos} min</span>
                                )}
                            </div>
                            <p style={estilos.detalhe}>{item.servico}</p>
                            <p style={estilos.detalhe}>{formatarDataHora(item.data_hora)}</p>
                        </div>
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
        marginBottom: '24px',
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
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    card: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '18px',
    },
    linhaTopo: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    cliente: {
        color: cores.texto,
        fontWeight: 600,
        fontSize: '15px',
    },
    duracao: {
        color: cores.dourado,
        fontSize: '12px',
        fontWeight: 700,
    },
    detalhe: {
        color: cores.textoSecundario,
        fontSize: '13px',
        margin: '2px 0',
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

export default HistoricoBarbeiro;