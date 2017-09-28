SELECT clients.title AS client_title, deed_files.id, client_id, document_date, parties, matter, deed_files.created_at, deed_files.created_by_user_id
FROM clients

RIGHT JOIN deed_files ON clients.id = deed_files.client_id

WHERE
    clients.created_by_user_id IN (SELECT id FROM users WHERE organisation_id = :org_id)
    AND deleted_at IS NULL

ORDER BY
    clients.title ASC,
    deed_files.created_at ASC