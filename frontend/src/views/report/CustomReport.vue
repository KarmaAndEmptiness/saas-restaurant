<template>
  <div class="drag-container">
    <div class="fields-panel">
      <div
        v-for="field in availableFields"
        :key="field.id"
        class="draggable-field"
        draggable="true"
        @dragstart="dragStart(field)"
      >
        {{ field.label }}
      </div>
    </div>

    <div class="drop-area" @dragover.prevent @drop="handleDrop">
      <el-table :data="tableData">
        <el-table-column
          v-for="col in selectedFields"
          :key="col.id"
          :prop="col.prop"
          :label="col.label"
        />
      </el-table>
    </div>

    <div class="toolbar">
      <el-button @click="saveTemplate">保存模板</el-button>
      <el-button @click="loadTemplate">加载模板</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Field {
  id: string
  label: string
  prop: string
}

const availableFields = ref<Field[]>([...]) // 可用字段列表
const selectedFields = ref<Field[]>([]) // 已选字段
let draggedField: Field | null = null

const dragStart = (field: Field) => {
  draggedField = field
}

const handleDrop = () => {
  if (draggedField && !selectedFields.value.find(f => f.id === draggedField!.id)) {
    selectedFields.value.push(draggedField)
  }
}

const saveTemplate = () => {
  // 保存当前配置到后端
}

const loadTemplate = () => {
  // 从后端加载模板配置
}
</script>
