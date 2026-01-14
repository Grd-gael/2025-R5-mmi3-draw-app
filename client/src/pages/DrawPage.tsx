import { AppHeader } from '../shared/components/AppHeader/AppHeader'
import { DrawLayout } from '../shared/components/layouts/DrawLayout/DrawLayout'

// import { Instructions } from '../shared/components/Instructions/Instructions'
// import { getInstructions } from '../shared/utils/get-instructions'
import { UserList } from '../features/user/components/UserList'
import { DrawArea } from '../features/drawing/components/DrawArea'
import { DrawToolbar } from '../features/drawing/components/DrawToolbar'
import { useUpdatedUserList } from '../features/user/hooks/useUpdatedUserList'
import { useJoinMyUser } from '../features/user/hooks/useJoinMyUser'
import { useState } from 'react'



function DrawPage() {
  const { joinMyUser }  = useJoinMyUser();
  const [color, setColor] = useState('black');
  const [width, setWidth] = useState(2);
  const { userList } = useUpdatedUserList();

  return (
    <DrawLayout
      topArea={<AppHeader 
        onClickJoin={() => joinMyUser()}
      />}
      rightArea={
        <>
      
          <UserList users={userList} />
        </>
      }
      bottomArea={
        <>
          {/* <Instructions>
            {getInstructions('toolbar')}
          </Instructions> */}
          <DrawToolbar setColor={setColor} color={color} setWidth={setWidth} width={width} />
        </>
      }
    >
      <DrawArea strokes={""} color={color} width={width} />
      
    </DrawLayout>
  )
}

export default DrawPage;
