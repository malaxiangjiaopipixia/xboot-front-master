<style lang="less">
@import "../../../styles/table-common.less";
@import "./applyManage.less";
</style>
<template>
  <div class="search">
    <Card>
      <Row>
        <Form v-show="openSearch" ref="searchForm" :model="searchForm" inline :label-width="70">
          <Form-item label="标题" prop="title">
            <Input
              type="text"
              v-model="searchForm.title"
              clearable
              placeholder="标题"
              style="width: 200px"
            />
          </Form-item>
          <Form-item label="状态" prop="status">
            <Input
              type="text"
              v-model="searchForm.status"
              clearable
              placeholder="状态"
              style="width: 200px"
            />
          </Form-item>
          <Form-item label="分类" prop="category">
            <category-choose @on-change="handleSelectCat(arguments)" style="width: 200px" ref="cat"></category-choose>
          </Form-item>
          <Form-item style="margin-left:-35px;" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleReset">重置</Button>
          </Form-item>
        </Form>
      </Row>
      <Row class="operation">
        <Button @click="add" type="primary" icon="md-add">新增申请</Button>
        <Button @click="delAll" icon="md-trash">批量删除</Button>
        <Button @click="handleSearch" icon="md-refresh">刷新</Button>
        <Button type="dashed" @click="openSearch=!openSearch">{{openSearch ? "关闭搜索" : "开启搜索"}}</Button>
        <Button type="dashed" @click="openTip=!openTip">{{openTip ? "关闭提示" : "开启提示"}}</Button>
      </Row>
      <Row v-show="openTip">
        <Alert show-icon>
          已选择
          <span class="select-count">{{selectCount}}</span> 项
          <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
      </Row>
      <Row>
        <Table
          :loading="loading"
          border
          :columns="columns"
          :data="data"
          sortable="custom"
          @on-sort-change="changeSort"
          @on-selection-change="showSelect"
          ref="table"
        ></Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          :page-size="searchForm.pageSize"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          size="small"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </Row>
    </Card>

    <Drawer title="选择流程" closable v-model="procModalVisible" width="800" draggable>
      <div>
        <Form ref="searchProcForm" :model="searchProcForm" inline :label-width="55">
          <Form-item label="流程名" prop="name">
            <Input
              type="text"
              v-model="searchProcForm.name"
              clearable
              placeholder="名称"
              style="width: 200px"
            />
          </Form-item>
          <Form-item label="分类" prop="category">
            <category-choose @on-change="handleSelectDep(arguments)" style="width: 200px" ref="dep"></category-choose>
          </Form-item>
          <Form-item style="margin-left:-35px;" class="br">
            <Button @click="handleSearchProc" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleResetProc">重置</Button>
          </Form-item>
        </Form>
      </div>
      <Table
        :loading="procLoading"
        border
        :columns="procColumns"
        :data="procData"
        ref="procTable"
      ></Table>
      <div class="my-drawer-footer">
      </div>
    </Drawer>
  </div>
</template>

<script>
import {
  getApplyListData,
  getProcListData,
  deleteProcInst
} from "@/api/activiti";
import categoryChoose from "../../my-components/xboot/category-choose";
export default {
  name: "apply-manage",
  components: {
    categoryChoose
  },
  data() {
    return {
      loading: true,
      procLoading: false,
      openSearch: true,
      openTip: true,
      selectCount: 0,
      selectList: [],
      searchKey: "",
      searchForm: {
        title: "",
        status: "",
        categoryId: "",
        category: "",
        pageNumber: 1,
        pageSize: 10,
        sort: "createTime",
        order: "desc",
        startDate: "",
        endDate: ""
      },
      searchProcForm: {
        name: "",
        category: "",
        pageNumber: 1,
        pageSize: 1000
      },
      selectDate: null,
      procModalVisible: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "申请时间",
          key: "applyTime",
          sortable: true,
          sortType: "desc",
          width: 180,
          fixed: "left"
        },
        {
          title: "标题",
          key: "title",
          minWidth: 145,
          sortable: true,
          fixed: "left"
        },
        {
          title: "所属流程",
          key: "procDefName",
          minWidth: 145,
          sortable: true
        },
        {
          title: "状态",
          key: "status",
          width: 125,
          sortable: true
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: true,
          sortType: "desc",
          width: 180
        },
        {
          title: "操作",
          key: "action",
          width: 205,
          align: "center",
          fixed: "right",
          render: (h,params)=>{
            return h('div',[
                h('Button',{
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.skip(params.row,"查看请假申请","view");
                    }
                  }
                },"查看")
            ]);
          }
        }
      ],
      procColumns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "流程名称",
          key: "procDefName",
          width: 200,
          sortable: true
        },
        {
          title: "所属分类",
          key: "category",
          width: 200
        },
        {
          title: "版本",
          key: "version"
        },
        {
          title: "操作",
          key: "action",
          width: 140,
          align: "center",
          fixed: "right",
          render: (h,params) =>{
            return h("div",[
              h("Button",{
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.skip(params.row,"新增请假申请","add");
                    }
                  }
              },"选择")
            ])
          }
        }
      ],
      data: [],
      procData: [],
      total: 0
    };
  },
  methods: {
    init() {
      this.getApplyList();
      this.getProcList();
    },
    handleSelectCat(v) {
      this.searchForm.categoryId = v[0];
      this.searchForm.category=v[1];
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getApplyList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getApplyList();
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    handleSearchProc() {
      this.searchProcForm.pageNumber = 1;
      this.searchProcForm.pageSize = 9;
      this.getProcList();
    },
    handleResetProc() {
      this.$refs.searchProcForm.resetFields();
      this.searchUserForm.pageNumber = 1;
      this.searchUserForm.pageSize = 9;
      this.$refs.dep.clearSelect();
      this.searchProcForm.category = "";
      // 重新加载数据
      this.getProcList();
    },
    getProcList() {
      this.procLoading = true;
      // 避免后端默认值
      getProcListData(this.searchProcForm).then(res => {
        this.procLoading = false;
        if (res.success) {
          this.procData = res.result.records;
        }
      });
    },
    getApplyList() {
      // 多条件搜索用户列表
      this.loading = true;
      // 避免后端默认值
      
      getApplyListData(this.searchForm).then(res => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getApplyList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.selectCat = [];
      this.$refs.cat.clearSelect();
      this.searchForm.categoryId = "";
      this.searchForm.category = "";

      // 重新加载数据
      this.getApplyList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order == "normal") {
        this.searchForm.order = "";
      }
      this.getApplyList();
    },
    add() {
      this.$refs.searchProcForm.resetFields();
      this.procModalVisible = true;
    },
    
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除流程 " + v.name + " ?",
        loading: true,
        onOk: () => {
          deleteProc(v.deploymentId).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("删除成功");
              this.getProcList();
            }
          });
        }
      });
    },
    showSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.procInstId + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          deleteProcInst(ids).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("删除成功");
              this.clearSelectAll();
              this.getApplyList();
            }
          });
        }
      });
    },
    skip(v,title,action){
      this.procModalVisible = false;
      // 记录返回路由
      let query = { v:v, title: title, action: action,backRoute: this.$route.name };
      this.$router.push({
        // 该路由已在/router/router.js中定义好
        name: v.procDefKey,
        query: query
      });
    }
  },
  watch: {
    // 监听路由变化通过id获取数据
    $route(to, from) {
      console.log("route2:",from.name+"==>"+to.name);
      if(to.name === 'apply-manage'){
        //刷新
        this.init();
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>
