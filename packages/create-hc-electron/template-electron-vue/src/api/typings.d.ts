declare namespace API {
  /** 全局通过表格查询返回结果 */
  type TableListResult<T = any> =
    T[] | // 列表
    { // 分页
      data: T[];
      pageIndex: number;
      pageSize: number;
      total: number;
    };

  /** 全局通用表格分页返回数据结构 */
  type PaginationResult = {
    pageIndex: number;
    pageSize: number;
    total: number;
  };

  /** 后端基础实体类 */
  type BaseEntity = {
    id: string;
    modifierId : string;
    modifyTime : Date;
    creatorId : string;
    createTime : Date;
  }

  /** 全局通用树形返回树形结构*/
  type TreeResult<T = any> = {
    id:  int | string;
    parentId: int | string;
    path: string;
    sortIndex: number;
    level: number;
  } & {
    [P in keyof T]?: T[P];
  };

  /** 全局通用表格分页请求参数 */
  type PageParams<T = any> = {
    pageSize?: number;
    pageNum?: number;
    startSize?: number;
  } & {
    [P in keyof T]?: T[P];
  };

  type PageResult<T = any> = {
    pageIndex:number;
    pageSize:number;
    total:number;
    data: T[]
  }

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };


}
