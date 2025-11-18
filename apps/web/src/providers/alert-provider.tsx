"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

interface ConfirmOptions extends AlertOptions {
  confirmText?: string
  cancelText?: string
}

interface AlertContextType {
  alert: (message: string, options?: AlertOptions) => Promise<void>
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>
}

const AlertContext = React.createContext<AlertContextType | undefined>(undefined)

export function useAlert() {
  const context = React.useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}

interface AlertState {
  isOpen: boolean
  type: "alert" | "confirm"
  title?: string
  message: string
  confirmText: string
  cancelText?: string
  variant: "default" | "destructive"
  resolve?: ((value: boolean) => void) | ((value: void) => void)
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AlertState>({
    isOpen: false,
    type: "alert",
    message: "",
    confirmText: "OK",
    variant: "default",
  })

  const alert = React.useCallback((message: string, options: AlertOptions = {}) => {
    return new Promise<void>((resolve) => {
      setState({
        isOpen: true,
        type: "alert",
        title: options.title,
        message,
        confirmText: options.confirmText || "OK",
        variant: options.variant || "default",
        resolve: () => {
          resolve()
        },
      })
    })
  }, [])

  const confirm = React.useCallback((message: string, options: ConfirmOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        type: "confirm",
        title: options.title,
        message,
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        variant: options.variant || "default",
        resolve,
      })
    })
  }, [])

  const handleAction = React.useCallback((confirmed: boolean) => {
    if (state.resolve) {
      state.resolve(confirmed)
    }
    setState((prev) => ({ ...prev, isOpen: false }))
  }, [state.resolve])

  return (
    <AlertContext.Provider value={{ alert, confirm }}>
      {children}
      <AlertDialog open={state.isOpen} onOpenChange={(open) => !open && handleAction(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {state.title && <AlertDialogTitle>{state.title}</AlertDialogTitle>}
            <AlertDialogDescription>{state.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {state.type === "confirm" && state.cancelText && (
              <AlertDialogCancel onClick={() => handleAction(false)}>
                {state.cancelText}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={() => handleAction(true)}
              className={
                state.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {state.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  )
}

