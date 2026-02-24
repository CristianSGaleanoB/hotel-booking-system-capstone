export interface AppliedPromotion {
    name: string;
    description?: string;
    discountPercentage: number;
    type: 'festive' | 'kids' | 'group';
}