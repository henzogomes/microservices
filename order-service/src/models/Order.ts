export interface Order {
    id: string;
    userId: string;
    product: string;
    quantity: number;
    price: number;
    status: 'pending' | 'completed' | 'canceled';
}