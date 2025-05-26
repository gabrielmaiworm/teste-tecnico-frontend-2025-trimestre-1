export interface Address {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
}

export interface Contact {
    id: string;
    userName: string;
    displayName: string;
    cep: string;
    address: Address;
}

export interface Toast {
    message: string;
    type: 'success' | 'error' | 'warning';
}