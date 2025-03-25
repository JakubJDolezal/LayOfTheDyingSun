<script lang="ts">

import { useDnD } from './utils';
import {faArrowRightToBracket, faArrowRightFromBracket, faSquare, faScissors, faTableCells, faDiamond, faTags, faComments, faEye, faCode} from '@fortawesome/free-solid-svg-icons';
import Fa from "svelte-fa"

const type = useDnD();

const onDragStart = (event: DragEvent, nodeType: string) => {
  if (!event.dataTransfer) {
    return null;
  }
  type.set(nodeType);

  event.dataTransfer.effectAllowed = 'move';
};

let nodes = [
  { "name": "inputNode",          "display_name": "Input",                "icon": faArrowRightToBracket },
  { "name": "switchNode",         "display_name": "Switch",               "icon": faDiamond },
  { "name": "modelNode",          "display_name": "Classification Model", "icon": faTags },
]

</script>

<aside class="grl-dg__aside flow-sidebar-container">

  <div class="flow-sidebar-nodes">
    <div class="field-label">Drag nodes to the blueprint</div>
    {#each nodes as node}
      <div class="flow-sidebar-node" on:dragstart={(event) => onDragStart(event, node.name)} draggable={true}>
        <Fa icon={node.icon}/>
        <div class="name">{node.display_name}</div>
      </div>
    {/each}
  </div>
  <slot></slot> <!-- This slot allows you to insert content dynamically -->

</aside>
