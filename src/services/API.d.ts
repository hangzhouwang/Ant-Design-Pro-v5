declare namespace API {
  interface ApiResponse {
    status: 'ok' | 'error';
    message?: string;
    data?: any[];
  }

  export interface LoginStateType extends ApiResponse {
    data: {
      type?: string;
      message?: string;
      authority?: 'guest' | 'admin';
      token?: string;
    };
  }

  export interface SystemInfoType extends ApiResponse {
    data: {
      site_name: string;
      site_title: string;
    };
  }

  export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    id?: string;
    access?: 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
}
