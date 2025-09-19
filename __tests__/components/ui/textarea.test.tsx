import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea Component', () => {
  it('should render textarea with default props', () => {
    render(<Textarea />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('flex', 'min-h-[80px]', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-background', 'px-3', 'py-2', 'text-base', 'ring-offset-background', 'placeholder:text-muted-foreground', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:cursor-not-allowed', 'disabled:opacity-50', 'md:text-sm')
  })

  it('should render textarea with custom className', () => {
    render(<Textarea className="custom-textarea" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('custom-textarea')
  })

  it('should render textarea with placeholder', () => {
    render(<Textarea placeholder="Enter your message" />)
    
    const textarea = screen.getByPlaceholderText('Enter your message')
    expect(textarea).toBeInTheDocument()
  })

  it('should handle user input', async () => {
    const user = userEvent.setup()
    render(<Textarea />)
    
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Hello World')
    
    expect(textarea).toHaveValue('Hello World')
  })

  it('should render disabled textarea', () => {
    render(<Textarea disabled />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('should forward ref correctly', () => {
    const ref = { current: null }
    render(<Textarea ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('should pass through additional props', () => {
    render(<Textarea data-testid="custom-textarea" rows={5} />)
    
    const textarea = screen.getByTestId('custom-textarea')
    expect(textarea).toHaveAttribute('rows', '5')
  })

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup()
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    
    render(<Textarea onFocus={onFocus} onBlur={onBlur} />)
    
    const textarea = screen.getByRole('textbox')
    
    await user.click(textarea)
    expect(onFocus).toHaveBeenCalled()
    
    await user.tab()
    expect(onBlur).toHaveBeenCalled()
  })
})
