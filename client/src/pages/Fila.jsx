import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TabBar from '../components/TabBar';
import { cores, fontes, sombras, raios } from '../theme';

function Fila() {
    const [minhaFila, setMinhaFila] = useState(null);
    const [barbeiros, setBarbeiros] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [barbeiroSelecionado, setBarbeiroSelecionado] = useState('');
    const [servicoSelecionado, setServicoSelecionado] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [entrando, setEntrando] = useState(false);
    const [erro, setErro] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        carregarTudo();
    }, []);

    async function carregarTudo() {
        try {
            const [posicaoResp, barbeirosResp, servicosResp] = await Promise.all([
                api.get('/fila/minha-posicao'),
                api.get('/barbeiros'),
                api.get('/servicos'),
            ]);
            setMinhaFila(posicaoResp.data);
            setBarbeiros(barbeirosResp.data);
            setServicos(servicosResp.data);
        } catch (erro) {
            setErro('Não foi possível carregar a fila.');
        } finally {
            setCarregando(false);
        }
    }

    async function entrarNaFila() {
        if (!barbeiroSelecionado || !servicoSelecionado) {
            setErro('Escolha um barbeiro e um serviço.');
            return;
        }

        setEntrando(true);
        setErro('');
        try {
            await api.post('/fila', {
                barbeiro_id: barbeiroSelecionado,
                servico_id: servicoSelecionado,
            });
            carregarTudo();
        } catch (erro) {
            setErro(erro.response?.data?.erro || 'Erro ao entrar na fila.');
        } finally {
            setEntrando(false);
        }
    }

    if (carregando) return <p style={estilos.mensagem}>Carregando...</p>;

    return (
        <div style={estilos.container}>
            <h2 style={estilos.titulo}>Fila de espera</h2>

            {erro && <p style={estilos.erro}>{erro}</p>}

            {minhaFila ? (
                <div style={estilos.cardPosicao}>
                    <p style={estilos.labelPosicao}>Sua posição</p>
                    <p style={estilos.numeroPosicao}>#{minhaFila.posicao}</p>
                    <p style={estilos.detalhe}>{minhaFila.servico} com {minhaFila.barbeiro}</p>
                    {minhaFila.tempo_estimado && (
                        <p style={estilos.tempoEstimado}>Tempo estimado: {minhaFila.tempo_estimado} min</p>
                    )}
                    {minhaFila.posicao === 1 && (
                        <p style={estilos.chamando}>É a sua vez! Dirija-se ao barbeiro.</p>
                    )}
                </div>
            ) : (
                <div style={estilos.form}>
                    <label style={estilos.label}>Barbeiro</label>
                    <select
                        value={barbeiroSelecionado}
                        onChange={(e) => setBarbeiroSelecionado(e.target.value)}
                        style={estilos.select}
                    >
                        <option value="">Selecione</option>
                        {barbeiros.map((b) => (
                            <option key={b.id} value={b.id}>{b.nome}</option>
                        ))}
                    </select>

                    <label style={estilos.label}>Serviço</label>
                    <select
                        value={servicoSelecionado}
                        onChange={(e) => setServicoSelecionado(e.target.value)}
                        style={estilos.select}
                    >
                        <option value="">Selecione</option>
                        {servicos.map((s) => (
                            <option key={s.id} value={s.id}>{s.nome}</option>
                        ))}
                    </select>

                    <button onClick={entrarNaFila} disabled={entrando} className="bf-botao" style={estilos.botao}>
                        {entrando ? 'Entrando...' : 'Entrar na fila'}
                    </button>
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
    titulo: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '28px',
        fontWeight: 700,
        marginBottom: '24px',
    },
    cardPosicao: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '36px 24px',
        textAlign: 'center',
        boxShadow: sombras.card,
    },
    labelPosicao: {
        color: cores.textoSecundario,
        fontSize: '13px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    numeroPosicao: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '52px',
        fontWeight: 700,
        margin: '10px 0',
    },
    detalhe: {
        color: cores.texto,
        fontSize: '15px',
    },
    tempoEstimado: {
        color: cores.textoSecundario,
        fontSize: '13px',
        marginTop: '12px',
    },
    chamando: {
        color: cores.sucesso,
        fontWeight: 700,
        marginTop: '18px',
        fontSize: '15px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        color: cores.textoSecundario,
        fontSize: '12px',
        fontWeight: 600,
        marginBottom: '8px',
        marginTop: '18px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    select: {
        padding: '14px 16px',
        borderRadius: raios.md,
        border: `1px solid ${cores.linha}`,
        backgroundColor: cores.superficieElevada,
        color: cores.texto,
        fontSize: '15px',
        fontFamily: fontes.corpo,
        colorScheme: 'dark',
    },
    botao: {
        width: '100%',
        padding: '16px',
        marginTop: '28px',
        borderRadius: raios.md,
        border: 'none',
        background: `linear-gradient(135deg, ${cores.dourado} 0%, ${cores.douradoEscuro} 100%)`,
        color: '#0c0c0c',
        fontWeight: 700,
        fontSize: '15px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
        boxShadow: sombras.botao,
    },
    mensagem: {
        color: cores.textoSecundario,
        textAlign: 'center',
        marginTop: '40px',
        fontFamily: fontes.corpo,
    },
    erro: {
        color: cores.perigo,
        textAlign: 'center',
        marginBottom: '16px',
        background: 'rgba(248,113,113,0.1)',
        padding: '10px',
        borderRadius: raios.sm,
        border: '1px solid rgba(248,113,113,0.2)',
    },
};

export default Fila;