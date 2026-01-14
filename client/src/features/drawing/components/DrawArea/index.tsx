import { useCallback, useRef, useMemo, useEffect, type MouseEventHandler } from "react"
import style from "./DrawArea.module.css"
import { getCoordinatesRelativeToElement } from "../../utils/getCanvasCoordinates";
import { useMyUserStore } from "../../../user/store/useMyUserStore";
import { SocketManager } from "../../../../shared/services/SocketManager";
import type { DrawStroke, Point } from "../../../../shared/types/drawing.type";



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
  
  
  const drawLine  = useCallback((
    from: { x: number, y: number } | null, 
    to: { x: number, y: number } 
  ) => {
    if (!canvasRef.current) {
      return;
    }
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }
    
    
    if (from){
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
    }
    
    ctx.lineWidth = 2;
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    
    
  }, []);


  const relativeCoordinates = ( coordinates :{x: number, y: number}) => {
    if (!canvasRef.current) return {x: 0, y:0};

    return {
      x : coordinates.x / canvasRef.current.width, 
      y: coordinates.y / canvasRef.current.height};
  }
  
  const onMouseDown : MouseEventHandler<HTMLCanvasElement> = useCallback((e) =>{
    
    if (!canvasRef.current) {
      return;
    }
    
    if (!canUserDraw) return; 
    
    
    const coordinates = getCanvasCoordinates(e);
    
    
    drawLine(coordinates, {x: coordinates.x + 0.4, y: coordinates.y + 0.4});
    
    const relativeCoord = relativeCoordinates(coordinates);
    
    SocketManager.emit('draw:start', { 
      x: relativeCoord.x,
      y: relativeCoord.y,
      strokeWidth: 2,
      color: 'black'
    });

    
    const onMouseMove = (e: MouseEvent) => {
      
      const coordinates = getCanvasCoordinates(e as unknown as React.MouseEvent<HTMLCanvasElement>);
      drawLine(null, coordinates)


      const relativeCoord = relativeCoordinates(coordinates);
      
      SocketManager.emit('draw:move', { 
        x: relativeCoord.x,
        y: relativeCoord.y
      });
    };
    
    
    canvasRef.current.addEventListener("mousemove", onMouseMove);
    
    
    const onMouseUp = () => {
      if (!canvasRef.current) return;

      SocketManager.emit('draw:end');
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

  const absoluteCoordinates = ( relativeCoordinates :{x: number, y: number}) => {
    if (!canvasRef.current) return {x: 0, y:0};

    return {
      x : relativeCoordinates.x * canvasRef.current.width, 
      y: relativeCoordinates.y * canvasRef.current.height};
  }


  const drawOtherUserPoints = useCallback((socketId: string, points : Point[]) => {

    const previousPoints = otherUsersStrokes.current.get(socketId) || [];

    points.forEach((point, pointIndex) => {
      if (previousPoints[pointIndex]){
        return; /* On ne redessine pas les points déjà dessinés */
      }

        const absolutePoint = absoluteCoordinates(point);

        if (pointIndex === 0) {
          drawLine(absolutePoint, absolutePoint);
        }
        else{
          drawLine(absoluteCoordinates(points[pointIndex - 1]), absolutePoint);
        }
        
      });
  }, []);

  const onOtherUserMove = useCallback((payload: DrawStroke) => {
    drawOtherUserPoints(payload.socketId, payload.points);
  }, [drawOtherUserPoints]);


  const onOtherUserStart = useCallback((payload: DrawStroke) => {
    drawOtherUserPoints(payload.socketId, payload.points);
    otherUsersStrokes.current.set(payload.socketId, payload.points);
  }, []);


  const onOtherUserEnd = useCallback((payload: DrawStroke) => {
    otherUsersStrokes.current.delete(payload.socketId);
  }, []);
  
  const otherUsersStrokes = useRef<Map<string, Point[]>>(new Map());      

  const getAllStrokes = useCallback(() => {
    SocketManager.get('strokes').then((data) => {
      if(!data || !data.strokes){
        return;
      }
      data.strokes.forEach((stroke) => {
        drawOtherUserPoints(stroke.socketId, stroke.points);
      });
    });
  }, [drawOtherUserPoints]);

  
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
      getAllStrokes();
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
  
  useEffect(() => {
    SocketManager.listen('draw:start', onOtherUserStart);
    SocketManager.listen('draw:move', onOtherUserMove);
    SocketManager.listen('draw:end', onOtherUserEnd);

    return () => {
      SocketManager.off('draw:start');
      SocketManager.off('draw:move');
      SocketManager.off('draw:end');
    };
  }, [])


  useEffect(() => getAllStrokes(), [drawOtherUserPoints]);
  
  
  
  return(
    <div ref={parentRef} className={style.drawArea}>
    <canvas ref={canvasRef} className={`${style.drawArea__canvas} border-1`} width={"800"} height={"400"} onMouseDown={onMouseDown}/>
    </div>
  )
}