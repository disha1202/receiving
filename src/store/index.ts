import { createStore, useStore as useVuexStore } from "vuex"
import mutations  from './mutations'
import getters  from './getters'
import actions from './actions'
import RootState from './RootState'
import createPersistedState from "vuex-persistedstate";
import userModule from './modules/user';
import shipmentModule from "./modules/shipment"
import productModule from "./modules/product";
import SecureLS from "secure-ls";


const ls = new SecureLS({ encodingType: 'aes' , isCompression: true , encryptionSecret: process.env.VUE_APP_SECURITY_KEY});


// TODO check how to register it from the components only
// Handle same module registering multiple time on page refresh
//store.registerModule('user', userModule);


const state: any = {

}

const persistState = createPersistedState({
    paths: ['user'],
    fetchBeforeUse: true,
    storage: {
      getItem: key => {
        try {
          return ls.get(key)
        } 
        catch(err) {
          ls.remove(key)
            return ls.get(key)
        }
      },       
      setItem: (key, value) => ls.set(key, value),
      removeItem: key => ls.remove(key)
    }
})

// Added modules here so that hydration takes place before routing
const store = createStore<RootState>({
    state,
    actions,
    mutations,
    getters,
    plugins: [ persistState ],
    modules: { 
        'user': userModule,
        'product': productModule,
        'shipment': shipmentModule
    },
})

export default store
export function useStore(): typeof store {
    return useVuexStore()
}