import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { cores, fontes, sombras, raios } from '../theme';

function Servicos() {
    const [servicos, setServicos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function carregarServicos() {
            try {
                const resposta = await api.get('/servicos');
                setServicos(resposta.data);
            } catch (erro) {
                setErro('Não foi possível carregar os serviços.');
            } finally {
                setCarregando(false);
            }
        }
        carregarServicos();
    }, []);

    function escolherServico(servico) {
        localStorage.setItem('servicoEscolhido', JSON.stringify(servico));
        navigate('/barbeiros');
    }

    if (carregando) {
        return <p style={estilos.mensagem}>Carregando serviços...</p>;
    }

    return (
        <div style={estilos.container}>
            <p style={estilos.etapa}>Etapa 1 de 4</p>
            <h2 style={estilos.titulo}>Escolha um serviço</h2>

            {erro && <p style={estilos.erro}>{erro}</p>}

            {servicos.length === 0 && !erro && (
                <p style={estilos.mensagem}>Nenhum serviço disponível no momento.</p>
            )}

            <div style={estilos.lista}>
                {servicos.map((servico) => (
                    <button
                        key={servico.id}
                        onClick={() => escolherServico(servico)}
                        style={estilos.cardServico}
                    >
                        <div style={estilos.infoServico}>
                            <span style={estilos.nomeServico}>{servico.nome}</span>
                            <span style={estilos.detalheServico}>{servico.duracao_minutos} min</span>
                        </div>
                        <span style={estilos.precoServico}>R$ {Number(servico.preco).toFixed(2)}</span>
                    </button>
                ))}
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
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    cardServico: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        textAlign: 'left',
    },
    infoServico: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    nomeServico: {
        color: cores.texto,
        fontSize: '16px',
        fontWeight: 600,
        fontFamily: fontes.corpo,
    },
    detalheServico: {
        color: cores.textoSecundario,
        fontSize: '13px',
    },
    precoServico: {
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '18px',
        fontWeight: 600,
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

export default Servicos;