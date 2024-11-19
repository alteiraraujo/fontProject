export interface Colaborador {
  id_colaborador?: number;
  cargo_colaborador: "Administrador" | "Recepcionista" | "Veterinario";
  tipo_colaborador: string;
  senha_colaborador: string;
  login_colaborador: string;
  email_colaborador: string;
  tbl_pessoa_id: number;
  status_colaborador: string;
  nome_colaborador: string;
}
