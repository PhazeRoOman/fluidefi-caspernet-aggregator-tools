export const createBlocksTableQuery = `
  CREATE TABLE IF NOT EXISTS blocks (
    block_hash          varchar(64)      NOT NULL,
    parent_hash         varchar(64)     ,
    state_root_hash     varchar(64)     ,
    body_hash           varchar(64)     ,
    random_bit          boolean         ,
    accumulated_seed    varchar(64)     ,
    era_end             boolean         ,
    timestamp_utc       timestamptz     ,
    era_id              integer         ,
    block_number        integer         ,
    protocol_version    varchar(20)     ,
    proposer            varchar(68)     ,
    deploy_hashes       varchar(64)[]   ,
    transfer_hashes     varchar(64)[]   ,
    api_version         varchar(20)     ,
    CONSTRAINT pk_blocks PRIMARY KEY ( block_number )
  );
`;
