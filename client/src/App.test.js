import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event'

test('renders home page', () => {
  render(<App />);
  const totalPay = screen.getByText(/Total Pay/i);
  expect(totalPay).toBeInTheDocument();
});

test('should update start time', () => {
  render(<App />);
  const startTimeInput = screen.getByTestId('startTime')
  startTimeInput.value = '17:00'
  expect(startTimeInput.value).toBe('17:00');
});

test('should update end time', () => {
  render(<App />);
  const endTimeInput = screen.getByTestId('endTime')
  endTimeInput.value = '04:00'
  expect(endTimeInput.value).toBe('04:00');
});

test('should update total pay', async () => {
  const user = userEvent.setup()

  render(<App />);
  const startTimeInput = screen.getByTestId('startTime')
  const endTimeInput = screen.getByTestId('endTime')
  const totalPay = screen.getByTestId('totalPay')


  await fireEvent.change(startTimeInput, {target: {value: '17:44'}})
  await fireEvent.change(endTimeInput, {target: {value: '04:00'}})


  await user.click(screen.getByTestId('button'))
  await (screen.findByText('Start Time'))
  expect(startTimeInput.value).toBe('17:44');
  expect(endTimeInput.value).toBe('04:00');
  expect(totalPay.textContent).toBe('Total Pay: $ 140!')
});
// wrapper.find('Button').prop('onClick')() 
