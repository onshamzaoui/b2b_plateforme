import { renderHook, act } from '@testing-library/react'
import { useToast, toast, reducer } from '@/hooks/use-toast'

// Mock the toast component
jest.mock('@/components/ui/toast', () => ({
  Toast: () => null,
  ToastAction: () => null,
}))

describe('useToast Hook', () => {
  beforeEach(() => {
    // Reset the global state
    jest.clearAllMocks()
  })

  describe('reducer', () => {
    const initialState = { toasts: [] }

    it('should add a toast', () => {
      const action = {
        type: 'ADD_TOAST' as const,
        toast: {
          id: '1',
          title: 'Test Toast',
          description: 'Test Description',
          open: true,
        }
      }

      const newState = reducer(initialState, action)

      expect(newState.toasts).toHaveLength(1)
      expect(newState.toasts[0]).toEqual(action.toast)
    })

    it('should update a toast', () => {
      const initialState = {
        toasts: [{
          id: '1',
          title: 'Original Title',
          description: 'Original Description',
          open: true,
        }]
      }

      const action = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: '1',
          title: 'Updated Title',
        }
      }

      const newState = reducer(initialState, action)

      expect(newState.toasts[0].title).toBe('Updated Title')
      expect(newState.toasts[0].description).toBe('Original Description')
    })

    it('should dismiss a specific toast', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Toast 1',
            open: true,
          },
          {
            id: '2',
            title: 'Toast 2',
            open: true,
          }
        ]
      }

      const action = {
        type: 'DISMISS_TOAST' as const,
        toastId: '1',
      }

      const newState = reducer(initialState, action)

      expect(newState.toasts[0].open).toBe(false)
      expect(newState.toasts[1].open).toBe(true)
    })

    it('should dismiss all toasts when no toastId provided', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Toast 1',
            open: true,
          },
          {
            id: '2',
            title: 'Toast 2',
            open: true,
          }
        ]
      }

      const action = {
        type: 'DISMISS_TOAST' as const,
      }

      const newState = reducer(initialState, action)

      expect(newState.toasts[0].open).toBe(false)
      expect(newState.toasts[1].open).toBe(false)
    })

    it('should remove a specific toast', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Toast 1',
            open: true,
          },
          {
            id: '2',
            title: 'Toast 2',
            open: true,
          }
        ]
      }

      const action = {
        type: 'REMOVE_TOAST' as const,
        toastId: '1',
      }

      const newState = reducer(initialState, action)

      expect(newState.toasts).toHaveLength(1)
      expect(newState.toasts[0].id).toBe('2')
    })

    it('should remove all toasts when no toastId provided', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Toast 1',
            open: true,
          },
          {
            id: '2',
            title: 'Toast 2',
            open: true,
          }
        ]
      }

      const action = {
        type: 'REMOVE_TOAST' as const,
      }

      const newState = reducer(initialState, action)

      expect(newState.toasts).toHaveLength(0)
    })
  })

  describe('useToast hook', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useToast())

      expect(result.current.toasts).toEqual([])
      expect(typeof result.current.toast).toBe('function')
      expect(typeof result.current.dismiss).toBe('function')
    })

    it('should add a toast', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({
          title: 'Test Toast',
          description: 'Test Description',
        })
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0].title).toBe('Test Toast')
      expect(result.current.toasts[0].description).toBe('Test Description')
      expect(result.current.toasts[0].open).toBe(true)
    })

    it('should dismiss a toast', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({
          title: 'Test Toast',
        })
      })

      const toastId = result.current.toasts[0].id

      act(() => {
        result.current.dismiss(toastId)
      })

      expect(result.current.toasts[0].open).toBe(false)
    })

    it('should dismiss all toasts', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
        result.current.toast({ title: 'Toast 2' })
      })

      // Due to TOAST_LIMIT = 1, only one toast should be present
      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        result.current.dismiss()
      })

      expect(result.current.toasts[0].open).toBe(false)
    })
  })

  describe('toast function', () => {
    it('should return toast object with id, dismiss, and update functions', () => {
      const toastResult = toast({
        title: 'Test Toast',
        description: 'Test Description',
      })

      expect(toastResult).toHaveProperty('id')
      expect(toastResult).toHaveProperty('dismiss')
      expect(toastResult).toHaveProperty('update')
      expect(typeof toastResult.dismiss).toBe('function')
      expect(typeof toastResult.update).toBe('function')
    })

    it('should allow updating a toast', () => {
      const { result } = renderHook(() => useToast())

      let toastResult: any

      act(() => {
        toastResult = toast({
          title: 'Original Title',
        })
      })

      act(() => {
        toastResult.update({
          title: 'Updated Title',
          description: 'New Description',
        })
      })

      const updatedToast = result.current.toasts.find(t => t.id === toastResult.id)
      expect(updatedToast?.title).toBe('Updated Title')
      expect(updatedToast?.description).toBe('New Description')
    })

    it('should dismiss toast when onOpenChange is called with false', () => {
      const { result } = renderHook(() => useToast())

      let toastResult: any

      act(() => {
        toastResult = toast({
          title: 'Test Toast',
        })
      })

      const toastData = result.current.toasts.find(t => t.id === toastResult.id)
      
      act(() => {
        toastData?.onOpenChange?.(false)
      })

      const dismissedToast = result.current.toasts.find(t => t.id === toastResult.id)
      expect(dismissedToast?.open).toBe(false)
    })
  })
})
