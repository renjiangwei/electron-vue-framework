import { onBeforeUnmount } from "vue";


export const useAppFullContent = () => {
  const app = document.querySelector('#app')! as HTMLElement
  const setWH = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    app.style.width = `${w}px`
    app.style.height = `${h}px`
    app.style.overflow = 'hidden'
  }
  setWH()
  window.addEventListener('resize', setWH)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', setWH)
  })
}