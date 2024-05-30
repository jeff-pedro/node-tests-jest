import LivroImagem from '../models/livro_imagem.js';

class LivrosImagensService {
  async listarImagens() {
    try {
      const resultado = await LivroImagem.pegarImagens();

      return resultado;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async listarImagemPorId(id) {
    try {
      const resultado = await LivroImagem.pegarPeloId(id);

      return resultado;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async cadastrarImagem(req) {
    try {
      const buffer = req.file.buffer;
      const base64Image = buffer.toString('base64');

      const data = {
        livro_id: req.body.livroId,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        base64: base64Image,
      };

      if (!data.livro_id) {
        throw new Error('O id do livro é obrigatório.');
      }

      if (data.mimetype !== 'image/png' && data.mimetype !== 'image/jpg') {
        throw new Error(`O formato ${data.mimetype} não é permitido.`);
      }

      if (data.size > 5000) {
        throw new Error('O limite para upload de imagem é de 5000kb.');
      }

      const imagem = new LivroImagem(data);
      const resposta = await imagem.salvar(imagem);

      return { message: 'imagem criado', content: resposta };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async atualizarImagem(id, body) {
    try {
      const imagemAtual = await LivroImagem.pegarPeloId(id);
      const imagemLivro = new LivroImagem({ ...imagemAtual, ...body });
      const resposta = await imagemLivro.salvar(imagemLivro);

      return { message: 'imagem atualizado', content: resposta };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async excluirImagemLivro(id) {
    try {
      await LivroImagem.excluir(id);

      return { message: 'imagem excluído' };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default LivrosImagensService;
