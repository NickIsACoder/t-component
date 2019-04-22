<template>
  <div>
    <button style="position: absolute;left: 400px;top: 200px;"
            @click="mytooltip($event);stepCount++"> tooltip test</button>
    <p @click="mytooltip($event)"
    style="position: absolute;left: 300px;top: 450px;display: none;"
    >21212332<span>span冒泡</span>231321321</p>
    <input type="checkbox" v-model="checks" value="1">
    <span><input type="checkbox" v-model="checks" value="2"></span>
    <div><input type="checkbox" v-model="checks" value="3"></div>
    <input type="checkbox" v-model="checks" value="4">
    <span
      @click="$tooltip($event, {
        position: 'bottomLeft',
        title: 'tooltip',
        icon: 'icon-info-fill',
        iconColor: 'orange'})"
    >
      4542121654654546
    </span>
    <p @mouseenter="$tooltip($event, {position: 'bottomRight', title: 'tooltip'})">
      121211122
    </p>
    <button @click="singlefile" >testSingleFile</button>
    <button @click="showModal=true">
      打开modal
    </button>
    <button @click="openLoading(1)">
      打开loading1
    </button>
    <button @click="openLoading(2)">
      打开loading2
    </button
    ><button @click="openLoading(3)">
      打开loading2
    </button>
    <button @click="openMessageBox(1)">
      打开loading2
    </button>
    <button @click="openMessageBox(2)">
      打开loading2
    </button>
    <button @click="$notify.info('更改加载样式', 'ballqueue').onClick()">
      打开loading2
    </button>
    <input type="text" @keyup="$tooltip($event, {
        position: 'topRight',
        title: '用户名必须是6-20位英文数字的组合'})" >
    <tooltip :target="target" :refTarget="rg" v-model="showTooltip">
      <p>你确定要删除吗?</p><br>
      <Button type="primary">确定</Button>
      <Button type="error">取消</Button>
    </tooltip>
    <Modal v-model="showModal">
      <div slot="header">这个是一个自定义的模态框</div>
      <div slot="body">
        它啥都可以装的下，满足你所有定制需求
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
        <label for="1">表单1</label>：<input type="text" id="1">
        <label for="2">表单1</label>：<input type="text" id="2"><br>
        <label for="3">表单1</label>：<input type="text" id="3">
        <label for="4">表单1</label>：<input type="text" id="4"><br>
        <label for="5">表单1</label>：<input type="text" id="5">
        <label for="6">表单1</label>：<input type="text" id="6"><br>
        <label for="7">表单1</label>：<input type="text" id="7">
        <label for="8">表单1</label>：<input type="text" id="8"><br>
        <label for="9">表单1</label>：<input type="text" id="9">
        <label for="0">表单1</label>：<input type="text" id="0">
      </div>、
      <div slot="footer">
        <Button type="primary" style="float: right;">确定</Button>
        <Button style="float: right;margin-right: 15px;">取消</Button></div>
    </Modal>
    <div style="width: 1000px;">
      <steps :active="stepCount" :status="activeStatus2" :useNumber="false">
        <step>
          <span slot="title"></span>
          <p slot="description"></p>
        </step>
        <step :showNumber="false"><p slot="title" >第二步</p></step>
        <step><p slot="title">第三步dfdfd</p></step>
      </steps>
    </div>
    <div style="height: 600px; float: right;display: none;">
      <steps :active="stepCount" :status="activeStatus2" direction="vertical">
        <step>
          <span slot="title">第一步</span>
          <p slot="description" style="text-align:left;">首先要打开冰箱门8888</p>
        </step>
        <step :showNumber="false"><p slot="title" >第二步</p></step>
        <step :showNumber="false"><p slot="title" >第三步</p></step>
        <step :showNumber="false"><p slot="title" >第四步</p></step>
      </steps>
    </div>
    <Badge><Button>评论</Button></Badge>
    <Badge type="text" content="9999+"><span>全新发布</span></Badge>
    <div>
      <t-menu v-model="menuModel">
        <menu-item menuName="菜单0" icon="icon-download-cloud"></menu-item>
        <SubMenu menuName="菜单1" icon="icon-upload-cloud">
          <SubMenu menuName="副菜单1" >
            <menu-item menuName="副菜单1-1"></menu-item>
            <menu-item menuName="副菜单1-2"></menu-item>
          </SubMenu>
          <menu-item menuName="副菜单2"></menu-item>
          <menu-item menuName="副菜单3"></menu-item>
        </SubMenu>
        <menu-item menuName="菜单2" icon="icon-star-line"></menu-item>
        <menu-item menuName="菜单3" icon="icon-verify"></menu-item>
      </t-menu>
    </div >
    <div style="margin-top: 120px;" >
      <t-menu direction="vertical"  v-model="menuModel" canCollapse>
        <menu-item menuName="菜单0" >
          <img src="../assets/logo.png" slot="icon"
               width="18" height="18">
        </menu-item>
        <SubMenu menuName="菜单1" >
          <img src="../assets/logo.png" slot="icon"
               width="18" height="18">
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
        <menu-item menuName="菜单2" icon="icon-upload-cloud">
          <img src="../assets/logo.png" slot="icon"
               width="18" height="18">
        </menu-item>
        <menu-item menuName="菜单3" icon="icon-star-line">
          <img src="../assets/logo.png" slot="icon"
               width="18" height="18">
        </menu-item>
      </t-menu>
    </div>

    <div v-if="0">
      <Table :source="tableData"
             :hasSummary="true"
             :summaryKeys="['zip']"
             :onClick="ialert"
             :height="300"
             :width="800"
             >
        <TableColumn type="selection" ></TableColumn>
        <TableColumn type="index" ></TableColumn>
        <TableColumn colKey="name" label="姓名"  ></TableColumn>
        <TableColumn colKey="date" label="时间"  ></TableColumn>
        <TableColumn colKey="address" label="地址" :nowarp="true"></TableColumn>
        <TableColumn colKey="zip" label="邮编"  :hasSorter="true" align="center">
        </TableColumn>
        <TableColumn label="省市" >
          <div  slot-scope="scope">{{scope.row.province + scope.row.city}}</div>
        </TableColumn>
      </Table>
    </div>
    <br>
    <div style="margin-left: 100px;width: 950px;" >
      <Table :source="tableData2"
             bordered
             singleSelect
             :rowClass="striperRow"
             :height="200"
             :width="600"
             fixedHead
      >
        <TableColumn type="selection"  align="center"  width="50" fixed></TableColumn>
        <!--<TableColumn type="index"  width="50" align="center"  ></TableColumn>-->
        <TableColumn colKey="date" label="时间"  width="180"></TableColumn>
        <TableColumn colKey="name" label="姓名"   ></TableColumn>
        <TableColumn colKey="zip" label="邮编" width="120"  :hasSorter="true" align="center">
        </TableColumn>
        <TableColumn colKey="address" label="地址"  width="250"></TableColumn>
        <TableColumn label="省市"  width="200">
          <div  slot-scope="scope">{{scope.row.province + scope.row.city}}</div>
        </TableColumn>
      </Table>
      <br><br>
      <button @click="$router.push('/a')">跳转</button>
    </div>
  </div>
</template>

<script>
import { tooltip, Button, Modal, Step, Steps, Badge, Menu, MenuItem, SubMenu, Table, TableColumn } from 't-component';

export default {
  name: 'test-h',
  data() {
    return {
      showTooltip: false,
      target: null,
      rg: null,
      showModal: false,
      gi: { o: 1 },
      stepCount: -1,
      menuModel: '副菜单2',
      activeStatus1: 'process',
      activeStatus2: 'process',
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
      tableData2: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200332,
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200335,
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip: 200339,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip: 200338,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip: 200338,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip: 200338,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip: 200338,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip: 200338,
        },
      ],
      checks: [],
    };
  },
  components: {
    tooltip, Button, Modal, Step, Steps, Badge, 't-menu': Menu, MenuItem, SubMenu, Table, TableColumn,
  },
  methods: {
    mytooltip($event) {
      this.$tooltip($event, '11111111111');
    },
    singlefile($event) {
      this.target = $event;
      this.rg = $event.currentTarget;
      this.showTooltip = true;
    },
    ialert() {
    },
    openLoading(step) {
      if (step === 1) {
        this.$loading.config({ icon: 'circle3', duration: 0.2 }).open();
      } else if (step === 2) {
        this.$loading.config({ icon: 'walkSquare', duration: 0.2 }).open();
      } else if (step === 3) {
        this.$loading.config({ icon: 'ballring', duration: 0.2 }).open();
      } else if (step === 4) {
        this.$loading.config({ icon: 'stripper', duration: 0.2 }).open();
      }
    },
    openMessageBox(step) {
      if (step === 1) {
        this.$messagebox({ title: '这是小标题', buttonText: ['对的', '错的'], type: 'prompt', inputValidate: /[0-9]/, errorMessage: '请输入数字' }).then(() => { this.time = document.querySelector('.t-msgbox-input').innerHTML; });
      } else {
        this.$messagebox.prompt('请输入你的最爱', 'icon-add', '', ['确定', '取消']).then(() => { this.tip = document.querySelector('.t-msgbox-input').innerHTML; }).catch((action) => {
          if (typeof action === 'string') {
            this.tip = '您点击了取消';
          } else {
            this.tip = '报错啦';
          }
        });
      }
    },
    striperRow(row, index) {
      if (index % 2 === 0) return 'darker-row';
      return '';
    },
  },
  mounted() {
    // setTimeout(() => {
    //   this.tableData = this.tableData2;
    // }, 5000);
  },
};
</script>

<style >
  .darker-row td{
    background-color: #b9ceee ;
  }
</style>
