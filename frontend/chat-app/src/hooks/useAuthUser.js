import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';
const useAuthUser = () => {
  const authUser=useQuery({
  queryKey:["authUser"],
    queryFn:getAuthUser,
    retry:false,
  });
  return {
    isLoading:authUser.isLoading && !authUser.isError,
    authUser:authUser.data?.user
  }
}

export default useAuthUser
