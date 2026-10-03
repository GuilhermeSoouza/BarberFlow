import { useState, useEffect } from 'react';
import api from '../../services/api';
import TabBarAdmin from '../../components/TabBarAdmin';
import { cores, fontes, sombras, raios } from '../../theme';

function GestaoBarbeiros() {
    const [barbeiros, setBarbeiros] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [editandoId, setEditandoId] = useState(null);
    const [especialidadeEdit, setEspecialidadeEdit] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarBarbeiros();
    }, []);

    async function carregarBarbeiros() {
        try {
            const resposta = await api.get('/admin/barbeiros');
            setBarbeiros(resposta.data);
        } catch (erro) {
            setErro('Não foi possível carregar os barbeiros.');
        } finally {
            setCarregando(false);
        }
    }

    function iniciarEdicao(barbeiro) {
        setEditandoId(barbeiro.id);
        setEspecialidadeEdit(barbeiro.especialidade || '');
    }

    async function salvarEdicao(id) {
        try {
            await api.put(`/admin/barbeiros/${id}`, { especialidade: especialidadeEdit });
            setEditandoId(null);
            carregarBarbeiros();
        } catch (erro) {
            alert(erro.response?.data?.erro || 'Erro ao salvar.');
        }
    }

    async function alternarAtivo(barbeiro) {
        const confirmar = window.confirm(
            barbeiro.ativo
                ? `Remover ${barbeiro.nome}? Ele deixará de aparecer para os clientes.`
                : `Reativar ${barbeiro.nome}?`
        );
        if (!confirmar) return;

        try {
            if (barbeiro.ativo) {
                await api.delete(`/admin/barbeiros/${barbeiro.id}`);
            } else {
                await api.post(`/admin/barbeiros/${barbeiro.id}/reativar`);
            }
            carregarBarbeiros();
        } catch (erro) {
            alert(erro.response?.data?.erro || 'Erro ao atualizar.');
        }
    }

    function iniciais(nome) {
        return nome
            .split(' ')
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase();
    }

    if (carregando) return <p style={estilos.mensagem}>Carregando...</p>;

    return (
        <div style={estilos.container}>
            <h2 style={estilos.titulo}>Barbeiros</h2>
            {erro && <p style={estilos.erro}>{erro}</p>}

            <div style={estilos.lista}>
                {barbeiros.map((b) => (
                    <div key={b.id} style={estilos.card}>
                        <div style={estilos.linhaTopo}>
                            <div style={estilos.identidade}>
                                <div style={estilos.avatar}>{iniciais(b.nome)}</div>
                                <span style={estilos.nome}>{b.nome}</span>
                            </div>
                            <span style={{ ...estilos.status, color: b.ativo ? cores.sucesso : cores.perigo }}>
                                {b.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>

                        {editandoId === b.id ? (
                            <div style={estilos.formEdicao}>
                                <input
                                    value={especialidadeEdit}
                                    onChange={(e) => setEspecialidadeEdit(e.target.value)}
                                    placeholder="Especialidade"
                                    style={estilos.input}
                                />
                                <div style={estilos.botoesEdicao}>
                                    <button onClick={() => salvarEdicao(b.id)} style={estilos.botaoSalvar}>Salvar</button>
                                    <button onClick={() => setEditandoId(null)} style={estilos.botaoCancelar}>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p style={estilos.detalhe}>{b.especialidade || 'Sem especialidade definida'}</p>
                                <div style={estilos.acoes}>
                                    <button onClick={() => iniciarEdicao(b)} style={estilos.botaoAcao}>Editar</button>
                                    <button
                                        onClick={() => alternarAtivo(b)}
                                        style={{
                                            ...estilos.botaoAcao,
                                            color: b.ativo ? cores.perigo : cores.sucesso,
                                            borderColor: b.ativo ? cores.perigo : cores.sucesso,
                                        }}
                                    >
                                        {b.ativo ? 'Desativar' : 'Reativar'}
                                    </button>
                                </div>
                            </>
                        )}
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
        padding: '18px',
    },
    linhaTopo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    identidade: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
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
    nome: {
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
        marginBottom: '14px',
    },
    formEdicao: {
        marginTop: '10px',
    },
    input: {
        width: '100%',
        padding: '11px 12px',
        borderRadius: raios.sm,
        border: `1px solid ${cores.linha}`,
        backgroundColor: cores.superficieElevada,
        color: cores.texto,
        fontSize: '14px',
        fontFamily: fontes.corpo,
        boxSizing: 'border-box',
        marginBottom: '10px',
        colorScheme: 'dark',
    },
    botoesEdicao: {
        display: 'flex',
        gap: '8px',
    },
    botaoSalvar: {
        padding: '9px 18px',
        borderRadius: raios.sm,
        border: 'none',
        background: `linear-gradient(135deg, ${cores.dourado} 0%, ${cores.douradoEscuro} 100%)`,
        color: '#0c0c0c',
        fontWeight: 700,
        fontSize: '13px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    botaoCancelar: {
        padding: '9px 18px',
        borderRadius: raios.sm,
        border: `1px solid ${cores.linha}`,
        backgroundColor: 'transparent',
        color: cores.textoSecundario,
        fontSize: '13px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    acoes: {
        display: 'flex',
        gap: '8px',
    },
    botaoAcao: {
        padding: '7px 14px',
        borderRadius: raios.sm,
        border: `1px solid ${cores.dourado}`,
        backgroundColor: 'transparent',
        color: cores.dourado,
        fontSize: '13px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
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

export default GestaoBarbeiros;