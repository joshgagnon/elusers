CREATE OR REPLACE FUNCTION user_pdr(userId integer)
    RETURNS SETOF JSONB
AS $$
WITH  RECURSIVE
    date_range(first_record, last_record) AS (
        SELECT
            min(date),
            GREATEST(max(date), now())
        FROM professional_development_records
        WHERE user_id = $1 AND deleted_at IS NULL
    ),
    financial_years(start_date, end_date, year_ending) AS (
        SELECT
            date_trunc('day', start)::date,
            date_trunc('day', start + interval '1 year' - interval '1 day')::date,
            (date_part('year', start) + 1)::int
        FROM generate_series
             ( '2000-04-01'::timestamp
            , '2100-03-31'::timestamp
            , '1 year'::interval) start
    ),
    events AS (
        SELECT year_ending, pdr.*
        FROM financial_years
            LEFT OUTER JOIN professional_development_records pdr ON date >= start_date AND date < end_date AND user_id = $1
            JOIN date_range ON end_date >= first_record AND start_date <= last_record
        WHERE deleted_at IS NULL
        ORDER BY year_ending ASC
    ),
    totals (minutes, year_ending, row) AS (
        SELECT COALESCE(sum(minutes), 0), year_ending, row_number() OVER () FROM events GROUP BY year_ending
        ORDER BY year_ending
    ),
    carry_over (minutes, full_minutes, carry_over, year, current_row) AS (
        SELECT
            minutes, minutes, 0, year_ending, row
        FROM totals WHERE row = $1

        UNION ALL

        SELECT
            t.minutes,
            t.minutes + CASE WHEN co.full_minutes > 600 THEN LEAST(co.full_minutes - 600, 300) ELSE 0 END AS full_minutes,
            (CASE WHEN co.full_minutes > 600 THEN LEAST(co.full_minutes - 600, 300) ELSE 0 END)::integer as carry_over,
            year_ending,
            current_row + 1
        FROM totals t, carry_over co
        WHERE row = current_row + 1

    ),
    all_events AS (
        SELECT id, user_id, date, minutes, reflection, title, true as editable
        FROM professional_development_records pdr
        WHERE user_id = $1 AND deleted_at IS NULL

        UNION

        SELECT null, $1, make_date(year-1, 4, 1),  carry_over, null, 'Hours Carried Forward', false as editable
        FROM carry_over
        WHERE carry_over > 0
    ),
    all_years AS (
        SELECT year_ending,
            sum(minutes) as minutes,
            array_to_json(array_remove(array_agg(pdr ORDER BY date ASC, id ASC NULLS FIRST), null)) as records,
            year_ending
        FROM financial_years
            LEFT OUTER JOIN all_events pdr ON date >= start_date AND date < end_date AND user_id = $1
            JOIN date_range ON end_date >= first_record AND start_date <= last_record
        GROUP BY year_ending
        ORDER BY year_ending DESC
    )

SELECT jsonb_agg(q) FROM all_years q
$$ LANGUAGE SQL STABLE;