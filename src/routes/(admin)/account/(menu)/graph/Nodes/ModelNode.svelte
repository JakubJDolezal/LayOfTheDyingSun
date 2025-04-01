<script lang="ts">
  import { Handle, Position, type NodeProps, useUpdateNodeInternals } from '@xyflow/svelte';
  import { faTags, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
  import { tick } from 'svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Button from '$lib/components/Button.svelte';
  import TextField from '$lib/components/TextField.svelte';
  import { colorPalettes, getNextPaletteColor, resolveColorInput } from '$lib/colors';
  import { getTextColorForBackground } from '$lib/colors';
  import { onClickOutside } from '$lib/utils/onClickOutside';
  import SelectField from "$lib/components/SelectField.svelte" // optional helper
  import { faCog } from '@fortawesome/free-solid-svg-icons';
  // import { nodeDataDict } from './NodeDataStore.svelte.js'
  import { nodeDataDict } from '../Flow.svelte'

  let showPicker = $state(-1); // track open picker by index
  let showAdvanced = $state(false);
  type Color = {
    backgroundColor: string;
    textColor: string;
  };

  type Category = {
    id: number;
    category: string;
    read: boolean;
    starred: boolean;
    color: Color;
  };

  type HandlePosition = {
    id: string;
    x: number;
    y: number;
    type: 'target' | 'source';
  };

  type NodeData = {
    categories: Category[];
    handle_positions: HandlePosition[];
    show_color: boolean;
  };

  type $$Props = NodeProps;

  let { id, isConnectable, data: initialData } :NodeProps = $props();
  nodeDataDict[id]={
    categories: initialData?.categories ?? [],
    handle_positions: initialData?.handle_positions ?? [{ id: `${id}-0`, x: -182, y: 0, type: 'target' }],
    show_color: initialData?.show_color ?? false
  }
  // Initialize data as a reactive state
  let data = $derived(nodeDataDict[id])

  const updateNodeInternals = useUpdateNodeInternals();
  const paletteType = $state('base'); // 'base', 'pastel', or 'vivid'
  const paletteOptions = [
    { label: 'Base', value: 'base' },
    { label: 'Pastel', value: 'pastel' },
    { label: 'Vivid', value: 'vivid' },
    { label: 'Monochrome', value: 'monochrome' }

  ];



  // if (!data || !data.categories) {
  //   data.categories = [];
  //   data.handle_positions = [{ id: `${id}-0`, x: -182, y: 0, type: 'target' }];
  //   updateNodeInternals(id);
  // }

  const addRow = async () => {
    const maxId = nodeDataDict[id].categories.length > 0 ? Math.max(...nodeDataDict[id].categories.map(cat => cat.id)) + 1 : 0;
    const newCategory = {
      id: maxId,
      category: '',
      read: true,
      starred: false,
      color: getNextPaletteColor(paletteType)
    };

    const newCategories = [...nodeDataDict[id].categories, newCategory];
    const x = 182;
    const y = 42 + newCategories.length * 40;
    const newHandlePositions = [...nodeDataDict[id].handle_positions, {
      id: `${id}-category-${maxId}`,
      x,
      y,
      type: 'source'
    }];

    nodeDataDict[id] = {
      ...nodeDataDict[id],
      categories: newCategories,
      handle_positions: newHandlePositions
    };
    console.log(nodeDataDict[id]);
    await tick();
    updateNodeInternals(id);
  };


   const removeRow = async (categoryId: number) => {
    const newCategories = nodeDataDict[id].categories.filter(cat => cat.id !== categoryId);
    const newHandlePositions = newCategories.map((cat, idx) => ({
      id: `${id}-category-${cat.id}`,
      x: 182,
      y: 42 + (idx + 1) * 40,
      type: 'source'
    }));

    nodeDataDict[id] = {
      ...nodeDataDict[id],
      categories: newCategories,
      handle_positions: newHandlePositions
    };

    await tick();
    updateNodeInternals(id);
  };


</script>


<div class="node-card bg-base-100 shadow-xl border border-neutral rounded-lg">
    <div class="node-header flex justify-between items-center px-3 py-2 bg-primary text-primary-content rounded-lg">
        <div class="flex items-center gap-2">
            <Icon data={faTags} />
            <span class="font-semibold text-lg">Categories</span>
        </div>
        <label class="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={data.show_color}
            onchange={(e) => {
              nodeDataDict[id] = { ...nodeDataDict[id], show_color: e.currentTarget.checked };
            }}
            class="checkbox-sm"
          />
          <span class="font-semibold">Color</span>
        </label>
        <div class="flex items-center gap-2">
          <Button icon={faPlus} onclick={addRow}></Button>
        </div>
      <!-- Advanced Settings Toggle -->
        <div class="relative">
          <Button icon={faCog} size="sm" onclick={() => showAdvanced = !showAdvanced} />

          {#if showAdvanced}
            <div class="absolute right-0 mt-2 z-10 bg-base-100 shadow-lg rounded-lg border border-base-300 p-3 min-w-[200px]">
              <label  class="block font-medium mb-1">Palette
                <SelectField
                  options={paletteOptions}
                  placeholder="Select Palette"
                  clearable={false}
                  selected={paletteType}
                />
              </label>
            </div>
          {/if}
        </div>
        <Handle
            id={id + "-0"}
            type="target"
            position={Position.Left}
            {isConnectable}
        />
    </div>

    {#if data.categories.length > 0}
        <div class="w-full">
            <table class="table-auto w-full text-left">
                <thead>
                    <tr class="bg-base-200">
                        <th class="px-3 py-1">Category</th>
                        {#if data.show_color}
                          <th class="px-3 py-1">Color</th>
                        {/if}
                        <th class="px-3 py-1 text-center">Read</th>
                        <th class="px-3 py-1 text-center">Starred</th>
                        <th class="px-3 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.categories as row, index}
                        <tr class="hover:bg-base-100">
                            <td class="px-3 py-1">
                                <TextField bind:value={row.category} placeholder="Category">
                                    <span slot="append">
                                        <Button outline={false} icon={faXmark} size="xs" onclick={() => removeRow(row.id)} />
                                    </span>
                                </TextField>
                            </td>
                            {#if data.show_color}
                              <td class="px-3 py-1 relative">
                                <!-- Color Button Trigger -->
                                <button
                                  class="w-6 h-6 rounded-full border"
                                  style="background-color: {row.color.backgroundColor};"
                                  onclick={() => showPicker = showPicker === index ? -1 : index}
                                />

                                <!-- Color Picker Popover -->
                                {#if showPicker === index}
                                  <div
                                    use:onClickOutside={() => (showPicker = -1)}
                                    class="absolute z-10 mt-2 bg-white p-3 border rounded shadow-lg flex flex-col gap-2"
                                  >
                                    <!-- Preset Colors -->
                                    <div class="grid grid-cols-5 gap-1">
                                      {#each colorPalettes[paletteType] as preset}
                                        <button
                                          class="w-6 h-6 rounded-full border-2 {row.color.backgroundColor === preset.backgroundColor ? 'border-black' : 'border-transparent'}"
                                          style="background-color: {preset.backgroundColor};"
                                          onclick={() => {
                                            row.color = preset;
                                            showPicker = -1;
                                          }}
                                        />
                                      {/each}
                                    </div>

                                    <!-- Custom Color Input -->
                                    <div class="flex items-center gap-2">
                                      <input
                                        type="color"
                                        bind:value={row.color.backgroundColor}
                                        oninput={() => {
                                          row.color.textColor = getTextColorForBackground(row.color.backgroundColor);
                                        }}
                                        class="w-6 h-6 p-0 border rounded"
                                      />
                                      <input
                                        type="text"
                                        bind:value={row.color.backgroundColor}
                                        onchange={() => {
                                          const resolved = resolveColorInput(row.color.backgroundColor);
                                          row.color = resolved;
                                        }}
                                        class="input input-sm input-bordered w-28"
                                      />
                                    </div>
                                  </div>
                                {/if}
                              </td>
                            {/if}
                            <td class="px-3 py-1 text-center">
                                <input type="checkbox" bind:checked={row.read} class="checkbox-sm" />
                            </td>
                            <td class="px-3 py-1 text-center">
                                <input type="checkbox" bind:checked={row.starred} class="checkbox-sm" />
                            </td>
                            <td class="relative px-3 py-1">
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={id + `-category-${row.id}`}
                                    {isConnectable}
                                />
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
  .node-card {
    min-width: 280px;
    max-width: 400px;
  }
</style>
