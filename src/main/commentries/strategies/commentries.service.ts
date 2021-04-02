import { Injectable } from '@nestjs/common';
import * as pg from 'pg';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require('../../../../ormconfig.json');

@Injectable()
export class CommentriesService {
	async getCommentriesByMatch(params: any): Promise<any | undefined> {
		let pool;
		try {
			const { matchId } = params;
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			const queryResult = await pool.query(
				`select 
                    commentries.id as id,
                    commentries.channel_name as "channelName",
                    commentries.language as "language",
                    commentries.speaker_alias_name as "speakerAliasName"
                    from commentries
                    where 
                    match_id=$1 and current_state = 'LIVE'`,
				[matchId],
			);
			await pool.end();
			return queryResult.rows;
		} catch (err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}
	}
}
