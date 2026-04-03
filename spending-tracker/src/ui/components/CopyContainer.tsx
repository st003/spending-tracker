import { useState } from 'react'

import ClickAwayListener from '@mui/material/ClickAwayListener'
import Tooltip, { type TooltipProps } from '@mui/material/Tooltip'

import '../styles/CopyContainer.css'

interface CopyContainerProps {
  value: string;
  toolTipPlacement?: TooltipProps['placement'];
}

export default function CopyContainer({ value, toolTipPlacement = 'top' }: CopyContainerProps): React.JSX.Element {

  const [toolTipOpen, setToolTipOpen] = useState(false)

  const handleCopy = async () => {
    setToolTipOpen(true)
    await navigator.clipboard.writeText(value)
  }

  const handleToolTipClose = () => {
    setToolTipOpen(false)
  }

  return (
    <ClickAwayListener onClickAway={handleToolTipClose}>
      <Tooltip
        arrow
        disableFocusListener
        disableHoverListener
        disableTouchListener
        open={toolTipOpen}
        placement={toolTipPlacement}
        title='copied'
      >
        <span className='CopyContainer' onClick={handleCopy}>{value}</span>
      </Tooltip>
    </ClickAwayListener>
  )
}