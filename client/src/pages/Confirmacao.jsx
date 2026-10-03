import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { cores, fontes, sombras, raios } from '../theme';

function Confirmacao() {
    const [servico, setServico] = useState(null);
    const [barbeiro, setBarbeiro] = useState(null);
    const [dataHora, setDataHora] = useState('');
    const [confirmado, setConfirmado] = useState(false);
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const servicoSalvo = localStorage.getItem('servicoEscolhido');
        const barbeiroSalvo = localStorage.getItem('barbeiroEscolhido');
        const dataHoraSalva = localStorage.getItem('dataHoraEscolhida');

        if (!servicoSalvo || !barbeiroSalvo || !dataHoraSalva) {
            navigate('/servicos');
            return;
        }

        setServico(JSON.parse(servicoSalvo));
        setBarbeiro(JSON.parse(barbeiroSalvo));
        setDataHora(dataHoraSalva);
    }, [navigate]);

    function formatarDataHora(iso) {
        const dataObj = new Date(iso);
        const data = dataObj.toLocaleDateString('pt-BR');
        const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${data} às ${hora}`;
    }

    async function confirmarAgendamento() {
        setErro('');
        setEnviando(true);
        try {
            await api.post('/agendamentos', {
                barbeiro_id: barbeiro.id,
                servico_id: servico.id,
                data_hora: dataHora,
            });

            setConfirmado(true);
            localStorage.removeItem('servicoEscolhido');
            localStorage.removeItem('barbeiroEscolhido');
            localStorage.removeItem('dataHoraEscolhida');
        } catch (erro) {
            setErro(erro.response?.data?.erro || 'Erro ao criar agendamento.');
        } finally {
            setEnviando(false);
        }
    }

    if (!servico || !barbeiro) return null;

    if (confirmado) {
        return (
            <div style={estilos.container}>
                <div style={estilos.cardSucesso}>
                    <div style={estilos.iconeSucesso}>✓</div>
                    <h2 style={estilos.tituloSucesso}>Agendamento confirmado</h2>
                    <p style={estilos.textoSucesso}>
                        Te esperamos {formatarDataHora(dataHora)} com {barbeiro.nome}.
                    </p>
                    <button onClick={() => navigate('/home')} style={estilos.botao}>
                        Voltar para a Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={estilos.container}>
            <p style={estilos.etapa}>Etapa 4 de 4</p>
            <h2 style={estilos.titulo}>Confirme seu agendamento</h2>

            <div style={estilos.resumo}>
                <div style={estilos.faixaTopo} />
                <div style={estilos.resumoConteudo}>
                    <div style={estilos.linha}>
                        <span style={estilos.label}>Serviço</span>
                        <span style={estilos.valor}>{servico.nome}</span>
                    </div>
                    <div style={estilos.linha}>
                        <span style={estilos.label}>Barbeiro</span>
                        <span style={estilos.valor}>{barbeiro.nome}</span>
                    </div>
                    <div style={estilos.linha}>
                        <span style={estilos.label}>Data e horário</span>
                        <span style={estilos.valor}>{formatarDataHora(dataHora)}</span>
                    </div>
                    <div style={{ ...estilos.linha, borderBottom: 'none' }}>
                        <span style={estilos.label}>Valor</span>
                        <span style={estilos.valorPreco}>R$ {Number(servico.preco).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {erro && <p style={estilos.erro}>{erro}</p>}

            <button onClick={confirmarAgendamento} disabled={enviando} style={estilos.botao}>
                {enviando ? 'Confirmando...' : 'Confirmar agendamento'}
            </button>
            <button onClick={() => navigate(-1)} style={estilos.botaoVoltar}>
                Voltar e alterar
            </button>
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
    etapa: {
        color: cores.dourado,
        fontSize: '12px',
        fontWeight: 600,
        margin: 0,
    },
    titulo: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '26px',
        fontWeight: 600,
        margin: '4px 0 24px',
    },
    resumo: {
        backgroundColor: cores.superficie,
        borderRadius: raios.lg,
        overflow: 'hidden',
        border: `1px solid ${cores.linha}`,
    },
    faixaTopo: {
        height: '3px',
        background: `linear-gradient(90deg, ${cores.dourado}, ${cores.douradoClaro})`,
    },
    resumoConteudo: {
        padding: '8px 22px 4px',
    },
    linha: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    valorPreco: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '18px',
        fontWeight: 600,
    },
    botao: {
        width: '100%',
        padding: '16px',
        marginTop: '24px',
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
    botaoVoltar: {
        width: '100%',
        padding: '15px',
        marginTop: '10px',
        borderRadius: raios.md,
        border: `1px solid ${cores.linha}`,
        backgroundColor: 'transparent',
        color: cores.textoSecundario,
        fontSize: '14px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    erro: {
        color: cores.perigo,
        fontSize: '13px',
        textAlign: 'center',
        marginTop: '16px',
    },
    cardSucesso: {
        backgroundColor: cores.superficie,
        borderRadius: raios.lg,
        padding: '40px 28px',
        textAlign: 'center',
        marginTop: '80px',
        border: `1px solid ${cores.linha}`,
    },
    iconeSucesso: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${cores.dourado} 0%, ${cores.douradoEscuro} 100%)`,
        color: '#0c0c0c',
        fontSize: '28px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
    },
    tituloSucesso: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '22px',
        fontWeight: 600,
        margin: '0 0 10px',
    },
    textoSucesso: {
        color: cores.textoSecundario,
        fontSize: '14px',
        marginBottom: '28px',
        lineHeight: 1.5,
    },
};

export default Confirmacao;