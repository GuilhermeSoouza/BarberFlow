import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { cores, fontes, sombras, raios } from '../theme';

function Barbeiros() {
    const [barbeiros, setBarbeiros] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [servico, setServico] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const servicoSalvo = localStorage.getItem('servicoEscolhido');
        if (!servicoSalvo) {
            navigate('/servicos');
            return;
        }
        setServico(JSON.parse(servicoSalvo));

        async function carregarBarbeiros() {
            try {
                const resposta = await api.get('/barbeiros');
                setBarbeiros(resposta.data);
            } catch (erro) {
                setErro('Não foi possível carregar os barbeiros.');
            } finally {
                setCarregando(false);
            }
        }
        carregarBarbeiros();
    }, [navigate]);

    function escolherBarbeiro(barbeiro) {
        localStorage.setItem('barbeiroEscolhido', JSON.stringify(barbeiro));
        navigate('/horario');
    }

    function iniciais(nome) {
        return nome
            .split(' ')
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase();
    }

    if (carregando) {
        return <p style={estilos.mensagem}>Carregando barbeiros...</p>;
    }

    return (
        <div style={estilos.container}>
            <p style={estilos.etapa}>Etapa 2 de 4</p>
            <h2 style={estilos.titulo}>Escolha o barbeiro</h2>
            {servico && <p style={estilos.subtitulo}>Para: {servico.nome}</p>}

            {erro && <p style={estilos.erro}>{erro}</p>}

            {barbeiros.length === 0 && !erro && (
                <p style={estilos.mensagem}>Nenhum barbeiro disponível no momento.</p>
            )}

            <div style={estilos.lista}>
                {barbeiros.map((barbeiro) => (
                    <button
                        key={barbeiro.id}
                        onClick={() => escolherBarbeiro(barbeiro)}
                        style={estilos.cardBarbeiro}
                    >
                        <div style={estilos.avatar}>{iniciais(barbeiro.nome)}</div>
                        <div style={estilos.infoBarbeiro}>
                            <span style={estilos.nomeBarbeiro}>{barbeiro.nome}</span>
                            {barbeiro.especialidade && (
                                <span style={estilos.especialidade}>{barbeiro.especialidade}</span>
                            )}
                        </div>
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
        margin: '4px 0 2px',
    },
    subtitulo: {
        color: cores.textoSecundario,
        fontSize: '13px',
        marginBottom: '24px',
    },
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    cardBarbeiro: {
        backgroundColor: cores.superficie,
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.lg,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        cursor: 'pointer',
        textAlign: 'left',
    },
    avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: cores.superficieElevada,
        border: `1.5px solid ${cores.dourado}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '16px',
        fontWeight: 600,
        flexShrink: 0,
    },
    infoBarbeiro: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    nomeBarbeiro: {
        color: cores.texto,
        fontSize: '15px',
        fontWeight: 600,
    },
    especialidade: {
        color: cores.dourado,
        fontSize: '12px',
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

export default Barbeiros;