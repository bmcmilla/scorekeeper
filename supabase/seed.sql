-- create test users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            crypt ('test123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM generate_series(1, 3)
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            id,
            format(
                '{"sub":"%s","email":"%s"}',
                id::text,
                email
            )::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from auth.users
    );

-- game data for test users
INSERT INTO
    public.games (
        game_id,
        created_at,
        title,
        user_id
    ) (
        select 
            (ROW_NUMBER() OVER ()),
            current_timestamp,
            'Example ' || (ROW_NUMBER() OVER ()),
            (select id from auth.users where email = 'user1@example.com')
        FROM generate_series(1, 3)
    );


DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Fetch the user_id once
    SELECT id INTO user_id FROM auth.users WHERE email = 'user1@example.com';

    -- First INSERT into the public.players table
    INSERT INTO public.players (
        player_id,
        player_name,
        user_id,
        seat_position,
        game_id
    )
    VALUES
        (1, 'Barry', user_id, 1, 1),
        (2, 'Kathy', user_id, 2, 1),
        (3, 'James', user_id, 3, 1),
        (4, 'Susie', user_id, 4, 1);

    -- Second INSERT into the public.scores table
    INSERT INTO public.scores (
        score_id,
        player_id,
        score,
        user_id
    )
    VALUES
        (1, 1, 12, user_id),
        (2, 2, 23, user_id),
        (3, 3, 34, user_id),
        (4, 4, 0, user_id),
        (6, 1, 0, user_id),
        (8, 2, 43, user_id),
        (11, 3, 32, user_id),
        (10, 4, 21, user_id);
END $$;  
