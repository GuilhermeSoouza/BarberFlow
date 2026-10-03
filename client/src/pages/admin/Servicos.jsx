import { useState, useEffect } from 'react';
import api from '../../services/api';
import TabBarAdmin from '../../components/TabBarAdmin';
import { cores, fontes, sombras, raios } from '../../theme';

function GestaoServicos() {
    const [servicos, setServicos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [editandoId, setEditandoId] = useState(null);
    const [nomeEdit, setNomeEdit] = useState('');
    const [precoEdit, setPrecoEdit] = useState('');
    const [duracaoEdit, setDuracaoEdit] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarServicos();
    }, []);

    async function carregarServicos() {
        try {
            const resposta = await api.get('/admin/servicos');
            setServicos(resposta.data);
        } catch (erro) {
            setErro('Não foi possível carregar os serviços.');
        } finally {
            setCarregando(false);
        }
    }

    function iniciarEdicao(servico) {
        setEditandoId(servico.id);
        setNomeEdit(servico.nome);
        setPrecoEdit(String(servico.preco));
        setDuracaoEdit(String(servico.duracao_minutos));
    }

    async function salvarEdicao(id) {
        try {
            await api.put(`/admin/servicos/${id}`, {
                nome: nomeEdit,
                preco: Number(precoEdit),
                duracao_minutos: Number(duracaoEdit),
            });
            setEditandoId(null);
            carregarServicos();
        } catch (erro) {
            alert(erro.response?.data?.erro || 'Erro ao salvar.');
        }
    }

    async function alternarAtivo(servico) {
        const confirmar = window.confirm(
            servico.ativo
                ? `Desativar ${servico.nome}?`
                : `Reativar ${servico.nome}?`
        );
        if (!confirmar) return;

        try {
            if (servico.ativo) {
                await api.delete(`/admin/servicos/${servico.id}`);
            } else {
                await api.post(`/admin/servicos/${servico.id}/reativar`);
            }
            carregarServicos();
        } catch (erro) {
            alert(erro.response?.data?.erro || 'Erro ao atualizar.');
        }
    }

    if (carregando) return <p style={estilos.mensagem}>Carregando...</p>;

    return (
        <div style={estilos.container}>
            <h2 style={estilos.titulo}>Serviços</h2>
            {erro && <p style={estilos.erro}>{erro}</p>}

            <div style={estilos.lista}>
                {servicos.map((s) => (
                    <div key={s.id} style={estilos.card}>
                        <div style={estilos.linhaTopo}>
                            <span style={estilos.nome}>{s.nome}</span>
                            <span style={{ ...estilos.status, color: s.ativo ? cores.sucesso : cores.perigo }}>
                                {s.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>

                        {editandoId === s.id ? (
                            <div style={estilos.formEdicao}>
                                <input value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} placeholder="Nome" style={estilos.input} />
                                <input value={precoEdit} onChange={(e) => setPrecoEdit(e.target.value)} placeholder="Preço" type="number" style={estilos.input} />
                                <input value={duracaoEdit} onChange={(e) => setDuracaoEdit(e.target.value)} placeholder="Duração (min)" type="number" style={estilos.input} />
                                <div style={estilos.botoesEdicao}>
                                    <button onClick={() => salvarEdicao(s.id)} style={estilos.botaoSalvar}>Salvar</button>
                                    <button onClick={() => setEditandoId(null)} style={estilos.botaoCancelar}>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p style={estilos.detalhe}>
                                    <span style={estilos.preco}>R$ {Number(s.preco).toFixed(2)}</span>
                                    {' · '}{s.duracao_minutos} min
                                </p>
                                <div style={estilos.acoes}>
                                    <button onClick={() => iniciarEdicao(s)} style={estilos.botaoAcao}>Editar</button>
                                    <button
                                        onClick={() => alternarAtivo(s)}
                                        style={{
                                            ...estilos.botaoAcao,
                                            color: s.ativo ? cores.perigo : cores.sucesso,
                                            borderColor: s.ativo ? cores.perigo : cores.sucesso,
                                        }}
                                    >
                                        {s.ativo ? 'Desativar' : 'Reativar'}
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
        marginBottom: '4px',
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
    preco: {
        color: cores.dourado,
        fontWeight: 700,
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

export default GestaoServicos;