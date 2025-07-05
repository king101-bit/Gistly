'use client'
import { useState } from 'react'

// TypeScript interfaces
interface TabObject {
  label: string
  value: string
}

interface FlexibleTabsProps {
  tabs: string[] | TabObject[]
  defaultTab?: string
  onTabChange?: (tabValue: string) => void
  className?: string
}

// Main flexible tabs component
const FlexibleTabs: React.FC<FlexibleTabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (defaultTab) return defaultTab
    const firstTab = tabs[0]
    return typeof firstTab === 'string'
      ? firstTab.toLowerCase()
      : firstTab?.value || ''
  })

  const handleTabChange = (tabValue: string): void => {
    setActiveTab(tabValue)
    onTabChange?.(tabValue)
  }

  // Handle both string arrays and object arrays
  const normalizedTabs: TabObject[] = tabs.map((tab) =>
    typeof tab === 'string' ? { label: tab, value: tab.toLowerCase() } : tab,
  )

  return (
    <div
      className={`flex gap-4 sm:gap-6 text-base sm:text-lg lg:text-xl overflow-x-auto ${className}`}
    >
      {normalizedTabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabChange(tab.value)}
          className={`
            pb-2 transition-all duration-200 whitespace-nowrap flex-shrink-0
            ${
              activeTab === tab.value
                ? 'text-emerald-400 font-bold border-b-2 border-emerald-400'
                : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-muted-foreground/30'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default FlexibleTabs
