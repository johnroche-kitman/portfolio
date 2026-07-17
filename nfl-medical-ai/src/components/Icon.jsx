import SportsFootballOutlinedIcon from '@mui/icons-material/SportsFootballOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import MicOutlinedIcon from '@mui/icons-material/MicOutlined'
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined'
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined'
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined'
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined'
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'

// Central registry, every icon in the app must be Outlined per design-system rules
export const ICONS = {
  football: SportsFootballOutlinedIcon,
  medical: LocalHospitalOutlinedIcon,
  chart: BarChartOutlinedIcon,
  clipboard: AssignmentOutlinedIcon,
  groups: GroupsOutlinedIcon,
  calendar: CalendarMonthOutlinedIcon,
  settings: SettingsOutlinedIcon,
  help: HelpOutlineOutlinedIcon,
  collapse: KeyboardDoubleArrowRightOutlinedIcon,
  search: SearchOutlinedIcon,
  expandMore: ExpandMoreOutlinedIcon,
  chevronRight: ChevronRightOutlinedIcon,
  moreVert: MoreVertOutlinedIcon,
  download: DownloadOutlinedIcon,
  add: AddOutlinedIcon,
  info: InfoOutlinedIcon,
  close: CloseOutlinedIcon,
  mic: MicOutlinedIcon,
  micOff: MicOffOutlinedIcon,
  send: SendOutlinedIcon,
  ai: AutoAwesomeOutlinedIcon,
  checkCircle: CheckCircleOutlineOutlinedIcon,
  taskAlt: TaskAltOutlinedIcon,
  back: ArrowBackOutlinedIcon,
  noteAdd: NoteAddOutlinedIcon,
  update: UpdateOutlinedIcon,
  personAdd: PersonAddAltOutlinedIcon,
  factCheck: FactCheckOutlinedIcon,
  refresh: RefreshOutlinedIcon,
  checklist: ChecklistRtlOutlinedIcon,
  lock: LockOutlinedIcon,
  archive: ArchiveOutlinedIcon,
  delete: DeleteOutlineOutlinedIcon,
  rehab: FitnessCenterOutlinedIcon,
  chevronLeft: ChevronLeftOutlinedIcon,
  swapVert: SwapVertOutlinedIcon,
  summary: SummarizeOutlinedIcon,
  print: PrintOutlinedIcon,
}

export default function Icon({ name, ...props }) {
  const Component = ICONS[name]
  if (!Component) return null
  return <Component {...props} />
}
