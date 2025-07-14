const validator = require('validator');
const TIPOS_VALIDOS = ['compra', 'venda'];
const pool = require('../db/postgres');

class Operacao {
	constructor(data, idDoUsuario) {
		this.data = data;
		this.errors = [];
		this.idDoUsuario = idDoUsuario;
	}
}

Operacao.prototype.validate = function () {
	let data = this.data.data;
	let ativo = this.data.ativo;
	let tipoDeOperacao = this.data.tipoDeOperacao;
	let quantidade = this.data.quantidade;
	let preco = this.data.preco;

	if (!validator.isDate(data)) {
		this.errors.push('Formato de data inválido.')
	}
	if (!ativo || typeof ativo !== 'string' || !/^[A-Z]{3,5}[0-9]{1,2}$/.test(ativo)) {
		this.errors.push('Código do ativo inválido. OBS: Digite as letras em Maiúsculas e o número de 1 a 2 dígitos.')
	}
	if (!validator.isIn(tipoDeOperacao, TIPOS_VALIDOS)) {
		this.errors.push('Selecione uma operação.');
	}
	if (!validator.isInt(quantidade)) {
		this.errors.push('Quantidade deve ser um número inteiro.')
	} else {
		quantidade = parseInt(quantidade)
		if (quantidade <= 0) {
			this.errors.push('Quantidade deve ser maior que zero.')
		}
	}
	if (!validator.isFloat(preco)) {
		this.errors.push('Preço deve ser um número real.')
	} else {
		preco = parseFloat(preco)
		if (preco <= 0) {
			this.errors.push('Preço deve ser maior que zero.')
		}
	}

	if (this.errors.length === 0) {
		const valorBruto = preco * quantidade;
		const taxaB3 = valorBruto * 0.0003;
		const valorLiquido = tipoDeOperacao === 'compra' ? (valorBruto + taxaB3) : (valorBruto - taxaB3);
		const validatedData = {
			data: data,
			ativo: ativo,
			tipoDeOperacao: tipoDeOperacao,
			quantidade: quantidade,
			preco: preco,
			valorBruto: valorBruto,
			taxaB3: taxaB3,
			valorLiquido: valorLiquido
		}
		this.data = validatedData;
		console.log('Operação validada:', this.data);
	}
}

Operacao.prototype.create = function () {
	return new Promise((resolve, reject) => {
		const query_sql = 'INSERT INTO operacoes (data, ativo, tipo_de_operacao, quantidade, preco, valor_bruto, taxa_b3, valor_liquido, usuario_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;'
		const dataOperacao = new Date(this.data.data)
		const values = [dataOperacao, this.data.ativo, this.data.tipoDeOperacao, this.data.quantidade, this.data.preco, this.data.valorBruto, this.data.taxaB3, this.data.valorLiquido, this.idDoUsuario]
		pool.query(query_sql, values, (error, result) => {
			if (error) {
				reject(`Erro ao inserir operação: ${error}`);
			} else {
				const idDaOperacaoSalva = result.rows[0].id;
				resolve(idDaOperacaoSalva);
			}
		});
	})
}

Operacao.prototype.readUserOperations = function () {
	return new Promise((resolve, reject) => {
		const query_sql = 'SELECT data, ativo, tipo_de_operacao, quantidade, preco, valor_bruto, taxa_b3, valor_liquido FROM operacoes WHERE usuario_id = $1 ORDER BY data DESC';
		const values = [this.idDoUsuario];
		pool.query(query_sql, values, (error, result) => {
			if (error) {
				reject(`Erro ao recuperar as operações do usuário: ${error}`);
			} else {
				const listaDeOperacoes = [];
				for (let i = 0; i < result.rows.length; i++) {
					const tupla = result.rows[i];
					const operacao = parseTupleToOperacao(tupla);
					listaDeOperacoes.push(operacao.data);
				}
				resolve(listaDeOperacoes);
			}
		});
	})
}

Operacao.prototype.update = function () {
	return new Promise((resolve, reject) => {
		const query_sql = 'UPDATE operacoes SET data = $1, ativo = $2, tipo_de_operacao = $3, quantidade = $4, preco = $5, valor_bruto = $6, taxa_b3 = $7, valor_liquido = $8 WHERE id = $9 AND usuario_id = $10';
		const dataOperacao = new Date(this.data.data)
		const values = [dataOperacao, this.data.ativo, this.data.tipoDeOperacao, this.data.quantidade, this.data.preco, this.data.valorBruto, this.data.taxaB3, this.data.valorLiquido, this.idDaOperacao, this.idDoUsuario];
		pool.query(query_sql, values, (error, result) => {
			if (error) {
				reject(`Erro ao atualizar operação: ${error}`);
			} else {
				resolve(result.rows);
			}
		});
	})
}

Operacao.prototype.delete = function () {
	return new Promise((resolve, reject) => {
		const query_sql = 'DELETE FROM operacoes WHERE id = $1 AND usuario_id = $2';
		const values = [this.idDaOperacao, this.idDoUsuario];
		pool.query(query_sql, values, (error, result) => {
			if (error) {
				reject(`Erro ao deletar operação: ${error}`);
			} else {
				resolve(result.rows);
			}
		});
	})
}

function parseTupleToOperacao(tupla) {
	const operacaoData = {
		data: tupla.data,
		ativo: tupla.ativo,
		tipoDeOperacao: tupla.tipo_de_operacao,
		quantidade: tupla.quantidade,
		preco: tupla.preco,
		valorBruto: tupla.valor_bruto,
		taxaB3: tupla.taxa_b3,
		valorLiquido: tupla.valor_liquido
	}
	
	const operacao = new Operacao(operacaoData, tupla.usuario_id)
	return operacao;
}

module.exports = Operacao;