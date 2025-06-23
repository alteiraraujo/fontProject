export interface Animal {
  id_animal?: number;
  nome_animal: string;
  //idade_animal: number;
  data_nascimento: Date;
  status_animal: string;
  pessoa: {
    id_pessoa: number;
    nome_pessoa?: string;
  };
  raca: {
    id_raca: number;
    nome_raca?: string;
  };
}
