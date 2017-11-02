SELECT array_to_json(array_agg(row_to_json(q))) AS record
FROM (
    SELECT
        records.id, deed_packet_id, document_name, document_date, parties, matter_id, destruction_date, office_location_id, created_by_user_id, notes
    FROM deed_packet_records records
    WHERE
        records.id = :record_id
        AND records.created_by_user_id IN (SELECT user_ids_in_org(:org_id))
        AND records.deleted_at IS NULL
) q