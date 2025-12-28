import { useQuery } from "@tanstack/react-query";
import {fetchBatchedUserInfo} from '../api';
import QueryKeys from "@/lib/app/QueryKeys";

export const useFetchUserInfos = (userIds: string[])=>{

  return useQuery({
    queryKey: [QueryKeys.userInfos],
    queryFn: () =>  fetchBatchedUserInfo(userIds),
    enabled: userIds.length > 0,
  });
}