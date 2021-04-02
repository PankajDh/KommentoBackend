import { Injectable } from '@nestjs/common';
import * as pg from 'pg';
import { Helper } from '../../../helper';
import { ApplyForCommentaryDto } from '../dto/applyForCommentary.dto';
import { UserJoinedDto } from '../dto/userJoined.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require('../../../../ormconfig.json');

@Injectable()
export class UsersService {
	async addLoginDetails(phoneNumber: string): Promise<any> {
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
				`select * from users where phone_number=$1`,
				[phoneNumber],
			);

			let userDetails;
			if (queryResult?.rows[0]) {
				const updateResults = await pool.query(
					`update users set last_login = $1 returning *`,
					[new Date()],
				);
				userDetails = updateResults?.rows[0];
			} else {
				const insertResults = await pool.query(
					`insert into users(phone_number, last_login) values($1, $2) returning *`,
					[phoneNumber, new Date()],
				);
				userDetails = insertResults?.rows[0];
			}
			await pool.end();
			return Helper.convertToCamelCaseObject(userDetails);
		} catch (err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}
	}

	async startKyc(params: ApplyForCommentaryDto): Promise<void> {
		let pool;
		try {
			const { canCall, email, userId } = params;
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			await pool.query(
				`update users set email=$1, can_call=$2, kyc_requested_at=now(), kyc_status='REQUESTED' where id=$3`,
				[email.trim(), canCall, userId],
			);
			await pool.end();
		} catch (err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}
	}

	async userJoinedMatch(params: UserJoinedDto): Promise<void> {
		const { matchId, userId, currentState } = params;
		let pool;
		try {
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			const selectResult = await pool.query(
				`select * from user_match_relation where user_id=$1 and match_id=$2`,
				[userId, matchId],
			);

			const userMatchRelation = selectResult.rows[0];
			const newJoinDetails = {
				event_time: new Date(),
				status: currentState,
			};
			if (userMatchRelation) {
				const totalJoinDetails = userMatchRelation.join_details ?? [];
				totalJoinDetails.push(newJoinDetails);

				await pool.query(
					`update user_match_relation set current_state=$1, join_details=$2 where id = $3`,
					[
						currentState,
						JSON.stringify(totalJoinDetails),
						userMatchRelation.id,
					],
				);
			} else {
				await pool.query(
					`insert into user_match_relation(user_id,match_id,current_state,join_details) values($1,$2,$3,$4)`,
					[
						userId,
						matchId,
						currentState,
						JSON.stringify([newJoinDetails]),
					],
				);
			}
			await pool.end();
		} catch (err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}
	}
}
