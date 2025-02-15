# API for Developers

CS2 Inventory Simulator exposes a couple of endpoints to be used in other applications. There is currently no read quota for the endpoints.

## Get user inventory

```http
GET https://inventory.cstrike.app/api/inventory/{steamID64}.json
```

### Response

```typescript
type GetUserInventoryResponse = Array<{
  equipped?: boolean;
  equippedCT?: boolean;
  equippedT?: boolean;
  id: number;
  nametag?: string;
  seed?: number;
  stattrak?: number;
  stickers?: number[];
  stickerswear?: number[];
  wear?: number;
}>;
```

## Get user equipped items

```http
GET https://inventory.cstrike.app/api/equipped/{steamID64}.json
```

### Response

```typescript
type CSTeam = 2 /* T */ | 3 /* CT */;
type ItemDef = number;
type StickerSlot = 0 | 1 | 2 | 3;
type GetUserEquippedItemsResponse = {
  // Music Kit equipped.
  ["mk"]: number | undefined;
  // Pin equipped.
  ["pi"]: number | undefined;
  // Melee equipped for T and/or CT.
  ["me_{CSTeam}"]: number | undefined;
  // Melee's model equipped for T and/or CT.
  ["mem_{CSTeam}"]: string | undefined;
  // Glove equipped for T and/or CT.
  ["gl_{CSTeam}"]: number | undefined;
  // Agent equipped for T and/or CT.
  ["ag_{CSTeam}"]: number | undefined;
  // Agent's model equipped for T and/or CT.
  ["agm_{CSTeam}"]: string | undefined;
  // Patch for Agent equipped for T and/or CT.
  ["ap_{CSTeam}"]: number | undefined;
  // PaintKit equipped for T and/or CT and a weapon/melee/glove.
  ["pa_{CSTeam}_{ItemDef}"]: number | undefined;
  // PaintKit legacy flag equipped for T and/or CT and a weapon/melee/glove.
  ["pal_{CSTeam}_{ItemDef}"]: boolean | undefined;
  // Seed equipped for a T and/or CT weapon/melee.
  ["se_{CSTeam}_{ItemDef}"]: number | undefined;
  // Wear equipped for a T and/or CT weapon/melee/glove.
  ["fl_{CSTeam}_{ItemDef}"]: number | undefined;
  // StatTrak count for a T and/or CT weapon/melee.
  ["st_{CSTeam}_{ItemDef}"]: number | undefined;
  // StatTrak inventory item uid for a T and/or CT weapon/melee.
  ["stu_{CSTeam}_{ItemDef}"]: number | undefined;
  // Nametag equipped for a T and/or CT weapon/melee/glove.
  ["nt_{CSTeam}_{ItemDef}"]: string | undefined;
  // Whether a T and/or CT weapon has stickers.
  ["ss_{CSTeam}_{ItemDef}"]: boolean | undefined;
  // Sticker equipped for a T and/or CT weapon.
  ["ss_{CSTeam}_{ItemDef}_{StickerSlot}"]: number | undefined;
  // Wear of an equipped sticker for a T and/or CT weapon.
  ["sf_{CSTeam}_{ItemDef}_{StickerSlot}"]: number | undefined;
};
```

## Increment item StatTrak

```http
POST https://inventory.cstrike.app/api/increment-item-stattrak
```

### Request

```json
{
  "apiKey": "api key to authorize this request",
  "userId": "steamID64",
  "targetUid": 0
}
```

### Response

- Returns `401` when using an invalid API Key.
- Returns `400` when the user does not exist or target uid is invalid.
- Returns `204` when the increment was successful.

## Sign-in user

This is intended to be used in other first-party apps to authenticate users to Inventory Simulator. First, a POST request must be sent to `/api/sign-in` to get the user's authentication `token`, then the user must be immediately redirected to `/api/sign-in/callback?token={returned token}`.

### Get user sign-in token

```http
POST https://inventory.cstrike.app/api/sign-in
```

#### Request

```json
{
  "apiKey": "api key to authorize this request",
  "userId": "steamID64"
}
```

#### Response

```typescript
type GetUserSignInTokenResponse = {
  token: string; // expires in 1 minute.
};
```

### Sign-in user

```http
GET https://inventory.cstrike.app/api/sign-in/callback?token={token}
```
