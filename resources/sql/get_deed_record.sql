SELECT
    id, deed_packet_id, document_name, document_date, parties, matter_id, destruction_date, office_location_id, created_by_user_id, notes
FROM deed_packet_records
WHERE
    id = :record_id
    AND created_by_user_id IN (SELECT user_ids_in_org(:org_id))
    AND deleted_at IS NULL
