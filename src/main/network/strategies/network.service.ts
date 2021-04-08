import { Injectable } from '@nestjs/common';
import * as requestPromise from 'request-promise';
import * as request from 'request';

const TIMEOUT = 300000;
@Injectable()
export class NetworkService {
	async get(url: string, params: any, headers?: any, options?: any): Promise<any> {
        return requestPromise(url, {
            headers: {
                ...headers,
                'User-Agent': 'Request-Promise',
            },
            method: 'GET',
            qs: params,
            json: true,
            // resolveWithFullResponse: true,
            timeout: TIMEOUT,
            ...options,
        });
	}
	async post(url: string, params: any, headers?: any, options?: any): Promise<any> {
        return requestPromise(url, {
            headers,
            method: 'POST',
            body: params,
            json: true,
            resolveWithFullResponse: true,
            timeout: TIMEOUT,
            ...options,
        });	
	}

	async patch(url: string, params: any, headers?: any, options?: any): Promise<any> {
        return requestPromise(url, {
            headers,
            method: 'PATCH',
            body: params,
            json: true,
            resolveWithFullResponse: true,
            timeout: TIMEOUT,
            ...options,
        });
	}

	getStream(url: string, params: any, headers?: any, options?: any): any {
		return request.get(url, {
			headers,
			method: 'GET',
			qs: params,
			...options,
		});
	}

	postStream(url: string, params: any, headers?: any, options?: any): any {
		return request.post(url, {
			headers,
			method: 'POST',
			body: params,
			json: true,
			...options,
		});
	}
}
