import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum';
import Storage from '@/utils/Storage';
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router';
import { login, logout, getInfo } from '@/api/login';
enum LOGIN_TYPE{
  LOCAL,SSO
}

interface UserState {
  token: string;
  name: string;
  avatar: string;
  organizationid: string;
  roles: Array<API.RoleInfo>,
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[];
  menus: RouteRecordRaw[];
  userInfo: Partial<API.UserInfo>;
  loginType: LOGIN_TYPE;
  // 外部系统，应用于单点模式下，子系统间跳转
  // outerSystems: SSO.SystemInfo[],
  funcs: API.FuncInfo[],
  organization: any
}

export const useUserStore = defineStore('user', {
  state: ():UserState => {
    return {
      token: Storage.get(ACCESS_TOKEN_KEY, null),
      name: 'admin',
      avatar: '',
      organizationid: '',
      perms: [],
      menus: [],
      userInfo: {},
      loginType: LOGIN_TYPE.LOCAL,
      // outerSystems: [],
      funcs: [],
      organization: {},
      roles: []
    }
  },
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getName(): string {
      return this.name;
    },
    getPerms(): string[] {
      return this.perms;
    },
    getOrganizationId(): string {
      return this.organizationid;
    },
    getOrganizationInfo(): API.OrganizationInfo {
      return this.organization;
    },
    getRoles(): Array<API.RoleInfo> {
      return this.roles
    }
  },
  actions: {
    // 清空token及用户信息
    resetToken() {
      this.avatar = this.token = this.name = '';
      this.perms = [];
      this.menus = [];
      this.userInfo = {};
      Storage.clear();
      Storage.removeCookie('token')
    },
    // 登录成功保存token
    setToken(token: string) {
      this.token = token ?? '';
      const ex = 7 * 24 * 60 * 60 * 1000;
      Storage.set(ACCESS_TOKEN_KEY, this.token, ex);
    },
    // 登录
    async login(params: API.LoginParams) {
      try {
        const { data } =  await login(params);
        this.setToken(data.token);
        return this.afterLogin();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 登录成功之后, 获取用户信息以及生成权限路由
    async afterLogin() {
      try {
        const [{ user,funcs, organization, roles }] = await Promise.all([getInfo()]);
        this.name = user.username;
        this.avatar = user.headImg;
        this.organizationid = organization?.id || '';
        this.userInfo = user;
        this.funcs = funcs
        this.organization = organization
        this.roles = roles
        // 生成路由
        // const generatorResult = generateMenu(this.funcs[0]?.children || []); // this.funcs[0].children!
        // this.menus = generatorResult.menus;
      } catch (error) {
        // return this.logout();
      }
    },
    // 登出
    async logout() {
      await logout();
      this.resetToken();
    },
  }
})