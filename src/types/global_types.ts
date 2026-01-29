export interface Memotype {
  board?: MemoStrtype;
  imgs?: MemoImgstype[];
}
export interface MemoStrtype {
  content?: string;
  createdDt?: string;
  updatedDt?: string;
  id?: number;
  title?: string;
  htmlContent?: string;
  jsonContent?: string;
  username?: string;
  userId?: number;
}
export interface MemoImgstype {
  filesize?: number;
  createdDt?: string;
  updatedDt?: string;
  id?: number;
  imgurl?: string;
  minetype?: string;
  originalFilename?: string;
  uniqueFilename?: string;
}

export interface UserInfoType {
  id: number;
  username: string;
  password: string;
  createdDt: string;
  updatedDt: string;
  realName: string;
  profileUrl: string;
  uid: string;
  email: string;
  displayName: string;
  providerId: string;
  metadata: string;
  token: string;
}

export interface BoardType {
  board_id: number;
  user_id: number;
  board_created_dt: string;
  board_updated_dt: string;
  title: string;
  content: string;
  uid: string;
  profile_url: string;
  email: string;
  user_display_name: string;
}
