export interface PaymentMethod {
    id: number;
    name: string;
    maxValue: number;
    type: 'ELECTRONIC' | 'PHYSICAL';
}

export type PaymentMethodType = 'ELECTRONIC' | 'PHYSICAL'; 