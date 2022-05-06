// 鼠标移动
const MouseDragDirective = {
  mounted(el,binding) {
    const handler = binding.value;
    let isDown = false,
    baseX = 0,
    baseY = 0;
    el.addEventListener('mousedown',(e)=> {
      baseX = e.x;
      baseY = e.y;
      isDown = true;
    }) 

    document.addEventListener('mousemove',(e)=>{
      if(isDown){
        const X = e.screenX - baseX;
        const Y = e.screenY - baseY;
        handler({X,Y})
      }
    })
    document.addEventListener('mouseup',(e)=>{
      isDown = false
    })
  }
}

export default MouseDragDirective