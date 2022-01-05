WITH contact_informations AS (
    SELECT ccinfo.contact_id as id,
           array_to_json(array_agg(row_to_json(cinfo)))::jsonb as data
    FROM contact_contact_information ccinfo
             join contact_information cinfo on cinfo.id = ccinfo.contact_information_id
    WHERE cinfo.type = 'phone' or cinfo.type = 'email'
    GROUP BY ccinfo.contact_id
), contact_json as (
    select c.id, row_to_json(c)::jsonb || jsonb_build_object('contact_informations', cinfo.data) ||
                                                            CASE
                                                                WHEN contactable_type = 'Individual' THEN jsonb_build_object('contactable', ci.*)
                                                                WHEN contactable_type = 'Company' THEN jsonb_build_object('contactable', cc.*)
                                                                WHEN contactable_type = 'Trust' THEN jsonb_build_object('contactable', ct.*)
                                                                WHEN contactable_type = 'Partnership' THEN jsonb_build_object('contactable', cp.*)
                                                                WHEN contactable_type = 'Court' THEN jsonb_build_object('contactable', crt.*)
                                                                WHEN contactable_type = 'Bank' THEN jsonb_build_object('contactable', cbk.*)

                                                                ELSE null END

         as cj
    from contacts c
        JOIN contact_informations cinfo on cinfo.id = c.id
             left outer join contact_individuals ci on ci.id = c.contactable_id and contactable_type = 'Individual'
             left outer join contact_companies cc on cc.id = c.contactable_id and contactable_type = 'Company'
             left outer join contact_trusts ct on ct.id = c.contactable_id and contactable_type = 'Trust'
             left outer join contact_partnerships cp on cp.id = c.contactable_id and contactable_type = 'Partnership'
             left outer join contact_courts crt on crt.id = c.contactable_id and contactable_type = 'Court'
             left outer join contact_banks cbk on cbk.id = c.contactable_id and contactable_type = 'Bank'
)
SELECT
    CASE WHEN COUNT(q.*) > 0 THEN array_to_json(array_agg(q.cj)) ELSE '[]'::json END AS contacts
FROM (
SELECT cj from contacts c
JOIN contact_json cj on c.id = cj.id
where c."organisation_id" = :orgId and c."deleted_at" is null and cj.cj IS NOT NULL
    ORDER BY c.name ASC
    ) q



