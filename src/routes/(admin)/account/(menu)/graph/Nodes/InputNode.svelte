<script lang="ts">
  import {Handle, Position, type NodeProps, useUpdateNodeInternals} from '@xyflow/svelte';
  import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
  import {onMount} from "svelte";
  import Fa from "svelte-fa"
  type $$Props = NodeProps;
  export let id: NodeProps['id'];
  export let data: $$Props['data'] = [{ handle_positions: [{id:id+'-0', x:24, y:0, type:"source"}] }];
  console.log(id)
  const updateNodeInternals = useUpdateNodeInternals();

  // After updating node data or handle positions

  onMount(async () => {
    if (!data || !data.categories) {
            data.handle_positions = [{id:id+'-0', x:24, y:0, type:"source"}]
      }
    updateNodeInternals(id);
  });

  export let isConnectable: $$Props['isConnectable'];
</script>

<div class="node-card bg-base-100 shadow-xl border border-neutral relative rounded-lg">
  <div class="node-header flex justify-between items-center px-3 py-2 bg-primary text-primary-content rounded-t-lg">
      <Fa icon={faRightToBracket}/>
      <span class="node-info"> Inbox</span>
      <Handle id={id+`-0`} type="source" position={Position.Right} {isConnectable} />
  </div>
</div>

