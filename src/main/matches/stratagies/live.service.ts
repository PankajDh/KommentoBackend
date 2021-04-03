/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import * as pg from 'pg';
import { Helper } from '../../../helper';
const ormConfig = require('../../../../ormconfig.json');

@Injectable()
export class LiveService {
	// constructor() {}

	async getMatches(type:string) {
		let pool;
		try {
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			const queryResult = await pool.query(
				`select * from matches where type = $1`,[type],
			);
			await pool.end();
			return Helper.convertToCamelCaseObject(queryResult.rows);
		} catch (err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}
	}
}
