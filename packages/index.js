/* eslint-disable no-param-reassign */
import loading from './loading/index';
import notification from './notification/index';
import Messagebox from './messagebox/index';
import tTooltip from './tooltip/index';
import tooltip from './tooltip/tooltip';
import carousel from './carousel/index';
import Button from './button/index';
import Switch from './switch/index';
import Radio from './radio/index';
import Checkbox from './checkbox/index';
import CheckboxGroup from './checkbox-group/index';
import Progress from './progress/index';
import Input from './input/input';
import Select from './select/select';
import Cascader from './cascader/cascader';
import Modal from './modal/modal';
import Steps from './steps/steps';
import Step from './step/step';
import Badge from './badge/badge';
import Menu from './menu/menu';
import MenuItem from './menuItem/menuItem';
import SubMenu from './subMenu/subMenu';
import Upload from './upload/upload';
import Transfer from './transfer/transfer';
import Backtop from './backtop/backtop';
import Pagination from './pagination/pagination';
import Tree from './tree/tree';
import Datepicker from './datepicker/datepicker';
import Table from './table/table';
import TableColumn from './tableColumn/tableColumn';
import Timepicker from './timePicker/timePicker';
import Empty from './empty/empty';
import Card from './card/card';
import Breadcrumb from './breadcrumb/breadcrumb';
import BreadcrumbItem from './breadcrumbItem/breadcrumbItem';
import Affix from './Affix/affix';
import List from './list/list';
import ListItem from './list/listItem';

// 版本号
const version = '1.0.1.b';
// 基础组件默认是安装好了的
const baseComponents = [
  Button,
  Radio,
  Checkbox,
  Modal,
  Input,
  tooltip,
  Select,
];

const install = (Vue) => {
  for (let i = 0; i < baseComponents.length; i++) {
    Vue.component(baseComponents[i].name, baseComponents[i]);
  }
  Vue.prototype.$loading = loading;
  Vue.prototype.$notify = notification;
  Vue.prototype.$messagebox = Messagebox;
  Vue.prototype.$tooltip = tTooltip;
};
// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

// 输出体积较大的非默认的组件
export {
  install,
  version,
  carousel,
  Switch,
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
  Button,
  Radio,
  Checkbox,
  Modal,
  Input,
  tooltip,
  Select,
  Empty,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  Affix,
  List,
  ListItem,
};

export default {
  install,
  version,
};
