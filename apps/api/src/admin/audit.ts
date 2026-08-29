import { assertUuid, pgQuery } from '../pg.js';
import { sqlText } from '../sql.js';

export async function auditAdmin(input: {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string;
  before?: unknown;
  after?: unknown;
}) {
  await pgQuery(`
    INSERT INTO veritas.admin_audit_log
      (actor_id, action, target_type, target_id, reason, before_data, after_data)
    VALUES (
      '${assertUuid(input.actorId)}'::uuid,
      ${sqlText(input.action)},
      ${sqlText(input.targetType)},
      ${sqlText(input.targetId)},
      ${input.reason ? sqlText(input.reason) : 'NULL'},
      ${input.before == null ? 'NULL' : `${sqlText(JSON.stringify(input.before))}::jsonb`},
      ${input.after == null ? 'NULL' : `${sqlText(JSON.stringify(input.after))}::jsonb`}
    )
  `);
}
