export interface Cotacao {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    varBid: string;
    pctChange: string;
    bid: string;
    ask: string;
    timestamp: string;
    create_date: string;
}

export interface CotacaoSimplificada {
    ask: string;
    pctChange: string;
    create_date:string;
}
