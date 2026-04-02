import { useState } from 'react'

import ClickAwayListener from '@mui/material/ClickAwayListener'
import Tooltip from '@mui/material/Tooltip'

import '../styles/CopyCell.css'

interface CopyCellProps {
  value: string;
  style?: object;
}

export default function CopyCell({ value, style }: CopyCellProps) {

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
        placement='top'
        title='copied'
      >
        <td
          className='CopyCell'
          style={style}
          onClick={handleCopy}
        >{value}</td>
      </Tooltip>
    </ClickAwayListener>
  )
}