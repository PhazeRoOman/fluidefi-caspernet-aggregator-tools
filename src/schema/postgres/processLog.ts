export const createProcessLogSequenceQuery = `
  CREATE SEQUENCE IF NOT EXISTS "public".seq_process_log START WITH 1 INCREMENT BY 1;
`;

export const createProcessLogTableQuery = `
  CREATE TABLE IF NOT EXISTS process_log (
    id integer DEFAULT nextval('seq_process_log'::regclass) NOT NULL,
    process_name            varchar(100)    NOT NULL    ,
    block_number            integer         ,
    start_block_number      integer         ,
    end_block_number        integer         ,
    timestamp_utc           timestamptz     ,
    last_processed          timestamptz     ,
    CONSTRAINT pk_process_log PRIMARY KEY ( id )
  );
`;

export const createProcessLogConstraintQuery = `
  ALTER TABLE process_log
  ADD CONSTRAINT unique_process_log_process_name
  UNIQUE (process_name);
`;
