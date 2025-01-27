<template>
  <div class="design-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="config-panel">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="满减活动" name="discount">
              <DiscountForm @change="updatePreview" />
            </el-tab-pane>
            <el-tab-pane label="积分活动" name="points">
              <PointsForm @change="updatePreview" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="preview-panel">
          <CampaignPreview :config="previewConfig" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DiscountForm from '@/components/DiscountForm.vue'
import PointsForm from '@/components/PointsForm.vue'
import CampaignPreview from '@/components/CampaignPreview.vue'

const activeTab = ref('discount')
const previewConfig = ref({})

const updatePreview = (config: any) => {
  previewConfig.value = { ...config }
}
</script>

<style>
.config-panel {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.preview-panel {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  min-height: 600px;
}
</style>
