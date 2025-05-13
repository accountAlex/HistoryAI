CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    uuid     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX idx_users_uuid ON users(uuid);

INSERT INTO users (id, uuid, email, password)
VALUES
    (1, 'uuid255', 'user@user', '$2a$10$0Hl2ZrIrLsKBSNa1fge3n.TxOSzSBWs1BUvhvbC/Yp1BxnbeNblM.');
ALTER SEQUENCE users_id_seq RESTART WITH 2;