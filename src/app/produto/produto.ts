export interface Produto {
  id_produto?: number;
  cod_produto: number;
  desc_produto: string;
  qtd_produto: number;
  valor_compra_produto: number;
  valor_venda_produto: number;
  status_produto: string;
  categoria: {
    id_categoria: number;
  };
}
