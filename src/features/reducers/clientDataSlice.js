
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    clientId: null
}
const clientDataSlice = createSlice({
    name: "clientId",
    initialState,
    reducers: {
        setClientId: (state, action) => {
            const { clientId } = action.payload
            state.clientId = clientId;
        },
        reSetClientId: (state, action) => {
            state.clientId = null;
        }
    }
})
export default clientDataSlice.reducer
export const { setClientId, reSetClientId } = clientDataSlice.actions