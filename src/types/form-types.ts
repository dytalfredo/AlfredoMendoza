export type QuestionType = 'textarea' | 'radio' | 'text' | 'email' | 'tel';

export interface QuestionSchema {
    id: string;
    label: string;
    description?: string;
    placeholder?: string;
    type: QuestionType;
    options?: string[]; // For radio
    required?: boolean;
}

export interface SectionSchema {
    id: string;
    title: string;
    icon?: string; // Lucide icon name
    questions: QuestionSchema[];
}

export interface PaymentMethodSchema {
    id: 'zelle' | 'pagoMovil';
    label: string;
    details: string[]; // Lines of instructions
    fields: {
        id: string;
        label: string;
        placeholder: string;
        type: 'text' | 'email' | 'tel';
        maxLength?: number;
    }[];
}

export interface FormSchema {
    id: string;
    title: string;
    subtitle?: string;
    basePrice: number;
    currency: 'USD';
    sections: SectionSchema[];
    extras?: {
        id: string;
        title: string;
        description: string;
        price: number;
        negotiable?: boolean;
    }[];
    paymentMethods: PaymentMethodSchema[];
}
