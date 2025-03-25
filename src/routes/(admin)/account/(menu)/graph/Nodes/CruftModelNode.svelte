<!--<script lang="ts">-->
<!--  import { Handle, Position, type NodeProps } from '@xyflow/svelte';-->
<!--  import NodeCard from "./NodeCard.svelte"; -->
<!--  import {Icon} from "svelte-ux";-->

<!--  import {faShareNodes, faScissors} from '@fortawesome/free-solid-svg-icons';-->

<!--  type $$Props = NodeProps;-->
<!--  $$restProps;-->
<!--  let modalState=false;-->

<!--  export let data: $$Props['data'];-->
<!--  export let isConnectable: $$Props['isConnectable'];-->
<!--</script>-->

<!--<Handle type="target" position={Position.Left} {isConnectable} />-->
<!--<NodeCard-->
<!--  title="myCruftModel"-->
<!--  nodeType="CruftModelNode"-->
<!--  content=""-->
<!--  footer="Edit Call"-->
<!--  bind:isModalOpen={modalState}-->

<!--&gt;-->
<!--  <div slot="icon">-->
<!--    <div><Icon data={faShareNodes}/></div>-->
<!--    <div><Icon data={faScissors}/></div>-->
<!--  </div>-->
<!--</NodeCard>-->
<!--<Handle type="source" position={Position.Right} {isConnectable} />-->
