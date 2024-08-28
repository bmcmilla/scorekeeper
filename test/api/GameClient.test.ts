import { expect, test } from 'vitest'
import { transformToGameObject } from '../../src/api/GameClient';

test('transforms sql game data', () => {

  const input = [
    {
      "score": 12,
      "players": {
        "games": {
          "title": "Test 123",
          "game_id": 1
        },
        "player_name": "Barry",
        "seat_position": 1
      }
    },
    {
      "score": 23,
      "players": {
        "games": {
          "title": "Test 123",
          "game_id": 1
        },
        "player_name": "Kathy",
        "seat_position": 2
      }
    },
    {
      "score": 34,
      "players": {
        "games": {
          "title": "Test 123",
          "game_id": 1
        },
        "player_name": "James",
        "seat_position": 3
      }
    },
    {
      "score": 0,
      "players": {
        "games": {
          "title": "Test 123",
          "game_id": 1
        },
        "player_name": "Susie",
        "seat_position": 4
      }
    },
    {
      "score": 0,
      "players": {
        "games": {
          "title": "Test 123",
          "game_id": 1
        },
        "player_name": "Barry",
        "seat_position": 1
      }
    },
    {
      "score": 43,
      "players": {
        "games": {
          "title": "Test 123",
          "game_id": 1
        },
        "player_name": "Kathy",
        "seat_position": 2
      }
    },
    {
      "score": 21,
      "players": {
        "games": {
          "title": "Test 123",
          "game_id": 1
        },
        "player_name": "Susie",
        "seat_position": 4
      }
    },
    {
      "score": 32,
      "players": {
        "games": {
          "title": "Test 123",
          "game_id": 1
        },
        "player_name": "James",
        "seat_position": 3
      }
    }
  ];

  const actual = transformToGameObject(input);
  expect(actual).toStrictEqual({
    "title": "Test 123",
    "players": [
      {
        "name": "Barry",
        "seatPosition": 1,
        "scores": [12, 0]
      },
      {
        "name": "Kathy",
        "seatPosition": 2,
        "scores": [23, 43]
      },
      {
        "name": "James",
        "seatPosition": 3,
        "scores": [34, 32]
      },
      {
        "name": "Susie",
        "seatPosition": 4,
        "scores": [0, 21]
      }
    ]
  })
});