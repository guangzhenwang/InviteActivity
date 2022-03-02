import { createStore } from 'redux'
export const actions = {
    setPopupType: (data:string|null) => ({ type: 'POPUP_TYPE',data }),
    setPopupData: (data:any) => ({ type: 'POPUP_DATA',data })
}
const initial = { poopupType: null, popupData: false }
const reducer = (state = initial, action: { type: string,data:any }) => {
    switch (action.type) {
        case 'POPUP_TYPE': return { ...state, poopupType: action.data };
        case 'POPUP_DATA': return { ...state, popupData: action.data };
        default: return state;
    }
}


export const store = createStore(reducer);
store.subscribe(()=>{
    console.log('====================================');
    console.log('store更新了',store.getState());
    console.log('====================================');
})

