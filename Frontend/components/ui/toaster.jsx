import { ToastProvider, ToastViewport } from "@/components/ui/toast"

const Toaster = () => {
  return (
    <ToastProvider>
      <ToastViewport className="[--viewport-margin:0] fixed top-0 left-1/2 -translate-x-1/2 flex h-full w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}

export default Toaster
