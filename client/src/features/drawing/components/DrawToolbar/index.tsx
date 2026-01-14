import {useMemo } from "react"

import { useMyUserStore } from "../../../user/store/useMyUserStore";


type DrawToolbarProps = {
  setColor: (color: string) => void;
  color: string;
  setWidth: (width: number) => void;
  width: number;
  downloadPNG : () => void;
}


export function DrawToolbar({ setColor, color, setWidth, width, downloadPNG } : DrawToolbarProps) {

   const { myUser } = useMyUserStore();
    const canUserDraw = useMemo(() => myUser !== null, [myUser]); 

    if (!canUserDraw) {
      return null;
    }

  return (
    <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box gap-3 w-full p-3">
      <div className="label">Couleur :</div>
      <li><button className={`badge badge-xl ${color === 'black' ? 'badge-primary border-3' : ''}`} style={{backgroundColor : "black"}} onClick={ () => { setColor('black'); } }></button></li>
      <li><button className={`badge badge-xl ${color === 'green' ? 'badge-primary border-3' : ''}`} style={{backgroundColor : "green"}} onClick={ () => { setColor('green'); } }></button></li>
      <li><button className={`badge badge-xl ${color === 'red' ? 'badge-primary border-3' : ''}`} style={{backgroundColor : "red"}} onClick={ () => { setColor('red');} }></button></li>
      <li><button className={`badge badge-xl ${color === 'blue' ? 'badge-primary border-3' : ''}`} style={{backgroundColor : "blue"}} onClick={ () => { setColor('blue'); } }></button></li>
      <li><button className={`badge badge-xl ${color === 'orange' ? 'badge-primary border-3' : ''}`} style={{backgroundColor : "orange"}} onClick={ () => { setColor('orange'); } }></button></li>
      <li><button className={`badge badge-xl ${color === 'pink' ? 'badge-primary border-3' : ''}`} style={{backgroundColor : "pink"}} onClick={ () => { setColor('pink'); } }></button></li>
      <li><button className={`badge badge-xl ${color === 'cyan' ? 'badge-primary border-3' : ''}`} style={{backgroundColor : "cyan"}} onClick={ () => { setColor('cyan'); } }></button></li>
      <div className="divider divider-horizontal"></div>
      <div className="label">Epaisseur :</div>
      <input type="range" min="1" max="5" step="1" className="range" onChange={(e) => setWidth(Number(e.target.value))} value={width} />
      <div className="divider divider-horizontal"></div>
      <button onClick={downloadPNG} className="btn btn-primary">Télécharger</button>
    </ul>
  )
}