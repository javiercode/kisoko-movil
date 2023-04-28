import { createSlice } from '@reduxjs/toolkit';
import { AuthAction } from '../../utils/interfaces/ILoginStore';
import { IAddAction, IClearAction, IGaleriaReducer, IGaleriaStore } from '../../utils/interfaces/IMovimientoStore';

let initialState: IGaleriaReducer[] = [];

export const loginSlice = createSlice({
  name: 'movimiento',
  initialState,
  reducers: {
    addMovReducer: (state = initialState, action: IAddAction) => {
      const oTarea = state.filter(element => element.idTarea == action.payload.idTarea)
      let aMov = state;

      if (oTarea.length != 0) {
        aMov = aMov.map(element => {
          if (element.idTarea === action.payload.idTarea) {
            element.galeriaList.push(action.payload.galeriaList)
          }
          return element;
        });
      } else {
        const galeriaReduce:IGaleriaReducer={
          idTarea:action.payload.idTarea,
          galeriaList:[action.payload.galeriaList]
        }
        aMov.push(galeriaReduce)
      }
      console.log("aMov", aMov)
      // state = aMov;
      return state;
    },
    resetMovReducer: (state = initialState, action: IClearAction) => {
      state = state.filter(element => element.idTarea !== action.payload)
      return state;
    },
    clearAllReducer: (state: any) => {
      state = initialState;
      return state;
    },
  },
})


export const { addMovReducer, resetMovReducer, clearAllReducer } = loginSlice.actions;
export default loginSlice.reducer;