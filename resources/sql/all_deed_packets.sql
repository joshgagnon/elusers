WITH records AS (
    SELECT
        records.id, records.deed_packet_id, records.document_name, records.document_date, records.parties, records.matter_id, records.destruction_date, records.office_location_id, records.created_by_user_id, records.notes

    FROM deed_packet_records records

    LEFT JOIN deed_packets packets ON records.deed_packet_id = packets.id

    WHERE
        packets.created_by_user_id IN (SELECT user_ids_in_org(:org_id))
        AND packets.deleted_at IS NULL
        AND records.deleted_at IS NULL
        -- todo, remove packets where destruction date is before today
)

SELECT
    CASE WHEN COUNT(q.*) > 0 THEN array_to_json(array_agg(row_to_json(q))) ELSE '[]'::json END AS packets
FROM (
    SELECT
        packets.id,
        packets.title,
        packets.created_by_user_id,
        CASE WHEN COUNT(records.*) > 0 THEN json_agg(DISTINCT records.*) ELSE '[]'::json END AS records,
        CASE WHEN COUNT(cdp.*) > 0 THEN array_agg(DISTINCT cdp.contact_id) ELSE '{}' END AS contact_ids
    FROM deed_packets packets
        LEFT JOIN records ON packets.id = records.deed_packet_id
        LEFT JOIN contact_deed_packet cdp ON packets.id = cdp.deed_packet_id
    WHERE
        packets.deleted_at IS NULL
    GROUP BY packets.id, packets.title, packets.created_by_user_id
) q