import { useMyUserStore } from "../../store/useMyUserStore";
import { MyUserBadge } from "../MyUserBadge/MyUserBadge";

type Props = {
  onClickJoin: () => void;
};

export function AppHeader({ onClickJoin }: Props) {
  const myUser = useMyUserStore().myUser

  return (
    <div className="join items-center justify-between gap-4 w-full">
      <h1 className="join-item text-5xl font-bold">MMI3 Draw App</h1>
      {myUser ?
      <MyUserBadge id={myUser.id} username={myUser.username} avatar={myUser.avatar} />
        :
        <div className="join-item">
          <button className="btn btn-primary" onClick={onClickJoin}>Join game</button>
        </div>
    }
    </div>
  )
}