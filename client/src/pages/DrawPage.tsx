import { AppHeader } from '../shared/components/AppHeader/AppHeader'
import { DrawLayout } from '../shared/components/layouts/DrawLayout/DrawLayout'

import { Instructions } from '../shared/components/Instructions/Instructions'
import { getInstructions } from '../shared/utils/get-instructions'
import { UserList } from '../features/user/components/UserList'
import { DrawArea } from '../features/drawing/components/DrawArea'
import { useUpdatedUserList } from '../features/user/hooks/useUpdatedUserList'
import { useJoinMyUser } from '../features/user/hooks/useJoinMyUser'


function DrawPage() {
  const { joinMyUser }  = useJoinMyUser();
  const { userList } = useUpdatedUserList();

  //  useEffect(() => {
  //   DrawSocket.get('users').then((data) => {
  //     if (!data) return;
  //     setUserList(data.users);
  //   })
  // }, [setUserList])

  // useEffect(() => {
  //   DrawSocket.listen("myUser:joined", (data) => {
  //     setMyUser(data.user);

  //     console.log("My User joined:success", data);
  //   });
  //   return () => {
  //     DrawSocket.off("myUser:joined");
  //   }
  // }, [setMyUser]);

  // useEffect(() => {
  //   DrawSocket.listen("users:updated", (data) => {
  //     setUserList(data.users)
  //     console.log(data.users)
  //   })
  //   return () => {
  //     DrawSocket.off("users:updated")
  //   }
  // }, [setUserList])


  // useEffect(() => {
  //   DrawSocket.get('strokes').then((data) =>{
  //     if(!data) return;

  //     console.log('Strokes trouvés : ' + data)
  //   })
  // }, [])
  


  return (
    <DrawLayout
      topArea={<AppHeader 
        onClickJoin={() => joinMyUser()}
      />}
      rightArea={
        <>
          {/* <Instructions>
            {getInstructions('user-list')}
          </Instructions> */}
          <UserList users={userList} />
        </>
      }
      bottomArea={
        <>
          <Instructions>
            {getInstructions('toolbar')}
          </Instructions>
        </>
      }
    >
      <DrawArea strokes={""} />
      {/* <TestDrawArea /> */}
      <Instructions className="max-w-xs">
        {getInstructions('draw-area')}
      </Instructions>
    </DrawLayout>
  )
}

export default DrawPage;
