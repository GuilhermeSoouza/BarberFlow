const db = require('../config/database');

async function criarPagamento({ atendimento_id, valor, forma_pagamento = 'dinheiro' }) {
    const [resultado] = await db.query(
        `INSERT INTO pagamentos (atendimento_id, valor, forma_pagamento, status, pago_em)
         VALUES (?, ?, ?, 'pago', NOW())`,
        [atendimento_id, valor, forma_pagamento]
    );
    return resultado.insertId;
}

module.exports = { criarPagamento };