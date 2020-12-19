// @see https://element.eleme.cn/#/zh-CN/component/quickstart
import 'element-ui/lib/theme-chalk/index.css'

import {
  Pagination,
  Dialog,
  // Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  // MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  // CheckboxButton,
  // CheckboxGroup,
  Switch,
  Select,
  Option,
  // OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  // Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  // Tree,
  // Alert,
  // Slider,
  Icon,
  Row,
  Col,
  Upload,
  // Progress,
  Spinner,
  // Badge,
  Card,
  // Rate,
  // Steps,
  // Step,
  // Carousel,
  Scrollbar,
  // CarouselItem,
  // Collapse,
  // CollapseItem,
  Cascader,
  // ColorPicker,
  // Transfer,
  // Container,
  // Header,
  // Aside,
  // Main,
  // Footer,
  // Timeline,
  // TimelineItem,
  Link,
  // Divider,
  Image,
  // Calendar,
  // Backtop,
  // PageHeader,
  // CascaderPanel,
  Loading,
  MessageBox,
  Message
  // Notification,
  // Avatar,
  // Drawer,
  // InfiniteScroll
} from 'element-ui'

const components = [
  Pagination,
  Dialog,
  // Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  // MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  // CheckboxButton,
  // CheckboxGroup,
  Switch,
  Select,
  Option,
  // OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  // Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  // Tree,
  // Alert,
  // Slider,
  Icon,
  Row,
  Col,
  Upload,
  // Progress,
  Spinner,
  // Badge,
  Card,
  // Rate,
  // Steps,
  // Step,
  // Carousel,
  Scrollbar,
  // CarouselItem,
  // Collapse,
  // CollapseItem,
  Cascader,
  // ColorPicker,
  // Transfer,
  // Container,
  // Header,
  // Aside,
  // Main,
  // Footer,
  // Timeline,
  // TimelineItem,
  Link,
  // Divider,
  Image
  // Calendar,
  // Backtop,
  // PageHeader,
  // CascaderPanel,
  // Avatar,
  // Drawer,
  // InfiniteScroll
]

export default {
  install: function(Vue, opts = {}) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })

    // 处理 Babel@7 同时使用Loading、MessageBox多个属性 报_Loading,_MessageBox not defined
    // @see https://github.com/ElementUI/babel-plugin-component/issues/31
    const { directive: loadingDirective, service: loadingService } = Loading
    const msgbox = MessageBox
    const { alert, confirm, prompt } = msgbox
    Vue.use(loadingDirective)

    Vue.prototype.$ELEMENT = {
      size: opts.size || '',
      zIndex: opts.zIndex || 2000
    }

    Vue.prototype.$loading = loadingService
    Vue.prototype.$msgbox = msgbox
    Vue.prototype.$alert = alert
    Vue.prototype.$confirm = confirm
    Vue.prototype.$prompt = prompt
    // Vue.prototype.$notify = Notification
    Vue.prototype.$message = Message

    // Vue.use(InfiniteScroll)
  }
}
