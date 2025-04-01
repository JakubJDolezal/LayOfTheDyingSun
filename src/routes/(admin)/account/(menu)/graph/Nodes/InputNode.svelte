<script lang="ts">
  import {Handle, Position, type NodeProps, useUpdateNodeInternals} from '@xyflow/svelte';
  import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
  import {onMount} from "svelte";
  import Fa from "svelte-fa"
  import { nodeDataDict } from "../Flow.svelte"
  type $$Props = NodeProps;
  // export let id: NodeProps['id'];
  let { id, isConnectable } :NodeProps = $props();

  // export let data: $$Props['data'] = [{ handle_positions: [{id:id+'-0', x:24, y:0, type:"source"}] }];
  console.log(id)
  const updateNodeInternals = useUpdateNodeInternals();

  // After updating node data or handle positions

  onMount(async () => {
    // if (!data || !data.categories) {
    //         data.handle_positions = [{id:id+'-0', x:24, y:0, type:"source"}]
    //   }
    updateNodeInternals(id);
  });
  nodeDataDict[id]={ handle_positions: [{id:id+'-0', x:24, y:0, type:"source"}]}
  // Initialize data as a reactive state
  let data = $derived(nodeDataDict[id])
  // export let isConnectable: $$Props['isConnectable'];
</script>

<div class="node-card bg-base-100 shadow-xl border border-neutral rounded-lg">
  <div class="node-header flex justify-between items-center px-3 py-2 bg-primary text-primary-content rounded-lg">
      <Fa icon={faRightToBracket}/>
      <span class="node-info"> Inbox</span>
      <Handle id={id+`-0`} type="source" position={Position.Right} {isConnectable} />
  </div>
</div>

