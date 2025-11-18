/**
 * UI Component Library for BookMe Platform
 * Built with Untitled UI React components
 * @packageDocumentation
 */

// Export utilities
export { cx } from './utils/cx';
export { isReactComponent } from './utils/is-react-component';

// Export hooks
export { useBreakpoint } from './hooks/use-breakpoint';
export { useClipboard } from './hooks/use-clipboard';
export { useResizeObserver } from './hooks/use-resize-observer';
export { useActiveItem } from './hooks/use-active-item';

// Export base components - Buttons
export { Button } from './components/base/buttons/button';
export { CloseButton } from './components/base/buttons/close-button';
export { SocialButton } from './components/base/buttons/social-button';

// Export base components - Input
export { Input } from './components/base/input/input';
export { InputGroup } from './components/base/input/input-group';
export { Label } from './components/base/input/label';
export { HintText } from './components/base/input/hint-text';

// Export base components - Select
export { Select } from './components/base/select/select';
export type { SelectItemType } from './components/base/select/select';
export { ComboBox } from './components/base/select/combobox';
export { MultiSelect } from './components/base/select/multi-select';

// Export base components - Tooltip
export { Tooltip, TooltipTrigger } from './components/base/tooltip/tooltip';

// Export base components - Avatar
export { Avatar } from './components/base/avatar/avatar';

// Export base components - Badges
export { Badge } from './components/base/badges/badges';

// Export base components - Tags
export { Tag, TagGroup, TagList } from './components/base/tags/tags';

// Export base components - Checkbox
export { Checkbox } from './components/base/checkbox/checkbox';

// Export base components - Radio
export { RadioButton, RadioGroup } from './components/base/radio-buttons/radio-buttons';

// Export base components - Toggle
export { Toggle } from './components/base/toggle/toggle';

// Export base components - Textarea
export { TextArea } from './components/base/textarea/textarea';

// Export application components - Date Picker
export { DatePicker } from './components/application/date-picker/date-picker';
export { DateRangePicker } from './components/application/date-picker/date-range-picker';
export { Calendar } from './components/application/date-picker/calendar';
export { RangeCalendar } from './components/application/date-picker/range-calendar';

// Export application components - Modals
// export { Modal } from './components/application/modals/modal';

// Export application components - Tabs
// export { Tabs, TabList, Tab, TabPanel } from './components/application/tabs/tabs';

// Export application components - Pagination
// export { Pagination } from './components/application/pagination/pagination';

// Re-export common types from dependencies
export type { DateValue } from '@internationalized/date';

