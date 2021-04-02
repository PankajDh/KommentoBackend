import * as camelCase from 'camelcase';

export class Helper {
	static handleArrayRequestParamInGet(param: string | string[]) {
		if (!param) {
			return param;
		}
		if (typeof param === 'string') {
			param = param.trim();
			if (param === '') {
				return;
			}
			if (param === 'true') {
				return true;
			}
			if (param === 'false') {
				return false;
			}
			return [param];
		}
		if (param instanceof Array && param.length) {
			param = param.map((str) => {
				if (typeof str === 'string') {
					return str.trim();
				}
				return str;
			});
		}
		return param;
	}

	static handleBooleanRequestParamInGet(param: string) {
		switch (param.toString().trim().toLowerCase()) {
			case 'true':
				return true;
			case 'false':
				return false;
			default:
				throw new Error('Invalid value for boolean type');
		}
	}

	static handleNumberRequestParamInGet(param: string) {
		if (!param) {
			return param;
		}
		return Number(param);
	}

	static handleDateObjectRequestParamInGet(param: string) {
		if (!param) {
			return param;
		}
		return JSON.parse(decodeURI(param));
	}

	static isVoid(obj) {
		switch (typeof obj) {
			case 'undefined':
				return true;
			case 'object':
				if (obj instanceof Date) {
					return false;
				}
				for (const x in obj) {
					if (obj.hasOwnProperty(x)) {
						return false;
					}
					return true;
				}
				return true;
			case 'number':
			case 'boolean':
				return false;
			case 'string':
				if (obj === '' || obj === 'null' || obj === 'undefined') {
					return true;
				}
				return false;
			/* falls through */
			default:
				return false;
		}
	}

	static convertToCamelCaseObject(data: any) {
		const newData: any = {};
		let origKey: string;
		let newKey: string;
		let value: any;
		if (!data) {
			return data;
		}
		if (data instanceof Array) {
			return data.map((value) => {
				if (typeof value === 'object') {
					value = this.convertToCamelCaseObject(value);
				}
				return value;
			});
		}

		for (origKey in data) {
			if (data.hasOwnProperty(origKey)) {
				newKey = camelCase(origKey);
				value = data[origKey];
				if (
					value instanceof Array ||
					(!Helper.isVoid(value) &&
						typeof value === 'object' &&
						!(value instanceof Date))
				) {
					value = this.convertToCamelCaseObject(value);
				}
				newData[newKey] = value;
			}
		}
		return newData;
	}
}
