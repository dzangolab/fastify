import { sql } from "slonik";
import { z } from "zod";

const schema = z.any();

const updateAtTriggerQuery = sql.type(schema)`
  --
  -- Create function to update the updated_at column for table.
  --

  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;


  --
  -- Create function that loops each table with certain filters and adds trigger that updates
  -- updated_at value.
  --

  CREATE OR REPLACE FUNCTION create_updated_at_trigger_to_all_tables()
  RETURNS void AS $$
  DECLARE
    table_name TEXT;
  DECLARE
    table_schema TEXT;
  BEGIN
    FOR table_name, table_schema IN
      SELECT
        c.table_name,
        c.table_schema
      FROM
        information_schema.columns c
        join information_schema.tables as t
        ON
        t.table_name = c.table_name
      WHERE
            c.column_name = 'updated_at'
            AND t.table_schema NOT IN ('pg_catalog', 'information_schema')
            AND t.table_schema NOT LIKE 'pg_toast%'
            AND t.table_schema NOT LIKE'pg_temp_%'
    LOOP
      IF NOT Exists(
          SELECT
            trigger_name
          FROM
            information_schema.triggers
          WHERE
            event_object_table = table_name
            AND trigger_name = CONCAT(table_name,'_updated_at_trigger')
            AND event_object_schema = table_schema
          )
      THEN
        EXECUTE 'CREATE OR REPLACE TRIGGER ' || table_name || '_updated_at_trigger BEFORE UPDATE ON ' || table_schema || '.' || table_name || ' FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()';
      END IF;
    END LOOP;
  END;
  $$ LANGUAGE plpgsql;


  --
  -- Create a function that executes create_updated_at_trigger_to_all_tables function as a Function.
  --

  CREATE OR REPLACE FUNCTION add_updated_at_trigger_to_all_existing_tables()
  RETURNS void AS $$
  BEGIN
    EXECUTE public.create_updated_at_trigger_to_all_tables();
  END;
  $$ LANGUAGE plpgsql;


  --
  -- Execute functino to add trigger to existing tables.
  --

  SELECT add_updated_at_trigger_to_all_existing_tables();


  --
  -- Create a function that executes create_updated_at_trigger_to_all_tables as a Trigger.
  --

  CREATE OR REPLACE FUNCTION add_updated_at_trigger_to_all_tables()
  RETURNS event_trigger AS $$
  BEGIN
    EXECUTE public.create_updated_at_trigger_to_all_tables();
  END;
  $$ LANGUAGE plpgsql;


  --
  -- Create function add_updated_at_trigger_to_all_tables that executes another function
  -- create_updated_at_trigger_to_all_tablesto add trigger to add trigger to any new table or altered table.
  --

  DROP EVENT TRIGGER IF EXISTS on_create_or_update_table CASCADE;

  CREATE EVENT TRIGGER
  on_create_or_update_table ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'ALTER TABLE')
  EXECUTE PROCEDURE add_updated_at_trigger_to_all_tables();


  -- Here, the only difference between functions
  -- add_updated_at_trigger_to_all_existing_tables and add_updated_at_trigger_to_all_tables
  -- is that add_updated_at_trigger_to_all_existing_tables is a function and executes
  -- create_updated_at_trigger_to_all_tables as function discernible by its return type
  -- RETURNS void AS $$.
  -- But, add_updated_at_trigger_to_all_tables
  -- returns create_updated_at_trigger_to_all_tables as a trigger discernible by its return type
  -- RETURNS event_trigger AS $$.
`;

export default updateAtTriggerQuery;
