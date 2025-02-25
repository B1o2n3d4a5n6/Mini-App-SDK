export interface MdkProps {
  appid: string;
  onSuccess: () => void;
  onFailure: () => void;
  children: (props: { open: () => void }) => React.ReactNode;
}
