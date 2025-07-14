const validator = require('validator');
const bcrypt = require("bcryptjs")
const pool = require('../db/postgres');

class CadastroUsuario {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }
}

CadastroUsuario.prototype.validate = function() {
    this.validateUsername(this.data.username);
    this.validateEmail(this.data.email)
    this.validatePassword(this.data.password1);
    this.validatePassword(this.data.password2);

    
    if (!this.data.email || !validator.isEmail(this.data.email)) {
        this.errors.push('Email é obrigatorio e com o formato correto.');
    }
    
    if (this.data.password1 !== this.data.password2) {
        this.errors.push('Os passwords não conferem.');
    }

    if (!this.data.nome || typeof this.data.nome !== 'string') {
        this.errors.push('Nome é obrigatório e não deve conter números.');

    } else {
        if (!validator.isLength(this.data.nome, { min: 3, max: 30 })) {
            this.errors.push('Nome deve ter entre 3 e 30 caracteres.');
        }
    }

    if (!this.data.sobrenome || typeof this.data.sobrenome !== 'string') {
        this.errors.push('Sobrenome é obrigatório e não deve conter números.');

    } else {
        if (!validator.isLength(this.data.sobrenome, { min: 3, max: 30 })) {
            this.errors.push('Sobrenome deve ter entre 3 e 30 caracteres.');
        }
    }

    if (this.errors.length === 0) {
        const validatedData = {
            username: this.data.username,
            nome: this.data.nome,
            sobrenome: this.data.sobrenome,
            email: this.data.email,
            password: this.data.password1,
        };
        this.data = validatedData;
    }
}

CadastroUsuario.prototype.validateUsername = function (username) {
    if (!username || typeof username !== 'string') {
        this.errors.push('username é obrigatório e não deve conter números.');
    } else {
        if (!validator.isLength(username, { min: 5, max: 15 })) {
            this.errors.push('Nome de usuário deve ter entre 5 a 15 digitos.');
        }

        if (!validator.isAlphanumeric(username)) {
            this.errors.push('O nome de usuario deve conter letras e números');
        }
    }
}

CadastroUsuario.prototype.validatePassword = function (password) {
    if (!password || typeof password !== 'string') {
        this.errors.push('Password é obrigatório e deve ser uma string.');
    } else {
        if (!validator.isAlphanumeric(password)) {
            this.errors.push('Password não deve conter caracteres espéciais apenas letras e números.');
        }
        if (!validator.isLength(password, { min: 6, max: 15 })) {
            this.errors.push('Password deve ter entre 6 a 15 characters.');
        }
    }
}

CadastroUsuario.prototype.validateLogin = function () {
    this.validateUsername(this.data.username);
    this.validatePassword(this.data.password);

    if (this.errors.length === 0) {
        const validatedData = {
            username: this.data.username,
            password: this.data.password,
        };
        this.data = validatedData;
    }
}

CadastroUsuario.prototype.create = function () {
    return new Promise((resolve, reject) => {
        let salt = bcrypt.genSaltSync(10)
        this.data.password = bcrypt.hashSync(this.data.password, salt);
        const query_sql = 'INSERT INTO usuarios (username, password, email, nome, sobrenome) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const query_value = [this.data.username, this.data.password, this.data.email, this.data.nome, this.data.sobrenome];
        pool.query(query_sql, query_value, (error, result) => {
            if (error) {
                return reject(`Erro ao criar usuario: ${error}`);
            } else {
                const idDoUsuario = result.rows[0].id;
                resolve(idDoUsuario);
            }
        })
    });
}

CadastroUsuario.prototype.readOneByUsername = function (username) {
    return new Promise((resolve, reject) => {
        const query_sql = 'SELECT id, username, password, email, nome, sobrenome FROM usuarios WHERE username = $1';
        const query_value = [username];
        pool.query(query_sql, query_value, (error, result) => {
            if (error) {
                return reject(`Erro ao recuperar um usuario pelo username: ${error}`);
            } else {
                if (result.rows.length > 0) {
                    const tupla = result.rows[0];
                    const user = parseTupleToUser(tupla);
                    resolve(user);
                } else {
                    reject(`O Username: ${username} Não foi encontrado.`);
                }
            }
        });
    })
}

CadastroUsuario.prototype.update = function () {
    return new Promise((resolve, reject) => {
        let salt = bcrypt.genSaltSync(10)
        this.data.password = bcrypt.hashSync(this.data.password, salt);
        const query_sql = 'UPDATE usuarios SET username = $1, password = $2, email = $3, nome = $4, sobrenome = $5 WHERE id = $6';
        const query_value = [this.data.username, this.data.password, this.data.email, this.data.nome, this.data.sobrenome, this.idDoUsuario];
        pool.query(query_sql, query_value, (error, result) => {
            if (error) {
                return reject(`Erro ao atualizar usuario: ${error}`);
            } else {
                resolve(result.rows);
            }
        })
    })
}

CadastroUsuario.prototype.delete = function () {
    return new Promise((resolve, reject) => {
        const query_sql = 'DELETE FROM usuarios WHERE id = $1';
        const query_value = [this.idDoUsuario];
        pool.query(query_sql, query_value, (error, result) => {
            if (error) {
                return reject(`Erro ao deletar usuario: ${error}`);
            } else {
                resolve(result.rows);
            }
        })
    })
}

function parseTupleToUser(tupla) {
    const user = new CadastroUsuario({
        id: tupla.id,
        username: tupla.username,
        password: tupla.password,
        email: tupla.email,
        nome: tupla.nome,
        sobrenome: tupla.sobrenome
    });
    
    return user;
}

CadastroUsuario.prototype.login = function () {
    return new Promise((resolve, reject) => {
        this.readOneByUsername(this.data.username)
            .then((user) => {
                if (bcrypt.compareSync(this.data.password, user.data.password)) {
                    const loginData = {
                        id: user.data.id,
                        username: user.data.username
                    }
                    resolve(loginData);
                } else {
                    reject(`A Senha do úsuario ${this.data.username}, Está incorreta`);
                }
            })
            .catch((error) => {
                reject(error);
            });
    })
}

module.exports = CadastroUsuario;