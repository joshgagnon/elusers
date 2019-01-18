SELECT array_to_json(array_agg(row_to_json(q))) AS packet
FROM (
    SELECT
        packets.id,
        packets.created_by_user_id,
        packets.title,
        CASE WHEN COUNT(cdp.contact_id) > 0 THEN json_agg(cdp.contact_id) ELSE '[]'::json END AS contact_ids
    FROM deed_packets packets

    LEFT JOIN contact_deed_packet cdp ON packets.id = cdp.deed_packet_id

    WHERE
        packets.id = :deed_packet_id
        AND packets.created_by_user_id IN (SELECT user_ids_in_org(:org_id))
        AND packets.deleted_at IS NULL


    GROUP BY packets.id
) q