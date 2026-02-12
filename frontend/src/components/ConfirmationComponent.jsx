import React from 'react'
import { useState } from 'react';
import { confirmable, ContextAwareConfirmation,  ConfirmDialogProps } from 'react-confirm';
function ConfirmationComponent() {
  const [showTaskDialogue,setshowTaskDialogue] = useState(false);
  return (
    <div>
      <button>Yes</button>
      <button>No</button>
    </div>
  )
}

export default ConfirmationComponent
