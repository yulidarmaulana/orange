export interface Currency {
    code: string
    name: string
    symbol: string
    decimals: number
}

export const SUPPORTED_CURRENCIES: Currency[] = [
    { code: 'usd', name: 'US Dollar', symbol: '$', decimals: 2 },
    { code: 'eur', name: 'Euro', symbol: '€', decimals: 2 },
    { code: 'idr', name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 0 },
    { code: 'jpy', name: 'Japanese Yen', symbol: '¥', decimals: 0 },
    { code: 'gbp', name: 'British Pound', symbol: '£', decimals: 2 },
    { code: 'aud', name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
    { code: 'cad', name: 'Canadian Dollar', symbol: 'C$', decimals: 2 },
    { code: 'sgd', name: 'Singapore Dollar', symbol: 'S$', decimals: 2 },
    { code: 'myr', name: 'Malaysian Ringgit', symbol: 'RM', decimals: 2 },
    { code: 'thb', name: 'Thai Baht', symbol: '฿', decimals: 2 },
]

export function getCurrencySymbol(currencyCode: string): string {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode.toLowerCase())
    return currency?.symbol || '$'
}

export function formatCurrency(value: number, currencyCode: string): string {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode.toLowerCase())

    if (!currency) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code.toUpperCase(),
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals
    }).format(value)
}
