<!--<script lang="ts">-->
<!--  import { Handle, Position, type NodeProps } from '@xyflow/svelte';-->
<!--  import { onMount } from 'svelte';-->
<!--  import { Icon, Dialog, TextField, Field, Button, resize } from "svelte-ux";-->
<!--  import {faSquarePlus, faPenToSquare, faSquareMinus, faRotateLeft, faFileArrowUp, faFileArrowDown, faXmark, faPlus, faEllipsisH, faTableCells, faArrowRightToBracket, faArrowRightFromBracket, faArrowLeft, faArrowUp} from '@fortawesome/free-solid-svg-icons';-->

<!--  type $$Props = NodeProps;-->

<!--  export let id: string; // Node ID-->
<!--  export let data: $$Props['data']; // Node data-->
<!--  $$restProps;-->

<!--  export let isConnectable: $$Props['isConnectable']; // Flag to enable connections-->

<!--  // Initialize data for the table-->
<!--  let headers = { column_1: 'Input:1', column_2: 'Output:1', column_3: 'Description' };-->
<!--  let rows = data.rows || [{ column_1: '', column_2: '', column_3: '' }];-->

<!--  const labelPlacement = "float";-->
<!--  const fieldLabelPlacement = "inset";-->

<!--  let exportFileName = 'DecisionTable.csv';-->

<!--  let showModal = false;-->
<!--  let showImport = false;-->
<!--  let showExport = false;-->

<!--  let title: string = 'myDecisionTable';-->
<!--  let isEditingTitle = false; // Track whether the title is being edited-->
<!--  let editableTitle = title; // Local copy of the title for editing-->

<!--  const saveTitle = () => {-->
<!--    isEditingTitle = false;-->
<!--    title = editableTitle; // Update the prop with the new title-->
<!--  };-->

<!--  function toggleImport() {-->
<!--    showImport = !showImport;-->
<!--    showExport = false;-->
<!--  }-->

<!--  function toggleExport() {-->
<!--    showExport = !showExport;-->
<!--    showImport = false;-->
<!--  }-->

<!--  const addRow = () => {-->
<!--    rows = [...rows, Object.keys(headers).reduce((acc, key) => ({ ...acc, [key]: "" }), {})];-->
<!--    data.rows = rows;-->
<!--  };-->

<!--  const addRowAt = (index) => {-->
<!--    const newRow = Object.keys(headers).reduce((acc, key) => ({ ...acc, [key]: "" }), {});-->
<!--    rows = [-->
<!--      ...rows.slice(0, index), // Include rows up to the specified index-->
<!--      newRow,                  // Add the new row-->
<!--      ...rows.slice(index)     // Include the remaining rows-->
<!--    ];-->
<!--    data.rows = rows;-->
<!--  };-->

<!--  const swapRowWithPrevious = (index) => {-->
<!--    if (index <= 0 || index >= rows.length) {-->
<!--      return;-->
<!--    }-->

<!--    // Swap the row at the given index with the previous row-->
<!--    let updatedRows = [...rows];-->
<!--    [updatedRows[index - 1], updatedRows[index]] = [updatedRows[index], updatedRows[index - 1]];-->

<!--    rows = updatedRows;-->
<!--    data.rows = rows;-->
<!--  };-->

<!--  const addColumn = (type) => {-->
<!--    const newColumnKey = `column_${Object.keys(headers).length + 1}`;-->
<!--    headers = { ...headers, [newColumnKey]: `${type}: ${Object.keys(headers).length + 1}` };-->
<!--    rows = rows.map(row => ({ ...row, [newColumnKey]: '' }));-->
<!--    data.rows = rows;-->
<!--  };-->

<!--  const addColumnAfter = (afterKey, type) => {-->
<!--    const headerKeys = Object.keys(headers);-->
<!--    const newColumnKey = `column_${headerKeys.length + 1}`;-->
<!--    const newHeader = { [newColumnKey]: `${type}: ${headerKeys.length + 1}` };-->

<!--    // Find the index of the key to insert after-->
<!--    const index = headerKeys.indexOf(afterKey);-->

<!--    if (index === -1) {-->
<!--      return;-->
<!--    }-->

<!--    // Split headers into before and after the specified key-->
<!--    const updatedHeaders = {-->
<!--      ...Object.fromEntries(headerKeys.slice(0, index).map(key => [key, headers[key]])),-->
<!--      ...newHeader,-->
<!--      ...Object.fromEntries(headerKeys.slice(index).map(key => [key, headers[key]])),-->
<!--    };-->

<!--    headers = updatedHeaders;-->

<!--    // Update rows to include the new column with empty values-->
<!--    rows = rows.map(row => {-->
<!--      const newRow = {};-->
<!--      headerKeys.forEach(key => {-->
<!--        newRow[key] = row[key];-->
<!--        if (key === afterKey) {-->
<!--          newRow[newColumnKey] = ''; // Insert the new column after the specified key-->
<!--        }-->
<!--      });-->
<!--      return newRow;-->
<!--    });-->

<!--    data.rows = rows;-->
<!--  };-->

<!--  const swapColumnWithLeft = (key) => {-->
<!--    const headerKeys = Object.keys(headers);-->

<!--    // Find the index of the key-->
<!--    const index = headerKeys.indexOf(key);-->

<!--    if ( (index === -1) || (index === 0) ) {-->
<!--      return;-->
<!--    }-->

<!--    // Swap the order of the current key with the one to its left-->
<!--    const updatedKeys = [...headerKeys];-->
<!--    const t = updatedKeys[index - 1];-->
<!--    updatedKeys[index - 1] = updatedKeys[index]; -->
<!--    updatedKeys[index] =  t;-->
<!--   -->
<!--    // Update the headers object-->
<!--    headers = Object.fromEntries(updatedKeys.map(key => [key, headers[key]]));-->

<!--    // Update the rows to reflect the new column order-->
<!--    rows = rows.map(row => {-->
<!--      const updatedRow = {};-->
<!--      updatedKeys.forEach(key => {-->
<!--        updatedRow[key] = row[key];-->
<!--      });-->
<!--      return updatedRow;-->
<!--    });-->

<!--    data.rows = rows;-->
<!--  };-->

<!--  const deleteRow = (index) => {-->
<!--    if (index >= 0 && index < rows.length) {-->
<!--      rows = rows.filter((_, i) => i !== index); // Remove the row at the specified index-->
<!--      data.rows = rows; // Update the `data.rows` with the updated rows array-->
<!--    } else {-->
<!--      console.error("Invalid index: Unable to delete row.");-->
<!--    }-->
<!--  };-->

<!--  const deleteColumn = (columnKey) => {-->
<!--    if (headers.hasOwnProperty(columnKey)) {-->
<!--      // Remove the column from headers-->
<!--      const { [columnKey]: _, ...updatedHeaders } = headers;-->
<!--      headers = updatedHeaders;-->

<!--      // Remove the column from each row-->
<!--      rows = rows.map(row => {-->
<!--        const { [columnKey]: _, ...updatedRow } = row;-->
<!--        return updatedRow;-->
<!--      });-->

<!--      // Update the rows in the data object-->
<!--      data.rows = rows;-->
<!--    } else {-->
<!--      console.error("Invalid column key: Unable to delete column.");-->
<!--    }-->
<!--  };-->

<!--  const updateCell = (rowIndex: number, column: keyof typeof headers, value: string) => {-->
<!--    rows = rows.map((row, i) =>-->
<!--      i === rowIndex ? { ...row, [column]: value } : row-->
<!--    );-->
<!--    data.rows = rows;-->
<!--  };-->

<!--  const updateHeader = (column: keyof typeof headers, value: string) => {-->
<!--    headers = { ...headers, [column]: value };-->
<!--  };-->

<!--  const exportToCSV = () => {-->
<!--    const csvContent = [-->
<!--      Object.values(headers).join(","),-->
<!--      ...rows.map(row => Object.values(row).join(","))-->
<!--    ].join("\n");-->

<!--    const blob = new Blob([csvContent], { type: 'text/csv' });-->
<!--    const url = URL.createObjectURL(blob);-->
<!--    const link = document.createElement('a');-->
<!--    link.href = url;-->
<!--    link.download = exportFileName;-->
<!--    link.click();-->
<!--    URL.revokeObjectURL(url);-->
<!--  };-->

<!--  const importFromCSV = (event: InputEvent) => {-->
<!--    const file = (event.target as HTMLInputElement).files?.[0];-->
<!--    if (!file) return;-->

<!--    const reader = new FileReader();-->
<!--    reader.onload = (e) => {-->
<!--      const content = e.target?.result as string;-->
<!--      const [headerRow, ...dataRows] = content.split("\n").filter(Boolean);-->
<!--      const newHeaders = headerRow.split(",");-->
<!--      headers = newHeaders.reduce((acc, header, i) => {-->
<!--        acc[Object.keys(headers)[i] || `column${i + 1}`] = header;-->
<!--        return acc;-->
<!--      }, {} as typeof headers);-->
<!--      rows = dataRows.map(row => {-->
<!--        const values = row.split(",");-->
<!--        return newHeaders.reduce((acc, header, i) => {-->
<!--          acc[Object.keys(headers)[i] || `column${i + 1}`] = values[i] || "";-->
<!--          return acc;-->
<!--        }, {} as Record<keyof typeof headers, string>);-->
<!--      });-->
<!--      data.rows = rows;-->
<!--    };-->
<!--    reader.readAsText(file);-->
<!--  };-->
<!--  -->
<!--</script>-->

<!--<div class="node-card min-w-[400px]">-->
<!--  <div class="node-header">-->
<!--    <div class="node-icon">-->
<!--      <Icon data={faTableCells}/>-->
<!--    </div>-->
<!--    <div class="node-info">-->
<!--      {#if isEditingTitle}-->
<!--        <TextField-->
<!--          type="text"-->
<!--          bind:value={editableTitle}-->
<!--          on:blur={saveTitle}-->
<!--          on:keydown={(e) => e.key === 'Enter' && saveTitle()}-->
<!--          dense-->
<!--        />-->
<!--      {:else}-->
<!--        <p class="node-title" on:dblclick={() => (isEditingTitle = true)}>-->
<!--          {title}-->
<!--        </p>-->
<!--      {/if}-->
<!--      <p class="node-type">DecisionTable</p>-->
<!--    </div>-->
<!--    <Button icon={faEllipsisH} class="field-slot-icon"></Button>-->
<!--  </div>-->

<!--  <Handle type="target" position={Position.Left} style="background: #555;" {isConnectable} />-->
<!--  <Handle type="source" position={Position.Right} id="output" style="background: #555;" {isConnectable} />-->

<!--  {#if rows.length > 1 }-->
<!--  <div class="node-content">-->
<!--    {rows.length} Rows-->
<!--  </div>-->
<!--  {/if}-->

<!--  <div class="node-footer">-->
<!--    <div class="btn-group">-->
<!--      <Button icon={faPenToSquare} class="btn-primary" on:click={() => (showModal = true)}>Edit</Button>-->
<!--    </div>-->
<!--  </div>-->

<!--  <Dialog class="node-settings-pop-up" bind:open={showModal}>-->

<!--    <div class="node-tbl-container flex flex-col resize" use:resize>-->
<!--      -->
<!--      <div class="flex-1 overflow-scroll">-->
<!--        <table class="node-tbl-table">-->
<!--          <thead class="node-tbl-head">-->
<!--            <tr class="node-tbl-tr">-->
<!--              {#each Object.entries(headers) as [key, label]}-->
<!--                <th class="node-tbl-th">-->
<!--                  <TextField-->
<!--                    type="text"-->
<!--                    value={label}-->
<!--                    on:input={(e) => updateHeader(key, e.detail.value)}-->
<!--                  >-->
<!--                    <span slot="append">-->
<!--                      <Button icon={faPlus} class="field-slot-icon" on:click={() => addColumnAfter(key, 'input')}/>-->
<!--                      <Button icon={faArrowLeft} class="field-slot-icon" on:click={() => swapColumnWithLeft(key)}/>-->
<!--                      <Button icon={faXmark} class="field-slot-icon" on:click={() => deleteColumn(key)}/>-->
<!--                    </span>-->
<!--                  </TextField>-->
<!--                </th>-->
<!--              {/each}-->
<!--              <th class="node-tbl-th"></th>-->
<!--            </tr>-->
<!--          </thead>-->
<!--          <tbody>-->
<!--            {#each rows as row, rowIndex}-->
<!--              <tr class="node-tbl-tr">-->
<!--                {#each Object.keys(headers) as column}-->
<!--                  <td class="node-tbl-td">-->
<!--                    <TextField-->
<!--                      type="text"-->
<!--                      value={row[column]}-->
<!--                      on:change={(e) => updateCell(rowIndex, column, e.detail.value)}-->
<!--                    />-->
<!--                  </td>-->
<!--                {/each}-->
<!--                <td class="node-tbl-td">-->
<!--                  <div class="pb-2">-->
<!--                    <Button icon={faPlus} class="btn-small-standard" on:click={() => addRowAt(rowIndex)}></Button>-->
<!--                    <Button icon={faArrowUp} class="btn-small-standard" on:click={() => swapRowWithPrevious(rowIndex)}></Button>-->
<!--                    <Button icon={faXmark} class="btn-small-danger" on:click={() => deleteRow(rowIndex)}></Button>-->
<!--                  </div>-->
<!--                </td>-->
<!--              </tr>-->
<!--            {/each}-->
<!--          </tbody>-->
<!--        </table>-->
<!--      </div>-->

<!--      <div class="node-btn-group">-->
<!--        <Button icon={faPlus} class="btn-standard text-xs" on:click={() => addRow()}><span class="btn-responsive">Add Row</span></Button>-->
<!--        <Button icon={faArrowRightToBracket} class="btn-standard text-xs" on:click={() => addColumn('Input')}><span class="btn-responsive">Add Input</span></Button>-->
<!--        <Button icon={faArrowRightFromBracket} class="btn-standard text-xs" on:click={() => addColumn('Output')}><span class="btn-responsive">Add Output</span></Button>-->
<!--        <Button icon='{ (showImport) ? faXmark : faFileArrowUp  }' class="btn-secondary" on:click={() => toggleImport()}><span class="btn-responsive">Import</span></Button>-->
<!--        <Button icon='{ (showExport) ? faXmark : faFileArrowDown}' class="btn-secondary" on:click={() => toggleExport()}><span class="btn-responsive">Export</span></Button>  -->
<!--        <Button icon={faXmark} class="btn-cancel" on:click={() => (showModal = false)}><span class="btn-responsive">Close</span></Button>-->
<!--      </div>-->

<!--    </div>-->

<!--    <div class="w-full">-->
<!--      {#if showImport}-->

<!--        <div class="section-label">Import</div>-->
<!--        <div class="fieldset mb-2">-->
<!--      -->
<!--          <div class="field-flex-group">-->

<!--            <Field-->
<!--              class="flex-1"-->
<!--              type="text"-->
<!--              -->
<!--              labelPlacement={fieldLabelPlacement}-->
<!--              label="File"-->
<!--            >-->
<!--              <input class="px-2" type="file" id="path" required on:change={importFromCSV}>-->
<!--            </Field>-->

<!--          </div>-->

<!--        </div>-->
<!--      {/if}-->

<!--      {#if showExport}-->

<!--        <div class="section-label">Export</div>-->
<!--        <div class="fieldset mb-2">-->
<!--          -->
<!--          <div class="field-flex-group">-->

<!--            <TextField-->
<!--              class="flex-1"-->
<!--              label="File Name"-->
<!--              classes={{ label: 'field-label' }}-->
<!--              labelPlacement={labelPlacement}-->
<!--              bind:value={exportFileName}-->
<!--            >-->
<!--              <span slot="append">-->
<!--                <Button icon={faFileArrowDown} class="btn-standard" on:click={() => exportToCSV()}>Export</Button>-->
<!--              </span>-->
<!--            </TextField>-->
<!--          </div>-->

<!--        </div>-->
<!--      {/if}-->
<!--    </div>-->

<!--  </Dialog>-->

<!--</div>-->
