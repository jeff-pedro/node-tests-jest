/* eslint-disable import/no-extraneous-dependencies */
import {
  describe, expect, it,
} from '@jest/globals';
import bcryptjs from 'bcryptjs';
import AuthService from '../../services/authService';
import Usuario from '../../models/usuario.js';

const authService = new AuthService();

describe('Testando authService.cadastrarUsuario', () => {
  it('O usuário deve possuir um nome, email e senha', async () => {
    // arrange
    const usuarioMock = {
      nome: 'Test',
      email: 'test@mail.com',
    };

    // act
    const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);

    // assert
    await expect(usuarioSalvo).rejects.toThrowError('A senha do usuário é obrigatório!');
  });

  it('A senha do usuário precisa ser criptografada quando for salva no banco de dados', async () => {
    const usuarioMock = {
      nome: 'Jonh Doe',
      email: 'jonh@mail.com',
      senha: 'secret123',
    };

    const resultado = await authService.cadastrarUsuario(usuarioMock);
    const senhasIguais = await bcryptjs.compare('secret123', resultado.content.senha);

    await expect(senhasIguais).toStrictEqual(true);

    await Usuario.excluir(resultado.content.id);
  });

  it('Ao cadastrar um usuário deve ser retornada uma mensagem informando que o cadastro foi realizado', async () => {
    const usuarioMock = {
      nome: 'Marry',
      email: 'marry@mail.com',
      senha: 'secret123',
    };

    const resultado = await authService.cadastrarUsuario(usuarioMock);

    await expect(resultado.message).toEqual('usuario criado');

    await Usuario.excluir(resultado.content.id);
  });

  it('Ao cadastrar um usuário, validar o retorno das informações do usuário', async () => {
    const usuarioMock = {
      nome: 'Jack',
      email: 'jack@mail.com',
      senha: 'secret123',
    };

    const resultado = await authService.cadastrarUsuario(usuarioMock);

    await expect(resultado.content).toMatchObject(usuarioMock);

    await Usuario.excluir(resultado.content.id);
  });

  it.skip('Não pode ser cadastrado um usuário com e-mail duplicado', async () => {
    const usuarioMock = {
      nome: 'Luana',
      email: 'teste@gmail.com',
      senha: 'secret123',
    };

    const resultado = await authService.cadastrarUsuario(usuarioMock);

    await expect(resultado).rejects.toThrowError('O email já está cadastrado!');

    await Usuario.excluir(resultado.content.id);
  });
});
