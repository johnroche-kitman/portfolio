import TryOutlinedIcon from '@mui/icons-material/TryOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SportsOutlinedIcon from '@mui/icons-material/SportsOutlined'
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined'
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined'
import FilterNoneOutlinedIcon from '@mui/icons-material/FilterNoneOutlined'
import CropSquareOutlinedIcon from '@mui/icons-material/CropSquareOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

// Central registry, every icon in the app must be Outlined per design-system rules
export const ICONS = {
  askIp: TryOutlinedIcon,
  nextGen: ScienceOutlinedIcon,
  athletes: GroupsOutlinedIcon,
  medical: LocalHospitalOutlinedIcon,
  planning: MonitorHeartOutlinedIcon,
  forms: AssignmentOutlinedIcon,
  calendar: CalendarMonthOutlinedIcon,
  documents: FileCopyOutlinedIcon,
  messaging: ForumOutlinedIcon,
  media: OndemandVideoOutlinedIcon,
  recruitment: AssignmentIndOutlinedIcon,
  settings: SettingsOutlinedIcon,
  help: HelpOutlineOutlinedIcon,
  collapse: KeyboardDoubleArrowLeftOutlinedIcon,
  search: SearchOutlinedIcon,
  arrowDropDown: ArrowDropDownOutlinedIcon,
  moreVert: MoreVertOutlinedIcon,
  folder: FolderOutlinedIcon,
  dashboard: SpaceDashboardOutlinedIcon,
  look: PieChartOutlineOutlinedIcon,
  list: ListOutlinedIcon,
  grid: GridViewOutlinedIcon,
  chevronLeft: ChevronLeftOutlinedIcon,
  chevronRight: ChevronRightOutlinedIcon,
  edit: EditOutlinedIcon,
  history: HistoryOutlinedIcon,
  expand: OpenInFullOutlinedIcon,
  minimise: CloseFullscreenOutlinedIcon,
  close: CloseOutlinedIcon,
  sessions: SportsOutlinedIcon,
  medicalBag: MedicalServicesOutlinedIcon,
  cloud: CloudDownloadOutlinedIcon,
  mic: MicNoneOutlinedIcon,
  send: ArrowUpwardOutlinedIcon,
  explore: ExploreOutlinedIcon,
  copy: ContentCopyOutlinedIcon,
  expandMore: ExpandMoreOutlinedIcon,
  favourites: FavoriteBorderOutlinedIcon,
  sharedFolder: FolderSharedOutlinedIcon,
  templatesTab: FilterNoneOutlinedIcon,
  stop: CropSquareOutlinedIcon,
  delete: DeleteOutlineOutlinedIcon,
}

export default function Icon({ name, ...props }) {
  const Component = ICONS[name]
  if (!Component) return null
  return <Component {...props} />
}
