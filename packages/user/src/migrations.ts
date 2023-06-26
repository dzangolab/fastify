const migrations = [
  // 0. Create users table
  "CREATE TABLE IF NOT EXISTS users (\
    id VARCHAR ( 36 ) PRIMARY KEY,\
    email VARCHAR ( 256 ) NOT NULL,\
    last_login_at TIMESTAMP NOT NULL DEFAULT NOW(),\
    signed_up_at TIMESTAMP NOT NULL DEFAULT NOW(),\
    FOREIGN KEY ( id ) REFERENCES st__all_auth_recipe_users ( user_id )\
  );",
  // 1. Insert roles in st__roles table
  "INSERT INTO \"st__roles\" (\"role\") VALUES\
    ('ADMIN'),\
    ('USER')\
  ON CONFLICT DO NOTHING;",
];

export default migrations;
