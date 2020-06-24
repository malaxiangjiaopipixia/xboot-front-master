// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest,postFileRequest, deleteRequest } from '@/libs/axios';


//获取所有待办记录
export const getTodoTaskListData = (params) => {
    return getRequest('/act-task/todo', params)
}
//获取所有已办记录
export const getDoneTaskListData = (params) => {
    return getRequest('/act-task/done', params)
}
//获取某流程实例历史环节
export const getHisTaskListData = (id,params) => {
    return getRequest(`/act-task/getHisByProcInstId/${id}`, params)
}


//获取所有申请记录
export const getApplyListData = (params) => {
    return getRequest('/act-process/getInstances', params)
}

// 批量删除流程
export const deleteProcInst = (ids,params) => {
    return deleteRequest(`/act-process/delInstByIds/${ids}`, params)
}






// 获取流程列表
export const getProcListData = (params) => {
    return getRequest('/act-process/getByCondition', params)
}
// 部署新流程
export const deployProc = (params) => {
    return postFileRequest('/act-process/deploy', params)
}
// 挂起流程
export const suspendProc = (params) => {
    return postRequest('/act-process/updateState', params)
}
// 批量删除流程
export const deleteProc = (ids,params) => {
    return deleteRequest(`/act-process/delByIds/${ids}`, params)
}
// 转为模型
export const convertModel = (id,params) => {
    return getRequest(`/act-process/convert/${id}`, params)
}



// 获取模型列表数据
export const getModelListData = (params) => {
    return getRequest('/act-model/getByCondition', params)
}
// 添加模型
export const addModel = (params) => {
    return postRequest('/act-model/add', params)
}
// 编辑模型
export const editModel = (params) => {
    return postRequest('/act-model/edit', params)
}
// 批量删除模型
export const deleteModel = (ids,params) => {
    return getRequest(`/act-model/delByIds/${ids}`, params)
}
// 部署模型
export const deployModel = (id,params) => {
    return getRequest(`/act-model/deploy/${id}`, params)
}






// 获取模型一级分类节点
export const initCategory = (params) => {
    return getRequest('/category/getByParentId/0', params)
}
// 加载模型分类子节点数据
export const loadCategory = (id, params) => {
    return getRequest(`/category/getByParentId/${id}`, params)
}
// 添加模型分类
export const addCategory = (params) => {
    return postRequest('/category/add', params)
}
// 编辑模型分类
export const editCategory = (params) => {
    return postRequest('/category/edit', params)
}
// 删除模型分类
export const deleteCategory = (ids, params) => {
    return deleteRequest(`/category/delByIds/${ids}`, params)
}
// 搜索分类
export const searchCategory = (params) => {
    return getRequest('/category/search', params)
}