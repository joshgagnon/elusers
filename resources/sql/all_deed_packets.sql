SELECT *
FROM deed_packets

WHERE
    deed_packets.created_by_user_id IN (SELECT id FROM users WHERE organisation_id = :org_id)
    AND deed_packets.deleted_at IS NULL