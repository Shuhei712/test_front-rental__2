import axios from 'axios'

export default ({store, $config, redirect, route}, inject) => {

  const memberAxios = axios.create({
    baseURL: $config.MEMBER_API_URL
  })
  inject('memberAxios', memberAxios)

  const memberBaseAxios = axios.create({
    baseURL: $config.MEMBER_API_BASE_URL
  })
  inject('memberBaseAxios', memberBaseAxios)

  const checkToken = async()=>{
    const token = store.getters["auth/getAuthToken"]
    const loginID = store.getters["auth/getUser"]
    const res = await memberAxios.get(`/auth/tokenCheck/${loginID}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(res.data)
    if(res.data.Status==='FALSE'){
      alert('AuthKey Err:' + res.data.ErrorInfo)
      store.dispatch('auth/resetUser')
      location.reload()
    }
    return res
  }
  inject('checkToken', checkToken)

  const getAccessToken = async()=>{
    const token = store.getters["auth/getAuthToken"]
    const loginID = store.getters["auth/getUser"]
    const res = await memberAxios.get(`/auth/getAccessToken/${loginID}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    store.commit('auth/setAccessToken', res.data.AccessToken)
    if ($config.DEBUG_MODE) {
      console.log(res)
    }
    if(res.data.Status==='FALSE'){
      alert('AccessKey Err:' + res.data.ErrorInfo)
      store.dispatch('auth/resetUser')
      location.reload()
    }
    return res
  }
  inject('getAccessToken', getAccessToken)

  const getDisplayInfo = async(num)=>{
    const token = store.getters["auth/getAccessToken"]
    const loginID = store.getters["auth/getUser"]
    const param = new URLSearchParams()
    param.append('LoginID', loginID)
    param.append('DisplayKey', num)
    const res = await memberBaseAxios.post(`comm/getDispSelectData`,param,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(res)
    if(res.data.Status==='TRUE'){
      return res.data.DispSelectItemList[0].ItemChoicesList
    }else if(res.data.ErrorNo===100002){
      // access認証token有効期限切れ
      const res = await getAccessToken()
      getDisplayInfo(num)
      alert('again')
    }else {
      // 認証tokenの有効期限切れ
      alert('go login')
      store.dispatch('auth/resetUser')
      redirect('/login');
    }
  }
  inject('getDisplayInfo', getDisplayInfo)

  const getLoginInfo = async()=>{
    const token = store.getters["auth/getAccessToken"]
    const loginID = store.getters["auth/getUser"]
    const res = await memberAxios.get(`auth/loginInfo/${loginID}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(res)
    if(res.data.Status==='TRUE'){
      return res.data.AccountInfo
    }else if(res.data.ErrorNo===100002){
      // access認証token有効期限切れ
      const res = await getAccessToken()
      getLoginInfo()
      alert('again')
    }else {
      // 認証tokenの有効期限切れ
      store.dispatch('auth/resetUser')
      redirect('/login')
    }
  }
  inject('getLoginInfo', getLoginInfo)

  const getUserInfo = async ()=>{
    const accessToken = store.getters["auth/getAccessToken"]
    const loginID = store.getters["auth/getUser"]
    const res = await memberAxios.get(`member/${loginID}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if ($config.DEBUG_MODE) {
      console.log(res)
    }
    if(res.data.Status==='TRUE'){
      return res.data.MemberInfo
    }else if(res.data.ErrorNo===100002){
      // access認証token有効期限切れ
      const res = await getAccessToken()
      getUserInfo()
    }else {
      // 認証tokenの有効期限切れ
      store.dispatch('auth/resetUser')
      redirect('/login')
    }
  }
  inject('getUserInfo', getUserInfo)

  const setLog = async(display, action, info)=>{
    const token = store.getters["auth/getAccessToken"]
    const loginID = store.getters["auth/getUser"]
    const param = new URLSearchParams()
    param.append('LoginID', loginID)
    param.append('DisplayName', display)
    param.append('ActionName', action)
    param.append('ActionParam', route.path)
    param.append('ActionInfo', info)
    param.append('ActionMemo', '')

    const res = await memberBaseAxios.post(`log/setOperateLog`, param,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(res)
    if(res.data.Status==='TRUE'){
      return true
    }else if(res.data.ErrorNo===100002){
      // access認証token有効期限切れ
      const res = await getAccessToken()
      setLog(display, action, info)
      alert('again')
    }
  }
  inject('setLog', setLog)

}
