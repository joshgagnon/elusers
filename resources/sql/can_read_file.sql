SELECT  EXISTS(
    SELECT *
    FROM deed_packet_record_file f
    JOIN deed_packet_records record ON f.deed_packet_record_id = record.id
    JOIN users owner on record.created_by_user_id = owner.id
    JOIN users org_members on org_members.organisation_id = owner.organisation_id and org_members.id = :user_id
    WHERE
        f.file_id = :file_id
        AND record.deleted_at IS NULL
    );