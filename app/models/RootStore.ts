import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AppModel } from "./AppModel";

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  app: types.optional(AppModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
