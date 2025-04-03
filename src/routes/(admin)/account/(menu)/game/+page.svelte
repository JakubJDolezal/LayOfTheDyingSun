<script lang="ts">
  import { onMount } from 'svelte';
  import * as PIXI from 'pixi.js';
  import { createClient } from '@supabase/supabase-js';

  // Supabase client
  const supabase = createClient(
    'https://your-project.supabase.co',
    'your-public-anon-key'
  );

  let gold = 0, wood = 0, food = 0;

  async function fetchResources() {
    // const { data, error } = await supabase
    //   .from('resources')
    //   .select('*')
    //   .single();
    // if (data) {
    //   gold = data.gold;
    //   wood = data.wood;
    //   food = data.food;
    // } else {
    //   console.error(error);
    // }
  }

  onMount(() => {
    fetchResources();

    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1e293b, // slate-800
      antialias: true,
    });

    const container = document.getElementById('pixi-map');
    if (container) container.appendChild(app.view);

    const tileSize = 100;
    const hexHeight = 86.6;
    const rows = 6;
    const cols = 8;

    const hexTexture = PIXI.Texture.from('/hex.png');
    const fogTexture = PIXI.Texture.from('/fog.png');

    const mapContainer = new PIXI.Container();
    app.stage.addChild(mapContainer);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (tileSize * 0.75);
        const y = row * hexHeight + (col % 2) * (hexHeight / 2);

        const hexTile = new PIXI.Sprite(hexTexture);
        hexTile.x = x;
        hexTile.y = y;
        mapContainer.addChild(hexTile);

        const fog = new PIXI.Sprite(fogTexture);
        fog.x = x;
        fog.y = y;
        fog.alpha = 0.8;
        fog.name = `fog-${row}-${col}`;
        mapContainer.addChild(fog);
      }
    }

    // Demo: reveal one tile after 2 seconds
    setTimeout(() => {
      const fog = mapContainer.getChildByName('fog-1-1') as PIXI.Sprite;
      if (fog) fog.visible = false;
    }, 2000);
  });
</script>

<!-- UI Layout -->
<div class="p-6 space-y-4">
  <div class="card bg-base-200 shadow-xl p-4 max-w-md">
    <h2 class="card-title">Resources</h2>
    <ul>
      <li>Gold: {gold}</li>
      <li>Wood: {wood}</li>
      <li>Food: {food}</li>
    </ul>
  </div>

  <div id="pixi-map" class="border border-gray-600 rounded-lg"></div>
</div>
