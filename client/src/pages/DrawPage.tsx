import { AppHeader } from '../shared/components/AppHeader/AppHeader'
import { DrawLayout } from '../shared/components/layouts/DrawLayout/DrawLayout'

// import { Instructions } from '../shared/components/Instructions/Instructions'
// import { getInstructions } from '../shared/utils/get-instructions'
import { UserList } from '../features/user/components/UserList'
import { DrawArea } from '../features/drawing/components/DrawArea'
import { DrawToolbar } from '../features/drawing/components/DrawToolbar'
import { useUpdatedUserList } from '../features/user/hooks/useUpdatedUserList'
import { useJoinMyUser } from '../features/user/hooks/useJoinMyUser'
import { useCallback, useState } from 'react'



function DrawPage() {
  const { joinMyUser }  = useJoinMyUser();
  const [color, setColor] = useState('black');
  const [width, setWidth] = useState(2);
  const [canva, setCanva] = useState<HTMLCanvasElement | null>(null);
  const { userList } = useUpdatedUserList();

  const download = useCallback(() => {
    if (!canva) {
      return;
    }
      let url = canva.toDataURL("image/png");
      let link = document.createElement('a');
      link.download = 'toile.png';
      link.href = url;
      link.click();
    }, [canva]);

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
          <DrawToolbar setColor={setColor} color={color} setWidth={setWidth} width={width} downloadPNG={() => download()} />
        </>
      }
    >
      <DrawArea strokes={""} color={color} width={width} setCanva={setCanva} />
      
    </DrawLayout>
  )
}

export default DrawPage;
