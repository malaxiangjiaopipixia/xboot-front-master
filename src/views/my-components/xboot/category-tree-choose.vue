<template>
  <div>
    <div style="display:flex;">
      <Input
        v-model="categoryTitle"
        readonly
        style="margin-right:10px;"
        :placeholder="placeholder"
        :clearable="clearable"
        @on-clear="clearSelect"
      />
      <Poptip transfer trigger="click" placement="right" title="选择分类" width="250">
        <Button icon="md-list">选择分类</Button>
        <div slot="content">
          <Input
            v-model="searchKey"
            suffix="ios-search"
            @on-change="searchCat"
            placeholder="输入分类名搜索"
            clearable
          />
          <div class="dep-tree-bar">
            <Tree
              :data="dataCat"
              :load-data="loadData"
              @on-select-change="selectTree"
              :multiple="multiple"
            ></Tree>
            <Spin size="large" fix v-if="catLoading"></Spin>
          </div>
        </div>
      </Poptip>
    </div>
  </div>
</template>

<script>
import { initCategory, loadCategory, searchCategory } from "@/api/activiti";
export default {
  name: "categoryTreeChoose",
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: "点击选择分类"
    }
  },
  data() {
    return {
      catLoading: false,
      categoryTitle: "",
      searchKey: "",
      dataCat: [],
      selectCat: [],
      categoryId: []
    };
  },
  methods: {
    initCategoryData() {
      initCategory().then(res => {
        if (res.success) {
          res.result.forEach(function(e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status == -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          this.dataCat = res.result;
        }
      });
    },
    loadData(item, callback) {
      loadCategory(item.id).then(res => {
        if (res.success) {
          res.result.forEach(function(e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status == -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          callback(res.result);
        }
      });
    },
    searchCat() {
      // 搜索分类
      if (this.searchKey) {
        this.catLoading = true;
        searchCategory({ title: this.searchKey }).then(res => {
          this.catLoading = false;
          if (res.success) {
            res.result.forEach(function(e) {
              if (e.status == -1) {
                e.title = "[已禁用] " + e.title;
                e.disabled = true;
              }
            });
            this.dataCat = res.result;
          }
        });
      } else {
        this.initCategoryData();
      }
    },
    selectTree(v) {
      let ids = [],
        title = "";
      v.forEach(e => {
        ids.push(e.id);
        if (title == "") {
          title = e.title;
        } else {
          title = title + "、" + e.title;
        }
      });
      this.categoryId = ids;
      this.categoryTitle = title;
      if (this.multiple) {
        this.$emit("on-change", this.categoryId, this.categoryTitle);
      } else {
        this.$emit("on-change", this.categoryId[0], this.categoryTitle);
      }
    },
    clearSelect() {
      this.categoryId = [];
      this.categoryTitle = "";
      this.initCategoryData();
      if (this.multiple) {
        this.$emit("on-change", []);
      } else {
        this.$emit("on-change", "");
      }
      this.$emit("on-clear");
    },
    setData(ids, title) {
      this.categoryTitle = title;
      if (this.multiple) {
        this.categoryId = ids;
      } else {
        this.categoryId = [];
        this.categoryId.push(ids);
      }
      this.$emit("on-change", this.categoryId, this.categoryTitle);
    }
  },
  created() {
    this.initCategoryData();
  }
};
</script>

<style lang="less">
.dep-tree-bar {
  position: relative;
  min-height: 80px;
  max-height: 500px;
  overflow: auto;
  margin-top: 5px;
}

.dep-tree-bar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.dep-tree-bar::-webkit-scrollbar-thumb {
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 2px #d1d1d1;
  background: #e4e4e4;
}
</style>

