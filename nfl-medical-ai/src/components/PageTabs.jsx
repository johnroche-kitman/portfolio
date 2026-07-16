import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

export default function PageTabs({ tabs, value, onChange }) {
  return (
    <Tabs
      value={value}
      onChange={(e, val) => onChange?.(val)}
      TabIndicatorProps={{ style: { backgroundColor: 'var(--color-primary)', height: 2 } }}
      sx={{
        borderBottom: '1px solid var(--divider)',
        minHeight: 40,
        '& .MuiTab-root': {
          textTransform: 'none',
          minHeight: 40,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--grey-100)',
        },
        '& .Mui-selected': {
          color: 'var(--color-primary) !important',
        },
      }}
    >
      {tabs.map((tab) => (
        <Tab key={tab.value} label={tab.label} value={tab.value} disabled={tab.disabled} />
      ))}
    </Tabs>
  )
}
