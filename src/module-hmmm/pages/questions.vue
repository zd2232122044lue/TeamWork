<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-row>
          <el-col>
            <el-button type="primary" size="mini" @click="$router.push('/questions/new')">新增试题</el-button>
            <el-button type="danger" size="mini">批量导入</el-button>
          </el-col>
        </el-row>
        <!-- :gutter 栅格间隔 给各个col设置间隙,单位是像素 -->
        <el-row :gutter="20">
          <!-- :span 限定每列的宽度,是一个"权"的单位,总宽度是24 -->
          <el-col :span="6">
            学科
            <el-select v-model="searchForm.subjectID" class="wh">
              <el-option
                v-for="item in subjectIDList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            难&nbsp;&nbsp;&nbsp;&nbsp;度
            <el-select v-model="searchForm.difficulty" class="wh">
              <el-option
                v-for="item in difficultyList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            试题类型
            <el-select v-model="searchForm.questionType" class="wh">
              <el-option
                v-for="item in questionTypeList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签
            <el-select v-model="searchForm.tags" class="wh">
              <el-option
                v-for="item in tagsList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- :span 限定每列的宽度,是一个"权"的单位,总宽度是24 -->
          <el-col :span="6">
            城市
            <!-- 第一种方法 -->
            <!-- <el-select
              v-model="searchForm.province"
              placeholder="选城市"
              style="width: 90px;"
              @change="getCitys(searchForm.province)"
            >-->
            <!-- 给城市设置onchange事件,触发获得对应的区县 
            searchForm.province 代表变化后的城市数据-->
            <!-- 第二种方法 -->
            <el-select
              v-model="searchForm.province"
              placeholder="选城市"
              style="width: 90px;"
              @change="searchForm.city=''"
            >
              <!-- v-for="item in data成员/methods成员"
              methods成员在模板中可以使用和遍历,要设置()-->
              <el-option v-for="(item,k) in provinces()" :key="k" :value="item" :label="item"></el-option>
            </el-select>
            <el-select v-model="searchForm.city" placeholder="选区县" style="width: 90px;">
              <!-- 第一种方法 -->
              <!-- <el-option v-for="item in cityList" :key="item" :value="item" :label="item"></el-option> -->
              <!-- 第二种方法 -->
              <el-option
                v-for="item in citys(searchForm.province)"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            关键字
            <el-input type="text" v-model="searchForm.keyword" placeholder="请输入" class="wh"></el-input>
          </el-col>
          <el-col :span="6">
            题目备注
            <el-input type="text" v-model="searchForm.remarks" placeholder="请输入" class="wh"></el-input>
          </el-col>
          <el-col :span="6">
            企业简称
            <el-input type="text" v-model="searchForm.shortName" placeholder="请输入" class="wh"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- :span 限定每列的宽度,是一个"权"的单位,总宽度是24 -->
          <el-col :span="6">
            方向
            <el-select v-model="searchForm.direction" placeholder="请选择" class="wh">
              <el-option v-for="(item,k) in directionList" :key="k" :value="item" :label="item"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            录入人
            <el-select v-model="searchForm.creatorID" placeholder="请选择" class="wh">
              <el-option
                v-for="item in creatorIDList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            二级目录
            <el-select v-model="searchForm.catalogID" placeholder="请选择" class="wh">
              <el-option
                v-for="item in catalogIDList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button size="mini">清除</el-button>
            <el-button type="primary" size="mini">搜索</el-button>
          </el-col>
        </el-row>
        <el-table :data="questionList" style="width:100%">
          <el-table-column label="序号" type="index" width="60"></el-table-column>
          <el-table-column label="试题编号" prop="number"></el-table-column>
          <el-table-column label="学科" prop="subject"></el-table-column>
          <!-- :formatter="questionTypeFMT"：对列内容进行二次更新，注意不要设置()括号 -->
          <!-- 有了此属性，当前列的内容就会受到questionTypeFMT返回值决定了 -->
          <el-table-column :formatter="questionTypeFMT" label="题型" prop="questionType"></el-table-column>
          <el-table-column label="题干" prop="question"></el-table-column>
          <el-table-column label="录入时间" prop="addDate" width="170">
            <!-- 通过插值表达式表现时间信息,并应用过滤器做格式转换
            获得当前列的信息: 作用域插槽应用,具体还需要通过row衔接各个字段内容-->
            <span slot-scope="stData">{{stData.row.addDate | parseTimeByString}}</span>
            <!-- 
              span会填充给el-table-column子组件的slot插槽中去
              stData.row是要获取el-table-column的作用域插槽数据
              stData.row.addDate是el-table-column的作用域插槽给我们提供的数据,在这接收使用
              el-table-column本身就是子组件,这个子组件内部有作用域插槽
              stData接收的是作用域插槽提供的值,作用域插槽通过row的名称把值提供出来的 
            -->
          </el-table-column>
          <el-table-column :formatter="difficultyFMT" label="难度" prop="difficulty"></el-table-column>
          <el-table-column label="录入人" prop="creator"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="stData">
              <a href="#">预览</a>
              <a href="#">修改</a>
              <!-- 因为a标签有自己的默认行为,只要单击它,href和click都执行了,而只需要执行click
                    使用事件修饰符
                      @click.prevent: 阻止标签的默认行为,只执行事件
                        prevent: 阻止浏览器默认动作(a和form)
              @click.native: 使得事件直接作用到组件的html标签上-->
              <!-- stData.row代表当前整条试题记录对象,把删除的整个记录对象当做参数传递使用 -->
              <a href="#" @click.prevent="del(stData.row)">删除</a>
              <a href="#">加入精选</a>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
// 关于学科要使用的列表数据,需要通过api接口获得
// 相关的axios已经被封装(utils/request.js)
// 获取学科信息的function已经被封装,在src/api/**里边

// 导入获得学科简单列表的api方法 动态
import { simple } from '@/api/hmmm/subjects.js'
// 导入获得难度,题型,方向的常量  静态的,不需要axios获取
// --difficulty as difficultyList 起别名
// ==应用的是： es6模块化按需导入重命名 + data对象简易成员赋值
import {
  difficulty as difficultyList,
  questionType as questionTypeList,
  direction as directionList
} from '@/api/hmmm/constants.js'

// 导入获得标签列表的api方法
import { simple as tagsSimple } from '@/api/hmmm/tags.js'
// 导入获得录入人列表的api方法
import { simple as usersSimple } from '@/api/base/users.js'
// 导入获得二级目录列表的api方法
import { simple as directorysSimple } from '@/api/hmmm/directorys.js'
// 导入获得城市,区县列表的api方法
import { provinces, citys } from '@/api/hmmm/citys.js'
// 导入获得 基础题库列表,试题数据删除 的api方法
import { list, remove } from '@/api/hmmm/questions.js'

export default {
  name: 'QuestionsList',
  data() {
    return {
      // 这些是用做页面展示的,不用往服务器提交,所以不写到searchFrom中
      subjectIDList: [], // 学科简单列表收集
      difficultyList, // 难度列表
      // difficultyList: difficulty,
      // 导入的东西要和组件实例的东西联系起来才可以用,这样写是OK的,但是代码显得不优雅
      // 所以给导入的东西起个别名,例如difficultyList,这样就可以写成difficultyList: difficultyList,
      // 对象成员简易赋值,直接写成 difficultyList 即可
      questionTypeList, // 试题类型列表
      tagsList: [], // 标签列表
      creatorIDList: [], // 录入人列表
      catalogIDList: [], // 二级目录列表
      directionList, // 方向
      cityList: [], // 区县
      questionList: [], // 基础题库列表
      searchForm: {
        // 搜索题库的表单数据对象,是要往服务器端提交的
        subjectID: '', // 学科id
        difficulty: '', // 难度
        questionType: '', // 试题类型
        tags: '', // 标签
        province: '', // 城市
        city: '', // 区县
        keyword: '', // 关键字
        remarks: '', // 题目备注
        shortName: '', // 企业简称
        direction: '', // 方向
        creatorID: '', // 录入人
        catalogID: '' // 目录
      }
    }
  },
  // 对searchForm表单对象进行深度监听,发现搜索表单数据有变化,就重新获得试题列表信息
  watch: {
    searchForm: {
      handler: function(newV, oldV) {
        this.getQuestionList()
      },
      deep: true
    }
  },
  created() {
    this.getSubjectIDList()
    this.getTagsList()
    this.getCreatorIDList()
    this.getCatalogIDList()
    this.getQuestionList()
  },
  methods: {
    // 获得学科列表
    async getSubjectIDList() {
      // 调用simple的接口方法获得学科列表信息
      let result = await simple()
      // console.log(result)
      // result是一个promise对象,想要获取数据需要调用.then()和.catch()比较麻烦
      // 所以用 async和await 直接获取数据

      // 把获得到的学科信息赋予给 subjectIDList 成员
      // subjectIDList已经有数据了,在模板中做遍历即可展示数据
      this.subjectIDList = result.data
    },
    // 获得标签列表
    async getTagsList() {
      let result = await tagsSimple()
      this.tagsList = result.data
    },
    // 获得录入人列表
    async getCreatorIDList() {
      let result = await usersSimple()
      this.creatorIDList = result.data
    },
    // 获得二级目录列表
    async getCatalogIDList() {
      let result = await directorysSimple()
      this.catalogIDList = result.data
    },

    // 获得省份
    // --组件接收provinces(函数)模块,通过methods
    // --组件内部是通过methods定义成员方法(函数)
    // provinces: provinces
    provinces,

    // 获得区县信息
    // // ---第一种方法
    // getCitys(pname) {
    //   // pname代表当前选中城市
    //   this.searchForm.city = '' // 清除之前选好的区县
    //   // 调用citys()获取对应的城市信息并赋予给cityList
    //   this.cityList = citys(pname)
    // }
    // // ---第二种方法
    citys,

    // 获得基础题库列表信息
    async getQuestionList() {
      // 设置searchForm参数，作为获得试题列表信息的筛选条件
      let result = await list(this.searchForm)
      this.questionList = result.data.items
    },

    // 对 题型 列信息进行二次更新操作
    // row:代表当前每个数据项纪录信息的,是一个对象  {id:xxx,number:xx,difficulty:xx,addDate:xx……}
    // --可以通过这个row访问到当前任何数据项目纪录信息,调用形式: row.id row.number
    // column:可以获取纪录的列的信息,一般不使用
    // cellValue:当前行当前列的数据项目纪录信息,类似row.questionType的内容
    // index:代表各个纪录的序号信息,1/2/3/4/5……，一般不使用
    questionTypeFMT(row, column, cellValue, index) {
      // 把cellValue对应的"汉字"内容返回显示
      return this.questionTypeList[cellValue - 1].label
    },

    // 对 难度 列信息进行二次更新操作
    difficultyFMT(row, column, cellValue, index) {
      // 把cellValue对应的"汉字"内容返回显示
      return this.difficultyList[cellValue - 1].label
    },

    // 删除试题数据
    del(question) {
      // question:被删除试题的整条记录对象
      this.$confirm('确认要删除么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // async和await保障数据删除完毕(remove执行完毕),再做更新(调用方法)
          let result = await remove(question)
          this.$message.success('删除成功')
          // 刷新数据
          this.getQuestionList()
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.wh {
  width: 175px;
}
.el-row {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 30px;
}
</style>
