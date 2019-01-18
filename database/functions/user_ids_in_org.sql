CREATE OR REPLACE FUNCTION user_ids_in_org(org_id INTEGER)
    RETURNS SETOF integer

    AS $$
        SELECT id FROM users WHERE organisation_id = $1
    $$

    LANGUAGE SQL STABLE;