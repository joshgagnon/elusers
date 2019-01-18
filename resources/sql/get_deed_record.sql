WITH file_list AS (
    SELECT array_agg(f.*)
    FROM deed_packet_record_file dprf
    JOIN files f on dprf.file_id = f.id
    WHERE
        dprf.deed_packet_record_id = :record_id
)

SELECT array_to_json(array_agg(row_to_json(q))) AS record
FROM (
    SELECT
        records.id, deed_packet_id, document_name, document_date, parties, matter_id, destruction_date, office_location_id, created_by_user_id, notes, (SELECT * FROM file_list) as files
    FROM deed_packet_records records
    WHERE
        records.id = :record_id
        AND records.created_by_user_id IN (SELECT user_ids_in_org(:org_id))
        AND records.deleted_at IS NULL
) q