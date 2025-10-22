
type Props = {
  users : User[] ;
}

export const UserList = ( {users} : Props) => {
  return(
    <ul className="list bg-base-100 rounded-box shadow-md">
       <div className="p-4 pb-2 text-xs opacity-60 tracking-wide">Utilisateurs connectés :</div>
      {users.map((user) => 
      <div className="list-row" key={user.id}>
          <div className="w-4">
            <img className="rounded-full" src={user.avatar} alt={user.username} />
          </div>
        <span className="username">{user.username}</span>
      </div>
      )} 
    </ul>
  )
}