import { useState, useEffect } from 'react';
import api from '../../services/api';
import TabBarAdmin from '../../components/TabBarAdmin';
import { cores, fontes, sombras, raios } from '../../theme';

function ListaClientes() {
    const [clientes, setClientes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregar() {
            try {
                const resposta = await api.get('/admin/clientes');
                setClientes(resposta.data);
            } catch (erro) {
                setErro('Não foi possível carregar os clientes.');
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, []);

    function iniciais(nome) {
        return nome
            ?.split(' ')
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase();
    }

    function formatarData(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('pt-BR');
    }

    if (carregando) return <p style={estilos.mensagem}>Carregando...</p>;

    return (
        <div style={estilos.container}>
            <h2 style={estilos.titulo}>Clientes</h2>

            {erro && <p style={estilos.erro}>{erro}</p>}

            {clientes.length === 0 && !erro && (
                <p style={estilos.mensagem}>Nenhum cliente encontrado.</p>
            )}

            <div style={estilos.lista}>
                {clientes.map((c) => (
                    <div key={c.id} style={estilos.card}>
                        <div style={estilos.identidade}>
                            <div style={estilos.avatar}>{iniciais(c.nome)}</div>
                            <div style={estilos.infoCliente}>
                                <span style={estilos.nome}>{c.nome}</span>
                                <span style={estilos.telefone}>{c.telefone || 'Sem telefone'}</span>
                            </div>
                        </div>
                        <div style={estilos.linhaInfo}>
                            <span style={estilos.info}>{c.totalVisitas} visitas</span>
                            <span style={estilos.infoSecundaria}>Última: {formatarData(c.ultimaVisita)}</span>
                        </div>
                    </div>
                ))}
            </div>

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
        marginBottom: '20px',
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
    identidade: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: cores.superficieElevada,
        border: `1.5px solid ${cores.dourado}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fontes.titulo,
        color: cores.dourado,
        fontSize: '14px',
        fontWeight: 600,
        flexShrink: 0,
    },
    infoCliente: {
        display: 'flex',
        flexDirection: 'column',
    },
    nome: {
        color: cores.texto,
        fontWeight: 600,
        fontSize: '15px',
    },
    telefone: {
        color: cores.textoSecundario,
        fontSize: '12px',
    },
    linhaInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '10px',
        borderTop: `1px solid ${cores.linha}`,
    },
    info: {
        color: cores.dourado,
        fontSize: '12px',
        fontWeight: 700,
    },
    infoSecundaria: {
        color: cores.textoSecundario,
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

export default ListaClientes;