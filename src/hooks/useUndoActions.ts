
import { useState } from 'react';

interface UndoAction {
  isVisible: boolean;
  message: string;
  action: () => void;
}

export const useUndoActions = () => {
  const [undoAction, setUndoAction] = useState<UndoAction>({
    isVisible: false,
    message: '',
    action: () => {}
  });

  const showUndoPanel = (message: string, undoAction: () => void) => {
    setUndoAction({
      isVisible: true,
      message,
      action: undoAction
    });
  };

  const handleUndo = () => {
    undoAction.action();
    setUndoAction({ ...undoAction, isVisible: false });
  };

  const handleDismiss = () => {
    setUndoAction({ ...undoAction, isVisible: false });
  };

  return {
    undoAction,
    showUndoPanel,
    handleUndo,
    handleDismiss
  };
};
