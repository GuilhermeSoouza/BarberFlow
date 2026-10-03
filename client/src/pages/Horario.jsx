import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cores, fontes, sombras, raios } from '../theme';

function gerarHorarios() {
    const horarios = [];
    for (let hora = 9; hora < 18; hora++) {
        horarios.push(`${String(hora).padStart(2, '0')}:00`);
        horarios.push(`${String(hora).padStart(2, '0')}:30`);
    }
    return horarios;
}

function Horario() {
    const [servico, setServico] = useState(null);
    const [barbeiro, setBarbeiro] = useState(null);
    const [data, setData] = useState('');
    const [horaSelecionada, setHoraSelecionada] = useState('');

    const navigate = useNavigate();
    const horarios = gerarHorarios();

    useEffect(() => {
        const servicoSalvo = localStorage.getItem('servicoEscolhido');
        const barbeiroSalvo = localStorage.getItem('barbeiroEscolhido');

        if (!servicoSalvo || !barbeiroSalvo) {
            navigate('/servicos');
            return;
        }

        setServico(JSON.parse(servicoSalvo));
        setBarbeiro(JSON.parse(barbeiroSalvo));

        const hoje = new Date().toISOString().split('T')[0];
        setData(hoje);
    }, [navigate]);

    function confirmarHorario() {
        if (!data || !horaSelecionada) return;
        localStorage.setItem('dataHoraEscolhida', `${data}T${horaSelecionada}:00`);
        navigate('/confirmacao');
    }

    if (!servico || !barbeiro) return null;

    const hoje = new Date().toISOString().split('T')[0];

    return (
        <div style={estilos.container}>
            <p style={estilos.etapa}>Etapa 3 de 4</p>
            <h2 style={estilos.titulo}>Escolha o horário</h2>
            <p style={estilos.subtitulo}>{servico.nome} com {barbeiro.nome}</p>

            <label style={estilos.label}>Data</label>
            <input
                type="date"
                value={data}
                min={hoje}
                onChange={(e) => { setData(e.target.value); setHoraSelecionada(''); }}
                style={estilos.inputData}
            />

            <label style={estilos.label}>Horário</label>
            <div style={estilos.grade}>
                {horarios.map((hora) => (
                    <button
                        key={hora}
                        onClick={() => setHoraSelecionada(hora)}
                        style={{
                            ...estilos.botaoHora,
                            ...(horaSelecionada === hora ? estilos.botaoHoraAtivo : {}),
                        }}
                    >
                        {hora}
                    </button>
                ))}
            </div>

            <button
                onClick={confirmarHorario}
                disabled={!data || !horaSelecionada}
                className="bf-botao"
                style={estilos.botaoContinuar}
            >
                Continuar
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
        margin: '4px 0 2px',
    },
    subtitulo: {
        color: cores.textoSecundario,
        fontSize: '13px',
        marginBottom: '28px',
    },
    label: {
        color: cores.textoSecundario,
        fontSize: '12px',
        fontWeight: 600,
        display: 'block',
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    inputData: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: raios.md,
        border: `1px solid ${cores.linha}`,
        backgroundColor: cores.superficieElevada,
        color: cores.texto,
        fontSize: '15px',
        fontFamily: fontes.corpo,
        marginBottom: '24px',
        colorScheme: 'dark',
        boxSizing: 'border-box',
    },
    grade: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        marginBottom: '32px',
    },
    botaoHora: {
        padding: '14px 8px',
        borderRadius: raios.md,
        border: `1px solid ${cores.linha}`,
        backgroundColor: cores.superficie,
        color: cores.texto,
        fontSize: '14px',
        fontFamily: fontes.corpo,
        cursor: 'pointer',
    },
    botaoHoraAtivo: {
        background: `linear-gradient(135deg, ${cores.dourado} 0%, ${cores.douradoEscuro} 100%)`,
        color: '#0c0c0c',
        border: 'none',
        fontWeight: 700,
    },
    botaoContinuar: {
        width: '100%',
        padding: '16px',
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
};

export default Horario;