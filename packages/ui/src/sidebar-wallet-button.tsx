"use client"

import * as React from "react"
import { Wallet, Copy, Check, LogOut, ChevronRight } from "lucide-react"

import { useWallet } from "@tokenization/tw-blocks-shared/src/wallet-kit/useWallet"
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { useSidebar } from "./sidebar"
import { cn } from "@tokenization/shared/lib/utils"

export function SidebarWalletButton() {
  const { handleConnect, handleDisconnect } = useWallet()
  const { walletAddress, walletName } = useWalletContext()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [copied, setCopied] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const shortAddress = React.useMemo(() => {
    if (!walletAddress) return ""
    if (walletAddress.length <= 10) return walletAddress
    return `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
  }, [walletAddress])

  const copyAddress = async () => {
    if (!walletAddress) return
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Error copying address:", err)
    }
  }

  // Disconnected (or SSR skeleton)
  if (!mounted || !walletAddress) {
    return (
      <button
        type="button"
        onClick={mounted ? handleConnect : undefined}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl px-3 h-12",
          "bg-primary text-primary-foreground hover:bg-brand-primary-hover",
          "transition-colors font-medium text-sm cursor-pointer",
          isCollapsed && "justify-center px-0"
        )}
      >
        <Wallet className="size-5 shrink-0" />
        {!isCollapsed && <span>Conectar Billetera</span>}
      </button>
    )
  }

  // Connected
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 h-12",
            "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-accent",
            "transition-colors text-sm cursor-pointer",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Wallet className="size-5 shrink-0" />
          {!isCollapsed && (
            <>
              <div className="flex flex-col items-start min-w-0 flex-1 text-left">
                <span className="text-xs font-semibold leading-none truncate">
                  {walletName}
                </span>
                <span className="font-mono text-xs text-text-secondary leading-tight mt-0.5">
                  {shortAddress}
                </span>
              </div>
              <ChevronRight className="size-4 shrink-0 text-text-muted" />
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 p-0 overflow-hidden"
        side="right"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-accent">
              <Wallet className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{walletName}</p>
              <p className="text-xs text-text-muted mt-0.5">Testnet</p>
            </div>
          </div>
        </div>

        {/* Address block */}
        <div className="px-4 py-3">
          <p className="text-xs text-text-muted mb-1.5">Dirección</p>
          <div className="rounded-lg bg-secondary px-3 py-2 border border-border">
            <p className="font-mono text-xs break-all leading-relaxed">
              {walletAddress}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            type="button"
            onClick={copyAddress}
            disabled={copied}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium",
              "bg-secondary text-secondary-foreground hover:bg-secondary/70",
              "transition-colors cursor-pointer disabled:cursor-default"
            )}
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copiar
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDisconnect}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium",
              "border border-border bg-transparent text-destructive hover:bg-destructive/10",
              "transition-colors cursor-pointer"
            )}
          >
            <LogOut className="size-3.5" />
            Desconectar
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
