import { describe, expect } from '@jest/globals';
import AluguelLivroService from '../../services/aluguelLivroService.js';

const aluguelLivrosService = new AluguelLivroService();

describe('Testando AluguelLivroService', () => {
  it('Retorna a data de devolução do livro validando a quantidade de dias alugados', async () => {
    const dataAlugado = new Date('2024-01-01');
    const qtdDiasAlugados = 5;
    const dataDevocucaoMock = new Date('2024-01-06');

    const dataDevocucao = await aluguelLivrosService
      .calcularDataDevolucao(dataAlugado, qtdDiasAlugados);

    expect(dataDevocucao).toStrictEqual(dataDevocucaoMock);
  });
});
