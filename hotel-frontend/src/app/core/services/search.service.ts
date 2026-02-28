import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { ApiConfigService } from "./api-config.service";
import { firstValueFrom } from "rxjs";
import { SearchResult } from "../interfaces/searchResult.interface";
import { SearchFilters } from "../interfaces/search-filters.interface";

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    readonly #http = inject(HttpClient);
    readonly #api = inject(ApiConfigService);
    readonly #url = this.#api.getApiUrl('search');

    public searchResults = signal<SearchResult[]>([]);
    public isLoading = signal(false);
    public lastFilters = signal<SearchFilters | null>(null);

    async search(filters: SearchFilters, hotelDescriptions?: Map<string, string>) {
        this.lastFilters.set(filters);
        this.isLoading.set(true);
        let params = new HttpParams();
        
        const filterEntries = Object.entries(filters) as [keyof SearchFilters, string | number | Date | null | undefined][];
        
        filterEntries.forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params = params.append(key, value instanceof Date ? value.toISOString() : value.toString());
            }
        });

        try {
            const response = await firstValueFrom(this.#http.get<SearchResult[]>(this.#url, { params }));
            const enriched = response.map(result => ({
                ...result,
                description: hotelDescriptions?.get(result.hotelId) ?? ''
            }));
            this.searchResults.set(enriched);
        } catch (error) {
            this.searchResults.set([]);
            throw error;
        } finally {
            this.isLoading.set(false);
        }
    }
}