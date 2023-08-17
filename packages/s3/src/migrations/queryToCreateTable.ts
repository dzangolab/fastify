import { sql } from "slonik";

const queryToCreateTable: any = sql.unsafe`
    CREATE TABLE files (
        id SERIAL PRIMARY KEY,
        original_file_name VARCHAR(255) NOT NULL,
        bucket VARCHAR(255) NOT NULL,
        description TEXT,
        key VARCHAR(255) NOT NULL,
        uploaded_by_id VARCHAR(255),
        uploaded_at BIGINT,
        download_count INT DEFAULT 0,
        last_downloaded_at BIGINT,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL
    );
`;

export default queryToCreateTable;
