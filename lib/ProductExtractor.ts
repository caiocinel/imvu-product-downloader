import type { ResponseType } from 'axios';
import JSZip from 'jszip';

import axios from 'axios';


export type ProductManifest = {
	id: number;
	revision: number;
	files: Array<{
		name: string;
		url?: string;
		original_dimensions?: string;
		tags?: string[];
	}>;
};

export class ProductExtractor {
	public async parse(product: number ): Promise<Buffer> {
		const { revision, files, id } = await this.manifest(product);

		const zip = new JSZip();


		for (const file of files) {
			const url = file.url ?? file.name;
			const buffer = await this.download(`${id}/${revision}/${url}`);
			
			zip.file(file.name, buffer);
			
		}

		return zip.generateAsync({ type: 'nodebuffer' });
	}

	private async manifest(product: number): Promise<ProductManifest> {
		const pid = product;

		let i: number;

		for (i = 1; i < 10; i++) {
			try {
				console.log(`/${pid}/${i}`)
				const response = await this.download(`/${pid}/${i}`);

				if (response.length === 0) {
					i--;
					break;
				}
			} catch {
				i--;
				break;
			}
		}

		if (i === 10) {
			throw new Error('Failed to download product after 10 attempts');
		}

		const files = await this.download<ProductManifest['files']>(
			`/${pid}/${i}/_contents.json`,
			'json'
		);

		return {
			id: parseInt(`${pid}`),
			revision: i,
			files,
		};
	}

	private async download<T = Buffer>(
		url: string,
		responseType: ResponseType = 'arraybuffer'
	): Promise<T> {
		console.log('https://userimages-akm.imvu.com/productdata')
		const response = await axios.get(url, {
			baseURL: 'https://userimages-akm.imvu.com/productdata',
			responseType,
		});


		return response.data;
	}
}
