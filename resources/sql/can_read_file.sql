SELECT  CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END AS can_read_file

FROM deed_packet_record_file file_pivot

LEFT JOIN deed_packet_records records ON file_pivot.deed_packet_record_id = records.id

WHERE
    file_pivot.file_id = 3
    AND records.created_by_user_id IN (SELECT user_ids_in_org(1))
    AND records.deleted_at IS NULL;