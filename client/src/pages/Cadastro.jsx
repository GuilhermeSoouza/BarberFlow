import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { cores, fontes, sombras, raios } from '../theme';

function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setCarregando(true);
        try {
            await api.post('/usuarios', {
                nome,
                email,
                telefone,
                senha,
                tipo: 'cliente',
            });
            navigate('/');
        } catch (erro) {
            setErro(erro.response?.data?.erro || 'Erro ao criar conta.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div style={estilos.container}>
            <div style={estilos.glow} />
            <div className="bf-fade-in" style={estilos.card}>
                <div className="bf-poste" style={estilos.poste} />

                <div style={estilos.conteudo}>
                    <h1 style={estilos.titulo}>Criar conta</h1>
                    <p style={estilos.subtitulo}>Leva menos de um minuto</p>

                    <form onSubmit={handleSubmit}>
                        <label style={estilos.label}>Nome completo</label>
                        <input value={nome} onChange={(e) => setNome(e.target.value)} style={estilos.input} required placeholder="Seu nome" />

                        <label style={estilos.label}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={estilos.input} required placeholder="seu@email.com" />

                        <label style={estilos.label}>Telefone</label>
                        <input value={telefone} onChange={(e) => setTelefone(e.target.value)} style={estilos.input} placeholder="(00) 00000-0000" />

                        <label style={estilos.label}>Senha</label>
                        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={estilos.input} required placeholder="••••••••" />

                        <label style={estilos.label}>Confirmar senha</label>
                        <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} style={estilos.input} required placeholder="••••••••" />

                        {erro && <p style={estilos.erro}>{erro}</p>}

                        <button type="submit" className="bf-botao" style={estilos.botao} disabled={carregando}>
                            {carregando ? 'Criando...' : 'Criar conta'}
                        </button>
                    </form>

                    <p style={estilos.linkTexto}>
                        Já tem conta? <Link to="/" style={estilos.link}>Entrar</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const estilos = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cores.fundo,
        fontFamily: fontes.corpo,
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
    },
    glow: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,197,71,0.1) 0%, transparent 70%)',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
    },
    card: {
        position: 'relative',
        backgroundColor: 'rgba(17, 19, 24, 0.92)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${cores.linha}`,
        borderRadius: raios.xl,
        width: '100%',
        maxWidth: '380px',
        overflow: 'hidden',
        boxShadow: sombras.elevada,
    },
    poste: {
        height: '6px',
        width: '100%',
    },
    conteudo: {
        padding: '36px 32px 32px',
    },
    titulo: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '30px',
        fontWeight: 700,
        letterSpacing: '0.8px',
        textAlign: 'center',
        margin: 0,
    },
    subtitulo: {
        color: cores.textoSecundario,
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '8px',
        marginBottom: '28px',
    },
    label: {
        color: cores.textoSecundario,
        fontSize: '12px',
        fontWeight: 600,
        display: 'block',
        marginBottom: '8px',
        marginTop: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: raios.md,
        border: `1px solid ${cores.linha}`,
        backgroundColor: cores.superficieElevada,
        color: cores.texto,
        fontSize: '15px',
        fontFamily: fontes.corpo,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        colorScheme: 'dark',
    },
    botao: {
        width: '100%',
        padding: '16px',
        marginTop: '26px',
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
    erro: {
        color: cores.perigo,
        fontSize: '13px',
        marginTop: '14px',
        textAlign: 'center',
        background: 'rgba(248,113,113,0.1)',
        padding: '10px',
        borderRadius: raios.sm,
        border: '1px solid rgba(248,113,113,0.2)',
    },
    linkTexto: {
        color: cores.textoSecundario,
        fontSize: '13px',
        textAlign: 'center',
        marginTop: '24px',
    },
    link: {
        color: cores.dourado,
        fontWeight: 700,
        textDecoration: 'none',
    },
};

export default Cadastro;