
export interface ActionButtonsProps {
  shareKey: string;
  setShareKey: (value: string) => void;
  addSharedQuiz: (shareKey: string) => void;
  loading: boolean;
}