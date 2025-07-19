import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const createPersistedStore = (storeName, storeFn) => {
  return create(
    persist(storeFn, {
      name: storeName,
    })
  )
}
