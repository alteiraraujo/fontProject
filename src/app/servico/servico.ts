import { Produto } from "../produto/produto";

export interface Servico {
  id_servico?: number;
  data_servico: Date;
  status_servico: string;
  valor_servico: number;
  obs_servico: string;
  animal: {
    id_animal: number;
  };
}

export interface ServicoItem {
  produto: Produto | null;
  produtoSearch?: string; // nome digitado, opcional
  qtd: number;
  valor: number;
}
