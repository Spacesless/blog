import Vue from 'vue'
// @see https://element.eleme.cn/#/zh-CN/component/quickstart
// import 'element-ui/lib/theme-chalk/display.css'

import {
  Pagination,
  // Dialog,
  // Autocomplete,
  // Dropdown,
  // DropdownMenu,
  // DropdownItem,
  // Slider,
  Menu,
  Submenu,
  MenuItem,
  // MenuItemGroup,
  Input,
  // InputNumber,
  // Radio,
  RadioGroup,
  RadioButton,
  // Checkbox,
  // CheckboxButton,
  // CheckboxGroup,
  // Switch,
  Select,
  Option,
  // OptionGroup,
  Button,
  // ButtonGroup,
  Table,
  TableColumn,
  // DatePicker,
  // TimeSelect,
  // TimePicker,
  Popover,
  Tooltip,
  // Breadcrumb,
  // BreadcrumbItem,
  Form,
  FormItem,
  // Tabs,
  // TabPane,
  Tag,
  // Tree,
  // Alert,
  // Slider,
  // Icon,
  Row,
  Col,
  // Upload,
  Progress,
  // Spinner,
  // Badge,
  // Card,
  Rate,
  // Steps,
  // Step,
  Carousel,
  CarouselItem,
  Scrollbar,
  // Collapse,
  // CollapseItem,
  // ColorPicker,
  // Transfer,
  // Container,
  // Header,
  // Aside,
  // Main,
  // Footer,
  Timeline,
  TimelineItem,
  // Link,
  // Divider,
  Image,
  Cascader, // TODO
  // Backtop,
  // PageHeader,
  // CascaderPanel,
  Loading,
  // Message,
  MessageBox, // TODO
  Notification,
  // Avatar,
  Drawer
  // InfiniteScroll,
  // Avatar,
  // Drawer,
  // InfiniteScroll,
  // Popconfirm,
  // Skeleton,
  // SkeletonItem,
  // Empty,
  // Descriptions,
  // DescriptionsItem,
  // Result,
  // CollapseTransition
} from 'element-ui'

Vue.use(Pagination)
// Vue.use(Dialog)
// Vue.use(Dropdown)
// Vue.use(DropdownMenu)
// Vue.use(DropdownItem)
Vue.use(Scrollbar)
// Vue.use(Slider)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
// Vue.use(ButtonGroup)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tag)
// Vue.use(Tree)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Progress)
Vue.use(Tooltip)
Vue.use(Popover)
// Vue.use(Breadcrumb)
// Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Cascader)
Vue.use(Rate)
Vue.use(Col)
Vue.use(Image)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Timeline)
Vue.use(TimelineItem)
// Vue.use(Card)
Vue.use(Drawer)
Vue.use(Loading)

Vue.prototype.$ELEMENT = {
  size: 'small',
  zIndex: 2000
}

const msgbox = MessageBox
const { prompt } = msgbox

Vue.prototype.$notify = Notification
Vue.prototype.$prompt = prompt
