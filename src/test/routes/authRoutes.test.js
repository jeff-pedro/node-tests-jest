import {
  afterEach, beforeEach, describe, expect,
} from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import AuthService from '../../services/authService.js';
import Usuario from '../../models/usuario.js';

const authService = new AuthService();

let servidor;
let usuario;

beforeEach(async () => {
  const porta = 3000;
  servidor = app.listen(porta);

  usuario = await authService.cadastrarUsuario({
    nome: 'Teste',
    email: 'test@test.com',
    senha: 'senha123',
  });
});

afterEach(async () => {
  servidor.close();
  await Usuario.excluir(usuario.content.id);
});

describe('Testando rota de login (POST)', () => {
  it('O login deve possuir um e-mail e senha para se autenticar', async () => {
    const loginMock = {
      email: 'test@test.com',
    };

    await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)
      .expect('"A senha de usuario é obrigatório."');
  });

  it('O login deve validar se o usuário está cadastrado', async () => {
    const loginMock = {
      email: 'test@test.com',
      senha: 'senha123',
    };

    await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(201);
  });

  it('O login deve validar e-mail e senha incorreto', async () => {
    const loginMock = {
      email: 'test@test.com',
      senha: 'errado123',
    };

    await request(servidor)
      .post('/login')
      .send(loginMock)
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Usuario ou senha invalido."');
  });

  it('O login deve validar se está sendo retornado um accessToken', async () => {
    const loginMock = {
      email: 'test@test.com',
      senha: 'senha123',
    };

    const res = await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(201);

    expect(res.body.message).toBe('Usuario conectado');
    expect(res.body).toHaveProperty('accessToken');
  });
});
