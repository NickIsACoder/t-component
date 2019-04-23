<template>
<div>
  <div>
    <h2 class="main-title">pc组件展示页面</h2>
  </div>
  <backtop></backtop>
  <!-- <div class="display-item">
    <h3 class="sub-title"># button / 按钮</h3>
    <div>
      <t-button size="small">small</t-button>
      <t-button>默认</t-button>
      <t-button size="large">large</t-button>
      <t-button size="large" :disable="true">disabled</t-button>
      <t-button type="primary">primary</t-button>
      <t-button type="warning">warning</t-button>
      <t-button type="danger">danger</t-button>
      <t-button type="success">success</t-button>
      <t-button type="info">info</t-button>
      <t-button type="text">text</t-button>

      <t-button type="primary" icon="icon-ios-arrow-back">primary</t-button>
      <t-button type="primary" icon="icon-ios-arrow-back" shape="ellipse">primary</t-button>
      <t-button type="primary"
                size="small"
                icon="icon-ios-arrow-back"
                shape="ellipse">primary</t-button>
      <t-button type="primary"
                size="large"
                icon="icon-ios-arrow-back"
                shape="ellipse">primary</t-button>
      <t-button icon="icon-ios-search"
                shape="circle"></t-button>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># badge / 角标</h3>
    <div>
      <Badge class="mg-left"><t-button>评论</t-button></Badge>
      <Badge class="mg-left" color="green"><t-button type="primary">评论</t-button></Badge>
      <Badge class="mg-left" type="text" content="99+"><span>全新发布</span></Badge>
      <Badge class="mg-left" type="text" color="orange" content="hot">其他颜色的</Badge>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># cascader / 级联选择器</h3>
    <div>
      <Cascader style="width: 300px;"
                v-model="cascader.casValue"
                :options="cascader.casOptions"></Cascader>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># checkbox & checkbox-group / 多选框 & 多选框组</h3>
    <div>
      <t-checkbox :value="selectAll"
                  @change="checkAllChange" :halfCheck="halfCheck">全选</t-checkbox>
      <t-checkbox-group v-model="checkboxValue" @change="checkChange">
        <t-checkbox :class="[ind ? 'mg-left' : '']" v-for="(ck, ind) in checkOptions"
                    :disable="ck === '3'"
                    :key="ind"
                    :value="ck"></t-checkbox>
      </t-checkbox-group>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># datepicker / 日期选择器</h3>
    <div>
        <datepicker v-model="date" type="date"></datepicker>
        <datepicker v-model="month" type="month"></datepicker>
        <datepicker v-model="year" type="year"></datepicker>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># input / 输入框</h3>
    <div>
      <t-input type="text" placeholder="请输入"  clearable size="large"></t-input>
      <t-input class="mg-left" type="text"
               :maxLength="5"
               :validate="/[-a-z]/"
               v-model="input"
               errorMessage="请输入小写字母"
               placeholder="请输入"
               :minLength='2'
               :autofocus=true></t-input>
      <t-input class="mg-left" type="number" placeholder="请输入" :max="4" size="small"></t-input>
      <br>
      <t-input class="mg-top" type="text" placeholder="请输入">
        <i class="iconfont icon-add" slot="leftIcon"></i>
      </t-input>
      <t-input class="mg-top mg-left" type="text" size="small" placeholder="请输入">
        <i class="iconfont icon-add" slot="rightIcon"></i>
      </t-input>
      <br>
      <t-input class="mg-top" type="text" placeholder="请输入">
        <i class="iconfont icon-add" slot="rightIcon"></i>
      </t-input>
      <t-input class="mg-top mg-left" type="text" size="large" placeholder="请输入">
        <i class="iconfont icon-add" slot="rightIcon"></i>
      </t-input>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># loading / 加载提示</h3>
    <div>
      <t-button @click="openLoading(2)">点击加载</t-button>
      <t-button class="mg-left" @click="openLoading(4)" type="success">点击加载</t-button>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># menu / 菜单</h3>
    <div>
      <div style="width: 600px;">
        <Menu>
          <menu-item menuName="菜单0"></menu-item>
          <SubMenu menuName="菜单1">
            <SubMenu menuName="副菜单1">
              <menu-item menuName="副菜单1-1"></menu-item>
              <menu-item menuName="副菜单1-2"></menu-item>
            </SubMenu>
            <menu-item menuName="副菜单2"></menu-item>
            <menu-item menuName="副菜单3"></menu-item>
          </SubMenu>
          <menu-item menuName="菜单2" :disable="true"></menu-item>
        </Menu>
      </div >
      <div class="mg-top">
        <Menu direction="vertical"
              :canCollapse="true" :collapse="false"
        bgColor="#333" textColor="#fff">
          <menu-item menuName="菜单0" :disable="true"><img src="../assets/logo.png" slot="icon"
                                                         width="18" height="18"></menu-item>
          <SubMenu icon="icon-account" menuName="菜单1">
            <SubMenu menuName="副菜单1">
              <SubMenu menuName="副菜单1-1" >
                <menu-item menuName="副菜单1-1-1"></menu-item>
                <menu-item menuName="副菜单1-1-2"></menu-item>
              </SubMenu>
              <menu-item menuName="副菜单1-2"></menu-item>
            </SubMenu>
            <menu-item menuName="副菜单2" ></menu-item>
            <menu-item menuName="副菜单3"></menu-item>
          </SubMenu>
          <menu-item menuName="菜单2" icon="icon-info-line"></menu-item>
          <menu-item menuName="菜单3" icon="icon-clock"></menu-item>
        </Menu>
      </div>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># messagebox / 对话框</h3>
    <div>
      <t-button @click="openMessageBox(2)">点击显示对话框</t-button>
      <t-button class="mg-left" @click="openMessageBox(4)" type="success">点击显示对话框</t-button>
      <t-button class="mg-left" @click="openMessageBox(3)" type="danger">点击显示对话框</t-button>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># modal / 模态框</h3>
    <div>
      <t-button @click="showModal = true">点击显示模态框</t-button>
      <t-modal v-model="showModal">
        <div slot="header">这个是一个自定义的模态框</div>
        <div slot="body">
          <table>
            <thead></thead>
            <tbody>
            <tr>
              <th>123</th>
              <th>456</th>
              <th>789</th>
            </tr>
            <tr>
              <td>asd</td>
              <td>qwe</td>
              <td>xzxc</td>
            </tr>
            </tbody>
          </table>
        </div>、
        <div slot="footer">
          <t-button type="primary" style="float: right;">确定</t-button>
          <t-button style="float: right;margin-right: 15px;">取消</t-button></div>
      </t-modal>

    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># notification / 通知提示</h3>
    <div>
      <t-button @click="mynotify(1)">点击显示通知</t-button>
      <t-button class="mg-left" @click="mynotify(2)" type="primary">点击显示通知</t-button>
      <t-button class="mg-left" @click="mynotify(3)" type="warnning">点击显示通知</t-button>
      <t-button class="mg-left" @click="mynotify(4)" type="text">点击显示通知</t-button>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># pagination / 分页导航</h3>
    <div>
      <Pagination :total="page.total"
                  :showTotal="true"
                  :showPageSize="true"
                  :currentPage.sync="page.currentPage"></Pagination>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># progress / 进度条</h3>
    <div>
      <t-progress :percent="progress.percent"></t-progress>
      <t-progress color="red" :percent="progress.percent"></t-progress>
      <t-progress color="green" :percent="progress.percent"></t-progress>
      <t-button @click="addProgress">增加进度</t-button>
      <t-progress type="circle" :percent="30" status="exception"></t-progress>
      <t-progress type="circle" :color="progress.progressColor"
                  :percent="progress.percent"></t-progress>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># radio / 单选框</h3>
    <div>
      <t-radio v-model="radioValue" value="2" ></t-radio>
      <t-radio class="mg-left" v-model="radioValue" value="3" :disable="true" ></t-radio>
      <t-radio class="mg-left" v-model="radioValue" value="1" ></t-radio>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># select / 选择框</h3>
    <div>
      <t-select style="width: 300px;"
                v-model="selectValue"
                :displayMethod="displayMethod"
                :options="option"></t-select>
      <t-select style="width: 300px;" class="mg-left"
                v-model="multiSelect"
                :options="option"
                multiple></t-select>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># steps / 步骤条</h3>
    <div>
      <div style="width: 800px;">
        <steps :active="stepCount" status="process" :useNumber="true">
          <step>
            <span slot="title">第一步</span>
            <p slot="description">首先要打开冰箱门</p>
          </step>
          <step :showNumber="false">
            <p slot="title" >第二步</p>
            <p slot="description">然后把大象放进冰箱</p>
          </step>
          <step>
            <p slot="title">第三步</p>
            <p slot="description">最后关上冰箱门</p>
          </step>
        </steps>
      </div>
      <t-button type="primary" @click="stepCount++">下一步</t-button>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># switch / 开关</h3>
    <div>
      <t-switch size="large" type="primary" :value="true"></t-switch>
      <t-switch class="mg-left" size="large" type="warning" :value="true"></t-switch>
      <t-switch class="mg-left" size="large" type="danger" :value="true"></t-switch>
      <t-switch class="mg-left" size="large" type="success" :value="true"></t-switch>
      <t-switch class="mg-left" size="large" type="info" :value="true"></t-switch>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># table / 表格</h3>
    <div>
      <Table :source="tableData"
             :hasSummary="true"
             :summaryKeys="['zip']"
             height="300px"
             width="800px"
      >
        <TableColumn type="selection" align="center" width="50px"></TableColumn>
        <TableColumn type="index" align="center" width="50px"></TableColumn>
        <TableColumn colKey="date" label="时间"  ></TableColumn>
        <TableColumn colKey="name" label="姓名"  ></TableColumn>
        <TableColumn colKey="zip" label="邮编"  :hasSorter="true" align="center">
        </TableColumn>
        <TableColumn colKey="address" label="地址" :nowarp="true"></TableColumn>
        <TableColumn label="省市" >
          <div  slot-scope="scope">{{scope.row.province + scope.row.city}}</div>
        </TableColumn>
      </Table>

    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># timepicker / 时间选择器</h3>
    <div>
      <Timepicker v-model="time" :isPeriod="false" />
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># tooltip / 气泡提示框</h3>
    <div>
      <t-button type="primary" @click="$tooltip($event, '这是一条提示信息')">点击显示信息</t-button>
      <t-input class="mg-left" type="text" @focus="$tooltip($event, '用户名为字母或数字')"
               placeholder="请输入用户名" icon="icon-account"></t-input>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># transfer / 穿梭框</h3>
    <div>
      <transfer :source="mockData"
                v-model="targetData"
      ></transfer>
    </div>
  </div> -->
  <div class="display-item">
    <h3 class="sub-title"># tree / 树选择器</h3>
    <div>
      <tree :data="treeData" :anyState="true" :loadData="loadData"></tree>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># upload / 上传</h3>
    <div>
      <t-upload action="https://jsonplaceholder.typicode.com/posts/" >
        <t-button slot="trigger">选择图片</t-button>
      </t-upload>
    </div>
  </div>
  <div class="display-item">
    <h3 class="sub-title"># backtop / 回到顶部</h3>
    <div>
      请查看页面右下角
    </div>
  </div>
</div>
</template>

<script>
import { Switch,
  CheckboxGroup,
  Progress,
  Cascader,
  Step,
  Steps,
  Badge,
  Menu,
  MenuItem,
  SubMenu,
  Table,
  TableColumn,
  Upload,
  Transfer,
  Backtop,
  Pagination,
  Tree,
  Datepicker,
  Timepicker,
} from 't-component';

export default {
  name: 'displayPage',
  components: {
    't-switch': Switch,
    't-checkbox-group': CheckboxGroup,
    't-progress': Progress,
    Cascader,
    Step,
    Steps,
    Badge,
    Menu,
    MenuItem,
    SubMenu,
    Table,
    TableColumn,
    't-upload': Upload,
    Transfer,
    Backtop,
    Pagination,
    Tree,
    Datepicker,
    Timepicker,
  },
  data() {
    return {
      cascader: {
        casValue: [
          {
            value: 'gd',
            label: '广东省',
          }, {
            value: 'gz',
            label: '广州市',
          }, {
            value: 'xy',
            label: '越秀区',
          },
        ],
        casOptions: [
          {
            value: 'gd',
            label: '广东省',
            children: [
              {
                value: 'gz',
                label: '广州市',
                children: [
                  {
                    value: 'th',
                    label: '天河区',
                  },
                  {
                    value: 'xy',
                    label: '越秀区',
                  },
                ],
              },
              {
                value: 'cz',
                label: '潮州市',
                loading: false,
              },
              {
                value: 'sz',
                label: '深圳市',
                loading: false,
              },
            ],
          },
          {
            value: 'fj',
            label: '福建省',
            children: [
              {
                value: 'fz',
                label: '福州市',
              },
              {
                value: 'xm',
                label: '厦门市',
              },
            ],
          },
        ],
      },
      checkOptions: ['选项1', '选项2', '选项3', '选项4'],
      checkboxValue: [],
      selectAll: false,
      halfCheck: false,
      date: '2018-11-1',
      month: '2018-12',
      year: '2019',
      input: '',
      showModal: false,
      page: {
        total: 50,
        currentPage: 1,
      },
      progress: {
        percent: 0,
        progressColor: {
          active: 'yellow',
          success: 'red',
        },
      },
      radioValue: '',
      selectValue: [{ value: 1, label: '123' }],
      multiSelect: [],
      option: [
        { value: 1, label: '123' },
        { value: 11, label: '1123' },
        { value: 21, label: '12123' },
        { value: 31, label: '21123' },
        { value: 41, label: '32123' },
        { value: 331, label: '221123' },
        { value: 431, label: '121123' },
        { value: 531, label: '321123' },
      ],
      stepCount: 0,
      time: '',
      mockData: [
        { value: 1, label: '语文1', name: '张三', disabled: true },
        { value: 2, label: '语文2', name: '张三' },
        { value: 3, label: '语文3', name: '张三' },
        { value: 4, label: '语文4', name: '张三' },
        { value: 5, label: '语文5', name: '张三' },
      ],
      targetData: [1, 2],
      treeData: [
        {
          value: '000',
          label: '系统管理',
          children: [
            { value: '0001', label: '资源管理' },
            { value: '0002', label: '角色管理' },
            { value: '0003', label: '用户管理' },
            {
              value: '0004',
              label: '权限管理',
              children: [
                {
                  value: '00041',
                  label: '用户管理1',
                  children: [
                    { value: '000411', label: '用户管理21' },
                    { value: '000412', label: '用户管理22' },
                  ],
                },
                { value: '00042', label: '用户管理2' },
              ],
            },
            { value: '0005', label: '区域管理' },
          ],
        },
        {
          value: '001',
          label: '医院管理',
          children: [
            { value: '0011', label: '医生管理', loading: false },
            { value: '0012', label: '科室管理' },
            { value: '0013', label: '排班管理' },
          ],
        },
      ],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200332,
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200335,
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip: 200339,
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip: 200338,
        }],
    };
  },
  methods: {
    loadData(item, callback) {
      const data = item;
      data.loading = true;
      setTimeout(() => {
        data.children = [
          {
            value: 'asdad',
            label: '阿斯顿',
            disabled: true,
          },
          {
            value: 'asdad',
            label: '阿斯顿',
          },
          {
            value: 'asdad',
            label: '阿斯顿',
          },
        ];
        data.loading = false;
        callback(data.children);
      }, 1000);
    },
    checkChange(value) {
      if (value.length === this.checkOptions.length) {
        this.halfCheck = false;
        this.selectAll = true;
      } else if (value.length > 0) {
        this.halfCheck = true;
        this.selectAll = false;
      } else {
        this.halfCheck = false;
        this.selectAll = false;
      }
    },
    checkAllChange() {
      if (this.halfCheck) {
        this.selectAll = false;
      } else {
        this.selectAll = !this.selectAll;
      }
      this.halfCheck = false;
      this.checkboxValue = this.selectAll ? this.checkOptions : [];
    },
    openLoading(step) {
      if (step === 1) {
        this.$loading.config({ icon: 'circle3', duration: 5 }).open();
      } else if (step === 2) {
        this.$loading.config({ icon: 'walkSquare', duration: 5 }).open();
      } else if (step === 3) {
        this.$loading.config({ icon: 'ballring', duration: 5 }).open();
      } else if (step === 4) {
        this.$loading.config({ icon: 'stripper', duration: 5 }).open();
      }
    },
    openMessageBox(step) {
      if (step === 2) {
        this.$messagebox({ title: '输入一个你喜欢的数字', buttonText: ['错的', '对的'], type: 'prompt', inputValidate: /[0-9]/, errorMessage: '请输入数字' })
          .then((res) => {
            this.$notify.info(`您输入的数字是${res.value}`);
          })
          .catch((action) => {
            if (typeof action === 'string') {
              this.$notify.info('您点击了取消');
            } else {
              this.$notify.info('报错啦');
            }
          });
      } else if (step === 4) {
        this.$messagebox.confirm('添加成功', '感谢你的合作', 'icon-add', ['取消', '确定'])
          .then(() => {
            this.$notify.info('你点击了确定');
          })
          .catch((action) => {
            if (typeof action === 'string') {
              this.$notify.info('您点击了取消');
            } else {
              this.$notify.info('报错啦');
            }
          });
      } else {
        this.$messagebox.alert('请不要点击！');
      }
    },
    mynotify(step) {
      if (step === 1) {
        this.$notify.config({
          title: '通知示例',
          text: '这是一条一般的通知',
          theme: 'info',
        }).open();
      } else if (step === 2) {
        this.$notify.config({
          title: '错误示例',
          text: '这是一条错误通知',
          position: 'topCenter',
          theme: 'error',
        }).open();
      } else if (step === 3) {
        this.$notify.config({
          title: '警告通知',
          text: '这是一条警告通知',
          position: 'bottomLeft',
          theme: 'warning',
        }).open();
      } else {
        this.$notify.config({
          customTpl: '<div>' +
            '<h4>自定义模板的通知格式</h4>' +
            '<p>这里可以填写内容</p>' +
            '</div>',
          position: 'bottomCenter',
        }).open();
      }
    },
    addProgress() {
      this.progress.percent += 10;
      if (this.progress.percent > 100) {
        this.progress.percent = 100;
      }
    },
    displayMethod(value) {
      return value ? value.value : '请选择';
    },
  },
};
</script>

<style scoped>
.main-title{
  text-align: center;
  margin:10px;
}
.display-item{
  margin: 50px;
}
.sub-title{
  margin-bottom: 30px;
}
.mg-left{
  margin-left: 20px;
}
.mg-top{
  margin-top: 20px;
}
</style>
