import { TopNavbar } from '@/components/TopNavbar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <TopNavbar />
        <div className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
          <div className="max-w-lg lg:max-w-2xl mx-auto fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full button-press"
                >
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-sm text-muted-foreground">
                  Manage how you receive notifications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
