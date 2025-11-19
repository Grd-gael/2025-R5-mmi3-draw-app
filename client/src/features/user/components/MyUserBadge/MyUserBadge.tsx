import type { User } from "../../../../shared/types/user.type";

export const MyUserBadge = (myUser: User) => {
  return (
    <div className="my-user-badge badge badge-lg badge-primary badge-soft">
      <div className="avatar">
        <div className="w-4 rounded-full">
          <img src={myUser.avatar} alt={myUser.username} />
        </div>
      </div>
      <span className="username">{myUser.username}</span>
    </div>
  );
}