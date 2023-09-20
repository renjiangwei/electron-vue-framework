declare namespace API {
  enum LoginType {
    ORG = 'ORG',
    LAB = 'LAB',
    COM = 'COM'
  }
  type LoginParams = {
    username: string,
    password: string,
    type?: LoginType
  }
  type LoginResult = {
    token: string,
    userId: string,
  }

  type ServiceUrlInfo = {
    funcId: string;
    url: string;
    urlDesc: string;
  }

  type Func = {
    serviceId: string,
    parentId: number;
    name: string;
    memo: string;
    state: number;
    type: number;
    urls: ServiceUrlInfo[];
    children: FuncInfo[];
  } & API.BaseEntity;

  type FuncInfo = TreeResult<Func>;

  type OrganizationInfo = {
    name: string,
    id: string
  }

  type RoleInfo = {
    id: string,
    name: string
  }

  type TenantInfo = {

  }

  type UserInfo = {
    name: string,
    username: string,
    password: string,
    psalt: string,
    status: number,
    headImg: string,
    extData1: any,
    extData2: any,
    extData3: any,
  } & API.BaseEntity

  type AuthorizationInfo = {
    user: UserInfo,
    funcs: FuncInfo[],
    organization: OrganizationInfo,
    roles: RoleInfo[],
    tenant: TenantInfo
  }


  /** 获取验证码参数 */
  type CaptchaParams = {
    width?: number;
    height?: number;
  };

  /** 获取验证码结果 */
  type CaptchaResult = {
    code: string,
    imgBase64: string,
    // img: string;
    // id: string;
  };
}