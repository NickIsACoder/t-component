<template>
    <div>
      testPage
      <div>
        <h4>按钮</h4>
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
      <div>
        <h4>switch</h4>
        <t-switch size="small" type="info"></t-switch>
        <t-switch v-model="switch1" @change="switch1Change">
          <span slot="openText">open</span>
          <span slot="closeText">close</span>
        </t-switch>
        <t-switch :disable="true" :value="true">
          <i slot="openText" class="icon icon-md-checkmark">
        </i>
        </t-switch>
        <t-switch size="large" type="primary"></t-switch>
        <t-switch size="large" type="warning"></t-switch>
        <t-switch size="large" type="danger"></t-switch>
        <t-switch size="large" type="success"></t-switch>
        <t-switch size="large" type="info"></t-switch>
      </div>
      <div>
        <h4>radio</h4>
        <t-radio v-model="radioValue" value="2" @change="radioChange"></t-radio>
        <t-radio v-model="radioValue" value="3" :disable="true" @change="radioChange"></t-radio>
        <t-radio v-model="radioValue" value="1" @change="radioChange"></t-radio>
      </div>
      <div>
        <h4>checkbox</h4>
        <t-checkbox v-model="selectAll"
                    @change="checkAllChange" :halfCheck="halfCheck">全选</t-checkbox>
        <t-checkbox-group v-model="checkboxValue" :max="3" @change="checkChange">
          <t-checkbox v-for="(ck, ind) in checkOptions"
                      :disable="ck === '3'"
                      :key="ind"
                      :value="ck"></t-checkbox>
        </t-checkbox-group>
      </div>
      <div>
        <h4>progress</h4>
        <t-progress :percent="3"></t-progress>
        <t-progress color="red" :percent="33"></t-progress>
        <t-progress :color="progressColor" ></t-progress>
        <t-button @click="add" icon="iconfont icon-add"></t-button>
        <t-progress type="circle" :percent="percent" status="exception"></t-progress>
        <t-progress type="circle" :color="progressColor" :percent="percent"></t-progress>

      </div>
      <div>
        <h4>输入框</h4>
        <t-input type="textarea"
                 :maxLength="4"
                 :value='123'
                 :validate="/[-a-z]/"/>
        <t-input type="text" placeholder="请输入"  clearable size="large"></t-input>
        <t-input type="text"
                 :maxLength="5"
                 :validate="/[-a-z]/"
                 v-model="input"
                 :errorMessage="errorMessage"
                 placeholder="请输入"
                 :minLength='2'
                 :autofocus=true></t-input>
        <t-input type="number" placeholder="请输入" :max="4" size="small"></t-input>
        <t-input type="text" :disable="true" placeholder="请输入" ></t-input>

        <t-input type="text" placeholder="请输入">
          <i class="iconfont icon-add" slot="leftIcon"></i>
        </t-input>
        <t-input type="text" size="small" placeholder="请输入">
          <i class="iconfont icon-add" slot="rightIcon"></i>
        </t-input>
        <t-input type="text" placeholder="请输入">
          <i class="iconfont icon-add" slot="rightIcon"></i>
        </t-input>
        <t-input type="text" size="large" placeholder="请输入">
          <i class="iconfont icon-add" slot="rightIcon"></i>
        </t-input>
        <t-input type="text" placeholder="请输入">
          <span slot="leftLabel">请输入。。。</span>
          <span slot="rightLabel">请输入。。。</span>

        </t-input>
      </div>
      <carousel></carousel>
      <br>
      <button @click="$notify.info('这是一条没用的消息')">info</button>
      <button @click="$notify.warning('这是一条没用的消息')">warning</button>
      <button @click="$notify.error('这是一条没用的消息')">error</button>
      <button @click="$notify.success('这是一条没用的消息')">success</button>
      <button @click="mynotify()">custom</button>
      <br>
      <button @click="mymsg(1)">callmsg</button>
      <button @click="mymsg(2)">callmag1</button>
      <button @click="mymsg(3)">callmsg2</button>
      <button @click="mymsg(4)">callmsg4</button>
      <br>
      <button style="position: absolute;left: 400px;top: 200px;"
              @click="mytooltip($event)"> tooltip test</button>
      <p @click="mytooltip($event)">21212332<span>span冒泡</span>231321321</p>

      <div style="height: 200px;">
        <h4>select</h4>
        <t-select style="width: 300px;"
                  v-model="selectValue"
                  :displayMethod="displayMethod"
                  :options="option"></t-select>
        <t-select style="width: 300px;"
                  v-model="selectInput"
                  :options="option"
                  canInput></t-select>
        <t-select style="width: 300px;"
                  v-model="multiSelect"
                  :options="option"
                  multiple></t-select>
        <t-select style="width: 300px;"
                  v-model="multiSelect"
                  :options="option"
                  multiple canInput></t-select>
        <t-select style="width: 300px;"
                  v-model="selectInput"
                  :disable="true"
                  :options="option"
                  canInput></t-select>

      </div>
      <Cascader style="width: 300px;"
                  :value="casValue"
                  :multiple="true"
                  :displayMethod="displayCas"
                  v-model="casValue"
                  :options="casOptions"
                  @choose="choose"
                  :loadData="loadData"></Cascader>

      <h3>upload</h3>
      <div>
        <t-upload action="https://jsonplaceholder.typicode.com/posts/" :success="onSuccess" :error="onError">
          <t-button slot="trigger">选择图片</t-button>
        </t-upload>
        <t-upload action="https://jsonplaceholder.typicode.com/posts/"
                  :success="onSuccess" :error="onError"
                  multiple
                  :onRemove="onRemove"
                  listType="picture-card"
                  :fileList="fileList"></t-upload>
      </div>
      <div>
        <h4>transfer</h4>
        <div>
          <transfer :source="mockData"
                    v-model="targetData"
                    :displayMethod="transferFormat"
                  ></transfer>
        </div>
      </div>
      <backtop></backtop>
      <t-button @click="total--">change</t-button>
      <Pagination :total="total"
                  :showTotal="true"
                  :showPageSize="true"
                  :showElevator="true"
                  :currentPage.sync="currentPage"></Pagination>
      <tree :data="treeData"
            @change="treeChange"></tree>
      <div style="border: 1px solid #ccc;padding: 10px;">
        <t-input v-model="treeFilter" type="text" style="display: block;"></t-input>
        <tree :data="treeData" ref="tree"
              :disabledKeys="['000412']"
              :defaultCheckedKeys="['000412']"
              :showSearch="true"
              :loadData="treeLoad"
              :resultFilter="treeFilterFunc" @select="treeSelect"></tree>
      </div>
      <div>
        <h4>datepicker</h4>
        <datepicker v-model="date" :disabledDate="disabledDate" type="dateRange"></datepicker>
      </div>
    </div>
</template>

<script>
import { carousel, Button, Switch, Radio, Checkbox, CheckboxGroup, Progress, Input, Select, Cascader, Upload, Transfer, Backtop, Pagination, Tree, Datepicker } from 't-component';

export default {
  name: 'for-test',
  data() {
    return {
      total: 119,
      currentPage: 1,
      switch1: false,
      radioValue: '2',
      checkOptions: ['2', '3', '4', '5', '6'],
      checkboxValue: ['4'],
      selectAll: false,
      halfCheck: false,
      percent: 15,
      progressColor: {
        active: 'yellow',
        success: 'red',
      },
      value: '123455',
      input: '',
      errorMessage: {
        color: '#4bcd1e',
        text: '应有字母a-z',
      },
      selectValue: [{ value: 1, label: '123' }],
      selectInput: [{ value: 1, label: '123' }],
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
      fileList: [],
      mockData: [
        { value: 1, label: '语文1', name: '张三', disabled: true },
        { value: 2, label: '语文2', name: '张三' },
        { value: 3, label: '语文3', name: '张三' },
        { value: 4, label: '语文4', name: '张三' },
        { value: 5, label: '语文5', name: '张三' },
      ],
      sourceDisableData: [1],
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
      ids: ['000'],
      treeHalf: [],
      treeFilter: '',
      date: '2018-11-1',
    };
  },
  components: {
    carousel,
    't-button': Button,
    't-switch': Switch,
    't-radio': Radio,
    't-checkbox': Checkbox,
    't-checkbox-group': CheckboxGroup,
    't-progress': Progress,
    't-input': Input,
    't-select': Select,
    Cascader,
    't-upload': Upload,
    Transfer,
    Backtop,
    Pagination,
    Tree,
    Datepicker,
  },
  methods: {
    disabledDate(date) {
      return date < new Date('2018-10-3') || date > new Date('2019-1-3');
    },
    switch1Change() {
    },
    radioChange() {
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
    add() {
      this.percent += 10;
      if (this.percent > 100) {
        this.percent = 100;
      }
    },
    mynotify() {
      this.$notify.config({
        position: { top: '200px', right: '100px' },
        theme: 'info',
        autoDimiss: false,
        text: '这是一条没用的消息',
      }).open();
    },
    mymsg(num) {
      if (num === 1) {
        this.$messagebox.alert('下班了！', '', '又要上班了惨惨惨！')
          .then(() => { this.$loading.config({ duration: 3 }).open(); });
      } else if (num === 2) {
        this.$messagebox.confirm('你真的要上班吗', '', '你上班到底是为了什么').finally(() => { this.$loading.config({ duration: 3 }).open(); });
      } else if (num === 3) {
        this.$messagebox.prompt().then(() => { this.$loading.config({ duration: 3 }).open(); });
      } else if (num === 4) {
        this.$messagebox({
          customTpl: '<p>您将授权我们进行进一步的对您个人信息记录和使用，您的信息我们将严格保密，并用于正确用途。</p>',
        })
          .then(() => {
            this.$notify.info('感谢您的配合');
          })
          .catch((action) => {
            if (typeof action === 'string') {
              this.$notify.error('您取消了操作');
            } else {
              this.$notify.error('程序出错了');
            }
          });
      }
    },
    mytooltip($event) {
      this.$tooltip($event, '11111111111');
    },
    displayMethod(value) {
      return value ? value.value : '请选择';
    },
    displayCas(value) {
      let display = '';
      value.forEach((x) => {
        display += `${x.label} ( ${x.value} )/`;
      });
      return display;
    },
    loadData(item, callback) {
      const data = item;
      data.loading = true;
      setTimeout(() => {
        if (data.value === 'cz') {
          data.children = [
            {
              value: 'talkingdata',
              label: 'TalkingData',
            },
            {
              value: 'baidu',
              label: '百度',
            },
            {
              value: 'sina',
              label: '新浪',
            },
          ];
        } else if (data.value === 'sz') {
          data.children = [];
        }
        data.loading = false;
        callback();
      }, 1000);
    },
    choose() {
    },
    onSuccess() {
    },
    onError() {
    },
    onRemove() {
    },
    transferFormat(item) {
      return `${item.name}-${item.label}`;
    },
    treeChange() {
    },
    treeFilterFunc(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    treeSelect() {},
    treeLoad(item, callback) {
      setTimeout(() => {
        const data = [
          {
            label: 'children',
            value: '004221',
            children: [],
          },
          {
            label: 'children2',
            value: '004222',
            children: [],
          },
        ];
        callback(data);
      }, 1000);
    },
  },
  watch: {
    treeFilter(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    // this.$loading.config({ duration: 9 }).open();
  },
};
</script>

<style scoped>
.p-t-l{
  width: 100px;height: 50px; background-color: blue;
  position: absolute;top: 350px;left: 350px;;
  transform: translate(-100%, 0);
}
  .p-t-r{
    height: 50px; background-color: palegreen;
    position: absolute;
    top: 200px;
    left: 150px;
  }

  .p-t-c{
    width: 100px;height: 50px; background-color: yellow;
    position: absolute;
  }
</style>
