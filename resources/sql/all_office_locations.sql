SELECT id, name
FROM office_locations
WHERE
    organisation_id = :org_id
    AND deleted_at IS NULL