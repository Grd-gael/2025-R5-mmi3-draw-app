export type UserListProps = {
  users: {
    id: string;
    username: string;
    avatar: string;
  }[] /* Ici je précise explicitement que j'attends non pas un type User, mais un un array d'objets avec une clé id, username & avatar. --> Ca rend mes composants bien plus indépendants & réutilisables */
}

export function UserList({ users }: UserListProps){
  return (
    <div className="flex flex-col gap-3">
      <span className="font-bold">Liste des utilisateurs: <div className="badge badge-soft badge-info">{users.length}</div></span>

      <ul className="list bg-base-100 rounded-box shadow-md">
        {users.length > 0 ? 
          users.map((user) => (
            <li className="list-row items-center" key={user.id}>
              <div className="relative">
                <img className="size-8 rounded-box" src={user.avatar} />
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{user.username.charAt(0).toUpperCase()}</p>
              </div>
              <div>
                <div className="text-xs uppercase font-semibold">{user.username}</div>
              </div>
            </li>
          ))
        :
        <li className="list-row opacity-50">Pas d'utilisateur connecté actuellement.<br /> Rejoignez la partie pour pouvoir dessiner.</li>
      }
      </ul>
    </div>
  )
}