import { useEffect } from 'react'
import { AppHeader } from '../components/AppHeader/AppHeader'
import { DrawLayout } from '../components/DrawLayout/DrawLayout'
import { DrawSocket } from '../DrawSocket'
import { useMyUserStore } from '../store/useMyUserStore'
import {useUserListStore} from '../store/useUserListStore'
import { createMyUser } from '../utils/create-my-user'
import { Instructions } from '../components/Instructions/Instructions'
import { getInstructions } from '../utils/get-instructions'
import { UserList } from '../components/UserList/UserList'
import { DrawArea } from '../components/DrawArea/DrawArea'

function DrawPage() {
  const setMyUser = useMyUserStore((state) => state.setMyUser)
  const setUserList = useUserListStore((state) => state.setUserList)

  const userList = useUserListStore((state) => state.userList)

  const onClickJoin = () => {
    DrawSocket.emit("myUser:join", createMyUser() );
  }

   useEffect(() => {
    DrawSocket.get('users').then((data) => {
      if (!data) return;
      setUserList(data.users);
    })
  }, [setUserList])

  useEffect(() => {
    DrawSocket.listen("myUser:joined", (data) => {
      setMyUser(data.user);

      console.log("My User joined:success", data);
    });
    return () => {
      DrawSocket.off("myUser:joined");
    }
  }, [setMyUser]);

  useEffect(() => {
    DrawSocket.listen("users:updated", (data) => {
      setUserList(data.users)
      console.log(data.users)
    })
    return () => {
      DrawSocket.off("users:updated")
    }
  }, [setUserList])


  useEffect(() => {
    DrawSocket.get('strokes').then((data) =>{
      if(!data) return;

      console.log('Strokes trouvés : ' + data)
    })
  }, [])
  


  return (
    <DrawLayout
      topArea={<AppHeader 
        onClickJoin={onClickJoin}
        
      />}
      rightArea={
        <>
          <UserList users={userList}/>
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
    </DrawLayout>
  )
}

export default DrawPage;
