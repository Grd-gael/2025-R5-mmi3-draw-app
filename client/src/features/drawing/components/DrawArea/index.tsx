import { useCallback, useRef, type MouseEventHandler } from "react"

type Props = {
  strokes : string,
}


export const DrawArea = ( {strokes} : Props) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onMouseDown : MouseEventHandler = useCallback((e) =>{
    if (!canvasRef.current) return;
    console.log(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop)
    const contexte = canvasRef.current.getContext("2d");
    if (!contexte) return;

    contexte.beginPath();
    contexte.moveTo(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop);
    contexte.lineTo(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop);
    contexte.stroke();


    const onMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      if (!contexte) return;

      contexte.lineTo(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop);
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
  }, [])

  return(
    <div>
      <canvas ref={canvasRef} className="border-1" width={"800"} height={"400"} onMouseDown={onMouseDown}/>
    </div>
  )
}