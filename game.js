const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

/* ================================
   CONSTANTS
==================================*/
const TILE_SIZE = 16;
const WORLD_WIDTH = 400;
const WORLD_HEIGHT = 150;
const GRAVITY = 0.4;
const HOTBAR_SIZE = 9;
const INVENTORY_SIZE = 27;
const SURFACE_LEVEL = 50;
const CAVE_DEPTH = 70;

/* ================================
   BLOCKS / ITEMS
==================================*/
const BLOCKS = {
  AIR: 0, DIRT: 1, GRASS: 2, STONE: 3, WOOD: 4, LEAVES: 5,
  COPPER_ORE: 6, IRON_ORE: 7, GOLD_ORE: 8, DIAMOND_ORE: 9,
  CRAFTING_TABLE: 10, FURNACE: 11, CHEST: 12, WOOD_PLANK: 13,
  BRICK: 14, GLASS: 15, TORCH: 16, DOOR_CLOSED: 17, DOOR_OPEN: 18,
  SHOP: 19, COAL_ORE: 20, BEDROCK: 21, STONE_BRICK: 22,
  SAND: 23, DOOR_TOP_CLOSED: 24, DOOR_TOP_OPEN: 25
};

const ITEMS = {
  WOOD: 'wood', STONE: 'stone', DIRT: 'dirt', COPPER: 'copper',
  IRON: 'iron', GOLD: 'gold', DIAMOND: 'diamond', COAL: 'coal',
  WOOD_PICKAXE: 'wood_pickaxe', STONE_PICKAXE: 'stone_pickaxe',
  IRON_PICKAXE: 'iron_pickaxe', DIAMOND_PICKAXE: 'diamond_pickaxe',
  WOOD_AXE: 'wood_axe', STONE_AXE: 'stone_axe',
  IRON_AXE: 'iron_axe', DIAMOND_AXE: 'diamond_axe',
  WOOD_SWORD: 'wood_sword', STONE_SWORD: 'stone_sword',
  IRON_SWORD: 'iron_sword', DIAMOND_SWORD: 'diamond_sword',
  WOOD_PLANK: 'wood_plank', STICK: 'stick', TORCH: 'torch',
  CRAFTING_TABLE: 'crafting_table', FURNACE: 'furnace', CHEST: 'chest',
  RAW_MEAT: 'raw_meat', COOKED_MEAT: 'cooked_meat',
  COPPER_INGOT: 'copper_ingot', IRON_INGOT: 'iron_ingot',
  GOLD_INGOT: 'gold_ingot', BRICK: 'brick', GLASS: 'glass',
  IRON_ARMOR: 'iron_armor', DIAMOND_ARMOR: 'diamond_armor',
  HEALTH_POTION: 'health_potion', APPLE: 'apple', BOSS_KEY: 'boss_key',
  STONE_BRICK: 'stone_brick', SAND: 'sand', DOOR: 'door'
};

const BLOCK_COLORS = {
  [BLOCKS.DIRT]: ['#8B5A2B', '#7A4A1B', '#6A3A0B'],
  [BLOCKS.GRASS]: ['#4A8B2B', '#3A7B1B', '#5A9B3B'],
  [BLOCKS.STONE]: ['#808080', '#707070', '#909090'],
  [BLOCKS.WOOD]: ['#8B6914', '#7B5904', '#9B7924'],
  [BLOCKS.LEAVES]: ['#2E8B2E', '#1E7B1E', '#3E9B3E'],
  [BLOCKS.COPPER_ORE]: ['#808080', '#CD7F32', '#B87333'],
  [BLOCKS.IRON_ORE]: ['#808080', '#C0C0C0', '#A0A0A0'],
  [BLOCKS.GOLD_ORE]: ['#808080', '#FFD700', '#DAA520'],
  [BLOCKS.DIAMOND_ORE]: ['#808080', '#00FFFF', '#40E0D0'],
  [BLOCKS.COAL_ORE]: ['#808080', '#2F2F2F', '#1F1F1F'],
  [BLOCKS.CRAFTING_TABLE]: ['#8B6914', '#CD853F', '#DEB887'],
  [BLOCKS.FURNACE]: ['#505050', '#606060', '#FF4500'],
  [BLOCKS.CHEST]: ['#8B4513', '#A0522D', '#FFD700'],
  [BLOCKS.WOOD_PLANK]: ['#DEB887', '#D2A679', '#E8C897'],
  [BLOCKS.BRICK]: ['#B22222', '#8B1A1A', '#CD3232'],
  [BLOCKS.GLASS]: ['#ADD8E6', '#87CEEB', '#B0E0E6'],
  [BLOCKS.TORCH]: ['#8B4513', '#FFD700', '#FFA500'],
  [BLOCKS.DOOR_CLOSED]: ['#8B4513', '#A0522D', '#6B3503'],
  [BLOCKS.DOOR_OPEN]: ['#8B4513', '#A0522D', '#6B3503'],
  [BLOCKS.DOOR_TOP_CLOSED]: ['#8B4513', '#A0522D', '#6B3503'],
  [BLOCKS.DOOR_TOP_OPEN]: ['#8B4513', '#A0522D', '#6B3503'],
  [BLOCKS.SHOP]: ['#4169E1', '#1E90FF', '#FFD700'],
  [BLOCKS.BEDROCK]: ['#1A1A1A', '#0A0A0A', '#2A2A2A'],
  [BLOCKS.STONE_BRICK]: ['#696969', '#808080', '#5A5A5A'],
  [BLOCKS.SAND]: ['#F4D03F', '#E8C43F', '#FFE43F']
};

const ITEM_INFO = {
  [ITEMS.WOOD]: { name: 'Madeira', color: '#8B6914', stackable: true, maxStack: 99 },
  [ITEMS.STONE]: { name: 'Pedra', color: '#808080', stackable: true, maxStack: 99 },
  [ITEMS.DIRT]: { name: 'Terra', color: '#8B5A2B', stackable: true, maxStack: 99 },
  [ITEMS.COPPER]: { name: 'Cobre', color: '#CD7F32', stackable: true, maxStack: 99 },
  [ITEMS.IRON]: { name: 'Ferro', color: '#C0C0C0', stackable: true, maxStack: 99 },
  [ITEMS.GOLD]: { name: 'Ouro', color: '#FFD700', stackable: true, maxStack: 99 },
  [ITEMS.DIAMOND]: { name: 'Diamante', color: '#00FFFF', stackable: true, maxStack: 99 },
  [ITEMS.COAL]: { name: 'Carvao', color: '#2F2F2F', stackable: true, maxStack: 99 },

  [ITEMS.WOOD_PICKAXE]: { name: 'Picareta Madeira', color: '#8B6914', power: 2, damage: 3 },
  [ITEMS.STONE_PICKAXE]: { name: 'Picareta Pedra', color: '#808080', power: 3, damage: 4 },
  [ITEMS.IRON_PICKAXE]: { name: 'Picareta Ferro', color: '#C0C0C0', power: 5, damage: 5 },
  [ITEMS.DIAMOND_PICKAXE]: { name: 'Picareta Diamante', color: '#00FFFF', power: 8, damage: 7 },

  [ITEMS.WOOD_AXE]: { name: 'Machado Madeira', color: '#8B6914', power: 2, damage: 4, axePower: 3 },
  [ITEMS.STONE_AXE]: { name: 'Machado Pedra', color: '#808080', power: 2, damage: 6, axePower: 4 },
  [ITEMS.IRON_AXE]: { name: 'Machado Ferro', color: '#C0C0C0', power: 3, damage: 8, axePower: 6 },
  [ITEMS.DIAMOND_AXE]: { name: 'Machado Diamante', color: '#00FFFF', power: 4, damage: 10, axePower: 9 },

  [ITEMS.WOOD_SWORD]: { name: 'Espada Madeira', color: '#8B6914', damage: 5 },
  [ITEMS.STONE_SWORD]: { name: 'Espada Pedra', color: '#808080', damage: 8 },
  [ITEMS.IRON_SWORD]: { name: 'Espada Ferro', color: '#C0C0C0', damage: 12 },
  [ITEMS.DIAMOND_SWORD]: { name: 'Espada Diamante', color: '#00FFFF', damage: 20 },

  [ITEMS.WOOD_PLANK]: { name: 'Tabua', color: '#DEB887', placeable: BLOCKS.WOOD_PLANK, stackable: true, maxStack: 99 },
  [ITEMS.STICK]: { name: 'Graveto', color: '#8B6914', stackable: true, maxStack: 99 },
  [ITEMS.TORCH]: { name: 'Tocha', color: '#FFA500', placeable: BLOCKS.TORCH, stackable: true, maxStack: 99 },
  [ITEMS.CRAFTING_TABLE]: { name: 'Mesa Craft', color: '#DEB887', placeable: BLOCKS.CRAFTING_TABLE },
  [ITEMS.FURNACE]: { name: 'Fornalha', color: '#505050', placeable: BLOCKS.FURNACE },
  [ITEMS.CHEST]: { name: 'Bau', color: '#8B4513', placeable: BLOCKS.CHEST },

  [ITEMS.DOOR]: { name: 'Porta', color: '#8B4513', placeable: BLOCKS.DOOR_CLOSED, stackable: true, maxStack: 16 },

  [ITEMS.RAW_MEAT]: { name: 'Carne Crua', color: '#FF6B6B', food: 2, stackable: true, maxStack: 20 },
  [ITEMS.COOKED_MEAT]: { name: 'Carne Cozida', color: '#CD853F', food: 6, stackable: true, maxStack: 20 },

  [ITEMS.COPPER_INGOT]: { name: 'Barra Cobre', color: '#CD7F32', stackable: true, maxStack: 99 },
  [ITEMS.IRON_INGOT]: { name: 'Barra Ferro', color: '#C0C0C0', stackable: true, maxStack: 99 },
  [ITEMS.GOLD_INGOT]: { name: 'Barra Ouro', color: '#FFD700', stackable: true, maxStack: 99 },

  [ITEMS.BRICK]: { name: 'Tijolo', color: '#B22222', placeable: BLOCKS.BRICK, stackable: true, maxStack: 99 },
  [ITEMS.GLASS]: { name: 'Vidro', color: '#ADD8E6', placeable: BLOCKS.GLASS, stackable: true, maxStack: 99 },

  [ITEMS.IRON_ARMOR]: { name: 'Armadura Ferro', color: '#C0C0C0', defense: 5 },
  [ITEMS.DIAMOND_ARMOR]: { name: 'Armadura Diamante', color: '#00FFFF', defense: 10 },

  [ITEMS.HEALTH_POTION]: { name: 'Pocao Vida', color: '#FF1493', heal: 50, stackable: true, maxStack: 10 },
  [ITEMS.APPLE]: { name: 'Maca', color: '#FF0000', food: 4, stackable: true, maxStack: 20 },

  [ITEMS.BOSS_KEY]: { name: 'Chave Boss', color: '#9400D3' },

  [ITEMS.STONE_BRICK]: { name: 'Tijolo Pedra', color: '#696969', placeable: BLOCKS.STONE_BRICK, stackable: true, maxStack: 99 },
  [ITEMS.SAND]: { name: 'Areia', color: '#F4D03F', placeable: BLOCKS.SAND, stackable: true, maxStack: 99 }
};

/* ================================
   RECIPES / SHOP
==================================*/
const RECIPES = [
  { result: ITEMS.WOOD_PLANK, count: 4, ingredients: [[ITEMS.WOOD, 1]] },
  { result: ITEMS.STICK, count: 4, ingredients: [[ITEMS.WOOD_PLANK, 2]] },
  { result: ITEMS.CRAFTING_TABLE, count: 1, ingredients: [[ITEMS.WOOD_PLANK, 4]] },
  { result: ITEMS.FURNACE, count: 1, ingredients: [[ITEMS.STONE, 8]] },
  { result: ITEMS.CHEST, count: 1, ingredients: [[ITEMS.WOOD_PLANK, 8]] },
  { result: ITEMS.DOOR, count: 1, ingredients: [[ITEMS.WOOD_PLANK, 6]] },
  { result: ITEMS.TORCH, count: 4, ingredients: [[ITEMS.COAL, 1], [ITEMS.STICK, 1]] },
  { result: ITEMS.WOOD_PICKAXE, count: 1, ingredients: [[ITEMS.WOOD_PLANK, 3], [ITEMS.STICK, 2]] },
  { result: ITEMS.STONE_PICKAXE, count: 1, ingredients: [[ITEMS.STONE, 3], [ITEMS.STICK, 2]] },
  { result: ITEMS.IRON_PICKAXE, count: 1, ingredients: [[ITEMS.IRON_INGOT, 3], [ITEMS.STICK, 2]] },
  { result: ITEMS.DIAMOND_PICKAXE, count: 1, ingredients: [[ITEMS.DIAMOND, 3], [ITEMS.STICK, 2]] },
  { result: ITEMS.WOOD_AXE, count: 1, ingredients: [[ITEMS.WOOD_PLANK, 3], [ITEMS.STICK, 2]] },
  { result: ITEMS.STONE_AXE, count: 1, ingredients: [[ITEMS.STONE, 3], [ITEMS.STICK, 2]] },
  { result: ITEMS.IRON_AXE, count: 1, ingredients: [[ITEMS.IRON_INGOT, 3], [ITEMS.STICK, 2]] },
  { result: ITEMS.DIAMOND_AXE, count: 1, ingredients: [[ITEMS.DIAMOND, 3], [ITEMS.STICK, 2]] },
  { result: ITEMS.WOOD_SWORD, count: 1, ingredients: [[ITEMS.WOOD_PLANK, 2], [ITEMS.STICK, 1]] },
  { result: ITEMS.STONE_SWORD, count: 1, ingredients: [[ITEMS.STONE, 2], [ITEMS.STICK, 1]] },
  { result: ITEMS.IRON_SWORD, count: 1, ingredients: [[ITEMS.IRON_INGOT, 2], [ITEMS.STICK, 1]] },
  { result: ITEMS.DIAMOND_SWORD, count: 1, ingredients: [[ITEMS.DIAMOND, 2], [ITEMS.STICK, 1]] },
  { result: ITEMS.IRON_ARMOR, count: 1, ingredients: [[ITEMS.IRON_INGOT, 8]] },
  { result: ITEMS.DIAMOND_ARMOR, count: 1, ingredients: [[ITEMS.DIAMOND, 8]] },
  { result: ITEMS.STONE_BRICK, count: 4, ingredients: [[ITEMS.STONE, 4]] },
  { result: ITEMS.BOSS_KEY, count: 1, ingredients: [[ITEMS.GOLD_INGOT, 10], [ITEMS.DIAMOND, 5]] }
];

const FURNACE_RECIPES = [
  { input: ITEMS.RAW_MEAT, output: ITEMS.COOKED_MEAT, fuel: ITEMS.COAL },
  { input: ITEMS.COPPER, output: ITEMS.COPPER_INGOT, fuel: ITEMS.COAL },
  { input: ITEMS.IRON, output: ITEMS.IRON_INGOT, fuel: ITEMS.COAL },
  { input: ITEMS.GOLD, output: ITEMS.GOLD_INGOT, fuel: ITEMS.COAL },
  { input: ITEMS.SAND, output: ITEMS.GLASS, fuel: ITEMS.COAL }
];

const SHOP_ITEMS = [
  { item: ITEMS.HEALTH_POTION, price: 25, count: 1 },
  { item: ITEMS.TORCH, price: 5, count: 10 },
  { item: ITEMS.APPLE, price: 10, count: 5 },
  { item: ITEMS.DOOR, price: 15, count: 2 },
  { item: ITEMS.COOKED_MEAT, price: 15, count: 3 },
  { item: ITEMS.IRON_INGOT, price: 50, count: 1 }
];

/* ================================
   GAME STATE
==================================*/
let world, chests, doorStates, player, inventory, entities, particles;
let camera, keys, mouse, gameTime, dayTime;
let bossActive, boss, gameWon, gameOver, gameStartTime;
let miningProgress, miningTarget, animationId;
let selectedInventorySlot = null;

function initGameState() {
  world = [];
  chests = {};
  doorStates = {};
  player = {
    x: 0, y: 0, vx: 0, vy: 0,
    width: 12, height: 24,
    health: 100, maxHealth: 100,
    hunger: 100, maxHunger: 100,
    coins: 50, level: 1, exp: 0, expMax: 100,
    defense: 0, selectedSlot: 0,
    facingRight: true, grounded: false,
    attackCooldown: 0, invincible: 0,
    animFrame: 0
  };
  inventory = new Array(HOTBAR_SIZE + INVENTORY_SIZE).fill(null);
  entities = [];
  particles = [];
  camera = { x: 0, y: 0 };
  keys = {};
  mouse = { x: 0, y: 0, down: false, rightDown: false };
  gameTime = 0;
  dayTime = 200;
  bossActive = false;
  boss = null;
  gameWon = false;
  gameOver = false;
  gameStartTime = Date.now();
  miningProgress = 0;
  miningTarget = null;
  selectedInventorySlot = null;
}

/* ================================
   ITEM ICONS (CANVAS)
==================================*/
function createItemIcon(itemId, size) {
  return `<canvas class="item-icon" width="${size}" height="${size}" data-item="${itemId}"></canvas>`;
}

function renderItemCanvases(rootEl = document) {
  const canvases = rootEl.querySelectorAll('canvas.item-icon');
  canvases.forEach(c => {
    const itemId = c.dataset.item;
    const s = c.width;
    const cctx = c.getContext('2d');
    cctx.imageSmoothingEnabled = false;
    drawItemIcon(cctx, itemId, s);
  });
}

function pxI(ctx2, x, y, w, h, color) {
  ctx2.fillStyle = color;
  ctx2.fillRect(x|0, y|0, w|0, h|0);
}

function frameIcon(ctx2, s) {
  pxI(ctx2, 0, 0, s, 1, 'rgba(255,255,255,0.18)');
  pxI(ctx2, 0, 0, 1, s, 'rgba(255,255,255,0.12)');
  pxI(ctx2, 0, s-1, s, 1, 'rgba(0,0,0,0.35)');
  pxI(ctx2, s-1, 0, 1, s, 'rgba(0,0,0,0.45)');
}

/* MELHORADO: mini-ícone de bloco com mais detalhe */
function drawBlockMini(ctx2, blockId, s) {
  const colors = BLOCK_COLORS[blockId];
  if (!colors) return;

  const scale = s / 16;
  const draw = (x,y,w,h,c) => pxI(ctx2, x*scale, y*scale, w*scale, h*scale, c);
  const dot  = (x,y,c) => draw(x,y,1,1,c);

  // base
  draw(0,0,16,16, colors[0]);

  // bevel
  draw(0,0,16,1,'rgba(255,255,255,0.18)');
  draw(0,0,1,16,'rgba(255,255,255,0.12)');
  draw(0,15,16,1,'rgba(0,0,0,0.25)');
  draw(15,0,1,16,'rgba(0,0,0,0.35)');

  if (blockId === BLOCKS.STONE) {
    draw(2,4,5,4, colors[1]);
    draw(9,9,5,3, colors[2]);
    dot(6,7,'rgba(0,0,0,0.15)');
  } else if (blockId === BLOCKS.CRAFTING_TABLE) {
    draw(1,1,14,6, colors[1]);
    draw(2,3,12,1,'rgba(0,0,0,0.18)');
    for (let x=3;x<=13;x+=3) draw(x,1,1,6,'rgba(0,0,0,0.16)');
    draw(3,10,10,1, colors[2]);
  } else if (blockId === BLOCKS.FURNACE) {
    draw(1,1,14,14,'rgba(0,0,0,0.25)');
    draw(2,2,12,12, colors[0]);
    draw(4,7,8,6,'#101010');
    draw(5,10,6,2,'rgba(255,160,0,0.35)');
  } else if ([BLOCKS.COPPER_ORE,BLOCKS.IRON_ORE,BLOCKS.GOLD_ORE,BLOCKS.DIAMOND_ORE,BLOCKS.COAL_ORE].includes(blockId)) {
    // ore: stone + pontos do minério
    draw(0,0,16,16, BLOCK_COLORS[BLOCKS.STONE][0]);
    draw(2,4,5,4, BLOCK_COLORS[BLOCKS.STONE][1]);
    dot(6,6, colors[1]); dot(10,10, colors[2]); dot(11,9, colors[1]);
    // bevel por cima
    draw(0,0,16,1,'rgba(255,255,255,0.18)');
    draw(0,0,1,16,'rgba(255,255,255,0.12)');
    draw(0,15,16,1,'rgba(0,0,0,0.25)');
    draw(15,0,1,16,'rgba(0,0,0,0.35)');
  } else if (blockId === BLOCKS.BRICK) {
    draw(0,5,16,1,'rgba(0,0,0,0.18)');
    draw(0,11,16,1,'rgba(0,0,0,0.18)');
    draw(8,0,1,5,'rgba(0,0,0,0.18)');
  } else if (blockId === BLOCKS.GLASS) {
    draw(0,0,16,16,'rgba(173,216,230,0.35)');
    draw(3,3,1,1,'rgba(255,255,255,0.25)');
    draw(4,4,1,1,'rgba(255,255,255,0.20)');
    draw(0,0,16,1,'rgba(255,255,255,0.16)');
    draw(0,0,1,16,'rgba(255,255,255,0.10)');
  } else if (blockId === BLOCKS.SAND) {
    dot(4,4, colors[2]); dot(9,6, colors[1]); dot(11,12, colors[2]);
  } else if (blockId === BLOCKS.GRASS) {
    draw(0,0,16,4, colors[2]);
    draw(0,4,16,12, BLOCK_COLORS[BLOCKS.DIRT][0]);
    dot(2,1,'rgba(255,255,255,0.25)');
  } else if (blockId === BLOCKS.CHEST) {
    draw(2,6,12,8, colors[1]);
    draw(2,6,12,2, colors[0]);
    draw(7,9,2,2, colors[2]);
  }
}

function drawToolIcon(ctx2, baseColor, s, kind) {
  const scale = s / 16;
  const draw = (x,y,w,h,c) => pxI(ctx2, x*scale, y*scale, w*scale, h*scale, c);

  draw(7,2,2,12,'#6b4a2a');
  draw(8,2,1,12,'rgba(255,255,255,0.12)');

  if (kind === 'pickaxe') {
    draw(4,3,8,2, baseColor);
    draw(3,4,2,2, baseColor);
    draw(11,4,2,2, baseColor);
    draw(4,3,8,1,'rgba(255,255,255,0.12)');
  } else if (kind === 'axe') {
    draw(6,3,5,4, baseColor);
    draw(6,3,5,1,'rgba(255,255,255,0.12)');
  } else if (kind === 'sword') {
    draw(7,1,2,10, '#cfd8dc');
    draw(6,10,4,2, '#8d6e63');
    draw(7,12,2,3, '#6b4a2a');
  }
}

function drawItemIcon(ctx2, itemId, s) {
  ctx2.clearRect(0,0,s,s);
  frameIcon(ctx2, s);

  const info = ITEM_INFO[itemId];
  if (!info) return;

  pxI(ctx2, 1, 1, s-2, s-2, 'rgba(255,255,255,0.03)');

  if (info.placeable !== undefined) {
    drawBlockMini(ctx2, info.placeable, s);
    return;
  }

  const id = String(itemId);
  if (id.includes('pickaxe')) { drawToolIcon(ctx2, info.color, s, 'pickaxe'); return; }
  if (id.includes('axe'))     { drawToolIcon(ctx2, info.color, s, 'axe'); return; }
  if (id.includes('sword'))   { drawToolIcon(ctx2, info.color, s, 'sword'); return; }

  pxI(ctx2, s*0.25, s*0.25, s*0.5, s*0.5, info.color);
  pxI(ctx2, s*0.32, s*0.32, s*0.18, s*0.18, 'rgba(255,255,255,0.22)');
  pxI(ctx2, s*0.25, s*0.72, s*0.5, s*0.06, 'rgba(0,0,0,0.22)');
}

/* ================================
   WORLD GENERATION
==================================*/
function generateWorld() {
  world = [];

  for (let x = 0; x < WORLD_WIDTH; x++) {
    world[x] = [];
    let height = SURFACE_LEVEL + Math.sin(x * 0.05) * 8 + Math.sin(x * 0.02) * 5;

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      if (y < height - 1) world[x][y] = BLOCKS.AIR;
      else if (y < height) world[x][y] = BLOCKS.GRASS;
      else if (y < height + 4) world[x][y] = BLOCKS.DIRT;
      else if (y >= WORLD_HEIGHT - 3) world[x][y] = BLOCKS.BEDROCK;
      else world[x][y] = BLOCKS.STONE;
    }
  }

  for (let i = 0; i < 150; i++) {
    let cx = Math.random() * WORLD_WIDTH;
    let cy = CAVE_DEPTH + Math.random() * 60;
    let size = 2 + Math.random() * 4;

    for (let j = 0; j < 25; j++) {
      for (let dx = -size; dx <= size; dx++) {
        for (let dy = -size; dy <= size; dy++) {
          let px = Math.floor(cx + dx);
          let py = Math.floor(cy + dy);
          if (px >= 0 && px < WORLD_WIDTH && py >= 0 && py < WORLD_HEIGHT - 3) {
            if (dx*dx + dy*dy < size*size * 0.6) world[px][py] = BLOCKS.AIR;
          }
        }
      }
      cx += (Math.random() - 0.5) * 3;
      cy += (Math.random() - 0.3) * 2;
      size = Math.max(1.5, size + (Math.random() - 0.5));
    }
  }

  generateOre(BLOCKS.COAL_ORE, 40, 120, 100, 3);
  generateOre(BLOCKS.COPPER_ORE, 50, 110, 70, 2);
  generateOre(BLOCKS.IRON_ORE, 60, 120, 50, 2);
  generateOre(BLOCKS.GOLD_ORE, 80, 140, 30, 2);
  generateOre(BLOCKS.DIAMOND_ORE, 110, 145, 15, 1);

  for (let x = 15; x < WORLD_WIDTH - 15; x++) {
    if (Math.random() < 0.04) {
      let groundY = getGroundLevel(x);
      if (world[x][groundY] === BLOCKS.GRASS) {
        generateTree(x, groundY - 1);
        x += 5;
      }
    }
  }

  generateVillage(200);

  for (let i = 0; i < 30; i++) {
    let x = Math.random() * WORLD_WIDTH * TILE_SIZE;
    let y = getGroundLevel(Math.floor(x / TILE_SIZE)) * TILE_SIZE - 20;
    entities.push(createAnimal(x, y));
  }

  for (let i = 0; i < 40; i++) {
    let x = Math.random() * WORLD_WIDTH * TILE_SIZE;
    let y = (CAVE_DEPTH + 10 + Math.random() * 60) * TILE_SIZE;
    let enemy = createEnemy(x, y);
    enemy.isCaveEnemy = true;
    entities.push(enemy);
  }
}

function generateOre(type, minY, maxY, count, size) {
  for (let i = 0; i < count; i++) {
    let x = Math.floor(Math.random() * WORLD_WIDTH);
    let y = Math.floor(minY + Math.random() * (maxY - minY));
    for (let dx = 0; dx < size; dx++) {
      for (let dy = 0; dy < size; dy++) {
        let px = x + dx, py = y + dy;
        if (px < WORLD_WIDTH && py < WORLD_HEIGHT - 3 && world[px] && world[px][py] === BLOCKS.STONE) {
          if (Math.random() < 0.7) world[px][py] = type;
        }
      }
    }
  }
}

function generateTree(x, y) {
  let height = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < height; i++) if (y - i >= 0) world[x][y - i] = BLOCKS.WOOD;

  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -3; dy <= 1; dy++) {
      let px = x + dx, py = y - height + dy;
      if (px >= 0 && px < WORLD_WIDTH && py >= 0 && world[px]) {
        if (world[px][py] === BLOCKS.AIR && Math.abs(dx) + Math.abs(dy) < 4 && Math.random() < 0.8) {
          world[px][py] = BLOCKS.LEAVES;
        }
      }
    }
  }
}

function generateVillage(startX) {
  for (let x = startX - 5; x < startX + 50; x++) {
    let groundY = getGroundLevel(x);
    for (let y = groundY - 12; y < groundY; y++) if (y >= 0 && world[x]) world[x][y] = BLOCKS.AIR;
  }

  for (let i = 0; i < 3; i++) {
    let hx = startX + 2 + i * 14;
    let hy = getGroundLevel(hx);
    buildHouse(hx, hy);
  }

  buildShop(startX + 22, getGroundLevel(startX + 22));
}

function buildHouse(x, y) {
  for (let i = 0; i < 8; i++) if (x + i < WORLD_WIDTH && world[x+i]) world[x + i][y] = BLOCKS.STONE_BRICK;

  for (let i = 1; i < 6; i++) {
    if (y - i >= 0 && world[x]) {
      world[x][y - i] = BLOCKS.BRICK;
      if (world[x+7]) world[x + 7][y - i] = BLOCKS.BRICK;
    }
  }

  for (let i = 0; i < 8; i++) if (y - 6 >= 0 && world[x+i]) world[x + i][y - 6] = BLOCKS.WOOD_PLANK;

  if (world[x+3]) {
    world[x + 3][y - 1] = BLOCKS.DOOR_CLOSED;
    world[x + 3][y - 2] = BLOCKS.DOOR_TOP_CLOSED;
    doorStates[`${x+3},${y-1}`] = false;
  }
  if (world[x+5] && y - 3 >= 0) world[x + 5][y - 3] = BLOCKS.GLASS;
}

function buildShop(x, y) {
  for (let i = 0; i < 10; i++) if (x + i < WORLD_WIDTH && world[x+i]) world[x + i][y] = BLOCKS.STONE_BRICK;

  for (let i = 1; i < 7; i++) {
    if (y - i >= 0 && world[x]) {
      world[x][y - i] = BLOCKS.STONE_BRICK;
      if (world[x+9]) world[x + 9][y - i] = BLOCKS.STONE_BRICK;
    }
  }

  for (let i = 0; i < 10; i++) if (y - 7 >= 0 && world[x+i]) world[x + i][y - 7] = BLOCKS.BRICK;

  if (world[x+4] && y - 2 >= 0) world[x + 4][y - 2] = BLOCKS.SHOP;

  if (world[x+2]) {
    world[x + 2][y - 1] = BLOCKS.DOOR_CLOSED;
    world[x + 2][y - 2] = BLOCKS.DOOR_TOP_CLOSED;
    doorStates[`${x+2},${y-1}`] = false;
  }
}

function getGroundLevel(x) {
  if (x < 0 || x >= WORLD_WIDTH || !world[x]) return SURFACE_LEVEL;
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    if (world[x][y] !== BLOCKS.AIR && world[x][y] !== BLOCKS.LEAVES) return y;
  }
  return SURFACE_LEVEL;
}

function createAnimal(x, y) {
  return {
    type: 'animal',
    x, y, vx: 0, vy: 0,
    width: 16, height: 12,
    health: 20, maxHealth: 20,
    moveTimer: 0, animFrame: 0,
    color: Math.random() < 0.5 ? '#FFB6C1' : '#8B4513'
  };
}

function createEnemy(x, y) {
  let types = ['slime', 'zombie', 'skeleton'];
  let type = types[Math.floor(Math.random() * types.length)];
  let stats = {
    slime: { health: 30, damage: 5, color: '#32CD32', speed: 1 },
    zombie: { health: 50, damage: 10, color: '#556B2F', speed: 0.7 },
    skeleton: { health: 40, damage: 8, color: '#D3D3D3', speed: 1.2 }
  };
  return {
    type: 'enemy', subtype: type,
    x, y, vx: 0, vy: 0,
    width: 14, height: 20,
    health: stats[type].health, maxHealth: stats[type].health,
    damage: stats[type].damage, color: stats[type].color,
    speed: stats[type].speed, attackCooldown: 0, animFrame: 0,
    isCaveEnemy: false, isNightEnemy: false
  };
}

function createBoss(x, y) {
  return {
    type: 'boss', x, y, vx: 0, vy: 0,
    width: 48, height: 64,
    health: 500, maxHealth: 500,
    damage: 30, phase: 1,
    attackCooldown: 0, specialAttackTimer: 0, animFrame: 0
  };
}

/* ================================
   INVENTORY
==================================*/
function addToInventory(itemId, count = 1) {
  let info = ITEM_INFO[itemId];
  let maxStack = info.maxStack || 1;

  if (info.stackable) {
    for (let i = 0; i < inventory.length; i++) {
      if (inventory[i] && inventory[i].id === itemId && inventory[i].count < maxStack) {
        let add = Math.min(count, maxStack - inventory[i].count);
        inventory[i].count += add;
        count -= add;
        if (count <= 0) { updateHotbar(); return true; }
      }
    }
  }

  while (count > 0) {
    let found = false;
    for (let i = 0; i < inventory.length; i++) {
      if (!inventory[i]) {
        inventory[i] = { id: itemId, count: Math.min(count, maxStack) };
        count -= inventory[i].count;
        found = true;
        break;
      }
    }
    if (!found) break;
  }
  updateHotbar();
  return count <= 0;
}

function removeFromInventory(itemId, count = 1) {
  for (let i = 0; i < inventory.length; i++) {
    if (inventory[i] && inventory[i].id === itemId) {
      if (inventory[i].count >= count) {
        inventory[i].count -= count;
        if (inventory[i].count <= 0) inventory[i] = null;
        updateHotbar();
        return true;
      } else {
        count -= inventory[i].count;
        inventory[i] = null;
      }
    }
  }
  updateHotbar();
  return false;
}

function countItem(itemId) {
  let total = 0;
  for (let slot of inventory) if (slot && slot.id === itemId) total += slot.count;
  return total;
}

function getSelectedItem() { return inventory[player.selectedSlot]; }

function addExp(amount) {
  player.exp += amount;
  while (player.exp >= player.expMax) {
    player.level++;
    player.exp -= player.expMax;
    player.expMax = 100 + player.level * 50;
    player.maxHealth += 10;
    player.health = Math.min(player.health + 20, player.maxHealth);
    showMessage('LEVEL UP!');
  }
  updateUI();
}

/* ================================
   BLOCKS / MINING / PLACING
==================================*/
function getBlockHardness(block) {
  const h = {
    [BLOCKS.DIRT]: 1, [BLOCKS.GRASS]: 1, [BLOCKS.SAND]: 0.8,
    [BLOCKS.WOOD]: 2, [BLOCKS.LEAVES]: 0.3, [BLOCKS.STONE]: 3,
    [BLOCKS.COPPER_ORE]: 4, [BLOCKS.IRON_ORE]: 5,
    [BLOCKS.GOLD_ORE]: 6, [BLOCKS.DIAMOND_ORE]: 8,
    [BLOCKS.COAL_ORE]: 3, [BLOCKS.WOOD_PLANK]: 2,
    [BLOCKS.BRICK]: 4, [BLOCKS.GLASS]: 0.5, [BLOCKS.TORCH]: 0.1,
    [BLOCKS.DOOR_CLOSED]: 2, [BLOCKS.DOOR_OPEN]: 2,
    [BLOCKS.STONE_BRICK]: 4, [BLOCKS.SHOP]: 9999, [BLOCKS.BEDROCK]: 9999
  };
  return h[block] || 2;
}

function isWoodBlock(b) {
  return b === BLOCKS.WOOD || b === BLOCKS.LEAVES || b === BLOCKS.WOOD_PLANK ||
         b === BLOCKS.DOOR_CLOSED || b === BLOCKS.DOOR_OPEN;
}

function getBlockDrop(block) {
  const drops = {
    [BLOCKS.DIRT]: ITEMS.DIRT, [BLOCKS.GRASS]: ITEMS.DIRT,
    [BLOCKS.SAND]: ITEMS.SAND, [BLOCKS.STONE]: ITEMS.STONE,
    [BLOCKS.WOOD]: ITEMS.WOOD,
    [BLOCKS.LEAVES]: Math.random() < 0.15 ? ITEMS.APPLE : (Math.random() < 0.4 ? ITEMS.STICK : null),
    [BLOCKS.COPPER_ORE]: ITEMS.COPPER, [BLOCKS.IRON_ORE]: ITEMS.IRON,
    [BLOCKS.GOLD_ORE]: ITEMS.GOLD, [BLOCKS.DIAMOND_ORE]: ITEMS.DIAMOND,
    [BLOCKS.COAL_ORE]: ITEMS.COAL, [BLOCKS.CRAFTING_TABLE]: ITEMS.CRAFTING_TABLE,
    [BLOCKS.FURNACE]: ITEMS.FURNACE, [BLOCKS.CHEST]: ITEMS.CHEST,
    [BLOCKS.WOOD_PLANK]: ITEMS.WOOD_PLANK, [BLOCKS.BRICK]: ITEMS.BRICK,
    [BLOCKS.TORCH]: ITEMS.TORCH, [BLOCKS.STONE_BRICK]: ITEMS.STONE_BRICK,
    [BLOCKS.DOOR_CLOSED]: ITEMS.DOOR, [BLOCKS.DOOR_OPEN]: ITEMS.DOOR
  };
  return drops[block];
}

function hasAdjacentBlock(x, y) {
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  for (const [dx, dy] of dirs) {
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < WORLD_WIDTH && ny >= 0 && ny < WORLD_HEIGHT && world[nx]) {
      if (world[nx][ny] !== BLOCKS.AIR) return true;
    }
  }
  return false;
}

function canPlaceBlock(x, y) {
  if (x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT) return false;
  if (!world[x] || world[x][y] !== BLOCKS.AIR) return false;

  let dx = (x + 0.5) * TILE_SIZE - (player.x + player.width/2);
  let dy = (y + 0.5) * TILE_SIZE - (player.y + player.height/2);
  if (Math.hypot(dx, dy) > 80) return false;

  if (!hasAdjacentBlock(x, y)) return false;

  let bx = x * TILE_SIZE, by = y * TILE_SIZE;
  if (!(player.x + player.width < bx || player.x > bx + TILE_SIZE ||
        player.y + player.height < by || player.y > by + TILE_SIZE)) return false;

  return true;
}

/* Raycast coloca bloco na "face" do bloco mirado */
function isRaycastHitBlock(b) {
  return b !== BLOCKS.AIR && b !== BLOCKS.TORCH;
}

function raycastTiles(x0, y0, x1, y1, maxSteps = 90) {
  let dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len; dy /= len;

  let prevTx = null, prevTy = null;

  for (let i = 0; i < maxSteps; i++) {
    const px = x0 + dx * i;
    const py = y0 + dy * i;
    const tx = Math.floor(px / TILE_SIZE);
    const ty = Math.floor(py / TILE_SIZE);

    if (tx < 0 || tx >= WORLD_WIDTH || ty < 0 || ty >= WORLD_HEIGHT || !world[tx]) continue;

    const b = world[tx][ty];
    if (isRaycastHitBlock(b) || b === BLOCKS.SHOP) {
      return { hitX: tx, hitY: ty, placeX: prevTx, placeY: prevTy };
    }

    prevTx = tx; prevTy = ty;
  }
  return null;
}

function placeFromMouse() {
  const item = getSelectedItem();
  if (!item || !ITEM_INFO[item.id]?.placeable) return;

  const originX = player.x + player.width/2;
  const originY = player.y + player.height/2;

  const mouseWorldX = mouse.x + camera.x;
  const mouseWorldY = mouse.y + camera.y;

  const hit = raycastTiles(originX, originY, mouseWorldX, mouseWorldY, 90);

  let tx, ty;
  if (hit && hit.placeX !== null) { tx = hit.placeX; ty = hit.placeY; }
  else { tx = Math.floor(mouseWorldX / TILE_SIZE); ty = Math.floor(mouseWorldY / TILE_SIZE); }

  placeBlock(tx, ty);
}

function mineBlock(worldX, worldY) {
  if (worldX < 0 || worldX >= WORLD_WIDTH || worldY < 0 || worldY >= WORLD_HEIGHT) return;
  if (!world[worldX]) return;

  let block = world[worldX][worldY];
  if (block === BLOCKS.AIR || block === BLOCKS.BEDROCK) return;
  if (block === BLOCKS.DOOR_TOP_CLOSED || block === BLOCKS.DOOR_TOP_OPEN) return;

  let dx = (worldX + 0.5) * TILE_SIZE - (player.x + player.width/2);
  let dy = (worldY + 0.5) * TILE_SIZE - (player.y + player.height/2);
  if (Math.hypot(dx, dy) > 80) return;

  let key = `${worldX},${worldY}`;
  if (miningTarget !== key) { miningTarget = key; miningProgress = 0; }

  let power = 1;
  let item = getSelectedItem();
  if (item && ITEM_INFO[item.id]) {
    let info = ITEM_INFO[item.id];
    if (info.axePower && isWoodBlock(block)) power = info.axePower;
    else if (info.power) power = info.power;
  }

  miningProgress += power;

  if (BLOCK_COLORS[block]) {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: worldX * TILE_SIZE + Math.random() * TILE_SIZE,
        y: worldY * TILE_SIZE + Math.random() * TILE_SIZE,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2,
        life: 20, color: BLOCK_COLORS[block][0], size: 2
      });
    }
  }

  if (miningProgress >= getBlockHardness(block) * 10) {
    if (block === BLOCKS.DOOR_CLOSED || block === BLOCKS.DOOR_OPEN) {
      world[worldX][worldY - 1] = BLOCKS.AIR;
      delete doorStates[`${worldX},${worldY}`];
    }
    world[worldX][worldY] = BLOCKS.AIR;
    let drop = getBlockDrop(block);
    if (drop) { addToInventory(drop); addExp(1); }
    miningProgress = 0;
    miningTarget = null;
  }
}

function placeBlock(worldX, worldY) {
  let item = getSelectedItem();
  if (!item || !ITEM_INFO[item.id] || !ITEM_INFO[item.id].placeable) return;

  if (item.id === ITEMS.DOOR) {
    if (!canPlaceBlock(worldX, worldY) || !canPlaceBlock(worldX, worldY - 1)) return;
    world[worldX][worldY] = BLOCKS.DOOR_CLOSED;
    world[worldX][worldY - 1] = BLOCKS.DOOR_TOP_CLOSED;
    doorStates[`${worldX},${worldY}`] = false;
    removeFromInventory(item.id, 1);
    return;
  }

  if (!canPlaceBlock(worldX, worldY)) return;

  world[worldX][worldY] = ITEM_INFO[item.id].placeable;
  removeFromInventory(item.id, 1);

  if (ITEM_INFO[item.id].placeable === BLOCKS.CHEST) {
    chests[`${worldX},${worldY}`] = new Array(20).fill(null);
  }
}

function toggleDoor(x, y) {
  let block = world[x][y];
  if (block === BLOCKS.DOOR_TOP_CLOSED || block === BLOCKS.DOOR_TOP_OPEN) { y += 1; block = world[x][y]; }

  if (block === BLOCKS.DOOR_CLOSED) {
    world[x][y] = BLOCKS.DOOR_OPEN;
    world[x][y - 1] = BLOCKS.DOOR_TOP_OPEN;
    return true;
  } else if (block === BLOCKS.DOOR_OPEN) {
    let bx = x * TILE_SIZE;
    if (!(player.x + player.width < bx || player.x > bx + TILE_SIZE ||
          player.y + player.height < (y-1) * TILE_SIZE || player.y > (y+1) * TILE_SIZE)) return false;

    world[x][y] = BLOCKS.DOOR_CLOSED;
    world[x][y - 1] = BLOCKS.DOOR_TOP_CLOSED;
    return true;
  }
  return false;
}

/* ================================
   COMBAT / INTERACT
==================================*/
function attack() {
  if (player.attackCooldown > 0) return;
  player.attackCooldown = 15;

  let damage = 3;
  let item = getSelectedItem();
  if (item && ITEM_INFO[item.id] && ITEM_INFO[item.id].damage) damage = ITEM_INFO[item.id].damage;

  let ax = player.x + player.width/2 + (player.facingRight ? 25 : -25);
  let ay = player.y + player.height/2;

  for (let e of entities) {
    if (e.health <= 0) continue;
    let dist = Math.hypot((e.x + e.width/2 - ax), (e.y + e.height/2 - ay));
    if (dist < 40) {
      e.health -= damage;
      e.vx = (player.facingRight ? 1 : -1) * 5;
      e.vy = -3;

      for (let i = 0; i < 5; i++) {
        particles.push({
          x: e.x + e.width/2, y: e.y + e.height/2,
          vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 3,
          life: 20, color: '#FF0000', size: 2
        });
      }

      if (e.health <= 0) {
        if (e.type === 'animal') {
          addToInventory(ITEMS.RAW_MEAT, 2);
          player.coins += 5;
          addExp(5);
        } else if (e.type === 'enemy') {
          player.coins += 10;
          addExp(10);
          if (Math.random() < 0.2) addToInventory(ITEMS.HEALTH_POTION);
        }
      }
    }
  }

  if (boss && boss.health > 0) {
    let dist = Math.hypot((boss.x + boss.width/2 - ax), (boss.y + boss.height/2 - ay));
    if (dist < 60) {
      boss.health -= damage;
      document.getElementById('bossHealthFill').style.width = (boss.health / boss.maxHealth * 100) + '%';

      if (boss.health <= 0) {
        bossActive = false;
        document.getElementById('bossHealth').style.display = 'none';
        gameWon = true;
        player.coins += 500;
        addToInventory(ITEMS.DIAMOND, 20);
      }
    }
  }
}

function interact() {
  let px = Math.floor((player.x + player.width/2) / TILE_SIZE);
  let py = Math.floor((player.y + player.height/2) / TILE_SIZE);

  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      let x = px + dx, y = py + dy;
      if (x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT || !world[x]) continue;

      let block = world[x][y];
      if (block === BLOCKS.DOOR_CLOSED || block === BLOCKS.DOOR_OPEN ||
          block === BLOCKS.DOOR_TOP_CLOSED || block === BLOCKS.DOOR_TOP_OPEN) { toggleDoor(x, y); return; }
      if (block === BLOCKS.CRAFTING_TABLE) { openCrafting(); return; }
      if (block === BLOCKS.FURNACE) { openFurnace(); return; }
      if (block === BLOCKS.CHEST) { openChest(x, y); return; }
      if (block === BLOCKS.SHOP) { openShop(); return; }
    }
  }

  if (countItem(ITEMS.BOSS_KEY) > 0) openBossSpawn();
}

/* ================================
   DAY/NIGHT ENEMIES
==================================*/
function isNight() { return dayTime >= 500 || dayTime < 100; }

function updateDayNightEnemies() {
  if (!isNight()) {
    for (let i = entities.length - 1; i >= 0; i--) {
      let e = entities[i];
      if (e.type === 'enemy' && e.isNightEnemy && !e.isCaveEnemy) {
        let tileY = Math.floor(e.y / TILE_SIZE);
        if (tileY < CAVE_DEPTH) {
          for (let j = 0; j < 10; j++) {
            particles.push({
              x: e.x + e.width/2, y: e.y + e.height/2,
              vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 3,
              life: 30, color: '#888888', size: 3
            });
          }
          entities.splice(i, 1);
        }
      }
    }
  }

  if (isNight() && Math.random() < 0.01) {
    let surfaceEnemies = entities.filter(e => e.type === 'enemy' && e.isNightEnemy).length;
    if (surfaceEnemies < 20) {
      let x = player.x + (Math.random() - 0.5) * 800;
      if (x > 0 && x < WORLD_WIDTH * TILE_SIZE) {
        let tileX = Math.floor(x / TILE_SIZE);
        let groundY = getGroundLevel(tileX);
        let enemy = createEnemy(x, (groundY - 2) * TILE_SIZE);
        enemy.isNightEnemy = true;
        entities.push(enemy);
      }
    }
  }
}

/* ================================
   UI
==================================*/
function updateHotbar() {
  let div = document.getElementById('hotbar');
  div.innerHTML = '';
  for (let i = 0; i < HOTBAR_SIZE; i++) {
    let slot = document.createElement('div');
    slot.className = 'hotbar-slot' + (i === player.selectedSlot ? ' selected' : '');
    slot.innerHTML = `<span class="slot-key">${i+1}</span>`;
    if (inventory[i]) {
      slot.innerHTML += createItemIcon(inventory[i].id, 24);
      if (inventory[i].count > 1) slot.innerHTML += `<span class="slot-count">${inventory[i].count}</span>`;
    }
    slot.onclick = () => { player.selectedSlot = i; updateHotbar(); };
    div.appendChild(slot);
  }
  renderItemCanvases(div);
}

function toggleInventory() {
  let inv = document.getElementById('inventory');
  inv.classList.toggle('open');
  if (inv.classList.contains('open')) {
    selectedInventorySlot = null;
    updateInventoryUI();
  }
}

function updateInventoryUI() {
  let hotbarGrid = document.getElementById('hotbarGrid');
  hotbarGrid.innerHTML = '';
  for (let i = 0; i < HOTBAR_SIZE; i++) hotbarGrid.appendChild(createInvSlot(i));

  let invGrid = document.getElementById('invGrid');
  invGrid.innerHTML = '';
  for (let i = HOTBAR_SIZE; i < inventory.length; i++) invGrid.appendChild(createInvSlot(i));

  renderItemCanvases(document.getElementById('inventory'));
}

function createInvSlot(index) {
  let slot = document.createElement('div');
  slot.className = 'inv-slot' + (selectedInventorySlot === index ? ' selected-item' : '');
  if (inventory[index]) {
    slot.innerHTML = createItemIcon(inventory[index].id, 20);
    if (inventory[index].count > 1) slot.innerHTML += `<span class="slot-count">${inventory[index].count}</span>`;
    slot.title = ITEM_INFO[inventory[index].id].name;
  }
  slot.onclick = () => handleInvClick(index);
  slot.oncontextmenu = (e) => { e.preventDefault(); useItem(index); };
  return slot;
}

function handleInvClick(index) {
  if (selectedInventorySlot === null) {
    if (inventory[index]) { selectedInventorySlot = index; updateInventoryUI(); }
  } else if (selectedInventorySlot === index) {
    selectedInventorySlot = null; updateInventoryUI();
  } else {
    if (inventory[selectedInventorySlot] && inventory[index] &&
        inventory[selectedInventorySlot].id === inventory[index].id &&
        ITEM_INFO[inventory[selectedInventorySlot].id].stackable) {
      let max = ITEM_INFO[inventory[selectedInventorySlot].id].maxStack || 99;
      let add = Math.min(inventory[selectedInventorySlot].count, max - inventory[index].count);
      if (add > 0) {
        inventory[index].count += add;
        inventory[selectedInventorySlot].count -= add;
        if (inventory[selectedInventorySlot].count <= 0) inventory[selectedInventorySlot] = null;
      }
    } else {
      let temp = inventory[selectedInventorySlot];
      inventory[selectedInventorySlot] = inventory[index];
      inventory[index] = temp;
    }
    selectedInventorySlot = null;
    updateInventoryUI();
    updateHotbar();
  }
}

function useItem(index) {
  let item = inventory[index];
  if (!item) return;
  let info = ITEM_INFO[item.id];

  if (info.food) {
    player.hunger = Math.min(player.maxHunger, player.hunger + info.food * 10);
    inventory[index].count--;
    if (inventory[index].count <= 0) inventory[index] = null;
    showMessage('+' + (info.food * 10) + ' FOME');
  } else if (info.heal) {
    player.health = Math.min(player.maxHealth, player.health + info.heal);
    inventory[index].count--;
    if (inventory[index].count <= 0) inventory[index] = null;
    showMessage('+' + info.heal + ' VIDA');
  } else if (info.defense) {
    player.defense = info.defense;
    showMessage('ARMADURA EQUIPADA');
  }
  updateInventoryUI();
  updateHotbar();
  updateUI();
}

function openCrafting() {
  document.getElementById('craftingMenu').style.display = 'block';
  let list = document.getElementById('recipeList');
  list.innerHTML = '';

  for (let recipe of RECIPES) {
    let canCraft = true;
    let text = '';
    for (let [id, count] of recipe.ingredients) {
      let have = countItem(id);
      if (have < count) canCraft = false;
      text += `<span style="color:${have >= count ? '#27ae60' : '#e74c3c'}">${ITEM_INFO[id].name}:${have}/${count}</span> `;
    }

    let div = document.createElement('div');
    div.className = 'recipe' + (canCraft ? ' craftable' : '');
    div.innerHTML = `
      ${createItemIcon(recipe.result, 24)}
      <div style="margin-left:10px;flex:1;">
        <div style="color:white;">${ITEM_INFO[recipe.result].name} x${recipe.count}</div>
        <div style="font-size:10px;">${text}</div>
      </div>
    `;
    if (canCraft) {
      div.onclick = () => {
        for (let [id, count] of recipe.ingredients) removeFromInventory(id, count);
        addToInventory(recipe.result, recipe.count);
        addExp(2);
        openCrafting();
      };
    }
    list.appendChild(div);
  }
  renderItemCanvases(list);
}

function closeCrafting() { document.getElementById('craftingMenu').style.display = 'none'; }

function openFurnace() {
  document.getElementById('furnaceMenu').style.display = 'block';
  let list = document.getElementById('furnaceRecipes');
  list.innerHTML = '';

  for (let recipe of FURNACE_RECIPES) {
    let hasInput = countItem(recipe.input) >= 1;
    let hasFuel = countItem(recipe.fuel) >= 1;
    let canSmelt = hasInput && hasFuel;

    let div = document.createElement('div');
    div.className = 'recipe' + (canSmelt ? ' craftable' : '');
    div.innerHTML = `
      ${createItemIcon(recipe.input, 24)}
      <span style="margin:0 10px;">→</span>
      ${createItemIcon(recipe.output, 24)}
      <div style="margin-left:10px;flex:1;">
        <div style="color:white;">${ITEM_INFO[recipe.output].name}</div>
        <div style="font-size:10px;">
          <span style="color:${hasInput ? '#27ae60' : '#e74c3c'}">Input:${countItem(recipe.input)}</span>
          <span style="color:${hasFuel ? '#27ae60' : '#e74c3c'}">Fuel:${countItem(recipe.fuel)}</span>
        </div>
      </div>
    `;
    if (canSmelt) {
      div.onclick = () => {
        removeFromInventory(recipe.input, 1);
        removeFromInventory(recipe.fuel, 1);
        addToInventory(recipe.output, 1);
        addExp(3);
        openFurnace();
      };
    }
    list.appendChild(div);
  }
  renderItemCanvases(list);
}

function closeFurnace() { document.getElementById('furnaceMenu').style.display = 'none'; }

let currentChestKey = null;
function openChest(x, y) {
  currentChestKey = `${x},${y}`;
  if (!chests[currentChestKey]) chests[currentChestKey] = new Array(20).fill(null);
  document.getElementById('chestMenu').style.display = 'block';
  updateChestUI();
}
function closeChest() { document.getElementById('chestMenu').style.display = 'none'; }

function updateChestUI() {
  if (!currentChestKey) return;
  let grid = document.getElementById('chestGrid');
  grid.innerHTML = '';
  let chest = chests[currentChestKey];

  for (let i = 0; i < 20; i++) {
    let slot = document.createElement('div');
    slot.className = 'inv-slot';
    if (chest[i]) {
      slot.innerHTML = createItemIcon(chest[i].id, 20);
      if (chest[i].count > 1) slot.innerHTML += `<span class="slot-count">${chest[i].count}</span>`;
    }
    slot.onclick = () => {
      if (chest[i]) {
        addToInventory(chest[i].id, chest[i].count);
        chest[i] = null;
        updateChestUI();
      }
    };
    slot.oncontextmenu = (e) => {
      e.preventDefault();
      let item = getSelectedItem();
      if (item && !chest[i]) {
        chest[i] = { ...item };
        inventory[player.selectedSlot] = null;
        updateChestUI();
        updateHotbar();
      }
    };
    grid.appendChild(slot);
  }
  renderItemCanvases(grid);
}

function openShop() {
  document.getElementById('shopMenu').style.display = 'block';
  let list = document.getElementById('shopItems');
  list.innerHTML = '';

  for (let item of SHOP_ITEMS) {
    let canBuy = player.coins >= item.price;
    let div = document.createElement('div');
    div.className = 'shop-item' + (canBuy ? ' craftable' : '');
    div.innerHTML = `
      ${createItemIcon(item.item, 24)}
      <div style="margin-left:10px;flex:1;">
        <div style="color:white;">${ITEM_INFO[item.item].name} x${item.count}</div>
        <div style="color:#f1c40f;font-size:10px;">${item.price} MOEDAS</div>
      </div>
    `;
    if (canBuy) {
      div.onclick = () => {
        player.coins -= item.price;
        addToInventory(item.item, item.count);
        openShop();
        updateUI();
      };
    }
    list.appendChild(div);
  }
  renderItemCanvases(list);
}
function closeShop() { document.getElementById('shopMenu').style.display = 'none'; }

function openBossSpawn() {
  document.getElementById('bossSpawnContent').innerHTML = `
    <div style="text-align:center;padding:20px;">
      <div style="font-size:40px;margin-bottom:20px;">⚔️</div>
      <div>Invocar o GOLEM DE PEDRA?</div>
      <button class="overlay-btn" onclick="spawnBoss()" style="margin-top:20px;">INVOCAR</button>
    </div>
  `;
  document.getElementById('bossSpawnMenu').style.display = 'block';
}
function closeBossSpawn() { document.getElementById('bossSpawnMenu').style.display = 'none'; }

function spawnBoss() {
  if (countItem(ITEMS.BOSS_KEY) <= 0 || bossActive) return;
  removeFromInventory(ITEMS.BOSS_KEY);
  boss = createBoss(player.x + 200, player.y - 100);
  bossActive = true;
  document.getElementById('bossHealth').style.display = 'block';
  closeBossSpawn();
  showMessage('BOSS INVOCADO!');
}

function showMessage(text) {
  let msg = document.getElementById('message');
  msg.textContent = text;
  msg.style.opacity = 1;
  setTimeout(() => { msg.style.opacity = 0; }, 2000);
}

function updateUI() {
  document.getElementById('healthBarFill').style.width = (player.health / player.maxHealth * 100) + '%';
  document.getElementById('hungerBarFill').style.width = (player.hunger / player.maxHunger * 100) + '%';
  document.getElementById('expBarFill').style.width = (player.exp / player.expMax * 100) + '%';
  document.getElementById('healthText').textContent = Math.floor(player.health);
  document.getElementById('hungerText').textContent = Math.floor(player.hunger);
  document.getElementById('expText').textContent = Math.floor(player.exp);
  document.getElementById('coinCount').textContent = player.coins;
  document.getElementById('levelCount').textContent = player.level;
}

/* ================================
   PHYSICS / UPDATE
==================================*/
function checkCollision(x, y, w, h) {
  let l = Math.floor(x / TILE_SIZE), r = Math.floor((x + w - 1) / TILE_SIZE);
  let t = Math.floor(y / TILE_SIZE), b = Math.floor((y + h - 1) / TILE_SIZE);

  for (let tx = l; tx <= r; tx++) {
    for (let ty = t; ty <= b; ty++) {
      if (tx >= 0 && tx < WORLD_WIDTH && ty >= 0 && ty < WORLD_HEIGHT && world[tx]) {
        let block = world[tx][ty];
        if (block !== BLOCKS.AIR && block !== BLOCKS.TORCH && block !== BLOCKS.LEAVES &&
            block !== BLOCKS.DOOR_OPEN && block !== BLOCKS.DOOR_TOP_OPEN) return true;
      }
    }
  }
  return false;
}

function updatePlayer() {
  if (player.health <= 0 || gameWon) return;

  player.animFrame += 0.15;

  if (keys['a'] || keys['arrowleft']) { player.vx = -3; player.facingRight = false; }
  else if (keys['d'] || keys['arrowright']) { player.vx = 3; player.facingRight = true; }
  else { player.vx *= 0.8; }

  if ((keys['w'] || keys[' '] || keys['arrowup']) && player.grounded) {
    player.vy = -8;
    player.grounded = false;
  }

  player.vy += GRAVITY;
  player.vy = Math.min(player.vy, 12);

  let newX = player.x + player.vx;
  if (!checkCollision(newX, player.y, player.width, player.height)) player.x = newX;
  else player.vx = 0;

  let newY = player.y + player.vy;
  if (!checkCollision(player.x, newY, player.width, player.height)) {
    player.y = newY;
    player.grounded = false;
  } else {
    if (player.vy > 0) player.grounded = true;
    player.vy = 0;
  }

  player.x = Math.max(0, Math.min(player.x, WORLD_WIDTH * TILE_SIZE - player.width));
  player.y = Math.max(0, Math.min(player.y, WORLD_HEIGHT * TILE_SIZE - player.height));

  if (player.attackCooldown > 0) player.attackCooldown--;
  if (player.invincible > 0) player.invincible--;

  if (gameTime % 500 === 0) {
    player.hunger = Math.max(0, player.hunger - 1);
    if (player.hunger === 0) player.health -= 2;
  }
  if (player.hunger > 70 && gameTime % 100 === 0) {
    player.health = Math.min(player.maxHealth, player.health + 1);
  }

  updateUI();
}

function updateEntities() {
  for (let i = entities.length - 1; i >= 0; i--) {
    let e = entities[i];
    if (e.health <= 0) { entities.splice(i, 1); continue; }

    e.vy += GRAVITY;
    e.vy = Math.min(e.vy, 12);
    e.animFrame += 0.1;

    if (e.type === 'animal') {
      e.moveTimer--;
      if (e.moveTimer <= 0) {
        e.vx = (Math.random() - 0.5) * 2;
        e.moveTimer = 60 + Math.random() * 120;
      }
    } else if (e.type === 'enemy') {
      let dx = player.x - e.x;
      let dist = Math.hypot(dx, (player.y - e.y));

      if (dist < 300) {
        e.vx = Math.sign(dx) * e.speed;

        let checkX = e.x + (e.vx > 0 ? e.width + 3 : -3);
        if (checkCollision(checkX, e.y, 1, e.height)) {
          if (!checkCollision(e.x, e.y - TILE_SIZE, e.width, e.height)) e.vy = -7;
        }

        if (dist < 30 && e.attackCooldown <= 0 && player.invincible <= 0) {
          let dmg = Math.max(1, e.damage - player.defense);
          player.health -= dmg;
          player.invincible = 40;
          player.vx = Math.sign(dx) * -5;
          player.vy = -3;
          e.attackCooldown = 60;
        }
      } else e.vx *= 0.9;

      if (e.attackCooldown > 0) e.attackCooldown--;
    }

    let newX = e.x + e.vx;
    if (!checkCollision(newX, e.y, e.width, e.height)) e.x = newX;
    else e.vx *= -0.5;

    let newY = e.y + e.vy;
    if (!checkCollision(e.x, newY, e.width, e.height)) e.y = newY;
    else e.vy = 0;
  }
}

function updateBoss() {
  if (!boss || boss.health <= 0) return;

  boss.vy += GRAVITY * 0.3;
  boss.vy = Math.min(boss.vy, 10);
  boss.animFrame += 0.05;

  let dx = player.x - boss.x;
  let speed = boss.phase === 2 ? 2.5 : 1.5;
  boss.vx = Math.sign(dx) * speed;

  if (checkCollision(boss.x + boss.vx * 8, boss.y, boss.width, boss.height)) boss.vy = -10;

  let newX = boss.x + boss.vx;
  if (!checkCollision(newX, boss.y, boss.width, boss.height)) boss.x = newX;

  let newY = boss.y + boss.vy;
  if (!checkCollision(boss.x, newY, boss.width, boss.height)) boss.y = newY;
  else boss.vy = 0;

  let dist = Math.hypot((player.x - boss.x), (player.y - boss.y));
  if (dist < 70 && boss.attackCooldown <= 0 && player.invincible <= 0) {
    let dmg = Math.max(5, boss.damage - player.defense);
    player.health -= dmg;
    player.invincible = 50;
    player.vx = Math.sign(dx) * -10;
    player.vy = -8;
    boss.attackCooldown = 80;
  }

  boss.specialAttackTimer++;
  if (boss.specialAttackTimer >= (boss.phase === 2 ? 100 : 150)) {
    boss.specialAttackTimer = 0;
    for (let i = 0; i < (boss.phase === 2 ? 5 : 3); i++) {
      particles.push({
        x: boss.x + boss.width/2, y: boss.y + boss.height/2,
        vx: (Math.random() - 0.5) * 10, vy: -5 - Math.random() * 4,
        life: 150, color: '#808080', size: 10,
        damage: 15, gravity: true
      });
    }
  }

  if (boss.attackCooldown > 0) boss.attackCooldown--;
  if (boss.health < boss.maxHealth * 0.5 && boss.phase === 1) {
    boss.phase = 2;
    showMessage('BOSS FURIOSO!');
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.gravity) p.vy += GRAVITY * 0.5;
    p.vx *= 0.98;
    p.life--;

    if (p.damage && player.invincible <= 0) {
      let dist = Math.hypot((player.x + player.width/2 - p.x), (player.y + player.height/2 - p.y));
      if (dist < 15) {
        player.health -= p.damage;
        player.invincible = 30;
        p.life = 0;
      }
    }

    if (p.life <= 0) particles.splice(i, 1);
  }
}

/* ================================
   RENDER HELPERS (MELHORIA VISUAL)
==================================*/
function hexToRgb(hex){
  const h = hex.replace('#','');
  const n = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}
function mix(c1, c2, t){
  const a = hexToRgb(c1), b = hexToRgb(c2);
  const m = (x,y)=>Math.round(x + (y-x)*t);
  return `rgb(${m(a.r,b.r)},${m(a.g,b.g)},${m(a.b,b.b)})`;
}
function hash2(x, y, seed = 0){
  let n = (x * 374761393 + y * 668265263 + seed * 69069) | 0;
  n = (n ^ (n >> 13)) | 0;
  n = (n * 1274126177) | 0;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}
function putPx(screenX, screenY, px, py, color){
  ctx.fillStyle = color;
  ctx.fillRect(screenX + px, screenY + py, 1, 1);
}
function bevel(screenX, screenY){
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.fillRect(screenX, screenY, TILE_SIZE, 1);
  ctx.fillRect(screenX, screenY, 1, TILE_SIZE);

  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(screenX, screenY + TILE_SIZE - 1, TILE_SIZE, 1);
  ctx.fillRect(screenX + TILE_SIZE - 1, screenY, 1, TILE_SIZE);
}
function speckle(screenX, screenY, worldX, worldY, base, dark, light, amount=10, seed=1){
  for (let i = 0; i < amount; i++){
    const rx = Math.floor(hash2(worldX, worldY, seed + i*7) * 16);
    const ry = Math.floor(hash2(worldX, worldY, seed + i*11) * 16);
    const t = hash2(worldX, worldY, seed + i*13);
    putPx(screenX, screenY, rx, ry, t < 0.45 ? dark : (t < 0.9 ? base : light));
  }
}
function drawStoneBase(screenX, screenY, worldX, worldY){
  const c0 = BLOCK_COLORS[BLOCKS.STONE][0];
  const c1 = BLOCK_COLORS[BLOCKS.STONE][1];
  const c2 = BLOCK_COLORS[BLOCKS.STONE][2];

  ctx.fillStyle = c0;
  ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

  for (let i = 0; i < 3; i++){
    const ox = Math.floor(hash2(worldX, worldY, 100+i) * 10);
    const oy = Math.floor(hash2(worldX, worldY, 200+i) * 10);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(screenX + ox, screenY + oy, 6, 1);
    ctx.fillRect(screenX + ox, screenY + oy, 1, 5);
  }

  speckle(screenX, screenY, worldX, worldY, c0, c1, c2, 10, 300);
  bevel(screenX, screenY);
}
function drawOre(screenX, screenY, worldX, worldY, oreBlock){
  drawStoneBase(screenX, screenY, worldX, worldY);

  const colors = BLOCK_COLORS[oreBlock];
  const oreMid = colors[1];
  const oreHi  = colors[2];

  const cx = Math.floor(hash2(worldX, worldY, 900) * 8) + 4;
  const cy = Math.floor(hash2(worldX, worldY, 901) * 8) + 4;

  for (let i = 0; i < 10; i++){
    const a = i * 37;
    const rx = cx + Math.floor((hash2(worldX, worldY, 910+a) - 0.5) * 10);
    const ry = cy + Math.floor((hash2(worldX, worldY, 911+a) - 0.5) * 10);
    if (rx < 1 || rx > 14 || ry < 1 || ry > 14) continue;

    const t = hash2(worldX, worldY, 912+a);
    putPx(screenX, screenY, rx, ry, t < 0.25 ? oreHi : oreMid);
    if (t > 0.7 && rx < 15) putPx(screenX, screenY, rx+1, ry, oreMid);
  }

  if (oreBlock === BLOCKS.DIAMOND_ORE || oreBlock === BLOCKS.GOLD_ORE){
    const blink = 0.5 + Math.sin(gameTime * 0.15 + (worldX*0.7 + worldY*1.3)) * 0.5;
    const alpha = 0.12 + blink * 0.18;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(screenX + 3, screenY + 3, 1, 1);
    ctx.fillRect(screenX + 12, screenY + 10, 1, 1);
  }
}
function drawCraftingTable(screenX, screenY, worldX, worldY){
  const colors = BLOCK_COLORS[BLOCKS.CRAFTING_TABLE];
  const wood = colors[0];
  const top  = colors[1];
  const hi   = colors[2];

  ctx.fillStyle = wood;
  ctx.fillRect(screenX, screenY, 16, 16);

  ctx.fillStyle = top;
  ctx.fillRect(screenX+1, screenY+1, 14, 6);

  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let x = 2; x <= 13; x += 3) ctx.fillRect(screenX + x, screenY + 1, 1, 6);
  ctx.fillRect(screenX + 1, screenY + 3, 14, 1);

  ctx.fillStyle = hi;
  ctx.fillRect(screenX + 3, screenY + 9, 10, 1);
  ctx.fillRect(screenX + 2, screenY + 12, 12, 1);

  speckle(screenX, screenY, worldX, worldY, wood, mix(wood, '#000000', 0.2), mix(wood, '#ffffff', 0.15), 6, 700);
  bevel(screenX, screenY);
}
function drawFurnace(screenX, screenY, worldX, worldY){
  const colors = BLOCK_COLORS[BLOCKS.FURNACE];
  const base = colors[0];
  const mid  = colors[1];

  ctx.fillStyle = base;
  ctx.fillRect(screenX, screenY, 16, 16);
  speckle(screenX, screenY, worldX, worldY, base, mix(base,'#000',0.25), mid, 8, 1200);

  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.fillRect(screenX+1, screenY+1, 14, 14);
  ctx.fillStyle = base;
  ctx.fillRect(screenX+2, screenY+2, 12, 12);

  ctx.fillStyle = '#101010';
  ctx.fillRect(screenX+4, screenY+7, 8, 6);

  const flick = 0.5 + Math.sin(gameTime*0.25 + worldX*0.5) * 0.5;
  const glowA = 0.25 + flick * 0.35;

  ctx.fillStyle = `rgba(255,120,0,${glowA})`;
  ctx.fillRect(screenX+5, screenY+9, 6, 3);
  ctx.fillStyle = `rgba(255,220,120,${0.12 + flick*0.18})`;
  ctx.fillRect(screenX+6, screenY+9, 4, 2);

  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(screenX+4, screenY+4, 2, 1);
  ctx.fillRect(screenX+7, screenY+4, 2, 1);
  ctx.fillRect(screenX+10, screenY+4, 2, 1);

  bevel(screenX, screenY);
}

/* ================================
   DRAW BLOCK (MELHORADO)
==================================*/
function drawBlock(screenX, screenY, block, worldX, worldY) {
  if (block === BLOCKS.AIR) return;

  if ([BLOCKS.COPPER_ORE, BLOCKS.IRON_ORE, BLOCKS.GOLD_ORE, BLOCKS.DIAMOND_ORE, BLOCKS.COAL_ORE].includes(block)) {
    drawOre(screenX, screenY, worldX, worldY, block);
    return;
  }

  if (block === BLOCKS.FURNACE) { drawFurnace(screenX, screenY, worldX, worldY); return; }
  if (block === BLOCKS.CRAFTING_TABLE) { drawCraftingTable(screenX, screenY, worldX, worldY); return; }

  const colors = BLOCK_COLORS[block];
  if (!colors) return;

  ctx.fillStyle = colors[0];
  ctx.fillRect(screenX, screenY, 16, 16);

  if (block === BLOCKS.STONE) {
    drawStoneBase(screenX, screenY, worldX, worldY);
    return;
  }

  if (block === BLOCKS.DIRT) {
    speckle(screenX, screenY, worldX, worldY, colors[0], colors[1], colors[2], 10, 10);
    putPx(screenX, screenY, 4, 6, colors[2]);
    putPx(screenX, screenY, 11, 11, colors[1]);
    bevel(screenX, screenY);
    return;
  }

  if (block === BLOCKS.GRASS) {
    ctx.fillStyle = BLOCK_COLORS[BLOCKS.DIRT][0];
    ctx.fillRect(screenX, screenY+3, 16, 13);
    speckle(screenX, screenY+3, worldX, worldY, BLOCK_COLORS[BLOCKS.DIRT][0], BLOCK_COLORS[BLOCKS.DIRT][1], BLOCK_COLORS[BLOCKS.DIRT][2], 7, 44);

    ctx.fillStyle = colors[0];
    ctx.fillRect(screenX, screenY, 16, 4);
    ctx.fillStyle = colors[2];
    for (let i = 0; i < 6; i++){
      const gx = Math.floor(hash2(worldX, worldY, 500+i) * 16);
      putPx(screenX, screenY, gx, 1, colors[2]);
      if (gx < 15) putPx(screenX, screenY, gx+1, 2, colors[2]);
    }
    bevel(screenX, screenY);
    return;
  }

  if (block === BLOCKS.WOOD || block === BLOCKS.WOOD_PLANK) {
    const dark = mix(colors[0], '#000000', 0.22);
    const light = mix(colors[0], '#ffffff', 0.12);

    for (let y = 2; y < 16; y += 4){
      ctx.fillStyle = dark;
      ctx.fillRect(screenX+1, screenY+y, 14, 1);
      ctx.fillStyle = light;
      ctx.fillRect(screenX+1, screenY+y+1, 14, 1);
    }

    const kx = 3 + Math.floor(hash2(worldX, worldY, 777)*9);
    const ky = 5 + Math.floor(hash2(worldX, worldY, 778)*6);
    ctx.fillStyle = dark;
    ctx.fillRect(screenX+kx, screenY+ky, 3, 2);
    ctx.fillStyle = light;
    ctx.fillRect(screenX+kx+1, screenY+ky, 1, 1);

    bevel(screenX, screenY);
    return;
  }

  if (block === BLOCKS.BRICK) {
    const mortar = 'rgba(0,0,0,0.18)';
    ctx.fillStyle = mortar;
    ctx.fillRect(screenX, screenY+5, 16, 1);
    ctx.fillRect(screenX, screenY+11, 16, 1);
    ctx.fillRect(screenX+8, screenY, 1, 5);
    ctx.fillRect(screenX+4, screenY+6, 1, 5);
    ctx.fillRect(screenX+12, screenY+6, 1, 5);
    speckle(screenX, screenY, worldX, worldY, colors[0], colors[1], colors[2], 6, 880);
    bevel(screenX, screenY);
    return;
  }

  if (block === BLOCKS.STONE_BRICK) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(screenX, screenY+8, 16, 1);
    ctx.fillRect(screenX+8, screenY, 1, 16);

    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.fillRect(screenX+2, screenY+2, 3, 1);
    ctx.fillRect(screenX+11, screenY+12, 3, 1);

    speckle(screenX, screenY, worldX, worldY, colors[0], colors[2], colors[1], 8, 990);
    bevel(screenX, screenY);
    return;
  }

  if (block === BLOCKS.SAND) {
    speckle(screenX, screenY, worldX, worldY, colors[0], colors[1], colors[2], 12, 1300);
    bevel(screenX, screenY);
    return;
  }

  if (block === BLOCKS.GLASS) {
    ctx.fillStyle = 'rgba(173,216,230,0.32)';
    ctx.fillRect(screenX, screenY, 16, 16);

    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(screenX+3, screenY+3, 1, 1);
    ctx.fillRect(screenX+4, screenY+4, 1, 1);
    ctx.fillRect(screenX+5, screenY+5, 1, 1);
    ctx.fillRect(screenX+6, screenY+6, 1, 1);

    // borda pixel (sem half-pixel)
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(screenX, screenY, 16, 1);
    ctx.fillRect(screenX, screenY, 1, 16);

    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.fillRect(screenX, screenY+15, 16, 1);
    ctx.fillRect(screenX+15, screenY, 1, 16);
    return;
  }

  // fallback
  speckle(screenX, screenY, worldX, worldY, colors[0], colors[1] || colors[0], colors[2] || colors[0], 6, 2000);
  bevel(screenX, screenY);
}

/* ================================
   ENTITIES / PLAYER DRAW
==================================*/
function drawEntity(e, screenX, screenY) {
  if (e.type === 'animal') {
    ctx.fillStyle = e.color;
    ctx.fillRect(screenX, screenY + 4, e.width, e.height - 4);
    ctx.fillRect(screenX + e.width - 6, screenY, 6, 6);
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(screenX + 2, screenY + e.height - 3, 3, 3);
    ctx.fillRect(screenX + e.width - 5, screenY + e.height - 3, 3, 3);
    ctx.fillStyle = '#000';
    ctx.fillRect(screenX + e.width - 3, screenY + 2, 2, 2);
  } else if (e.type === 'enemy') {
    if (e.subtype === 'slime') {
      let squash = 0.85 + Math.sin(e.animFrame * 2) * 0.15;
      ctx.fillStyle = e.color;
      ctx.fillRect(screenX, screenY + e.height * (1 - squash), e.width, e.height * squash);
      ctx.fillStyle = '#fff';
      ctx.fillRect(screenX + 3, screenY + e.height * (1 - squash) + 4, 3, 3);
      ctx.fillRect(screenX + 9, screenY + e.height * (1 - squash) + 4, 3, 3);
      ctx.fillStyle = '#000';
      ctx.fillRect(screenX + 4, screenY + e.height * (1 - squash) + 5, 2, 2);
      ctx.fillRect(screenX + 10, screenY + e.height * (1 - squash) + 5, 2, 2);
    } else {
      ctx.fillStyle = e.color;
      ctx.fillRect(screenX + 3, screenY, 8, 8);
      ctx.fillRect(screenX + 2, screenY + 8, 10, 8);
      let armSwing = Math.sin(e.animFrame * 2) * 3;
      ctx.fillRect(screenX - 2, screenY + 8 + armSwing, 4, 8);
      ctx.fillRect(screenX + e.width - 2, screenY + 8 - armSwing, 4, 8);
      ctx.fillRect(screenX + 3, screenY + 16, 3, 4);
      ctx.fillRect(screenX + 8, screenY + 16, 3, 4);
      ctx.fillStyle = e.subtype === 'zombie' ? '#ff0000' : '#000';
      ctx.fillRect(screenX + 4, screenY + 3, 2, 2);
      ctx.fillRect(screenX + 8, screenY + 3, 2, 2);
    }
  }

  if (e.health < e.maxHealth) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(screenX - 2, screenY - 6, e.width + 4, 4);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(screenX - 1, screenY - 5, (e.width + 2) * (e.health / e.maxHealth), 2);
  }
}

function drawBoss(screenX, screenY) {
  ctx.fillStyle = '#606060';
  ctx.fillRect(screenX + 4, screenY + 20, boss.width - 8, boss.height - 24);

  ctx.fillStyle = '#707070';
  ctx.fillRect(screenX + 8, screenY, boss.width - 16, 24);

  let eyeColor = boss.phase === 2 ? '#ff0000' : '#ff6600';
  ctx.fillStyle = eyeColor;
  let pulse = Math.sin(boss.animFrame) * 2;
  ctx.fillRect(screenX + 14, screenY + 8, 8 + pulse, 8);
  ctx.fillRect(screenX + boss.width - 22, screenY + 8, 8 + pulse, 8);

  ctx.fillStyle = '#606060';
  ctx.fillRect(screenX - 10, screenY + 24, 16, 36);
  ctx.fillRect(screenX + boss.width - 6, screenY + 24, 16, 36);

  if (boss.health < boss.maxHealth * 0.5) {
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(screenX + 18, screenY + 30, 2, 20);
    ctx.fillRect(screenX + 20, screenY + 40, 2, 15);
    ctx.fillRect(screenX + 30, screenY + 35, 2, 18);
  }
}

function drawPlayer(screenX, screenY) {
  if (player.invincible % 4 >= 2) return;

  ctx.fillStyle = '#3498db';
  ctx.fillRect(screenX + 2, screenY + 18, 3, 6);
  ctx.fillRect(screenX + 7, screenY + 18, 3, 6);

  ctx.fillStyle = '#2980b9';
  ctx.fillRect(screenX + 1, screenY + 10, 10, 9);

  ctx.fillStyle = '#fad7a0';
  ctx.fillRect(screenX + 2, screenY + 2, 8, 8);

  ctx.fillStyle = '#5d4e37';
  ctx.fillRect(screenX + 2, screenY, 8, 3);

  ctx.fillStyle = '#000';
  let eyeX = player.facingRight ? 7 : 3;
  ctx.fillRect(screenX + eyeX, screenY + 5, 2, 2);

  ctx.fillStyle = '#fad7a0';
  let armX = player.facingRight ? screenX + 10 : screenX - 3;
  ctx.fillRect(armX, screenY + 12, 4, 6);

  let item = getSelectedItem();
  if (item) {
    let info = ITEM_INFO[item.id];
    ctx.fillStyle = info.color;
    let itemX = player.facingRight ? armX + 2 : armX - 4;
    ctx.fillRect(itemX, screenY + 8, 6, 6);
  }
}

/* ================================
   RENDER
==================================*/
function render() {
  let skyColor;
  if (dayTime < 100) skyColor = '#1a1a3a';
  else if (dayTime < 200) skyColor = `rgb(${40 + dayTime * 0.6}, ${40 + dayTime * 0.8}, ${80 + dayTime * 0.5})`;
  else if (dayTime < 500) skyColor = '#87CEEB';
  else if (dayTime < 600) skyColor = `rgb(${200 - (dayTime - 500)}, ${100 - (dayTime - 500) * 0.6}, 60)`;
  else skyColor = '#1a1a3a';

  ctx.fillStyle = skyColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (isNight()) {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      let sx = (i * 29) % canvas.width;
      let sy = (i * 17) % (canvas.height / 2);
      ctx.fillRect(sx, sy, 1, 1);
    }
  }

  camera.x = player.x - canvas.width/2;
  camera.y = player.y - canvas.height/2;
  camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH * TILE_SIZE - canvas.width));
  camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT * TILE_SIZE - canvas.height));

  let startX = Math.floor(camera.x / TILE_SIZE);
  let startY = Math.floor(camera.y / TILE_SIZE);
  let endX = Math.ceil((camera.x + canvas.width) / TILE_SIZE);
  let endY = Math.ceil((camera.y + canvas.height) / TILE_SIZE);

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      if (x >= 0 && x < WORLD_WIDTH && y >= 0 && y < WORLD_HEIGHT && world[x]) {
        let block = world[x][y];
        if (block !== BLOCKS.AIR) {
          let sx = Math.floor(x * TILE_SIZE - camera.x);
          let sy = Math.floor(y * TILE_SIZE - camera.y);
          drawBlock(sx, sy, block, x, y);
        }
      }
    }
  }

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      if (y > CAVE_DEPTH && world[x] && world[x][y] === BLOCKS.AIR) {
        let sx = Math.floor(x * TILE_SIZE - camera.x);
        let sy = Math.floor(y * TILE_SIZE - camera.y);
        let darkness = Math.min(0.85, (y - CAVE_DEPTH) * 0.015);

        for (let tx = x - 5; tx <= x + 5; tx++) {
          for (let ty = y - 5; ty <= y + 5; ty++) {
            if (tx >= 0 && tx < WORLD_WIDTH && ty >= 0 && ty < WORLD_HEIGHT && world[tx]) {
              if (world[tx][ty] === BLOCKS.TORCH) {
                let dist = Math.hypot((tx-x), (ty-y));
                if (dist < 6) darkness = Math.max(0, darkness - (1 - dist/6) * 0.5);
              }
            }
          }
        }

        if (darkness > 0) {
          ctx.fillStyle = `rgba(0,0,20,${darkness})`;
          ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  for (let e of entities) {
    let sx = Math.floor(e.x - camera.x);
    let sy = Math.floor(e.y - camera.y);
    if (sx > -50 && sx < canvas.width + 50 && sy > -50 && sy < canvas.height + 50) drawEntity(e, sx, sy);
  }

  if (boss && boss.health > 0) drawBoss(Math.floor(boss.x - camera.x), Math.floor(boss.y - camera.y));

  drawPlayer(Math.floor(player.x - camera.x), Math.floor(player.y - camera.y));

  for (let p of particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.min(1, p.life / 10);
    ctx.fillRect(Math.floor(p.x - camera.x), Math.floor(p.y - camera.y), p.size, p.size);
    ctx.globalAlpha = 1;
  }

  if (miningTarget && miningProgress > 0) {
    let [mx, my] = miningTarget.split(',').map(Number);
    if (world[mx]) {
      let block = world[mx][my];
      let progress = miningProgress / (getBlockHardness(block) * 10);
      let sx = Math.floor(mx * TILE_SIZE - camera.x);
      let sy = Math.floor(my * TILE_SIZE - camera.y);

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, TILE_SIZE, TILE_SIZE);

      ctx.fillStyle = '#000';
      ctx.fillRect(sx, sy + TILE_SIZE - 3, TILE_SIZE, 3);
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(sx, sy + TILE_SIZE - 3, TILE_SIZE * progress, 3);
    }
  }

  updateBlockPreview();

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(canvas.width - 70, 5, 65, 20);
  ctx.fillStyle = '#fff';
  ctx.font = '12px Courier New';
  ctx.fillText(isNight() ? 'NOITE' : 'DIA', canvas.width - 60, 18);

  if (gameOver) {
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('gameoverCoins').textContent = player.coins;
    document.getElementById('gameoverTime').textContent = Math.floor((Date.now() - gameStartTime) / 1000);
  }
  if (gameWon) {
    document.getElementById('victoryScreen').style.display = 'flex';
    document.getElementById('victoryCoins').textContent = player.coins;
    document.getElementById('victoryLevel').textContent = player.level;
  }
}

/* Preview com raycast + alinhamento correto */
function updateBlockPreview() {
  const preview = document.getElementById('blockPreview');
  const item = getSelectedItem();

  if (!item || !ITEM_INFO[item.id]?.placeable) {
    preview.style.display = 'none';
    return;
  }

  const originX = player.x + player.width/2;
  const originY = player.y + player.height/2;
  const mouseWorldX = mouse.x + camera.x;
  const mouseWorldY = mouse.y + camera.y;

  const hit = raycastTiles(originX, originY, mouseWorldX, mouseWorldY, 90);

  let worldX, worldY;
  if (hit && hit.placeX !== null) { worldX = hit.placeX; worldY = hit.placeY; }
  else { worldX = Math.floor(mouseWorldX / TILE_SIZE); worldY = Math.floor(mouseWorldY / TILE_SIZE); }

  let canPlace = canPlaceBlock(worldX, worldY);
  if (item.id === ITEMS.DOOR) canPlace = canPlaceBlock(worldX, worldY) && canPlaceBlock(worldX, worldY - 1);

  const sx = worldX * TILE_SIZE - camera.x;
  const sy = worldY * TILE_SIZE - camera.y;

  const rect = canvas.getBoundingClientRect();
  preview.style.display = 'block';
  preview.style.left = (rect.left + window.scrollX + sx) + 'px';
  preview.style.top  = (rect.top  + window.scrollY + sy + (item.id === ITEMS.DOOR ? -TILE_SIZE : 0)) + 'px';
  preview.style.width = TILE_SIZE + 'px';
  preview.style.height = (item.id === ITEMS.DOOR ? TILE_SIZE * 2 : TILE_SIZE) + 'px';
  preview.className = canPlace ? 'valid' : 'invalid';
}

/* ================================
   INPUT
==================================*/
function setupInputs() {
  document.onkeydown = (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key >= '1' && e.key <= '9') { player.selectedSlot = parseInt(e.key) - 1; updateHotbar(); }
    if (e.key.toLowerCase() === 'e') toggleInventory();
    if (e.key.toLowerCase() === 'f') interact();
    if (e.key === 'Escape') {
      closeCrafting(); closeFurnace(); closeChest(); closeShop(); closeBossSpawn();
      document.getElementById('inventory').classList.remove('open');
    }
  };
  document.onkeyup = (e) => { keys[e.key.toLowerCase()] = false; };

  canvas.onmousemove = (e) => {
    let rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };
  canvas.onmousedown = (e) => {
    e.preventDefault();
    if (e.button === 0) mouse.down = true;
    else if (e.button === 2) mouse.rightDown = true;
  };
  canvas.onmouseup = (e) => {
    if (e.button === 0) { mouse.down = false; miningTarget = null; miningProgress = 0; }
    else if (e.button === 2) mouse.rightDown = false;
  };
  canvas.oncontextmenu = (e) => e.preventDefault();
}

/* ================================
   GAME LOOP
==================================*/
function gameLoop() {
  if (!gameOver && !gameWon) {
    gameTime++;
    dayTime = (dayTime + 0.1) % 1000;

    updatePlayer();
    updateEntities();
    updateBoss();
    updateParticles();
    updateDayNightEnemies();

    if (mouse.down) {
      let worldX = Math.floor((mouse.x + camera.x) / TILE_SIZE);
      let worldY = Math.floor((mouse.y + camera.y) / TILE_SIZE);
      mineBlock(worldX, worldY);
      attack();
    }

    if (mouse.rightDown) {
      placeFromMouse();
      mouse.rightDown = false;
    }

    if (player.health <= 0 && !gameOver) gameOver = true;
  }

  render();
  animationId = requestAnimationFrame(gameLoop);
}

function restartGame() {
  if (animationId) cancelAnimationFrame(animationId);
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('victoryScreen').style.display = 'none';
  document.getElementById('bossHealth').style.display = 'none';
  closeCrafting(); closeFurnace(); closeChest(); closeShop(); closeBossSpawn();
  document.getElementById('inventory').classList.remove('open');

  initGameState();
  generateWorld();

  let spawnX = 100;
  player.y = (getGroundLevel(spawnX) - 3) * TILE_SIZE;
  player.x = spawnX * TILE_SIZE;

  let ctX = spawnX - 3, ctY = getGroundLevel(ctX);
  if (world[ctX]) world[ctX][ctY - 1] = BLOCKS.CRAFTING_TABLE;
  let fX = spawnX - 1, fY = getGroundLevel(fX);
  if (world[fX]) world[fX][fY - 1] = BLOCKS.FURNACE;

  addToInventory(ITEMS.WOOD_PICKAXE, 1);
  addToInventory(ITEMS.WOOD_AXE, 1);
  addToInventory(ITEMS.WOOD_SWORD, 1);
  addToInventory(ITEMS.TORCH, 20);
  addToInventory(ITEMS.COOKED_MEAT, 10);
  addToInventory(ITEMS.WOOD_PLANK, 20);
  addToInventory(ITEMS.DOOR, 3);

  updateHotbar();
  updateUI();
  gameLoop();
}

/* ================================
   INIT
==================================*/
initGameState();
setupInputs();
generateWorld();

let spawnX = 100;
player.y = (getGroundLevel(spawnX) - 3) * TILE_SIZE;
player.x = spawnX * TILE_SIZE;

let ctX = spawnX - 3, ctY = getGroundLevel(ctX);
if (world[ctX]) world[ctX][ctY - 1] = BLOCKS.CRAFTING_TABLE;
let fX = spawnX - 1, fY = getGroundLevel(fX);
if (world[fX]) world[fX][fY - 1] = BLOCKS.FURNACE;

addToInventory(ITEMS.WOOD_PICKAXE, 1);
addToInventory(ITEMS.WOOD_AXE, 1);
addToInventory(ITEMS.WOOD_SWORD, 1);
addToInventory(ITEMS.TORCH, 20);
addToInventory(ITEMS.COOKED_MEAT, 10);
addToInventory(ITEMS.WOOD_PLANK, 20);
addToInventory(ITEMS.DOOR, 3);

updateHotbar();
updateUI();
gameLoop();

/* ================================
   MISSING CLOSE FUNCTIONS (UI)
   (mantém compatível com os botões)
==================================*/
function closeCrafting(){ document.getElementById('craftingMenu').style.display = 'none'; }
function closeFurnace(){ document.getElementById('furnaceMenu').style.display = 'none'; }
function closeChest(){ document.getElementById('chestMenu').style.display = 'none'; }
function closeShop(){ document.getElementById('shopMenu').style.display = 'none'; }
function closeBossSpawn(){ document.getElementById('bossSpawnMenu').style.display = 'none'; }