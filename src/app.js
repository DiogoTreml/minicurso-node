import express from "express";
import {
  deleteProp,
  getProp,
  postProp,
  putProp,
} from "./controllers/propsController.js";
import { validateProp, handleResponse } from "./util.js";
import {
  deletePersonagem,
  getPersonagemById,
  getPersonagens,
  postPersonagem,
  putPersonagem,
} from "./controllers/personagemController.js";

const app = express();
const port = parseInt(process.env.PORT) || 3000;

app.use(express.json());

const apiRouter = express.Router();

//--------------------------------------------------------

apiRouter.get(
  "/prop/:prop",
  validateProp,
  async (req, res, next) => {
    const prop = req.params.prop;

    const { status, data } = await getProp(prop);
    res.locals.status = status;
    res.locals.data = data;
    next();
  },
  handleResponse
);

apiRouter.post(
  "/prop/:prop",
  validateProp,
  async (req, res, next) => {
    const prop = req.params.prop;
    const { nome, descricao } = req.body;

    const { status, data } = await postProp(prop, {
      nome,
      descricao,
    });
    res.locals.status = status;
    res.locals.data = data;
    next();
  },
  handleResponse
);

apiRouter.put(
  "/prop/:prop/",
  validateProp,
  async (req, res, next) => {
    const { prop } = req.params;
    const { id, nome, descricao } = req.body;

    const { status, data } = await putProp(prop, {
      nome,
      descricao,
      id,
    });

    res.locals.status = status;
    res.locals.data = data;
    next();
  },
  handleResponse
);

apiRouter.delete(
  "/prop/:prop",
  validateProp,
  async (req, res, next) => {
    const { prop } = req.params;
    const { id } = req.body;

    const { status, data } = await deleteProp(prop, id);

    res.locals.status = status;
    res.locals.data = data;
    next();
  },
  handleResponse
);

//----------------------------------------------------------

apiRouter.get(
  "/personagem",
  async (_, res, next) => {
    const { status, data } = await getPersonagens();

    res.locals.status = status;
    res.locals.data = data;
    next();
  },
  handleResponse
);

apiRouter.get(
  "/personagem/:id",
  async (req, res, next) => {
    const { id } = req.params;

    const { status, data } = await getPersonagemById(id);

    res.locals.status = status;
    res.locals.data = data;
    next();
  },
  handleResponse
);

apiRouter.post(
  "/personagem",
  async (req, res, next) => {
    const { nome, classe, raca, habilidades } = req.body;

    const { status, data } = await postPersonagem({
      nome,
      classe,
      raca,
      habilidades,
    });

    res.locals.status = status;
    res.locals.data = data;
    next();
  },
  handleResponse
);

apiRouter.put(
  "/personagem",
  async (req, res, next) => {
    const { id, nome, classe, raca, habilidades } = req.body;

    const { status, data } = await putPersonagem({
      id,
      nome,
      classe,
      raca,
      habilidades,
    });

    res.locals.status = status;
    res.locals.data = data;
    next();
  },
  handleResponse
);

apiRouter.delete(
  "/personagem",
  async (req, res, next) => {
    const { id } = req.body;

    const { status, data } = await deletePersonagem(id);

    res.locals.status = status;
    res.locals.data = data;
    next();
  },
  handleResponse
);

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
