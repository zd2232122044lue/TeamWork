<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-form ref="addFormRef" :model="addForm" label-width="120px">
          <el-form-item label="学科: ">
            <el-select v-model="addForm.subjectID">
              <el-option
                v-for="item in subjectIDList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录: ">
            <el-select v-model="addForm.catalogID">
              <el-option
                v-for="item in catalogIDList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业: ">
            <el-select v-model="addForm.enterpriseID">
              <el-option
                v-for="item in enterpriseIDList"
                :key="item.id"
                :value="item.id"
                :label="item.shortName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市: ">
            <el-select v-model="addForm.province" @change="addForm.city=''">
              <el-option v-for="(item,k) in provinces()" :key="k" :value="item" :label="item"></el-option>
            </el-select>
            <el-select v-model="addForm.city">
              <el-option
                v-for="(item,k) in citys(addForm.province)"
                :key="k"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="方向:">
            <el-select v-model="addForm.direction">
                <el-option 
                  v-for="item in directionList" 
                  :key="item" 
                  :value="item" 
                  :label="item"
               ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题型:">
            <!-- 
            1.el-radio-group对多个el-radio进行集中管理,利用v-model可以统一设置或接受选中的项目
            2.el-radio真实起作用的value数据信息要通过label属性定义
            3.服务器端要求题型的信息为String,所以设置item.value+''-->
            <el-radio-group v-model="addForm.questionType">
              <el-radio
                v-for="item in questionTypeList"
                :key="item.value"
                :label="item.value+''"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度:">
            <el-radio-group v-model="addForm.difficulty">
              <el-radio
                v-for="item in difficultyList"
                :key="item.value"
                :label=" item.value+'' "
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="题干：">
            <el-input type="textarea" v-model="addForm.question"></el-input>
          </el-form-item>
          <el-form-item label="选项：">
            <el-radio v-model="singleSelect" :label="0">
              A:
              <el-input type="text" v-model="addForm.options[0]['title']"></el-input>
              <!-- 使得各个单选按钮的el-input输入框直接与title成员联系 -->
            </el-radio>
            <br />
            <el-radio v-model="singleSelect" :label="1">
              B:
              <el-input type="text" v-model="addForm.options[1]['title']"></el-input>
            </el-radio>
            <br />
            <el-radio v-model="singleSelect" :label="2">
              C:
              <el-input type="text" v-model="addForm.options[2]['title']"></el-input>
            </el-radio>
            <br />
            <el-radio v-model="singleSelect" :label="3">
              D:
              <el-input type="text" v-model="addForm.options[3]['title']"></el-input>
            </el-radio>
          </el-form-item>
          <el-form-item label="答案：">
            <el-input type="textarea" v-model="addForm.answer"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="addForm.remarks"></el-input>
          </el-form-item>
          <el-form-item label="标签：">
            <el-input type="text" v-model="addForm.tags"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addQuestion()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { simple as subjectsSimple } from '@/api/hmmm/subjects' // 学科
import { simple as directorysSimple } from '@/api/hmmm/directorys' // 二级目录
import { provinces, citys } from '@/api/hmmm/citys' // 城市和区县
import {
  direction as directionList,
  questionType as questionTypeList,
  difficulty as difficultyList
} from '@/api/hmmm/constants' // 方向,题型,难度(常量)
import { list as companysList } from '@/api/hmmm/companys' // 企业
import { add } from '@/api/hmmm/questions' // 试题添加

export default {
  name: 'QuestionsNew',
  data() {
    return {
      subjectIDList: [], // 学科
      catalogIDList: [], // 二级目录
      directionList, // 方向(简易成员赋值)
      enterpriseIDList: [], // 企业
      questionTypeList, // 题型(简易成员赋值)
      difficultyList, // 难度(简易成员赋值)
      singleSelect: '', // 感知被选中的项目的值,是中间成员,需要通过watch转变为isRight
      addForm: {
        // 添加试题 表单数据对象
        subjectID: '', // 学科
        catalogID: '', // 二级目录
        enterpriseID: '', // 企业
        city: '', // 区县
        province: '', // 城市
        direction: '', // 方向
        questionType: '1', // 默认"单选"题型项目被选中(要求是字符串)
        difficulty: '1', // 默认难度第一个项目被选中(要求是字符串)
        question: '', // 题干
        answer: '', // 答案
        remarks: '', // 备注
        tags: '', // 标签
        videoURL: 'http://www.xxx.com', // 解析视频, 必填项目,信息固定即可
        options: [
          // 选项表单数据对象部分
          // code: "编号ABCD"
          // title: '当前项目文字答案'
          // img: '当前项目图片答案'
          // isRight: boolean表明当前项目是否是答案
          { code: 'A', title: '', img: '', isRight: false },
          { code: 'B', title: '', img: '', isRight: false },
          { code: 'C', title: '', img: '', isRight: false },
          { code: 'D', title: '', img: '', isRight: false }
        ]
      }
    }
  },
  created() {
    this.getSubjectIDList() // 学科
    this.getCatalogIDList() // 二级目录
    this.getEnterpriseIDList() // 企业
  },
  watch: {
    singleSelect(newV, oldV) {
      // 设置当前单选按钮选中情况,即isRight的值发生变化
      // 1.先让全部项目都处于false不选中状态
      for (var i = 0; i < 4; i++) {
        this.addForm.options[i].isRight = false
      }
      // 2.设置当前选中项目的isRight为true
      this.addForm.options[newV].isRight = true
    }
  },
  methods: {
    provinces, // 获得城市的方法(简易成员赋值)
    citys, // 获得地区的方法(简易成员赋值)
    // 学科 列表信息
    async getSubjectIDList() {
      var result = await subjectsSimple()
      this.subjectIDList = result.data
    },
    // 目录 列表信息
    async getCatalogIDList() {
      var result = await directorysSimple()
      this.catalogIDList = result.data
    },
    // 企业 列表信息
    async getEnterpriseIDList() {
      var result = await companysList()
      this.enterpriseIDList = result.data.items
    },
    // 添加试题
    async addQuestion() {
      // await 1.可以获得具体返回结果
      //       2.等待添加完成再向后执行,可以保证添加的数据会在列表中展示
      await add(this.addForm)
      this.$message.success('添加试题成功!!')
      this.$router.push('/questions/list')
    }
  }
}
</script>

<style scoped>
</style>
