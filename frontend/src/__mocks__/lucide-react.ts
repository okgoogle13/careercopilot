import React from 'react';

const createMockIcon = (name: string) => {
  const Icon: React.FC<{ className?: string; size?: number; color?: string }> = ({ className }) =>
    React.createElement('span', { 'data-testid': `icon-${name.toLowerCase()}`, className });
  Icon.displayName = name;
  return Icon;
};

// All lucide-react icons used in src and packages/ui
export const Activity = createMockIcon('Activity');
export const AlertCircle = createMockIcon('AlertCircle');
export const AlertTriangle = createMockIcon('AlertTriangle');
export const Archive = createMockIcon('Archive');
export const ArrowLeft = createMockIcon('ArrowLeft');
export const ArrowLeftIcon = createMockIcon('ArrowLeft');
export const ArrowLeftRight = createMockIcon('ArrowLeftRight');
export const ArrowRight = createMockIcon('ArrowRight');
export const ArrowRightIcon = createMockIcon('ArrowRight');
export const Award = createMockIcon('Award');
export const BarChart3 = createMockIcon('BarChart3');
export const Bell = createMockIcon('Bell');
export const BookOpen = createMockIcon('BookOpen');
export const Briefcase = createMockIcon('Briefcase');
export const Building = createMockIcon('Building');
export const Calendar = createMockIcon('Calendar');
export const Check = createMockIcon('Check');
export const CheckCircle = createMockIcon('CheckCircle');
export const CheckCircle2 = createMockIcon('CheckCircle2');
export const CheckIcon = createMockIcon('CheckIcon');
export const ChevronDown = createMockIcon('ChevronDown');
export const ChevronDownIcon = createMockIcon('ChevronDownIcon');
export const ChevronUp = createMockIcon('ChevronUp');
export const ChevronUpIcon = createMockIcon('ChevronUpIcon');
export const ChevronLeft = createMockIcon('ChevronLeft');
export const ChevronLeftIcon = createMockIcon('ChevronLeftIcon');
export const ChevronRight = createMockIcon('ChevronRight');
export const ChevronRightIcon = createMockIcon('ChevronRightIcon');
export const Circle = createMockIcon('Circle');
export const CircleIcon = createMockIcon('CircleIcon');
export const Clock = createMockIcon('Clock');
export const Compass = createMockIcon('Compass');
export const Copy = createMockIcon('Copy');
export const Download = createMockIcon('Download');
export const Edit = createMockIcon('Edit');
export const Edit2 = createMockIcon('Edit2');
export const Eye = createMockIcon('Eye');
export const EyeOff = createMockIcon('EyeOff');
export const FileText = createMockIcon('FileText');
export const Gauge = createMockIcon('Gauge');
export const Globe = createMockIcon('Globe');
export const GripVerticalIcon = createMockIcon('GripVerticalIcon');
export const Home = createMockIcon('Home');
export const Image = createMockIcon('Image');
export const Info = createMockIcon('Info');
export const Layout = createMockIcon('Layout');
export const LayoutDashboard = createMockIcon('LayoutDashboard');
export const LayoutGrid = createMockIcon('LayoutGrid');
export const Lightbulb = createMockIcon('Lightbulb');
export const Link2 = createMockIcon('Link2');
export const List = createMockIcon('List');
export const Loader2 = createMockIcon('Loader2');
export const Lock = createMockIcon('Lock');
export const Mail = createMockIcon('Mail');
export const MapPin = createMockIcon('MapPin');
export const Menu = createMockIcon('Menu');
export const MessageSquare = createMockIcon('MessageSquare');
export const Mic = createMockIcon('Mic');
export const MicOff = createMockIcon('MicOff');
export const Minus = createMockIcon('Minus');
export const MinusIcon = createMockIcon('MinusIcon');
export const MoreHorizontal = createMockIcon('MoreHorizontal');
export const MoreHorizontalIcon = createMockIcon('MoreHorizontalIcon');
export const MoreVertical = createMockIcon('MoreVertical');
export const PanelLeftIcon = createMockIcon('PanelLeftIcon');
export const Plus = createMockIcon('Plus');
export const RefreshCw = createMockIcon('RefreshCw');
export const Rocket = createMockIcon('Rocket');
export const RotateCcw = createMockIcon('RotateCcw');
export const Save = createMockIcon('Save');
export const ScrollText = createMockIcon('ScrollText');
export const Search = createMockIcon('Search');
export const SearchIcon = createMockIcon('SearchIcon');
export const Send = createMockIcon('Send');
export const Settings = createMockIcon('Settings');
export const Shapes = createMockIcon('Shapes');
export const Share = createMockIcon('Share');
export const Share2 = createMockIcon('Share2');
export const Shield = createMockIcon('Shield');
export const ShieldCheck = createMockIcon('ShieldCheck');
export const Sparkles = createMockIcon('Sparkles');
export const Star = createMockIcon('Star');
export const Target = createMockIcon('Target');
export const Terminal = createMockIcon('Terminal');
export const Trash = createMockIcon('Trash');
export const Trash2 = createMockIcon('Trash2');
export const TrendingUp = createMockIcon('TrendingUp');
export const Type = createMockIcon('Type');
export const Upload = createMockIcon('Upload');
export const UploadCloud = createMockIcon('UploadCloud');
export const User = createMockIcon('User');
export const Users = createMockIcon('Users');
export const Wand2 = createMockIcon('Wand2');
export const Waves = createMockIcon('Waves');
export const X = createMockIcon('X');
export const XIcon = createMockIcon('XIcon');
export const Zap = createMockIcon('Zap');
export const Fingerprint = createMockIcon('Fingerprint');

// For unknown icons, create them dynamically
const handler: ProxyHandler<Record<string, any>> = {
  get(_target, prop: string | symbol) {
    if (typeof prop === 'string') {
      return createMockIcon(prop);
    }
    return undefined;
  },
};

const proxy = new Proxy(
  {
    Activity,
    AlertCircle,
    AlertTriangle,
    Archive,
    ArrowLeft,
    ArrowLeftIcon,
    ArrowLeftRight,
    ArrowRight,
    ArrowRightIcon,
    Award,
    BarChart3,
    Bell,
    BookOpen,
    Briefcase,
    Building,
    Calendar,
    Check,
    CheckCircle,
    CheckCircle2,
    CheckIcon,
    ChevronDown,
    ChevronDownIcon,
    ChevronUp,
    ChevronUpIcon,
    ChevronLeft,
    ChevronLeftIcon,
    ChevronRight,
    ChevronRightIcon,
    Circle,
    CircleIcon,
    Clock,
    Compass,
    Copy,
    Download,
    Edit,
    Edit2,
    Eye,
    EyeOff,
    FileText,
    Gauge,
    Globe,
    GripVerticalIcon,
    Home,
    Image,
    Info,
    Layout,
    LayoutDashboard,
    LayoutGrid,
    Lightbulb,
    Link2,
    List,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Menu,
    MessageSquare,
    Mic,
    MicOff,
    Minus,
    MinusIcon,
    MoreHorizontal,
    MoreHorizontalIcon,
    MoreVertical,
    PanelLeftIcon,
    Plus,
    RefreshCw,
    Rocket,
    RotateCcw,
    Save,
    ScrollText,
    Search,
    SearchIcon,
    Send,
    Settings,
    Shapes,
    Share,
    Share2,
    Shield,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    Terminal,
    Trash,
    Trash2,
    TrendingUp,
    Type,
    Upload,
    UploadCloud,
    User,
    Users,
    Wand2,
    Waves,
    X,
    XIcon,
    Zap,
    Fingerprint,
  },
  handler
) as any;

export default proxy;
