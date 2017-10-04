WITH records AS (
    SELECT
        records.id, records.deed_packet_id, records.document_name, records.document_date, records.parties, records.matter_id, records.destruction_date, records.office_location_id, records.created_by_user_id

    FROM deed_packet_records records

        LEFT JOIN deed_packets packets ON records.deed_packet_id = packets.id

    WHERE
        packets.created_by_user_id IN (SELECT user_ids_in_org(:org_id))
        AND packets.deleted_at IS NULL
        -- todo, remove packets where destruction date is before today
)

SELECT array_to_json(array_agg(row_to_json(q))) AS packets
FROM (
    SELECT
        packets.id,
        packets.title,
        packets.created_by_user_id,
        CASE WHEN COUNT(records.*) > 0 THEN json_agg(records.*) ELSE '[]'::json END AS records
    FROM deed_packets packets
        LEFT JOIN records ON packets.id = records.deed_packet_id
    WHERE
        packets.deleted_at IS NULL
    GROUP BY packets.id, packets.title, packets.created_by_user_id
) q