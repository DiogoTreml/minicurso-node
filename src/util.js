export function validateProp(req, res, next) {
  const { prop } = req.params;
  const validProps = ["classe", "raca", "habilidade"];

  if (!validProps.includes(prop)) {
    res.status(400).json({ message: "Propriedade inválida" });
  } else {
    next();
  }
}

export const handleResponse = (_, res) => {
  if (res.locals.status && res.locals.data) {
    res.status(res.locals.status).json(res.locals.data);
  } else {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const statusErro = {
  status: 500,
  data: { message: "Erro desconhecido" },
};
