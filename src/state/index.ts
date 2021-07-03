import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import farmsReducer from './farms'
import poolsReducer from './pools'
import pricesReducer from './prices'
import bnbpredictionsReducer from './bnbpredictions'
import dogepredictionsReducer from './dogepredictions'
import btcpredictionsReducer from './btcpredictions'
import ethpredictionsReducer from './ethpredictions'
import profileReducer from './profile'
import teamsReducer from './teams'
import achievementsReducer from './achievements'
import blockReducer from './block'
import collectiblesReducer from './collectibles'

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    achievements: achievementsReducer,
    block: blockReducer,
    farms: farmsReducer,
    pools: poolsReducer,
    prices: pricesReducer,
    bnbpredictions: bnbpredictionsReducer,
    dogepredictions: dogepredictionsReducer,
    btcpredictions: btcpredictionsReducer,
    ethpredictions: ethpredictionsReducer,
    profile: profileReducer,
    teams: teamsReducer,
    collectibles: collectiblesReducer,
  },
})

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
