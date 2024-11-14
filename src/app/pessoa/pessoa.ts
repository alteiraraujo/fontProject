export interface Pessoa {
    id_pessoa?: number;
    nome_pessoa: string;
    cpf_pessoa: string;
    data_nascimento_pessoa: Date;
    rua_pessoa: string;
    complemento_pessoa: string;
    cep_pessoa: string;
    numero_pessoa: string;
    genero_pessoa: "Masculino" | "Feminino" | "Outro";
    bairro_pessoa: string;
    status_pessoa: string;
    cidade_pessoa: string;
    estado_pessoa: string;
    uf_pessoa: string;
    telefone_pessoa: string;
}
