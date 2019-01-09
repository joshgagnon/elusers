CREATE OR REPLACE FUNCTION files_in_org(org_id INTEGER)
    RETURNS TABLE (file_id integer, path text)

    AS $$
        SELECT file_id AS file_id, 'Matter Files/' || m.matter_number as path 
            FROM matter_files mf 
            JOIN matters m on mf.matter_id = m.id
            WHERE organisation_id = $1
        
        UNION

        SELECT file_id AS file_id, 'Contact Files' as path 
            FROM contact_files cf
            JOIN contacts c on cf.contact_id = c.id
            WHERE organisation_id = $1

        UNION 

        SELECT file_id AS file_id, 'Organisation Files' as path  
            FROM organisation_files 

            WHERE organisation_id = $1
    $$

    LANGUAGE SQL STABLE;