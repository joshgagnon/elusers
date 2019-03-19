with file_counts as (
    select matter_id, count(files.id) as files_count
    from "files"
    join "matter_files" on "files"."id" = "matter_files"."file_id"
    where "protected" = false
    GROUP BY matter_id
), clients as (
    select matter_id, json_agg(row_to_json(c)::jsonb ||
    CASE
        WHEN contactable_type = 'Individual' THEN jsonb_build_object('contactable', ci.*)
        WHEN contactable_type = 'Company' THEN jsonb_build_object('contactable', cc.*)
        WHEN contactable_type = 'Trust' THEN jsonb_build_object('contactable', ct.*)
        WHEN contactable_type = 'Partnership' THEN jsonb_build_object('contactable', cp.*)

        ELSE null END
    ) as clients
    from matter_clients mc
    join contacts c on c.id = mc.contact_id
    left outer join contact_individuals ci on ci.id = c.contactable_id and contactable_type = 'Individual'
    left outer join contact_companies cc on cc.id = c.contactable_id and contactable_type = 'Company'
    left outer join contact_trusts ct on ct.id = c.contactable_id and contactable_type = 'Trust'
    left outer join contact_partnerships cp on cp.id = c.contactable_id and contactable_type = 'Partnership'
    group by matter_id
)
SELECT
CASE WHEN COUNT(q.*) > 0 THEN array_to_json(array_agg(row_to_json(q))) ELSE '[]'::json END AS matters
FROM (
select m.*, COALESCE(fc."files_count", 0) as files_count, c.clients as clients
from "matters" m

left outer join file_counts fc on fc.matter_id = m.id
left outer join clients c on c.matter_id = m.id
where m."organisation_id" = :orgId and m."deleted_at" is null
) q