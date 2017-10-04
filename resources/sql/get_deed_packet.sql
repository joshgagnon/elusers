SELECT packets.id, packets.created_by_user_id, packets.title
FROM deed_packets packets
WHERE
    id = :deed_packet_id
    AND packets.created_by_user_id IN (SELECT user_ids_in_org(:org_id))
    AND deleted_at IS NULL