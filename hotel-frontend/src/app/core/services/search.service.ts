import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { ApiConfigService } from "./api-config.service";
import { firstValueFrom } from "rxjs";
import { SearchResult } from "../interfaces/searchResult.interface";

@Injectable({
    providedIn: 'root',
})export class SearchService {
    readonly #http = inject(HttpClient);
    readonly #api = inject(ApiConfigService);
    readonly #url = this.#api.getApiUrl('search');

    public searchResults = signal<SearchResult[]>([]);
    public isLoading = signal(false);

    async search(query: string){
        this.isLoading.set(true);
        try{
            const response = await firstValueFrom(this.#http.get<SearchResult[]>(this.#url, {params: {query}}));
            this.searchResults.set(response);
        }catch(error){
            console.error('Error loading search results:', error);
        }finally{
            this.isLoading.set(false);
        }
    }

}