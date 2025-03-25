<!--<script lang="ts">-->
<!--  import { Handle, Position, type NodeProps } from '@xyflow/svelte';-->

<!--  type $$Props = NodeProps;-->
<!--  export let data: $$Props['data'];-->
<!--  export let isConnectable: $$Props['isConnectable'];-->

<!--  // Ensure the `data` prop has a `rows` property-->
<!--  if (!data.rows) {-->
<!--    data.rows = [];-->
<!--  }-->

<!--  const addRow = () => {-->
<!--    data.rows = [...data.rows, { id: data.rows.length + 1, value: '' }];-->
<!--  };-->

<!--  const updateRow = (index: number, value: string) => {-->
<!--    data.rows = data.rows.map((row, i) =>-->
<!--      i === index ? { ...row, value } : row-->
<!--    );-->
<!--  };-->
<!--</script>-->

<!--<Handle type="target" position={Position.Left} style="background: #555;" {isConnectable} />-->

<!--<div>-->
<!--  <h3>Row Manager Node</h3>-->
<!--  {#each data.rows as row, index}-->
<!--    <div>-->
<!--      Row {row.id}:-->
<!--      <input-->
<!--        class="nodrag"-->
<!--        type="text"-->
<!--        bind:value={row.value}-->
<!--        on:input={(event) => updateRow(index, event.currentTarget.value)}-->
<!--      />-->
<!--    </div>-->
<!--  {/each}-->
<!--  <button class="nodrag" on:click={addRow}>Add Row</button>-->
<!--</div>-->

<!--<Handle-->
<!--  type="source"-->
<!--  position={Position.Right}-->
<!--  style="background: #555;"-->
<!--  {isConnectable}-->
<!--/>-->

<!--<style>-->
<!--  :global(.svelte-flow__node-rowManagerNode) {-->
<!--    font-size: 12px;-->
<!--    background: #eee;-->
<!--    border: 1px solid #555;-->
<!--    border-radius: 5px;-->
<!--    text-align: center;-->
<!--    padding: 10px;-->
<!--  }-->
<!--  input {-->
<!--    margin: 5px 0;-->
<!--  }-->
<!--  button {-->
<!--    margin-top: 10px;-->
<!--  }-->
<!--</style>-->
