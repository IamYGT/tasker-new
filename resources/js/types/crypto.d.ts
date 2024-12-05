export interface Network {
    id: string;
    name: string;
    symbol: string;
    chain: string;
    icon: string;
    validation_regex: string;
    explorer_url: string;
}

export interface UserCrypto {
    id: number;
    user_id: number;
    network_id: string;
    address: string;
    title: string;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface CryptoFormData {
    network_id: string;
    address: string;
    title: string;
    is_default: boolean;
}
