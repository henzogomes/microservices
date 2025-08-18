export interface Order {
    id: string;
    userId: string;
    product: string;
    quantity: number;
    status: 'pending' | 'completed' | 'canceled';
}

export interface OrderRequest {
    userId: string;
    product: string;
    quantity: number;
}