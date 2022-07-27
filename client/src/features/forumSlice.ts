import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Forum {
    forum: {
        forumId: string,
        nickname?: string,
        profileImagePath?: string,
        attachImageNames?: string[],
        titleText: string,
        mainText: string,
        viewCount: number,
        createdAt: string,
        heartCount: number,
        heartFill: boolean
    }[]
}

export const forumSlice = createSlice({
    name: 'forum',
    initialState: {
        forum: []
    } as Forum,
    reducers: {
        FORUM_POST: (state, action: PayloadAction<Forum['forum']>) => {
            return {
                ...state,
                forum: action.payload,
            }
        },
        /*
        FORUM_UPDATE: (state, action: PayloadAction<{ 
            forumId: string,
            attachImageNames: string[],
            titleText: string,
            mainText: string,
         }>) => {
            const newForums = state.forum;
            const findIndex = state.forum.findIndex(el => el.forumId == action.payload.forumId);

            if(findIndex !== -1) {
                newForums[findIndex] = {
                    ...newForums[findIndex], 
                    attachImageNames: action.payload.attachImageNames, 
                    titleText: action.payload.titleText,
                    mainText: action.payload.mainText
                };
            }

            return {
                ...state,
                forum: newForums,
            }
        },
        */
        FORUM_DELETE: (state, action: PayloadAction<{ forumId: string }>) => {
            const newForums = state.forum.filter(forum => forum.forumId !== action.payload.forumId);
            return {
                ...state,
                forum: newForums,
            }
        },
        
    }
})

export const { FORUM_POST, FORUM_DELETE } = forumSlice.actions;

export default forumSlice.reducer;