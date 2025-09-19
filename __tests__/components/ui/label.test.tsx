import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Label } from '@/components/ui/label'

describe('Label Component', () => {
  it('should render label with text', () => {
    render(<Label>Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
  })

  it('should render label with custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>)
    
    const label = screen.getByText('Custom Label')
    expect(label).toHaveClass('custom-label')
  })

  it('should render label with htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Label for Input</Label>)
    
    const label = screen.getByText('Label for Input')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('should render with additional props', () => {
    render(<Label data-testid="custom-label">Custom Label</Label>)
    
    const label = screen.getByTestId('custom-label')
    expect(label).toBeInTheDocument()
  })

  it('should be clickable when htmlFor is provided', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Label htmlFor="test-input">Clickable Label</Label>
        <input id="test-input" type="text" />
      </div>
    )
    
    const label = screen.getByText('Clickable Label')
    const input = screen.getByRole('textbox')
    
    await user.click(label)
    expect(input).toHaveFocus()
  })
})
