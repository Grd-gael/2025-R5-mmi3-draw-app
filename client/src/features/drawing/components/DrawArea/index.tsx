import { useCallback, useRef, useMemo, useEffect, type MouseEventHandler } from "react"
import style from "./DrawArea.module.css"
import { getCoordinatesRelativeToElement } from "../../utils/getCanvasCoordinates";
import { useMyUserStore } from "../../../user/store/useMyUserStore";
import { SocketManager } from "../../../../shared/services/SocketManager";



type Props = {
  strokes : string,
}


export const DrawArea = ({strokes}:Props) => {

  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  /** Pour récupérer les coordonnées d'un event en prenant en compte le placement de notre canvas */
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    return getCoordinatesRelativeToElement(e.clientX, e.clientY, canvasRef.current);
  } 
  const { myUser } = useMyUserStore();
  const canUserDraw = useMemo(() => myUser !== null, [myUser]); 
  


  const onMouseDown : MouseEventHandler<HTMLCanvasElement> = useCallback((e) =>{
    if (!canvasRef.current) return;
    if (!canUserDraw) return; 
    console.log(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop)
    const contexte = canvasRef.current.getContext("2d");
    if (!contexte) return;

    const coordinates = getCanvasCoordinates(e);
    SocketManager.emit('client:draw:start', { 
      x: coordinates.x,
      y: coordinates.y,
      strokeWidth: 2,
      color: 'black'
    });

    contexte.beginPath();
    contexte.moveTo(coordinates.x, coordinates.y);
    contexte.lineTo(coordinates.x + 0.4, coordinates.y + 0.4);
    contexte.stroke();

    const onMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      if (!contexte) return;


      const coordinates = getCanvasCoordinates(e as unknown as React.MouseEvent<HTMLCanvasElement>);
        contexte.lineTo(coordinates.x, coordinates.y);
        contexte.stroke();
      };
    canvasRef.current.addEventListener("mousemove", onMouseMove);


    const onMouseUp = () => {
      if (!canvasRef.current) return;
      canvasRef.current.removeEventListener("mousemove", onMouseMove);
      canvasRef.current.removeEventListener("mouseup", onMouseUp);
    };

    canvasRef.current.addEventListener("mouseup", onMouseUp);
    canvasRef.current.addEventListener('mouseleave', onMouseUp)
  }, [canUserDraw])

  
  
    const setCanvasDimensions = useCallback(() => {
      if (!canvasRef.current || !parentRef.current) return;
  
      /** On va utiliser le ratio de pixel de l'écran pour avoir un rendu net  (DPR = 3|2|1) et par défaut on sera toujours à 1 */
      const dpr = window.devicePixelRatio || 1;
  
      /** On définit la taille réelle interne du canvas en se basant sur les DPR  */
      const parentWidth = parentRef.current?.clientWidth;
      const canvasWidth = parentWidth; /** On veut remplir 100% de la largeur de l'élément parent */
      const canvasHeight = Math.round(parentWidth * 9 / 16); /** On veut un ratio 16/9 par rapport à la largeur */
  
      canvasRef.current.width = dpr * canvasWidth; /** On multiplie la largeur souhaitée par le nb de dpr */
      canvasRef.current.height = dpr * canvasHeight; /** On multiplie la hauteur souhaitée par le nb de dpr */
  
      /**  On définit ensuite la taille en CSS, visible par l'utilisateur  */
      
      parentRef.current.style.setProperty('--canvas-width', `${canvasWidth}px`);
      parentRef.current.style.setProperty('--canvas-height', `${canvasHeight}px`);
  
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        /** On scale en prenant compte les dpr */
        ctx.scale(dpr, dpr); 
      }
    }, []);
  
    /**
     * ===================
     * GESTION DU RESIZE
     * ===================
    */
  
  
    useEffect(() => {
      /**
       * On souhaite redimensionner le canvas et recharger les strokes au resize
       */
      const resizeObserver = new ResizeObserver(() => {
        setCanvasDimensions();
      });
      
      /** On observe les changements de taille sur l'élément parent */
      if (parentRef.current) {
        resizeObserver.observe(parentRef.current);
      }
  
      /** 
       * Rappel : Il s'agit d'une fonction de cleanup (dans le useEffect le cleanup est optionnel). A chaque fois qu'un re-rendu est effectué, le cleanup est d'abord effectué avant de re ré-effectuer le useEffect classique. Elle est également appelée lorsque le component est removed du DOM. 
       */
      return () => {
        /** On veut disconnect pour éviter d'avoir plusieurs resizeObservers ou d'avoir un resizeObserver sur un élément qui n'existe plus  */
        resizeObserver.disconnect();
      };
  
    }, [setCanvasDimensions]);

  return(
    <div ref={parentRef} className={style.drawArea}>
      <canvas ref={canvasRef} className={`${style.drawArea__canvas} border-1`} width={"800"} height={"400"} onMouseDown={onMouseDown}/>
    </div>
  )
}