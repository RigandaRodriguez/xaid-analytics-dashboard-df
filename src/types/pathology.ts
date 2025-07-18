
export type PathologyStatus = 'pending' | 'accepted' | 'rejected' | 'corrected';

export interface PathologyState {
  id: string;
  status: PathologyStatus;
  originalText: string;
  editedText: string;
  isEditing: boolean;
  timestamp?: Date;
}

export interface PathologyAction {
  pathologyId: string;
  action: 'accept' | 'reject' | 'edit' | 'save';
  originalText: string;
  newText?: string;
  timestamp: Date;
  userId: string;
}
