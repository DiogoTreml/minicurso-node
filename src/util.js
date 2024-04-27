export function validateProp(req, res, next) {
  const { prop } = req.params;
  const validProps = ["classe", "raca", "item", "habilidade"];

  if (!validProps.includes(prop)) {
    res.status(400).json({ message: "Propriedade inválida" });
  } else {
    next();
  }
}

export const statusErro = {
  status: 500,
  data: { message: "Erro desconhecido" },
};
