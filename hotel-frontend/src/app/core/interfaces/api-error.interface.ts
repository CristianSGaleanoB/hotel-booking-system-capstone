export interface ApiError {
    status: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
}