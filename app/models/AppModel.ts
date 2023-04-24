import { Instance, types } from "mobx-state-tree"

export const AppModel = types
  .model("AppModel")
  .props({
    loading: types.optional(types.boolean, false),
  })
  .actions((self) => ({
  }))
  .actions((self) => ({
  }))
export type AppType = Instance<typeof AppModel>
