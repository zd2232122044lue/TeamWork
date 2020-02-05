/*
 * @Author: taoshiwei
 * @Date: 2019-04-09 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:53:23
 *
 * 学科
 */

 // es6模块化按需导入 导入了createAPI这个方法,下边进行调用
 // @/utils/request 表示src/utils/request.js
import { createAPI } from '@/utils/request'

// 学科列表
// 下面的 都是es6模块化按需导出(用的时候需要按需导入)
export const list = data => createAPI('/subjects', 'get', data)

// 学科简单列表
// createAPI(地址,请求方式,传递的参数)  直接和api数据接口进行联系
export const simple = data => createAPI('/subjects/simple', 'get', data)

// 学科详情
export const detail = data => createAPI(`/subjects/${data.id}`, 'get', data)

// 学科添加
export const add = data => createAPI('/subjects', 'post', data)

// 学科修改
export const update = data => createAPI(`/subjects/${data.id}`, 'put', data)

// 学科删除
export const remove = data => createAPI(`/subjects/${data.id}`, 'delete', data)
