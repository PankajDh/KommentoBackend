CREATE TABLE commentries (
    "id" bigserial PRIMARY KEY,
    user_id bigint NOT NULL,
    match_id bigint NOT NULL,
    current_state text,
    created_at timestamp with time zone NOT NULL default now(),
    join_details jsonb,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);


