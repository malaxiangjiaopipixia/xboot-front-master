<template>
  <div>
    <Cascader
      v-model="selectCat"
      :data="category"
      :load-data="loadData"
      @on-change="handleChangeCat"
      change-on-select
      filterable
      clearable
      placeholder="请选择或分类"
    ></Cascader>
  </div>
</template>

<script>
import {initCategory, loadCategory} from '@/api/activiti';
export default {
    name: "categoryChoose",
    props: {},
    data() {
        return {
            selectCat: [],
            category: []
        };
    },
    methods: {
        initCategoryData() {
            initCategory().then(res => { 
                if (res.success) {
                res.result.forEach(function(e) {
                    if (e.isParent) {
                        e.value = e.id;
                        e.label = e.title;
                        e.loading = false;
                        e.children = [];
                    } else {
                        e.value = e.id;
                        e.label = e.title;
                    }
                    if (e.status == -1) {
                        e.label = "[已禁用] " + e.label;
                        e.disabled = true;
                    }
                });
                this.category = res.result;
                }
            });
        },
        loadData(item, callback) {
            item.loading = true;
            loadCategory(item.value).then(res => {
                item.loading = false;
                if (res.success) {
                res.result.forEach(function(e) {
                    if (e.isParent) {
                        e.value = e.id;
                        e.label = e.title;
                        e.loading = false;
                        e.children = [];
                    } else {
                        e.value = e.id;
                        e.label = e.title;
                    }
                    if (e.status == -1) {
                    e.label = "[已禁用] " + e.label;
                    e.disabled = true;
                    }
                });
                item.children = res.result;
                callback();
                }
            });
        },
        handleChangeCat(value, selectedData) {
            this.$emit("on-change", selectedData[0].id, selectedData[0].title);
        },
        clearSelect() {
            this.selectCat = [];
        }
        
    },
    created() {
        this.initCategoryData();
    }
};
</script>