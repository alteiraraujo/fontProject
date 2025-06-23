export interface Diagnostico {
  id_diagnostico?: number;
  data_diagnostico: Date;
  descricao_diagnostico: string;
  status_diagnostico: string;
  animal: {
    id_animal: number;
    nome_animal: string;
  };
}
