export const createBlocksTableQuery = `
  CREATE TABLE blocks (
    block_hash          varchar(64)      NOT NULL,
    parent_hash         varchar(64)     ,
    state_root_hash     varchar(64)     ,
    body_hash           varchar(64)     ,
    random_bit          boolean         ,
    accumulated_seed    varchar(64)     ,
    era_end             boolean         ,
    timestamp_utc       timestamptz     ,
    era_id              integer         ,
    block_height        integer         ,
    protocol_version    varchar(20)     ,
    proposer            varchar(68)     ,
    deploy_hashes       varchar(64)[]   ,
    transfer_hashes     varchar(64)[]   ,
    api_version         varchar(20)     ,
    CONSTRAINT pk_blocks PRIMARY KEY ( block_height )
  );
`;

export const createProcessLogTableQuery = `
  CREATE TABLE process_log (
    id SERIAL NOT NULL,
    process_name            varchar(100)    NOT NULL    ,
    sub_process_name        varchar(100)    NOT NULL    ,
    block_number            integer         ,
    start_block_number      integer         ,
    end_block_number        integer         ,
    timestamp_utc           timestamptz     ,
    deploy_hash             varchar(66)     ,
    id_pointer              integer         ,
    note                    text            ,
    last_processed          timestamptz     ,
    CONSTRAINT pk_process_log PRIMARY KEY ( id )
  );
`;
