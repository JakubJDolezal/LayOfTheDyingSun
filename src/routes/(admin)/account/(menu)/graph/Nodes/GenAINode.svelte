<!--<script lang="ts">-->
<!--  import { Handle, Position, type NodeProps } from '@xyflow/svelte';-->
<!--  import NodeCard from "./NodeCard.svelte";-->
<!--  import {CommentOutlined, RobotOutlined} from "svelte-ant-design-icons";-->
<!--  import {Dialog, Icon} from "svelte-ux";-->
<!--  import {writable} from "svelte/store";-->
<!--  import {onMount} from "svelte";-->
<!--  // import {fetchDataDjango} from "$lib/DjangoBackendCommunication/baseDjangoCommunicationWrappers";-->
<!--  // import {userSession} from "$lib/stores/sessionStore";-->
<!--  -->
<!--  import {faShareNodes, faComments} from '@fortawesome/free-solid-svg-icons';-->

<!--  type $$Props = NodeProps;-->
<!--  let modalState=false;-->
<!--  export let isConnectable: $$Props['isConnectable'];-->

<!--  $$restProps;-->
<!--  export let data: $$Props['data'] = { models: [] };-->


<!--  if (!data || !data.models) {-->
<!--      data.models = [];-->
<!--  }-->
<!--    let outputs = ['Collection', 'Json', 'Append']-->
<!--    const addRow = () => {-->
<!--      data.models = [-->
<!--        ...data.models,-->
<!--        {-->
<!--          model:'',-->
<!--          prompt: '',-->
<!--          output: 'Collection',-->
<!--          deployment: '',-->
<!--          platform: '',-->
<!--          source: '',-->
<!--          url: '',-->
<!--          key: ''-->
<!--        }-->
<!--      ]-->
<!--    };-->

<!--  const removeRow = (index: number) => {-->
<!--    data.models = data.models.filter((_, i) => i !== index);-->
<!--  };-->

<!--  const updateRow = (index: number, field: string, value: any) => {-->
<!--        data.rows = data.rows.map((row, i) =>-->
<!--            i === index ? { ...row, [field]: value } : row-->
<!--        );-->
<!--  };-->
<!--</script>-->


<!--<Handle type="target" position={Position.Left} {isConnectable} />-->
<!--<NodeCard-->
<!--  title="myModel"-->
<!--  nodeType="GenAINode"-->
<!--  content=""-->
<!--  footer="Edit Call"-->
<!--  bind:isModalOpen={modalState}-->

<!--&gt;-->
<!--  <div slot="icon">-->
<!--    <div><Icon data={faShareNodes}/></div>-->
<!--    <div><Icon data={faComments}/></div>-->
<!--  </div>-->
<!--</NodeCard>-->
<!--<Handle type="source" position={Position.Right} {isConnectable} />-->


<!--<Dialog bind:open={modalState}>-->
<!--    <div class="editable-table">-->
<!--      <div class="table-header">-->
<!--        <div>Model</div>-->
<!--        <div>Output</div>-->
<!--        <div>Prompt</div>-->
<!--        <div>Deployment</div>-->
<!--        <div>Platform</div>-->
<!--        <div>Source</div>-->
<!--      </div>-->
<!--      {#each data.rows ?? [] as row, index}-->
<!--        <div class="table-row">-->
<!--          <input-->
<!--            type="text"-->
<!--            class="input"-->
<!--            bind:value={row.model}-->
<!--            on:input={(e) => updateRow(index, 'model', e.target.value)}-->
<!--            placeholder="Enter usage"-->
<!--          />-->
<!--          <select-->
<!--            class="dropdown"-->
<!--            bind:value={row.output}-->
<!--            on:change={(e) => updateRow(index, 'output', e.target.value)}-->
<!--          >-->
<!--            <option value="" disabled>Select a model</option>-->
<!--            {#each outputs as output}-->
<!--              <option value={output}>{output}</option>-->
<!--            {/each}-->
<!--          </select>-->
<!--         <input-->
<!--            type="text"-->
<!--            class="input"-->
<!--            bind:value={row.prompt}-->
<!--            on:input={(e) => updateRow(index, 'prompt', e.target.value)}-->
<!--            placeholder="Enter usage"-->
<!--          />-->
<!--         <input-->
<!--            type="text"-->
<!--            class="input"-->
<!--            bind:value={row.deployment}-->
<!--            on:input={(e) => updateRow(index, 'deployment', e.target.value)}-->
<!--            placeholder="Enter usage"-->
<!--          />-->
<!--         <input-->
<!--            type="text"-->
<!--            class="input"-->
<!--            bind:value={row.platform}-->
<!--            on:input={(e) => updateRow(index, 'platform', e.target.value)}-->
<!--            placeholder="platform"-->
<!--          />-->
<!--         <input-->
<!--            type="text"-->
<!--            class="input"-->
<!--            bind:value={row.platform}-->
<!--            on:input={(e) => updateRow(index, 'source', e.target.value)}-->
<!--            placeholder="source"-->
<!--          />-->
<!--          <button class="delete-button" on:click={() => removeRow(index)}>🗑️</button>-->
<!--        </div>-->
<!--      {/each}-->
<!--      <button class="add-row" on:click={addRow}>+ Add row</button>-->
<!--    </div>-->
<!--</Dialog>-->


<!--<style>-->
<!--  .editable-table {-->
<!--    font-family: Arial, sans-serif;-->
<!--    width: 100%;-->
<!--    border: 1px solid #ddd;-->
<!--    border-radius: 8px;-->
<!--    overflow: hidden;-->
<!--    background-color: #fff;-->
<!--  }-->

<!--  .table-header,-->
<!--  .table-row {-->
<!--    display: grid;-->
<!--    grid-template-columns: 2fr 3fr 1.5fr 3fr 1.5fr 0.5fr;-->
<!--    padding: 10px;-->
<!--    border-bottom: 1px solid #ddd;-->
<!--  }-->

<!--  .table-header {-->
<!--    background-color: #f7f7f7;-->
<!--    font-weight: bold;-->
<!--    text-align: left;-->
<!--  }-->

<!--  .table-row {-->
<!--    align-items: center;-->
<!--  }-->

<!--  .input {-->
<!--    padding: 5px;-->
<!--    border: 1px solid #ccc;-->
<!--    border-radius: 4px;-->
<!--    font-size: 14px;-->
<!--  }-->

<!--  .dropdown {-->
<!--    padding: 5px;-->
<!--    border: 1px solid #ccc;-->
<!--    border-radius: 4px;-->
<!--    font-size: 14px;-->
<!--  }-->

<!--  .category-buttons {-->
<!--    display: flex;-->
<!--    flex-wrap: wrap;-->
<!--    gap: 5px;-->
<!--  }-->

<!--  .category-buttons button {-->
<!--    padding: 5px 10px;-->
<!--    border: 1px solid #ccc;-->
<!--    border-radius: 4px;-->
<!--    background-color: #f7f7f7;-->
<!--    cursor: pointer;-->
<!--    font-size: 14px;-->
<!--  }-->

<!--  .category-buttons button.active {-->
<!--    background-color: #007bff;-->
<!--    color: white;-->
<!--    border-color: #0056b3;-->
<!--  }-->

<!--  .delete-button {-->
<!--    background: none;-->
<!--    border: none;-->
<!--    color: #ff0000;-->
<!--    font-size: 18px;-->
<!--    cursor: pointer;-->
<!--  }-->

<!--  .delete-button:hover {-->
<!--    color: #cc0000;-->
<!--  }-->

<!--  .add-row {-->
<!--    width: 100%;-->
<!--    padding: 10px;-->
<!--    text-align: center;-->
<!--    background-color: #007bff;-->
<!--    color: white;-->
<!--    border: none;-->
<!--    font-size: 14px;-->
<!--    cursor: pointer;-->
<!--  }-->

<!--  .add-row:hover {-->
<!--    background-color: #0056b3;-->
<!--  }-->
<!--</style>-->

