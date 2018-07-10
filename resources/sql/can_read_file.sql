SELECT  (EXISTS(
    SELECT *
    FROM deed_packet_record_file f
    JOIN deed_packet_records record ON f.deed_packet_record_id = record.id
    JOIN users owner on record.created_by_user_id = owner.id
    JOIN users org_members on org_members.organisation_id = owner.organisation_id and org_members.id = :user_id
    WHERE
        f.file_id = :file_id
        AND record.deleted_at IS NULL
)

OR EXISTS(
    SELECT *
    FROM users u
    JOIN organisation_files of ON of.organisation_id = u.organisation_id
    WHERE
        u.id = :user_id AND
        of.file_id = :file_id AND
        of.deleted_at IS NULL



)

OR EXISTS(
    SELECT *
    FROM users u
    JOIN contacts c ON c.organisation_id = u.organisation_id
    LEFT OUTER JOIN contact_files cf ON cf.contact_id = c.id
    WHERE
        u.id = :user_id AND
        cf.file_id = :file_id AND
        cf.deleted_at IS NULL


)

OR EXISTS(
    SELECT *
    FROM users u
    JOIN contacts c ON c.organisation_id = u.organisation_id
    LEFT OUTER JOIN access_tokens ac on ac.model_id = c.id and ac.model_type = 'App\Contact'
    LEFT OUTER JOIN access_token_files af ON af.access_token_id = c.id
    WHERE
        u.id = :user_id AND
        af.file_id = :file_id

)

OR EXISTS(
    SELECT *
    FROM users u
    JOIN matters m ON m.organisation_id = u.organisation_id
    LEFT OUTER JOIN matter_files mf on m.id = mf.matter_id

    WHERE
        u.id = :user_id AND
        mf.file_id = :file_id

)

) as exists;
