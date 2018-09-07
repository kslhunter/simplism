import {DbContext} from "./DbContext";

export interface IDbContextExecutor {
  connectAsync<D extends DbContext, R>(db: D, fn: (db: D) => Promise<R>, withoutTransaction?: boolean): Promise<R>;

  forceCloseAsync(): Promise<void>;

  executeAsync<C extends { name: string; dataType: string | undefined }[] | undefined>(query: string, colDefs?: C, joinDefs?: { as: string; isSingle: boolean }[]): Promise<undefined extends C ? any[][] : any[]>;
}