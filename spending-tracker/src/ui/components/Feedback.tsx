import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'

interface FeedbackProps {
  open: boolean;
  handleClose: () => void;
  error: boolean;
  message: string;
}

export default function Feedback({ open, handleClose, error, message }: FeedbackProps) {

  const backgroundColor = (error) ? '#ff5d6e' : '#a3de83'

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      transitionDuration={0}
    >
      <SnackbarContent 
        message={message}
        sx={{ backgroundColor: backgroundColor, color: 'black' }}
      />
    </Snackbar>
  )
}
