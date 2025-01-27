<template>
  <div ref="mapContainer" style="height: 600px"></div>
  <el-dialog v-model="dialogVisible" title="结算详情">
    <!-- 结算详情内容 -->
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const mapContainer = ref<HTMLElement>()
const dialogVisible = ref(false)

// 初始化地图
onMounted(() => {
  // 使用AMap或类似地图库
  const map = new AMap.Map(mapContainer.value!, {
    zoom: 10,
    center: [116.397428, 39.90923]
  })

  // 添加门店标记
  addStoreMarkers(map)
})

const addStoreMarkers = (map: any) => {
  // 模拟门店数据
  const stores = [
    { name: '门店A', lnglat: [116.397428, 39.90923], data: {...} }
  ]

  stores.forEach(store => {
    const marker = new AMap.Marker({
      position: store.lnglat,
      content: '<div class="store-marker">...</div>'
    })

    marker.on('click', () => showStoreDetail(store))
    map.add(marker)
  })
}

const showStoreDetail = (store: any) => {
  dialogVisible.value = true
  // 加载详细数据
}
</script>
