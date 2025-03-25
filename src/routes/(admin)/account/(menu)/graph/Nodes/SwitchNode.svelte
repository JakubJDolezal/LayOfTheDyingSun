<script lang="ts">
  import {Handle, Position, type NodeProps, useUpdateNodeInternals} from '@xyflow/svelte';
  import { faDiamond, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
  import { tick } from 'svelte';
  import Icon from "$lib/components/Icon.svelte"
  import Button from "$lib/components/Button.svelte"
  import TextField from "$lib/components/TextField.svelte"

  type $$Props = NodeProps;
  export let id: $$Props['id'];
  export let data: $$Props['data'] = [{ conditions: [], handle_positions: [{id:id+'-0', x:-182, y:0, type:"target"}] }];
  export let isConnectable: $$Props['isConnectable'];

  const updateNodeInternals = useUpdateNodeInternals();

  if (!data || !data.conditions) {
      data.conditions = [];
      data.handle_positions = [{id:id+'-0', x:-182, y:0, type:"target"}];
      updateNodeInternals(id);
  }

  const addCondition = async () => {
      const maxId = data.conditions.length > 0 ? Math.max(...data.conditions.map(c => c.id)) + 1 : 0;
      data.conditions = [...data.conditions, { id: maxId, condition: "" }];

      await tick();
      const y = data.conditions.length * 73;
      data.handle_positions = [
          ...data.handle_positions,
          { id: `${id}-condition-${maxId}`, x: 182, y, type: "source" }
      ];
      updateNodeInternals(id);
  };

  const removeCondition = async (conditionId) => {
      data.conditions = data.conditions.filter((condition) => condition.id !== conditionId);
      data.handle_positions = data.handle_positions.filter(pos => pos.id !== `${id}-condition-${conditionId}`);
      await tick();
      data.handle_positions = data.conditions.map((condition, index) => ({
          id: `${id}-condition-${condition.id}`,
          x: 182,
          y: index * 73,
          type: "source",
      }));
      updateNodeInternals(id);
  };

  const updateCondition = (index: number, value: string) => {
    data.conditions = data.conditions.map((condition, i) => (i === index ? { ...condition, condition: value } : condition));
  };

</script>



<div class="node-card bg-base-100 shadow-xl border border-neutral relative rounded-lg">

    <div class="node-header flex justify-between items-center px-3 py-2 bg-primary text-primary-content rounded-lg">
        <div class="flex items-center gap-2">
            <Icon data={faDiamond}  />
            <span class="font-semibold text-lg">Switch</span>
        </div>
        <Button  icon={faPlus}  on:click={addCondition}>
            Add Condition
        </Button>
        <Handle
            id={id + "-0"}
            type="target"
            position={Position.Left}
            {isConnectable}
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
        />
    </div>

    <!-- Table for Conditions (No Extra White Space) -->
    {#if data.conditions.length > 0}
        <div class="w-full">
            <table class="table-auto w-full text-left">
                <thead>
                    <tr>
                        <th class="px-3 py-1 text-sm font-semibold">Condition</th>
                        <th class="px-3 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.conditions as condition, index}
                        <tr class="align-middle">
                            <td class="px-3 py-1 w-full">
                                <TextField
                                    bind:value={data.conditions[index].condition}
                                    on:input={(e) => updateCondition(index, e.target.value)}
                                    placeholder="Condition">
                                     <span slot="append">
                                        <Button icon={faXmark} size="xs" on:click={() => removeCondition(condition.id)}  />
                                    </span>
                                </TextField>
                            </td>
                            <td class="relative px-2 py-1">
                                <div class="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center">
                                    <Handle type="source" position={Position.Right} id={id+`-condition-${condition.id}`} {isConnectable} />
                                </div>
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




