import { useEffect } from 'react'
import { Message } from './Chat'
import classes from './Messages.module.css'
import MessageEl from './MessageEl'
import { useRef } from 'react'

type Messages = {
  messages: Message[]
}

const Messages = (props: Messages) => {
  const scrollBottomRef = useRef<HTMLDivElement>(null)
  const msgs = props.messages.map((msg, idx) => (
    <MessageEl key={idx} message={msg} />
  ))

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [props.messages])

  return (
    <div className={classes.messagesContainer}>
      {msgs}
      <div ref={scrollBottomRef} className={classes.bottomScroll}></div>
    </div>
  )
}

export default Messages
