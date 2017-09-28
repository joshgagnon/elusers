SELECT id, title
FROM clients

WHERE
    clients.created_by_user_id IN (SELECT id FROM users WHERE organisation_id = :org_id)
    AND deleted_at IS NULL

ORDER BY title ASC