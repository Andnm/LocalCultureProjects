import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";
import { GroupType } from "@/src/types/group.type";
import { UserGroupType } from "@/src/types/user-group.type";

export interface GroupState {
  dataGroup: GroupType | null;
  dataListGroup: UserGroupType[];
  groupMember: any;
  loadingGroup: boolean;
  loadingListGroup: boolean;
  error: string;
}

const initialState: GroupState = {
  dataGroup: null,
  dataListGroup: [],
  groupMember: null,
  loadingGroup: false,
  loadingListGroup: false,
  error: "",
};

export const createGroup = createAsyncThunk(
  "group/createGroup",
  async (group_name: string, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const data = {
        group_name: group_name,
      };
      const response = await http.post<any>(`/groups`, data, configHeader);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

// lấy tất cả group mà user đang là member
//có thể dùng cho cả LECTURE
export const getAllGroupAreMembers = createAsyncThunk(
  "group/getAllGroupAreMembers",
  async (_, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.get<any>(`/user-group/users`, configHeader);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

interface InviteMemberParams {
  groupId: number;
  userEmail: string;
}

export const inviteMemberByLeader = createAsyncThunk<any, InviteMemberParams>(
  "group/inviteMemberByLeader",
  async ({ groupId, userEmail }: InviteMemberParams, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.get<any>(
        `/groups/invite-member/${groupId}/${userEmail}`,
        configHeader
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

interface ReplyInviteToJoinGroupParams {
  userGroupId: number;
  relationshipStatus: string;
}

export const replyInviteToJoinGroup = createAsyncThunk(
  "group/replyInviteToJoinGroup",
  async (
    { userGroupId, relationshipStatus }: ReplyInviteToJoinGroupParams,
    thunkAPI
  ) => {
    try {
      const token = getTokenFromSessionStorage();

      // console.log(token)

      const configHeader = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await http.patch<any>(
        `/groups/reply-invite/${userGroupId}/${relationshipStatus}`,
        [],
        configHeader
      );

      return response.data;
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getAllMemberByGroupId = createAsyncThunk<any, number>(
  "group/getAllMemberByGroupId",
  async (id: number, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.get<any>(
        `/user-group/groups/${id}`,
        configHeader
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create group
    builder.addCase(createGroup.pending, (state) => {
      state.loadingGroup = true;
      state.error = "";
    });
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.loadingGroup = false;
      // state.dataGroup = action.payload;
      state.error = "";
    });
    builder.addCase(createGroup.rejected, (state, action) => {
      state.loadingGroup = false;
      state.error = action.payload as string;
    });

    //get all groups that user are currently members
    builder.addCase(getAllGroupAreMembers.pending, (state) => {
      state.loadingListGroup = true;
      state.error = "";
    });
    builder.addCase(getAllGroupAreMembers.fulfilled, (state, action) => {
      state.loadingListGroup = false;
      state.dataListGroup = [action.payload];
      state.error = "";
    });
    builder.addCase(getAllGroupAreMembers.rejected, (state, action) => {
      state.loadingListGroup = false;
      state.error = action.payload as string;
    });

    //get all member by group id
    builder.addCase(getAllMemberByGroupId.pending, (state) => {
      state.loadingGroup = true;
      state.error = "";
    });
    builder.addCase(getAllMemberByGroupId.fulfilled, (state, action) => {
      state.loadingGroup = false;
      state.error = "";
    });
    builder.addCase(getAllMemberByGroupId.rejected, (state, action) => {
      state.loadingGroup = false;
      state.error = action.payload as string;
    });

    //invite member by leader
    builder.addCase(inviteMemberByLeader.pending, (state) => {
      state.loadingListGroup = true;
      state.error = "";
    });
    builder.addCase(inviteMemberByLeader.fulfilled, (state, action) => {
      state.loadingListGroup = false;
      state.error = "";
    });
    builder.addCase(inviteMemberByLeader.rejected, (state, action) => {
      state.loadingListGroup = false;
      state.error = action.payload as string;
    });

    //reply Invite To Join Group
    builder.addCase(replyInviteToJoinGroup.pending, (state) => {
      state.loadingGroup = true;
      state.error = "";
    });
    builder.addCase(replyInviteToJoinGroup.fulfilled, (state, action) => {
      state.loadingGroup = false;
      state.error = "";
    });
    builder.addCase(replyInviteToJoinGroup.rejected, (state, action) => {
      state.loadingGroup = false;
      state.error = action.payload as string;
    });
  },
});

export default groupSlice.reducer;
