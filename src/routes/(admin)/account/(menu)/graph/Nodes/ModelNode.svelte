<script lang="ts">
import { Handle, Position, type NodeProps, useUpdateNodeInternals } from '@xyflow/svelte';
import { faTags, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { tick } from "svelte";
import Icon from "$lib/components/Icon.svelte";
import Button from "$lib/components/Button.svelte";
import TextField from "$lib/components/TextField.svelte";

type $$Props = NodeProps;
export let id: $$Props['id'];
export let isConnectable: $$Props['isConnectable'];
export let data: $$Props['data'] = { categories: [], handle_positions: [{ id: id + '-0', x: -182, y: 0, type: "target" }] };
const updateNodeInternals = useUpdateNodeInternals();

// Ensure data structure is initialized correctly
if (!data || !data.categories) {
    data.categories = [];
    data.handle_positions = [{ id: id + '-0', x: -182, y: 0, type: "target" }];
    updateNodeInternals(id);
}

// Function to add a new category row
const addRow = async () => {
    const maxId = data.categories.length > 0 ? Math.max(...data.categories.map(cat => cat.id)) + 1 : 0;

    data.categories = [...data.categories, { id: maxId, category: '', read: true, starred: false }];

    await tick(); // Ensures DOM update before measuring

    const x = 182;
    const y = data.categories.length * 73;

    data.handle_positions = [...data.handle_positions, { id: `${id}-category-${maxId}`, x, y, type: "source" }];
    updateNodeInternals(id);
};

// Function to remove a category row
const removeRow = async (index: number) => {
    data.handle_positions = data.handle_positions.filter(pos => pos.id !== `${id}-category-${index}`);
    data.categories = data.categories.filter(category => category.id !== index);

    await tick();

    // Recalculate positions
    data.handle_positions = data.categories.map((category, idx) => ({
        id: `${id}-category-${category.id}`,
        x: 182,
        y: idx * 73,
        type: "source"
    }));

    updateNodeInternals(id);
};
</script>

<div class="node-card bg-base-100 shadow-xl border border-neutral relative rounded-lg">

    <div class="node-header flex justify-between items-center px-3 py-2 bg-primary text-primary-content rounded-lg">
        <div class="flex items-center gap-2">
            <Icon data={faTags} />
            <span class="font-semibold text-lg">Categories</span>
        </div>
        <Button icon={faPlus} on:click={addRow}>
            Add Category
        </Button>
        <Handle
            id={id + "-0"}
            type="target"
            position={Position.Left}
            {isConnectable}
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
        />
    </div>

    <!-- Category Table -->
    {#if data.categories.length > 0}
        <div class="w-full">
            <table class="table-auto w-full text-left">
                <thead>
                    <tr class="bg-base-200">
                        <th class="px-3 py-1">Category</th>
                        <th class="px-3 py-1 text-center">Read</th>
                        <th class="px-3 py-1 text-center">Starred</th>
                        <th class="px-3 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.categories as row, index}
                        <tr class="hover:bg-base-100">
                            <td class="px-3 py-1 w-full">
                                <TextField bind:value={row.category} placeholder="Category">
                                    <span slot="append">
                                        <Button outline={false} icon={faXmark} size="xs" on:click={() => removeRow(row.id)}  />
                                    </span>
                                </TextField>
                            </td>
                            <td class="px-3 py-1 text-center">
                                <input type="checkbox" bind:checked={row.read} class="checkbox checkbox-sm" />
                            </td>
                            <td class="px-3 py-1 text-center">
                                <input type="checkbox" bind:checked={row.starred} class="checkbox checkbox-sm" />
                            </td>
                            <td class="relative px-3 py-1">
                                <!-- Right Edge Handle -->
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={id + `-category-${row.id}`}
                                    {isConnectable}
                                    class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
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
    max-width: 350px;
  }

  .node-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
  }

</style>
