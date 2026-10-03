import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cores, fontes, sombras, raios } from '../theme';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const usuarioLogado = await login(email, senha);

            if (usuarioLogado.tipo === 'barbeiro') {
                navigate('/barbeiro/dashboard');
            } else if (usuarioLogado.tipo === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }
        } catch (erro) {
            setErro(erro.response?.data?.erro || 'Erro ao fazer login.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div style={estilos.container}>
            <div style={estilos.textura} />
            <div style={estilos.glow} />

            <div className="bf-fade-in" style={estilos.card}>
                <div className="bf-poste" style={estilos.poste} />

                <div style={estilos.conteudo}>
                    <div style={estilos.iconeWrapper}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M9.5 6.5L20 17M14.5 6.5L4 17" stroke={cores.dourado} strokeWidth="1.8" strokeLinecap="round" />
                            <circle cx="7" cy="17" r="2.3" stroke={cores.dourado} strokeWidth="1.8" />
                            <circle cx="17" cy="17" r="2.3" stroke={cores.dourado} strokeWidth="1.8" />
                        </svg>
                    </div>

                    <h1 style={estilos.titulo}>BarberFlow</h1>
                    <p style={estilos.subtitulo}>Entre para continuar</p>

                    <form onSubmit={handleSubmit}>
                        <label style={estilos.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={estilos.input}
                            required
                            placeholder="seu@email.com"
                        />

                        <label style={estilos.label}>Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            style={estilos.input}
                            required
                            placeholder="••••••••"
                        />

                        {erro && <p style={estilos.erro}>{erro}</p>}

                        <button type="submit" className="bf-botao" style={estilos.botao} disabled={carregando}>
                            {carregando ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <p style={estilos.linkTexto}>
                        Não tem conta? <Link to="/cadastro" style={estilos.link}>Criar conta</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const estilos = {
    container: {
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cores.fundo,
        fontFamily: fontes.corpo,
        overflow: 'hidden',
        padding: '24px',
    },
    textura: {
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        pointerEvents: 'none',
    },
    glow: {
        position: 'absolute',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,197,71,0.12) 0%, transparent 70%)',
        top: '50%',
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
        padding: '40px 32px 36px',
    },
    iconeWrapper: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: `linear-gradient(145deg, ${cores.superficieElevada}, ${cores.superficie})`,
        border: `1px solid ${cores.linha}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 0 24px rgba(232,197,71,0.12)',
    },
    titulo: {
        fontFamily: fontes.titulo,
        color: cores.texto,
        fontSize: '32px',
        fontWeight: 700,
        letterSpacing: '1px',
        textAlign: 'center',
        margin: 0,
    },
    subtitulo: {
        color: cores.textoSecundario,
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '8px',
        marginBottom: '32px',
    },
    label: {
        color: cores.textoSecundario,
        fontSize: '12px',
        fontWeight: 600,
        display: 'block',
        marginBottom: '8px',
        marginTop: '18px',
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
        marginTop: '28px',
    },
    link: {
        color: cores.dourado,
        fontWeight: 700,
        textDecoration: 'none',
    },
};

export default Login;